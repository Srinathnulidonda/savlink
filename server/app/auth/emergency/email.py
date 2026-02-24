# server/app/auth/emergency/email.py
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from flask import current_app
import logging

logger = logging.getLogger(__name__)


def send_emergency_token_email(email: str, token: str) -> bool:
    """Send emergency access token via email using Brevo (SendInBlue)."""
    config = current_app.config
    
    if not config.get('BREVO_API_KEY'):
        logger.warning("BREVO_API_KEY not configured - cannot send emergency email")
        return False
    
    try:
        if config.get('USE_BREVO_API', True):
            return send_via_brevo_api(email, token)
        else:
            return send_via_brevo_smtp(email, token)
    except Exception as e:
        logger.error(f"Failed to send emergency email to {email}: {e}", exc_info=True)
        return False


def send_via_brevo_api(email: str, token: str) -> bool:
    """Send email via Brevo Transactional Email API."""
    try:
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = current_app.config['BREVO_API_KEY']
        
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )
        
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": email}],
            sender={
                "name": current_app.config.get('EMAIL_FROM_NAME', 'Savlink'),
                "email": current_app.config.get('EMAIL_FROM_ADDRESS', 'noreply@savlink.com')
            },
            subject="Savlink Emergency Access Token",
            html_content=_build_html(token),
            text_content=_build_text(token)
        )
        
        api_instance.send_transac_email(send_smtp_email)
        logger.info(f"Emergency token email sent to {email} via Brevo API")
        return True
        
    except ApiException as e:
        logger.error(f"Brevo API error: {e}")
        return False


def send_via_brevo_smtp(email: str, token: str) -> bool:
    """Send email via Brevo SMTP relay."""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    try:
        config = current_app.config
        
        message = MIMEMultipart('alternative')
        message['Subject'] = 'Savlink Emergency Access Token'
        message['From'] = f"{config.get('EMAIL_FROM_NAME', 'Savlink')} <{config.get('EMAIL_FROM_ADDRESS', 'noreply@savlink.com')}>"
        message['To'] = email
        
        message.attach(MIMEText(_build_text(token), 'plain'))
        message.attach(MIMEText(_build_html(token), 'html'))
        
        with smtplib.SMTP('smtp-relay.brevo.com', 587) as server:
            server.starttls()
            server.login(
                config.get('EMAIL_FROM_ADDRESS', 'noreply@savlink.com'),
                config['BREVO_API_KEY']
            )
            server.send_message(message)
        
        logger.info(f"Emergency token email sent to {email} via SMTP")
        return True
        
    except Exception as e:
        logger.error(f"SMTP send failed: {e}")
        return False


def _build_html(token: str) -> str:
    """Build HTML email content."""
    return f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Emergency Access Token</h2>
        <p>Your Savlink emergency access token is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <code style="font-size: 18px; font-weight: bold; color: #2c3e50;">{token}</code>
        </div>
        <p style="color: #e74c3c;"><strong>This token will expire in 15 minutes.</strong></p>
        <p style="color: #7f8c8d; font-size: 14px;">If you did not request this, please ignore this email.</p>
    </div>
</body>
</html>
"""


def _build_text(token: str) -> str:
    """Build plain text email content."""
    return f"""
Emergency Access Token

Your Savlink emergency access token is: {token}

This token will expire in 15 minutes.

If you did not request this, please ignore this email.
"""
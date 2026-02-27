# server/app/activity/routes.py

from flask import request
from app.activity import activity_bp
from app.auth.middleware import require_auth
from app.auth.utils import get_current_user_id as uid
from app.responses import success_response, error_response
from app.activity import service


@activity_bp.route('', methods=['GET'])
@require_auth
def get_activity():
    try:
        limit = min(max(1, int(request.args.get('limit', 30))), 100)
    except ValueError:
        limit = 30
    cursor = request.args.get('cursor')
    entity_type = request.args.get('entity_type')
    action = request.args.get('action')
    data = service.get_user_activity(uid(), limit=limit, cursor=cursor, entity_type=entity_type, action=action)
    return success_response(data)


@activity_bp.route('/feed', methods=['GET'])
@require_auth
def feed():
    data = service.get_activity_feed(uid())
    return success_response({'feed': data})


@activity_bp.route('/stats', methods=['GET'])
@require_auth
def activity_stats():
    try:
        days = min(max(1, int(request.args.get('days', 30))), 365)
    except ValueError:
        days = 30
    return success_response({'stats': service.get_activity_stats(uid(), days)})


@activity_bp.route('/clear', methods=['POST'])
@require_auth
def clear_history():
    data = request.get_json() or {}
    days = data.get('older_than_days', 90)
    deleted = service.clear_old_activity(uid(), days)
    return success_response({'deleted': deleted})
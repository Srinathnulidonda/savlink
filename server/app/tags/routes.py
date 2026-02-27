# server/app/tags/routes.py

from flask import request
from app.tags import tags_bp
from app.auth.middleware import require_auth
from app.auth.utils import get_current_user_id as uid
from app.responses import success_response, error_response
from app.tags import service


@tags_bp.route('', methods=['GET'])
@require_auth
def list_tags():
    tags = service.get_user_tags(uid())
    return success_response({'tags': tags})


@tags_bp.route('', methods=['POST'])
@require_auth
def create_tag():
    data = request.get_json()
    if not data or not data.get('name'):
        return error_response('name is required', 400)
    tag, err = service.create_tag(uid(), data)
    if err:
        return error_response(err, 400)
    return success_response({'tag': tag}, status=201)


@tags_bp.route('/<int:tag_id>', methods=['PUT'])
@require_auth
def update_tag(tag_id):
    data = request.get_json()
    if not data:
        return error_response('Invalid body', 400)
    tag, err = service.update_tag(uid(), tag_id, data)
    if err:
        return error_response(err, 404)
    return success_response({'tag': tag})


@tags_bp.route('/<int:tag_id>', methods=['DELETE'])
@require_auth
def delete_tag(tag_id):
    ok = service.delete_tag(uid(), tag_id)
    return success_response(message='Deleted') if ok else error_response('Tag not found', 404)
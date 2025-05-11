from flask import Blueprint, jsonify
from typing import Tuple
from flask_pydantic import validate
from app.schemas import HealthResponse, ErrorResponse

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.route("/health")
@validate()
def health_check() -> Tuple[dict, int]:
    response = HealthResponse(status="healthy")
    return jsonify(response.model_dump()), 200


@bp.route("/crawl", methods=["POST"])
def crawl():
    return jsonify({"status": "crawl"}), 200


@bp.errorhandler(Exception)
def handle_error(error: Exception) -> Tuple[dict, int]:
    response = ErrorResponse(
        error=str(error),
        code=getattr(error, "code", 500),
        details=getattr(error, "details", None),
    )
    return jsonify(response.model_dump()), getattr(error, "code", 500)

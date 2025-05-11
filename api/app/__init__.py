from flask import Flask
from flask_cors import CORS
import sys
import os
from typing import Type

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from app.utils import get_logger
from app.routes import bp as api_bp

logger = get_logger(__name__)


def create_app(config_class: Type[Config] = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS
    CORS(app)

    # Register blueprints
    app.register_blueprint(api_bp)

    logger.info("App initialized successfully")

    return app

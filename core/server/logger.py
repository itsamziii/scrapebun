import logging
import os
from datetime import datetime
from typing import Optional


class Logger:
    def __init__(
        self,
        name: str,
        level: int = logging.INFO,
        format_str: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    ):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)

        # Create formatter
        formatter = logging.Formatter(format_str)

        # Add console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)

    def debug(self, message: str) -> None:
        """Log a debug message."""
        self.logger.debug(message)

    def info(self, message: str) -> None:
        """Log an info message."""
        self.logger.info(message)

    def warning(self, message: str) -> None:
        """Log a warning message."""
        self.logger.warning(message)

    def error(self, message: str) -> None:
        """Log an error message."""
        self.logger.error(message)

    def critical(self, message: str) -> None:
        """Log a critical message."""
        self.logger.critical(message)

    def exception(self, message: str) -> None:
        """Log an exception message with traceback."""
        self.logger.exception(message)


logger = Logger(name="mcp_server", level=logging.DEBUG)

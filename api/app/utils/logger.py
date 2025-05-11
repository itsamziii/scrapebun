import logging
import sys
from typing import Optional


class Logger:

    LOG_LEVELS = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
    }

    def __init__(
        self,
        name: str = "scrapebun",
        level: str = "info",
        log_format: Optional[str] = None,
    ):
        self.logger = logging.getLogger(name)

        # Clear any existing handlers
        if self.logger.hasHandlers():
            self.logger.handlers.clear()

        # Set log level
        log_level = self.LOG_LEVELS.get(level.lower(), logging.INFO)
        self.logger.setLevel(log_level)

        # Default log format
        if log_format is None:
            log_format = "[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s"

        formatter = logging.Formatter(log_format)

        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)

    def debug(self, message: str, **kwargs):
        """Log a debug message."""
        self._log(self.logger.debug, message, **kwargs)

    def info(self, message: str, **kwargs):
        """Log an info message."""
        self._log(self.logger.info, message, **kwargs)

    def warning(self, message: str, **kwargs):
        """Log a warning message."""
        self._log(self.logger.warning, message, **kwargs)

    def error(self, message: str, **kwargs):
        """Log an error message."""
        self._log(self.logger.error, message, **kwargs)

    def critical(self, message: str, **kwargs):
        """Log a critical message."""
        self._log(self.logger.critical, message, **kwargs)

    def _log(self, log_func, message: str, **kwargs):
        if kwargs:
            context_str = " | ".join(f"{k}={v}" for k, v in kwargs.items())
            message = f"{message} | {context_str}"
        log_func(message)


def get_logger(name: str = "scrapebun", level: str = "info") -> Logger:
    return Logger(name=name, level=level)

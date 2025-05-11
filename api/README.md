# ScrapeBun API

A Flask-based REST API for ScrapeBun, built with type safety and modern Python practices.

## Features

- Type-safe API endpoints using Pydantic
- Automatic request/response validation
- CORS support
- Structured error handling
- Pre-commit hooks for code quality

## Prerequisites

- Python 3.11 or higher
- Poetry for dependency management

## Installation

1. Clone the repository
2. Install dependencies:
```bash
poetry install
```

## Development

1. Activate the virtual environment:
```bash
poetry shell
```

2. Run the development server:
```bash
flask run
```

The API will be available at `http://localhost:5000/api`

## Project Structure

```
api/
├── app/
│   ├── routes/          # API endpoints
│   ├── schemas/         # Pydantic models
│   └── utils/           # Utility functions
├── config.py           # Configuration
└── wsgi.py            # WSGI entry point
```

## Development Tools

- **Type Checking**: `mypy app`
- **Code Formatting**: `black app`
- **Pre-commit Hooks**: Installed automatically with `pre-commit install`

## License

ISC

# ScrapeBun API

Backend API for ScrapeBun built with Flask.

## Setup

```bash
# Install dependencies with Poetry
poetry install

# Run development server
poetry run flask run
```

## API Endpoints

- `/api/health` - Health check endpoint
- `/api/crawl` - Web crawling endpoint

## Technologies

- Flask
- Pydantic
- crawl4ai

## Requirements

- Python 3.11+
- Poetry

## Docker

```bash
docker build -t scrapebun-api .
docker run -p 5000:5000 scrapebun-api
```

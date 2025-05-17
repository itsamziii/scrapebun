from dotenv import load_dotenv
from fastapi import FastAPI

from routers import crawl_router, domain_router

load_dotenv()


def create_app():
    app = FastAPI(
        root_path="/api",
    )

    app.include_router(crawl_router)
    app.include_router(domain_router)

    return app


app = create_app()

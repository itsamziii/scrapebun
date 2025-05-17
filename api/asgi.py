from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import crawl_router, domain_router


def create_app():
    app = FastAPI(
        root_path="/api",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(crawl_router)
    app.include_router(domain_router)

    return app


app = create_app()

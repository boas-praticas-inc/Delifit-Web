import os

os.environ["DATABASE_URL"] = "postgresql+psycopg://postgres:postgres@localhost:5432/delifit"
os.environ["APP_NAME"] = "Delifit API"
os.environ["APP_ENV"] = "test"
os.environ["DEBUG"] = "true"
os.environ["SECRET_KEY"] = "test-secret"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"

FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install poetry

RUN poetry lock --no-update

RUN poetry install

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml ./

RUN pip install poetry
RUN poetry install

COPY . .

ENV PYTHONPATH=/app

CMD ["poetry", "run", "python", "app/search/workers/worker_consumer.py"]
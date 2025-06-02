FROM python:3.10

RUN apt-get update && apt-get install -y libffi-dev

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


RUN useradd --user-group --create-home --no-log-init --shell /bin/bash app


WORKDIR /app


RUN set -xe
RUN curl -sSL https://install.python-poetry.org | python3 - --git https://github.com/python-poetry/poetry.git@master
ENV PATH="/root/.local/bin:$PATH"
RUN poetry --version


COPY pyproject.toml poetry.lock /app/

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

COPY . /app

RUN chown -R app:app /app

USER app:app

EXPOSE 8000

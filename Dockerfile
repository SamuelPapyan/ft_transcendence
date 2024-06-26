FROM python:3.9-alpine3.13

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . .

EXPOSE 8000

RUN apk add --update --no-cache libffi-dev \
    build-base \
    libc-dev \
    postgresql-dev \
    postgresql-client \
    jpeg-dev \
    zlib-dev \
    freetype-dev \
    libpng-dev \
    sdl2-dev \
    sdl2_image-dev \
    sdl2_ttf-dev

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r requirements.txt && \
    adduser --disabled-password --no-create-home app

CMD ["sh", "-c", "/py/bin/python manage.py migrate && /py/bin/python manage.py runserver 0.0.0.0:8000 --noreload"]

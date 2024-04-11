#!/bin/bash

python -m venv .env
source .env/bin/activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000

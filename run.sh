# !/bin/bash

# python -m venv .env
# source .env/bin/activate
# pip install --upgrade pip
# pip install -r requirements.txt
# python manage.py makemigrations
# python manage.py migrate
# python manage.py runserver 0.0.0.0:8000

#!/bin/bash

python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000

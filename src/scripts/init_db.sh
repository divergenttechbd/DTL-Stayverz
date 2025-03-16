#!/bin/bash
export $(grep -v '^#' ../.env | xargs)


source ../.venv/bin/activate
python manage.py makemigrations
python manage.py migrate


if [[ "$ENVIRONMENT" == 'dev' ]]; then

 python manage.py runscript seeders.users.load_users
 python manage.py runscript seeders.users.load_super_user
 python manage.py runscript seeders.listings.load_categories
 python manage.py runscript seeders.listings.load_amenities
 python manage.py runscript seeders.configurations.load_cancellation_policy

#fi;

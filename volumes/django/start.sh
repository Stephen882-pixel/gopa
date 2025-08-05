#!/bin/bash

# Get the dir of the file in question
source="${BASH_SOURCE[0]}"
while [ -h "$source" ]; do
  dir="$( cd -P "$( dirname "$source" )" >/dev/null 2>&1 && pwd )"
  source="$(readlink "$source")"
  [[ $source != /* ]] && source="$dir/$source"
done

# Navigating to the correct folder
dir="$( dirname "$( cd -P "$( dirname "$source" )" >/dev/null 2>&1 && pwd )" )"
cd "${dir}"

# If the translation files have not been confirmed, this should be a
# fresh installation
if [ ! -f static/locale/fr/LC_MESSAGES/django.mo ]
then
  # Setup the translation files
  cd apps/
  python ../manage.py compilemessages
  cd ..

  # Run migrations
  python manage.py migrate

  # Ensure that the countries info is up to date
  python manage.py update_countries_plus

  # Ensure that the static resources are collected
  rm -r static/cache/*
  python manage.py collectstatic --noinput
fi

# Run the app instance
if [[ "True" == "${DEBUG}" ]]
then
  echo -e "Starting the development server ..."
  python manage.py runserver 0.0.0.0:3090
else
  echo -e "Starting the production server ..."
  gunicorn config.wsgi -b 0.0.0.0:3090
fi

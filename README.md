# GOPA Living Database

This assignment aims to contribute to effectively monitoring the removal of restrictions to trade in services (TiS) between participating Member States

## Pre-Requisite

As the application is built using multiple components, make sure a running copy of [Docker][1] and [docker compose][2] is installed to run the instance.

If one would like to run the development version of the application, you will need to have a copy of [Node LTS/Iron (v20.x.x)][3] and a copy of [Python 3.10][4].

## Deploy

### Production Setup

To run the application, make your own copy of `.env` using `.env.dist` as a guide. Once you have specified your own custom settings, you can deploy the instance as follows:

    user@linux:~/> docker compose up -d --build

### Developer Setup

For the developer setup, you will need to build the spa application as follows:

    user@linux:~/apps/spa> npm install

Once all the packages have been installed, you can deploy the client app as follows:

    user@linux:~/apps/spa> npm run dev

And on a separate terminal, you could setup the virtual environment needed to run the django development server as follows:

    user@linux:~/> virtualenv env
    user@linux:~/> source env/bin/activate
    (env) user@linux:~/> pip install -r requirements.txt

And then run the development server as follows:

    (env) user@linux:~/> ./manage.py runserver

## i18n

Language support can be broken down into 2 major components

### App Backend

To add a new translation file to the application backend:

    user@linux:~/apps> python ../manage.py makemessages -l ru

To update all the translation files:

    user@linux:~/apps> python ../manage.py makemessages -a

To compile the translation files that they may be used by the application:

    user@linux:~/apps> python ../manage.py compilemessages

### Web Client

Suppose one would like to add a new translation:

    user@linux:~/apps/spa> npx ttag init ru src/i18n/ru.po

The translation would have to be updated by the source code as follows:

    user@linux:~/apps/spa> npx ttag update src/i18n/ru.po src/

And, make sure to compile the translation for use:

    user@linux:~/apps/spa> npx ttag po2json src/i18n/ru.po > src/i18n/ru.po.json

The following command will update all the existing po files with the source code:

    user@linux:~/apps/spa> find src/i18n/ -type f -name *.po -print0 | while IFS= read -r -d '' line; do npx ttag update "$line" src/; done;

The following command will compile all translation files for use:

    user@linux:~/apps/spa> find src/i18n/ -type f -name *.po -print0 | while IFS= read -r -d '' line; do npx ttag po2json "$line" > "$line".json; done;

## Reference

To run the database migrations

    (env) user@linux:~/> ./manage.py migrate

Compile the translation files for use

    (env) user@linux:~/> ./manage.py collectstatic --noinput -l

Running the gunicorn server

    (env) user@linux:~/> gunicorn config.wsgi -b 0.0.0.0:8009



[1]:  https://docs.docker.com/engine/install/
[2]:  https://docs.docker.com/compose/install/
[3]:  https://nodejs.org/en/download/package-manager
[4]:  https://realpython.com/installing-python/

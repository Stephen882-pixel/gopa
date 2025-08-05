FROM python:3.10-slim

# Specify the working directory
WORKDIR /opt/app

# The startup script
ENTRYPOINT ["/opt/app/bin/start.sh"]

# The port to expose
EXPOSE 3090

# How to kill the app
STOPSIGNAL SIGQUIT

# Copy the code
COPY ./apps/ /opt/app/apps/
COPY ./config/ /opt/app/config/
COPY ./static/locale/ /opt/app/static/locale/
COPY ./static/static/ /opt/app/static/static/
COPY ./manage.py /opt/app/manage.py
COPY ./requirements.txt /opt/app/requirements.txt
COPY ./volumes/django/start.sh /opt/app/bin/start.sh

# Installation process
RUN apt-get update \
    && apt-get install -y gettext nano curl libmagic1 \
    && rm -rf /var/lib/apt/lists/* \
    && cd /opt/app \
    && pip install -r requirements.txt \
    && mkdir -p \
        logs/ \
        static/media \
        >/dev/null 2>&1 \
    && find . -path "*.pyc" -delete >/dev/null 2>&1 \
    && cd apps/spa/ \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" \
    && nvm install --lts=iron && npm install \
    && npx ttag po2json src/i18n/en_GB.po > src/i18n/en_GB.po.json \
    && npx ttag po2json src/i18n/fr.po > src/i18n/fr.po.json \
    && npm run build \
    && nvm deactivate && nvm uninstall --lts=iron \
    && rm -r node_modules/ && rm static/spa/dist/bundle-report.html \
    && useradd -m -d /home/app app \
    && chown -R app:app /opt/app

# Setup the correct user
USER app

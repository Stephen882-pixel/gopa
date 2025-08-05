import os
import re
from datetime import datetime

import magic
from django.conf import settings
from django.db import models

mime = magic.Magic(mime=True)


def get_upload_path(instance: "AbstractDocumentModel", filename: str) -> str:
    return instance.get_upload_path(instance, filename)


class AbstractDocumentModel(models.Model):
    _document = models.FileField(db_column="document", upload_to=get_upload_path)

    class Meta:
        abstract = True

    @property
    def document(self):
        if not self._document:
            return None
        doc = os.path.join(settings.MEDIA_ROOT, self._document.name)
        if not os.path.isfile(doc):
            return None
        return {
            "id": self.id,
            "name": os.path.basename(doc),
            "mime_type": mime.from_file(doc),
            "file": self._document.url,
        }

    def get_upload_path(self, instance: "AbstractDocumentModel", filename: str) -> str:
        # https://stackoverflow.com/a/1176023/3003786
        name = re.sub(r"(?<!^)(?=[A-Z])", "_", type(self).__name__).lower()
        stamp = instance.id if instance.id else datetime.now().strftime("%Y-%m-%d")
        return f"documents/{name}/{stamp}/{filename}"

    def clear(self):
        doc = os.path.join(settings.MEDIA_ROOT, self._document.name)
        if os.path.isfile(doc):
            os.remove(doc)

    def delete(self, *args, **kwargs):
        self.clear()
        return super().delete(*args, **kwargs)

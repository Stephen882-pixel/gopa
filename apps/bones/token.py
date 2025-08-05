from datetime import datetime, timedelta, timezone
from typing import Union

import jwt
from django.conf import settings


class Token:
    @staticmethod
    def create(
        user: str = "anonymous", seconds: int = 1801, token_type: str = "token"
    ) -> str:
        payload = {
            "type": token_type,
            "user": user,
            "exp": datetime.now(tz=timezone.utc) + timedelta(seconds=seconds),
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    @staticmethod
    def verify(encoded: str) -> Union[str, bool]:
        try:
            return jwt.decode(encoded, settings.SECRET_KEY, algorithms=["HS256"])
        except (jwt.exceptions.DecodeError, jwt.ExpiredSignatureError):
            return False

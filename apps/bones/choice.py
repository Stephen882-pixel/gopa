import random


ASCII_UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ"
ASCII_LOWER = "abcdefghjklmnpqrstuvwxyz"
DIGITS = "23456789"


def gen(n: int = 8, chars: str = ASCII_UPPER + ASCII_LOWER + DIGITS):
    return "".join(
        random.SystemRandom().choice(chars) for _ in range(5 if 5 > n else n)
    )


def password(n: int = 8):
    return gen(n, ASCII_UPPER + ASCII_LOWER + DIGITS + "!@#$%^&*()-_=+{}[]|:;<>?,./")


def receipt(n: int = 8):
    return gen(n, ASCII_UPPER + DIGITS)

from PIL import Image, ImageDraw, ImageFont
from django.http import HttpResponse
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.request import Request
from rest_framework.views import APIView

from apps.bones import swagger as sg


class ImageView(APIView):
    renderer_classes = [sg.PNGRenderer]

    @swagger_auto_schema(
        security=[],
        tags=["Profile"],
        operation_id="profile_image",
        operation_summary="Generate an image file",
        operation_description=(
            "Generate an image given the specified parameters. If the dimension "
            "is not specified, the profile image for the user who has logged in "
            "will be rendered"
        ),
        manual_parameters=[
            openapi.Parameter(
                name="dimensions",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="the image dimensions e.g. 256x256",
                required=False,
            ),
            openapi.Parameter(
                name="fg",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="the image foreground color e.g. fff",
                required=False,
            ),
            openapi.Parameter(
                name="bg",
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="the image background color e.g. 4888e1",
                required=False,
            ),
        ],
        responses=sg.response(
            description="The generated image file",
            schema=openapi.Schema(type=openapi.TYPE_FILE),
            has_validation=False,
            has_auth=False,
        ),
    )
    def get(self, req: Request) -> HttpResponse:
        dimensions = req.GET.get("dimensions", "user")
        if req.user.is_authenticated and "user" == dimensions:
            try:
                img = Image.open(f"static/media/{req.user.profile.avatar or ''}")
            except (IsADirectoryError, OSError, IOError):
                img = self._get_image()
        else:
            fg = req.GET.get("fg", "fff")
            bg = req.GET.get("bg", "4888e1")
            img = self._get_image(dimensions, fg, bg)
        res = HttpResponse(content_type="image/png")
        img.save(res, "PNG")
        return res

    def _get_image(
        self,
        dimensions: str = "256x256",
        fg: str = "fff",
        bg: str = "4888e1",
        msg: str = None,
    ) -> Image:
        """
        The default method used to get the image object
        """
        w = 0
        px = 1
        fontPath = "static/static/font/Ubuntu-R.ttf"
        dim = self._get_dimensions(dimensions)
        msg = msg or "%sx%s" % (dim[0], dim[1])

        img = Image.new("RGB", dim, color=self._get_color(bg, "cccccc"))
        draw = ImageDraw.Draw(img)

        while 0.5 > (w / dim[0]):
            font = ImageFont.truetype(fontPath, px)
            w = draw.textlength(msg, font=font)
            px = px + 1

        font = ImageFont.truetype(fontPath, px - 1)
        w = draw.textlength(msg, font=font)
        draw.text(
            ((dim[0] - w) / 2, (dim[1] - px) / 2),
            msg,
            fill=self._get_color(fg, "989898"),
            font=font,
        )

        return img

    @staticmethod
    def _get_dimensions(dimensions: str) -> list:
        """
        Get the safe dimensions of the image specified
        """
        result = []
        for dim in dimensions.split("x"):
            if 2 == len(result):
                break
            try:
                result.append(int(dim))
            except ValueError:
                result.append(256)
        if 1 == len(result):
            result.append(256)
        return result

    @staticmethod
    def _get_color(c: str, d: str) -> tuple:
        """
        Get the color to use as the image background or as the font text color
        """
        if 3 == len(c):
            c = "%s%s%s%s%s%s" % (c[0], c[0], c[1], c[1], c[2], c[2])
        if 6 != len(c):
            c = d
        try:
            c = (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16))
        except ValueError:
            c = (int(d[0:2], 16), int(d[2:4], 16), int(d[4:6], 16))
        return c

from rest_framework.renderers import BaseRenderer


class _FileRenderer(BaseRenderer):
    charset = None
    render_style = "binary"

    def render(self, data, media_type=None, renderer_context=None):
        return data


class PDFRenderer(_FileRenderer):
    media_type = "application/pdf"
    format = "pdf"


class PNGRenderer(_FileRenderer):
    media_type = "image/png"
    format = "png"

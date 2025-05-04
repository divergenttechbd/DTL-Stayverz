from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from base.models import BaseModel

User = get_user_model()

class QuickReply(BaseModel):

    title = models.CharField(_("Title"))
    description = models.TextField(_("Description"))

    host = models.ForeignKey(User, verbose_name=_("Host"), on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = _("Quick Reply")
        verbose_name = _("Quick Reply")
        ordering = ("host", "title")

    def __str__(self):
        return f"{self.title} (Host: {self.host.username})"

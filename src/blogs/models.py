from django.db import models

from base.models import BaseModel
from base.type_choices import BlogStatusOption


# Create your models here.
class Blog(BaseModel):
    title = models.CharField(max_length=220)
    slug = models.CharField(max_length=250, unique=True)
    description = models.TextField()
    image = models.URLField()
    status = models.CharField(max_length=20, choices=BlogStatusOption.choices)

    def __str__(self) -> str:
        return self.title

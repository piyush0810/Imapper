from django.db import models
from django_jsonfield_backport.models import JSONField

# Create your models here.
class Image(models.Model):
    title = models.CharField(max_length=100)
    image_id=models.CharField(max_length=50)
    info=JSONField()

    content = models.TextField()
    image = models.ImageField(upload_to='post_images')
    
    def __str__(self):
        return self.title
from django.db import models
from django_jsonfield_backport.models import JSONField



# Create your models here.
class Image(models.Model):
    # title = models.CharField(max_length=100)
    image_id=models.CharField(max_length=100)
    dots=JSONField()
    pid=models.CharField(max_length=50)
    # content = models.TextField()
    image = models.ImageField(upload_to='post_images')
    
    def __str__(self):
        return self.image_id

class Dot(models.Model):
    dot_id = models.CharField(max_length=100)
    x=models.IntegerField()
    y=models.IntegerField()
    parent_id=models.CharField(max_length=100)
    is_sensor=models.BooleanField()
    is_image=models.BooleanField()
    
    child_id = models.CharField(max_length=100)
    
    
    def __str__(self):
        return self.dot_id


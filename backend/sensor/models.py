from django.db import models
from django_jsonfield_backport.models import JSONField

# Create your models here.


class Sensor(models.Model):
    pid = models.CharField(max_length=100)
    sensor_id = models.CharField(max_length=100)
    sensor_name = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    dimensions = models.TextField()
    values = JSONField()
    dot_id = models.CharField(max_length=100)

    def __str__(self):
        return self.sensor_name


class Value(models.Model):
    sensor_id = models.CharField(max_length=100)
    value = models.IntegerField()

    def __str__(self):
        return self.sensor_id


class custom_sensor(models.Model):
    sensor_type = models.CharField(max_length=100)
    units = models.CharField(max_length=100)
    icon = models.ImageField(upload_to='post_images', blank=True)

    def __str__(self):
        return self.sensor_type

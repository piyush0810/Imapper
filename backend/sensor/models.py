from django.db import models
from django_jsonfield_backport.models import JSONField

# Create your models here.
class Sensor(models.Model):
    sensor_id = models.CharField(max_length=100)
    sensor_name=models.CharField(max_length=50)
    unit=models.CharField(max_length=50) 
    dimensions = models.TextField()
    value =  JSONField()
    
    def __str__(self):
        return self.sensor_name

class Value(models.Model):
    sensor_id = models.CharField(max_length=100)
    value=models.IntegerField()
        
    def __str__(self):
        return self.sensor_id
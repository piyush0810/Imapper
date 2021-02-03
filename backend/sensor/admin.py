from django.contrib import admin

# Register your models here.
from .models import Sensor, Value, custom_sensor
# Register your models here.
admin.site.register(Sensor)
admin.site.register(Value)
admin.site.register(custom_sensor)

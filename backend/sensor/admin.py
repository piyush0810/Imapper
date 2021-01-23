from django.contrib import admin

# Register your models here.
from .models import Sensor,Value
# Register your models here.
admin.site.register(Sensor)
admin.site.register(Value)
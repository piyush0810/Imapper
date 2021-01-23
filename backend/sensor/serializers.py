from rest_framework import serializers
from .models import Sensor

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'
from rest_framework import serializers
from .models import Sensor, Value, custom_sensor


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'


class sensSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ('sensor_id', 'sensor_name', 'unit', 'dimensions')


class ValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Value
        fields = '__all__'


class typeserializer(serializers.ModelSerializer):
    class Meta:
        model = custom_sensor
        fields = '__all__'

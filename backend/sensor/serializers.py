from rest_framework import serializers
from .models import Sensor,Value

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ('sensor_id','sensor_name','unit','dimensions','value')

class sensSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ('sensor_id','sensor_name','unit','dimensions')

class ValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Value
        fields = '__all__'
        
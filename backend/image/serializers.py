from rest_framework import serializers
from .models import Image ,Dot

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'



class DotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dot
        fields = '__all__'
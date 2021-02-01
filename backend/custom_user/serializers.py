from djoser.serializers import UserCreateSerializer as BaseUserRegistrationSerializer
from .models import User
from rest_framework import serializers


class UserRegistrationSerializer(BaseUserRegistrationSerializer):
    class Meta(BaseUserRegistrationSerializer.Meta):
        fields = ('email', 'username', 'password', 'is_staff')


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'parent_name',
                  'is_admin', 'is_staff', 'is_approved')

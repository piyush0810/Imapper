from django.shortcuts import render
from .serializers import PostSerializer
from .models import User
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import authentication_classes, permission_classes
import base64
import os
import requests
import json
import random
    

@permission_classes((AllowAny, ))
class userview(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        print("asdas")
        users = User.objects.all()
        
        serializer = PostSerializer(users, many=True)
        
        return Response(serializer.data)

  

    def post(self, request, *args, **kwargs):

        posts_serializer = PostSerializer(data=request.data)
        # print(request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()

            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

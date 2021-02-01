from django.shortcuts import render
from .serializers import PostSerializer, StatusSerializer
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
class username(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        serializer = StatusSerializer(request.user)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        print(request.data)
        if(request.data["username"]):
            username = request.data["username"]
            user = User.objects.filter(username=username)[0]
            user.is_admin = request.data["is_admin"]
            user.is_approved = request.data["is_approved"]
            user.is_staff = request.data["is_staff"]
            user.parent_name = request.data["parent_name"]
            user.save()

            return Response("user status changed", status=status.HTTP_201_CREATED)
        else:
            return Response("send valid data", status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class userview(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):

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


@permission_classes((AllowAny, ))
class addparent(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        print("asdas")
        username = self.kwargs['username']
        users = User.objects.filter(username=username)

        serializer = StatusSerializer(users, many=True)

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


@permission_classes((AllowAny, ))
class userstatus(APIView):
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


@permission_classes((AllowAny, ))
class userapproval(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        print(request.user)
        users = User.objects.filter(is_staff=True, is_approved=False)

        serializer = StatusSerializer(users, many=True)

        return Response(serializer.data)


@permission_classes((AllowAny, ))
class userapprove(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):

        data = request.data["key"]
        # print(request.data)
        test = 0
        username = self.kwargs['username']

        user = User.objects.filter(username=username)[0]
        print(user)
        if user.is_approved == False:
            if data == "False":

                user.delete()
                test = 1
            else:
                user.is_approved = True
                user.save()
                test = 1

        if test == 1:

            return Response("change is done")
        else:
            print('error')
            return Response("error as the mentioned user not found")

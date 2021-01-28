from django.shortcuts import render
from .serializers import PostSerializer, ValueSerializer, sensSerializer
from .models import Sensor, Value
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

# Create your views here.


@permission_classes((AllowAny, ))
class sensorview(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        sensors = Sensor.objects.all()

        # print(images[0][image])
        serializer = PostSerializer(sensors, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # print(type(request.data["image"]))
        # print("hi")
        # print(request.data)
        # a= request.data["image"].file.read()
        # print(type(a))

        url = "https://api.imgbb.com/1/upload"
        payload = {
            "key": "7848c52ffe49da2e717bcb60dbd5d7d8",
            # "image": base64.b64encode(a),
        }
        # res = requests.post(url, payload)
        # # encodedString = base64.b64encode(request.data["image"].file.read())
        # # # print(encodedString)
        # # data = {"key": os.environ.get("IMG_BB"), "image": encodedString.decode("utf-8")}
        # # uploadedImageInfo = requests.post("https://api.imgbb.com/1/upload", data=data)
        # # jsonResponse = json.loads(uploadedImageInfo.text)
        # # print( jsonResponse["data"]["display_url"])
        # # super().save()

        posts_serializer = PostSerializer(data=request.data)
        value1 = Value(
            sensor_id=request.data["sensor_id"], value=random.randint(3, 100))

        value1.save()

        value2 = Value(
            sensor_id=request.data["sensor_id"], value=random.randint(3, 100))

        value2.save()

        value3 = Value(
            sensor_id=request.data["sensor_id"], value=random.randint(3, 100))

        value3.save()
        if posts_serializer.is_valid():
            posts_serializer.save()

            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class sensorv(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        print("asdas")
        sensor_id = self.kwargs['sensor_id']
        # print("hi")
        sensors = Sensor.objects.filter(sensor_id=sensor_id)
        for sensor in sensors:
            values = Value.objects.filter(sensor_id=sensor_id)
            print(values)
            data = []
            for value in values:
                data.append(value.value)

            sensor.values = data
            print(type(sensor.values))
            sensor.save()

        serializer = PostSerializer(sensors, many=True)
        # print(serializer[0][image])
        return Response(serializer.data)

    # def save(self):
    #     encodedString = base64.b64encode(self.item_image.file.read())
    #     data = {"key": os.environ.get("IMG_BB"), "image": encodedString.decode("utf-8")}
    #     uploadedImageInfo = requests.post("https://api.imgbb.com/1/upload", data=data)
    #     jsonResponse = json.loads(uploadedImageInfo.text)
    #     self.item_image_url = jsonResponse["data"]["display_url"]
    #     super().save()

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
class sensorvalue(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):

        sensor_id = self.kwargs['sensor_id']

        values = Value.objects.filter(sensor_id=sensor_id)

        serializer = ValueSerializer(values, many=True)
        # print(serializer[0][image])

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):

        posts_serializer = ValueSerializer(data=request.data)
        # print(request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()

            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

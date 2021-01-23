from django.shortcuts import render
from .serializers import PostSerializer
from .models import Image
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


# Create your views here.


@permission_classes((AllowAny, ))
class imageview(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        images = Image.objects.all()
        # print(images[0][image])
        serializer = PostSerializer(images, many=True)


    
    




    def post(self, request, *args, **kwargs):
        # print(type(request.data["image"]))
        print("hi")
        print(request.data)
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





@permission_classes((AllowAny, ))
class imagev(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):

        image_id = self.kwargs['image_id']
        # print("hi")
        images = Image.objects.filter(image_id=image_id)
         #         print(type(images[0].image))
        serializer = PostSerializer(images, many=True)


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

        if posts_serializer.is_valid():
            posts_serializer.save()
            
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

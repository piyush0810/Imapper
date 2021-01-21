from django.shortcuts import render
from .serializers import PostSerializer
from .models import Image
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import authentication_classes, permission_classes

# Create your views here.
@permission_classes((AllowAny, ))
class imageview(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        images = Image.objects.all()
        serializer = PostSerializer(images, many=True)
        
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        
        posts_serializer = PostSerializer(data=request.data)
        
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class imagev(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def get(self, request, *args, **kwargs):
        # print("hi")
        image_id = self.kwargs['image_id']
        # print("hi")
        images = Image.objects.filter(image_id=image_id)
        
        serializer = PostSerializer(images, many=True)
        
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        
        posts_serializer = PostSerializer(data=request.data)
        
        if posts_serializer.is_valid():
            posts_serializer.save()
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

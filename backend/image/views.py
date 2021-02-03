from django.shortcuts import render
from custom_user.models import User
from .serializers import PostSerializer, DotSerializer
from .models import Image, Dot
from sensor.models import Sensor, Value, custom_sensor
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import authentication_classes, permission_classes
import json
from django.http import JsonResponse
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
class userimage(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        username = self.kwargs['username']
        user = User.objects.filter(username=username)[0]
        if user.is_admin:
            images = Image.objects.all()
        elif user.is_staff:
            images = Image.objects.filter(username=username)
        else:
            images = Image.objects.filter(username=user.parent_name)

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
        print("hi")
        image_id = self.kwargs['image_id']
        # print("hi")
        images = Image.objects.filter(image_id=image_id)

        for image in images:
            dots = Dot.objects.filter(parent_id=image_id)
            data = []
            for dot in dots:
                data.append(dot.dot_id)
                print(data)
            image.dots = json.dumps(data)

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
class dotv(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):

        image_id = self.kwargs['image_id']

        dots = Dot.objects.filter(parent_id=image_id)
        print(dots)
        serialize = DotSerializer(dots, many=True)
        print("hh")
        return Response(serialize.data)

    def post(self, request, *args, **kwargs):

        dots_serializer = DotSerializer(data=request.data)

        if dots_serializer.is_valid():
            dots_serializer.save()
            return Response(dots_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', dots_serializer.errors)
            return Response(dots_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class dotdel(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def deleteim(self, id):
        dots = Dot.objects.filter(parent_id=id)
        for dot in dots:
            self.deletedot(dot.dot_id)
        image = Image.objects.filter(image_id=id)
        image.delete()

    def deletedot(self, id):
        dot = Dot.objects.filter(dot_id=id)
        if dot[0]:
            dot = dot[0]
            if dot.is_sensor:
                sensor_id = dot.child_id
                dot.delete()
                sensor = Sensor.objects.filter(sensor_id=sensor_id)
                sensor.delete()
            elif dot.is_image:
                image_id = dot.child_id
                self.deleteim(image_id)
                dot.delete()

    def delete(self, request, *args, **kwargs):

        dot_id = self.kwargs['dot_id']
        dot = Dot.objects.filter(dot_id=dot_id)
        if dot:
            self.deletedot(dot_id)

            return JsonResponse({"status": "ok"}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes((AllowAny, ))
class aggregator(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def funct(self, b, id, a, t):
        print("HIII")
        image = Image.objects.filter(image_id=id)
        dots = Dot.objects.filter(parent_id=id)
        print(dots, image)
        for dot in dots:
            if dot.is_sensor:
                print("vvv")
                values = Value.objects.filter(sensor_id=dot.child_id)
                print("fafaf", dot.child_id)
                sensor = Sensor.objects.filter(sensor_id=dot.child_id)
                print(sensor)
                # print(t)
                if sensor[0].sensor_name == t:
                    dimen = int(sensor[0].dimensions)
                    for i in range(len(values)):
                        a[i] = (a[i]*b+values[i].value*dimen)/(b+dimen)
                    b = b+dimen
            else:
                a, b = self.funct(b, dot.child_id, a, t)
        return (a, b)

    def get(self, request, *args, **kwargs):

        types = custom_sensor.objects.all()
        res = []
        for stype in types:
            iid = self.kwargs['image_id']
            k = [0, 0, 0]
            j = 0
            t = stype.sensor_type
            tunits = stype.units
            x, y = self.funct(j, iid, k, t)
            a = {
                "values": x,
                "units": tunits,
                "name": t
            }
            res.append(a)

        return Response(res)

    def post(self, request, *args, **kwargs):

        dots_serializer = DotSerializer(data=request.data)

        if dots_serializer.is_valid():
            dots_serializer.save()
            return Response(dots_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', dots_serializer.errors)
            return Response(dots_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class deleteall(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        users = User.objects.filter(is_superuser=False)
        users.delete()
        images = Image.objects.all()
        images.delete()
        Sensor.objects.all().delete()

        return Response("congratulations,all mall tall deleted")


@permission_classes((AllowAny, ))
class imagedel(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def deleteim(self, id):
        dots = Dot.objects.filter(parent_id=id)
        for dot in dots:
            self.deletedot(dot.dot_id)
        image = Image.objects.filter(image_id=id)
        image.delete()

    def deletedot(self, id):
        dot = Dot.objects.filter(dot_id=id)
        if dot[0]:
            dot = dot[0]
            if dot.is_sensor:
                sensor_id = dot.child_id
                dot.delete()
                sensor = Sensor.objects.filter(sensor_id=sensor_id)
                sensor.delete()
            elif dot.is_image:
                image_id = dot.child_id
                self.deleteim(image_id)
                dot.delete()

    def delete(self, request, *args, **kwargs):

        image_id = self.kwargs['image_id']
        image = Image.objects.filter(image_id=image_id)
        if image:
            self.deleteim(image_id)

            return JsonResponse({"status": "ok"}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)

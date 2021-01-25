from django.urls import path, re_path
from . import views

urlpatterns = [
    path('sensors/', views.sensorview.as_view(), name='sensors_list'),
    re_path('value/(?P<sensor_id>.+)/$', views.sensorvalue.as_view(), name='sensor_value'),
    # path('(?P<sensor_id>[\w ]+)/$', views.sensorv.as_view(), name='sensor_fetch'),
    
    re_path('^(?P<sensor_id>.+)/$', views.sensorv.as_view()),

    # path('^purchases/(?P<username>.+)/$', PurchaseList.as_view()),
]
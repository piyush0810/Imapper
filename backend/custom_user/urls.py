from django.urls import path, re_path
from . import views

urlpatterns = [
    path('users/', views.userview.as_view(), name='users_list'),
    path('name/', views.username.as_view(), name='username'),
    path('approval/', views.userapproval.as_view(), name='approved users'),
    re_path('approval/(?P<username>.+)/$',
            views.userapprove.as_view(), name='approve users'),
    # re_path('value/(?P<sensor_id>.+)/$', views.sensorvalue.as_view(), name='sensor_value'),
    # path('(?P<sensor_id>[\w ]+)/$', views.sensorv.as_view(), name='sensor_fetch'),

    # re_path('^(?P<sensor_id>.+)/$', views.sensorv.as_view()),

    # path('^purchases/(?P<username>.+)/$', PurchaseList.as_view()),
]

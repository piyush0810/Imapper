from django.urls import path, re_path
from . import views

urlpatterns = [
    path('images/', views.imageview.as_view(), name='posts_list'),
    re_path('dot/(?P<image_id>.+)/$', views.dotv.as_view(), name='dot'),
    re_path('dotdel/(?P<dot_id>.+)/$', views.dotdel.as_view(), name='dotdel'),
    re_path('value/(?P<image_id>.+)/(?P<sensor_name>.+)/$', views.aggregator.as_view(), name='aggregator'),
    re_path('^(?P<image_id>.+)/$', views.imagev.as_view()),
    
    # path('^purchases/(?P<username>.+)/$', PurchaseList.as_view()),
]

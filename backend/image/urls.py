from django.urls import path, re_path
from . import views

urlpatterns = [
    path('images/', views.imageview.as_view(), name='posts_list'),
    re_path('dot/(?P<image_id>.+)/$', views.dotv.as_view(), name='dot'),
    re_path('^(?P<image_id>.+)/$', views.imagev.as_view()),
    
    # path('^purchases/(?P<username>.+)/$', PurchaseList.as_view()),
]

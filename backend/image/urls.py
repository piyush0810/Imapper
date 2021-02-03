from django.urls import path, re_path
from . import views

urlpatterns = [
    path('allimages/', views.imageview.as_view(), name='posts_list'),
    re_path('images/(?P<username>.+)/$',
            views.userimage.as_view(), name='userimage'),
    re_path('dot/(?P<image_id>.+)/$', views.dotv.as_view(), name='dot'),
    re_path('dotdel/(?P<dot_id>.+)/$', views.dotdel.as_view(), name='dotdel'),
    re_path('value/(?P<image_id>.+)/$',
            views.aggregator.as_view(), name='aggregator'),
    re_path('^(?P<image_id>.+)/$', views.imagev.as_view()),
    path('delete/', views.deleteall.as_view(), name='posts_list'),
    # path('^purchases/(?P<username>.+)/$', PurchaseList.as_view()),
    re_path('imagedel/(?P<image_id>.+)/$',
            views.imagedel.as_view(), name='delete image by id'),
]

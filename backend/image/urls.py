from django.urls import path,re_path
from . import views

urlpatterns = [
    path('images/', views.imageview.as_view(), name= 'posts_list'),
    path('(?P<image_id>[\w ]+)/$', views.imagev.as_view(), name='image_edit'),
    re_path('^(?P<image_id>.+)/$', views.imagev.as_view()),
    # path('^purchases/(?P<username>.+)/$', PurchaseList.as_view()),
]
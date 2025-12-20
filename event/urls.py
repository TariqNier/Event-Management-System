#event/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, EventRegistrationViewSet,UserViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet) 
router.register(r'registrations', EventRegistrationViewSet) 
router.register(r'users', UserViewSet) 

urlpatterns = [
    path('', include(router.urls)),
]

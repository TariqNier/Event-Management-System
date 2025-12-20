from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Event, Registration
from .serializers import EventSerializer, RegistrationSerializer

                    
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    search_fields = ['title', 'location']
    

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer


    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Registration.objects.all()

        return Registration.objects.filter(customer=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
    
       
        
    
    
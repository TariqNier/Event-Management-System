#event/views.py
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework.decorators import action
from .models import Event, EventRegistration,User
from .serializers import EventRegistrationSerializer, EventSerializer,UserRegistrationSerializer
from rest_framework.response import Response
from .permissions import IsOrganizer

   
   
  
   
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'username': user.username, 
        })   
   

                    
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    search_fields = ['title', 'location']
    
    def get_permissions(self):
        if self.action in ['create','update','partial_update', 'destroy']:
            return [(IsAdminUser | IsOrganizer)()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventRegistrationViewSet(viewsets.ModelViewSet):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return EventRegistration.objects.all()

        return EventRegistration.objects.filter(customer=user)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
    
       
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all() 
    serializer_class = UserRegistrationSerializer
    
    
    def get_permissions(self):
        
        if self.action in ['register','login',]:
            return [AllowAny()]
        else:
            return [IsAdminUser()]
     
        
    
    @action(detail=False,methods=['post'],url_name='register', url_path='register')
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "status": "success",
            "message": "User created successfully",
            "user_id": user.id,
            "username": user.username,
            "role": user.role
        }, status=status.HTTP_201_CREATED)
    
    
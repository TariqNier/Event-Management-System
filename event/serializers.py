#event/serializers.py
from rest_framework import serializers,status
from .models import Event, EventRegistration,User
from rest_framework.response import Response


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['role']
        extra_kwargs = {
            'password': {'write_only': True} 
        }
        
        
        
        
        
    def create(self, validated_data):
       
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
        
        

class EventSerializer(serializers.ModelSerializer):
    tickets_left = serializers.SerializerMethodField()
    is_sold_out = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = '__all__' 
        
        extra_kwargs = {
            'organizer': {'read_only': True} 
        }
        
        
    def get_tickets_left(self, obj):
        sold = EventRegistration.objects.filter(event=obj, ticket_type='STANDARD').count()
        return obj.standard_limit - sold

    def get_is_sold_out(self, obj):
        sold = EventRegistration.objects.filter(event=obj, ticket_type='STANDARD').count()
        return sold >= obj.standard_limit

class EventRegistrationSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(read_only=True)
    
    
    event_info = EventSerializer(source='event', read_only=True) 

    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'event_info', 'ticket_type', 'booking_date', 'customer']
    def validate(self, validated_data):
        event=validated_data['event']
        ticket_type=validated_data['ticket_type']

        
        user = self.context['request'].user
        
        if EventRegistration.objects.filter(event=event, customer=user).exists():
            raise serializers.ValidationError({"error": "You have already booked a ticket for this event!"})
   
   
        limit = 0
        if ticket_type == 'STANDARD':
            limit = event.standard_limit
        elif ticket_type == 'VIP':
            limit = event.vip_limit
        elif ticket_type == 'BACKSTAGE':
            limit = event.backstage_limit
  
        sold_count = EventRegistration.objects.filter(event=event, ticket_type=ticket_type).count()
        print("SOLD COUNT: ",sold_count)
        print("limit: ",limit)
       
        
        if sold_count >= limit:
            raise serializers.ValidationError(
                {"error": f"Sorry, {ticket_type} tickets are sold out!"}
            )
        
        
        return validated_data
from rest_framework import serializers,status
from .models import Event, Registration
from rest_framework.response import Response


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__' 

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'
        
    def create(self, validated_data):
        event=validated_data['event']
        ticket_type=validated_data['ticket_type']
   
        limit = 0
        if ticket_type == 'STANDARD':
            limit = event.standard_limit
        elif ticket_type == 'VIP':
            limit = event.vip_limit
        elif ticket_type == 'BACKSTAGE':
            limit = event.backstage_limit
  
        sold_count = Registration.objects.filter(event=event, ticket_type=ticket_type).count()
        print("SOLD COUNT: ",sold_count)
        print("limit: ",limit)
       
        
        if sold_count >= limit:
            raise serializers.ValidationError(
                {"error": f"Sorry, {ticket_type} tickets are sold out!"}
            )
        
        
        return super().create(validated_data)
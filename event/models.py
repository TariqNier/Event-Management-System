from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Event(models.Model):
   
   
    title=models.CharField(max_length=200)
    location=models.CharField(max_length=200)
    date=models.DateField()
    time=models.TimeField()
    standard_price=models.DecimalField(max_digits=6, decimal_places=2)
    standard_limit=models.IntegerField() 
    vip_price=models.DecimalField(max_digits=6, decimal_places=2,null=True,blank=True)
    vip_limit=models.IntegerField(default=0,null=True) 
    backstage_price=models.DecimalField(max_digits=6, decimal_places=2, blank=True,null=True)
    backstage_limit=models.IntegerField(default=0,null=True)


    def __str__(self):
        return self.title    


# class TicketTier(models.Model):
#     TICKET_TYPES= [
#         ('STANDARD', 'Standard'),
#         ('VIP', 'VIP'),
#         ('BACKSTAGE', 'Backstage'),
#         ]
     
#     type=models.CharField(max_length=20,choices=TICKET_TYPES)
#     price=models.DecimalField(max_digits=6, decimal_places=2)
#     limit=models.IntegerField()
#     event=models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')

    
class Registration(models.Model):
    
    TICKET_TYPES= [
        ('STANDARD', 'Standard'),
        ('VIP', 'VIP'),
        ('BACKSTAGE', 'Backstage'),
        ]
    
    event=models.ForeignKey(Event, on_delete=models.CASCADE)
    customer=models.ForeignKey(User, on_delete=models.CASCADE)
    booking_date=models.DateTimeField(auto_now_add=True)
    ticket_type=models.CharField(max_length=20,choices=TICKET_TYPES)
    

    class Meta:
        unique_together=('event' ,'customer')        
    
    


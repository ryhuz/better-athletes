from django.contrib import admin
from .models import Club, User_Details, Workout

# Register your models here.

admin.site.register(Club)
admin.site.register(User_Details)
admin.site.register(Workout)
# remember to import model
from django.contrib import admin
from .models import Club, User_Details, Workout

# Register your models here.

admin.site.register(Club)
admin.site.register(UserDetail)
admin.site.register(Workout)
admin.site.register(WorkoutResult)
admin.site.register(WorkoutTemplate)
admin.site.register(SavedWorkouts)
admin.site.register(TrackedAthletes)
# remember to import model
from django.contrib import admin
from .models import Club, UserDetail, Workout, WorkoutResult, WorkoutTemplate, SavedWorkout, TrackedAthlete

# Register your models here.

admin.site.register(Club)
admin.site.register(UserDetail)
admin.site.register(Workout)
admin.site.register(WorkoutResult)
admin.site.register(WorkoutTemplate)
admin.site.register(SavedWorkout)
admin.site.register(TrackedAthlete)
# remember to import model
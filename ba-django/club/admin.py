from django.contrib import admin
from .models import Club, UserDetail, Workout, WorkoutResult, WorkoutTemplate, SavedWorkout, TrackedAthlete

# Register your models here.

class WorkoutResultAdmin(admin.ModelAdmin):
    list_display = ("id", "athlete_id")

admin.site.register(Club)
admin.site.register(UserDetail)
admin.site.register(Workout)
admin.site.register(WorkoutResult, WorkoutResultAdmin)
admin.site.register(WorkoutTemplate)
admin.site.register(SavedWorkout)
admin.site.register(TrackedAthlete)
# remember to import model
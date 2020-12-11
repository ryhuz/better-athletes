from django.contrib import admin
from .models import Club, UserDetail, Workout, WorkoutResult, WorkoutTemplate, SavedWorkout, TrackedAthlete
from django_better_admin_arrayfield.admin.mixins import DynamicArrayMixin
from django_better_admin_arrayfield.forms.widgets import DynamicArrayTextareaWidget

# Register your models here.

class WorkoutAdmin(admin.ModelAdmin, DynamicArrayMixin):
    pass

admin.site.register(Club)
admin.site.register(UserDetail)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(WorkoutResult)
admin.site.register(WorkoutTemplate)
admin.site.register(SavedWorkout)
admin.site.register(TrackedAthlete)
# remember to import model
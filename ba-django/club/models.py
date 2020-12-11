from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User

# Create your models here.

class Club(models.Model):
    club_name = models.CharField(max_length=50, unique=True)
    club_desc = models.CharField("Club Description", max_length=255)

    def __str__(self):
        return self.club_name

class UserDetail(models.Model):
    club = models.ForeignKey(Club, related_name='members', on_delete=models.PROTECT)
    dob = models.DateField(auto_now=False, auto_now_add=False)
    location = models.CharField(max_length=50)
    phone = models.CharField(max_length=16, blank=True)
    height = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(300)])
    weight = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(300)])

    GENDER = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('P', 'Prefer not to say'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER,)
    public_workouts = models.BooleanField("Make workouts public?", default=True)
    base_user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.base_user

class Workout(models.Model):
    workout_name = models.CharField(max_length=50)
    exercise = ArrayField( # number of sets
        ArrayField( # exercises
            models.CharField(max_length=50, blank=True)
        )
    )
    reps = ArrayField( # number of sets
        ArrayField( # reps per exercise
            models.IntegerField(validators=[MinValueValidator(1)], blank=True)
        )
    )
    targets = ArrayField( # number of sets
        ArrayField( # target per exercise
            models.CharField(max_length=50, blank=True)
        )
    )
    created_date = models.DateTimeField(auto_now=True)
    workout_date = models.DateField()
    based_on_template = models.ForeignKey(WorkoutTemplate, related_name=("workout"), on_delete=models.PROTECT)

    def __str__(self):
        return self.workout_name

class WorkoutResult(models.Model):
    athlete = models.ForeignKey(User, related_name=("athlete"), on_delete=models.PROTECT)
    workout = models.ForeignKey(Workout, related_name=("athlete"), on_delete=models.PROTECT)
    completed = models.BooleanField(default=False)
    results = ArrayField(   # number of sets
        ArrayField(         # results per exercise
            models.CharField(max_length=10, blank=True)
        )
    )

    UNIT = [
        ('sec', 's'),
        ('min', 'min'),
        ('m', 'meters'),
        ('kg', 'kg'),
        ('-', ''),
    ]
    units = ArrayField(     # number of sets
        ArrayField(         # units per result
            models.CharField(max_length=3, choices=GENDER, default="")
        )
    )
    comments = ArrayField(  # number of sets
        ArrayField(         # comments per exercise
            models.CharField(max_length=255, blank=True)
        )
    )
    completed_on = models.DateTimeField(auto_now=True)
    # workout_conversation = 
    # performance_tracking

    def __str__(self):
        return self.athlete + self.workout + self.completed_on

class WorkoutTemplate(models.Model):
    workout_name = models.CharField(max_length=50)
    exercise = ArrayField( # number of sets
        ArrayField( # exercises
            models.CharField(max_length=50, blank=True)
        )
    )
    reps = ArrayField( # number of sets
        ArrayField( # reps per exercise
            models.IntegerField(validators=[MinValueValidator(1)], blank=True)
        )
    )
    targets = ArrayField( # number of sets
        ArrayField( # target per exercise
            models.CharField(max_length=50, blank=True)
        )
    )

    def __str__(self):
        return self.workout_name + " template"

class SavedWorkouts(models.Model):
    saved_workouts = models.ManyToManyField(Workout, related_name("saved_workouts"))
    saved_templates = models.ManyToManyField(WorkoutTemplate, related_name("saved_templates"))
    saved_by = models.ForeignKey(User, related_name=("saved"), on_delete=models.CASCADE)

class TrackedAthletes(models.Model):
    tracked_athletes = models.ManyToManyField(User, related_name=("tracked_by"))
    notes = models.TextField()
    tracked_by = models.ForeignKey(User, related_name=("tracking"), on_delete=models.CASCADE)

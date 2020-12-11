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

class User_Details(models.Model):
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

    def __str__(self):
        return self.workout_name
    
    def serialize(self):
        return {
            "workout_name": self.workout_name,
            "exercise": self.exercise,
            "reps": self.reps,
            "targets": self.targets,
            "created_date" : self.created_date,
            "workout_date" : self.workout_date,
        }
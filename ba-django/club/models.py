from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User
from datetime import date, timedelta

# Create your models here.

class Club(models.Model):
    club_name = models.CharField(max_length=50, unique=True)
    club_desc = models.CharField("Club Description", max_length=255)

    def __str__(self):
        return self.club_name

    def serialize(self):
        return {
            'club_name': self.club_name,
            'club_desc': self.club_desc,
        }

class UserDetail(models.Model):
    base_user = models.OneToOneField(User, related_name="userdetail", on_delete=models.CASCADE)
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
    is_coach = models.BooleanField(default=False)

    def __str__(self):
        return self.base_user.username

    def serialize(self):
        return {
            'username': self.base_user.username,
            'name': self.base_user.first_name + " " + self.base_user.last_name,
            'club': self.club.club_name,
            'location': self.location,
            'age': (date.today() - self.dob) // timedelta(days=365.2425),
            'gender': self.gender
            
        }
    def serialize_for_club(self):
        return {
            'name': self.base_user.first_name + " " + self.base_user.last_name,
            'user_id': self.base_user.id,
        }

class WorkoutTemplate(models.Model):
    workout_name = models.CharField(max_length=50)
    exercise = ArrayField( # number of sets
        ArrayField( # exercises
            models.CharField(max_length=50, blank=True)
        )
    )
    reps = ArrayField( # number of sets
        ArrayField( # reps per exercise
            models.IntegerField(validators=[MinValueValidator(0)], blank=True)
        )
    )
    rests = ArrayField( # number of sets
        ArrayField( # target per exercise
            models.CharField(max_length=50, blank=True)
        )
    )
    targets = ArrayField( # number of sets
        ArrayField( # target per exercise
            models.CharField(max_length=50, blank=True)
        )
    )

    def __str__(self):
        return self.workout_name + " template"

class Workout(models.Model):
    workout_name = models.CharField(max_length=50)
    workout_date = models.DateField()
    based_on_template = models.ForeignKey(WorkoutTemplate, related_name=("workout"), on_delete=models.PROTECT, null=True, blank=True)
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
    rests = ArrayField( # number of sets
        ArrayField( # target per exercise
            models.CharField(max_length=50, blank=True)
        )
    )
    targets = ArrayField( # number of sets
        ArrayField( # target per exercise
            models.CharField(max_length=50, blank=True)
        )
    )
    created_date = models.DateTimeField(auto_now=True)
    
    
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

class WorkoutResult(models.Model):
    athlete = models.ForeignKey(User, related_name=("athlete"), on_delete=models.PROTECT)
    workout = models.ForeignKey(Workout, related_name=("athlete"), on_delete=models.PROTECT)
    completed = models.BooleanField(default=False)
    completed_on = models.DateTimeField(blank=True, default=None, null=True)
    reviewed = models.BooleanField(default=False)
    reviewed_on = models.DateTimeField(blank=True, default=None, null=True)
    results = ArrayField(   # number of sets
        ArrayField(         # number of exercises
            ArrayField(         # array of results
                models.CharField(max_length=10, default="")
            )
        ), blank=True
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
            models.CharField(max_length=3, choices=UNIT, default="")
        ), blank=True
    )
    comments = ArrayField(  # number of sets
        ArrayField(         # comments per exercise
            models.CharField(max_length=255, blank=True)
        ), blank=True
    )
    # workout_conversation = 
    # performance_tracking

    def __str__(self):
        return self.athlete.first_name + "/" + self.workout.workout_name

    def serialize(self):
        return {
            "result_id": self.id,
            "workout_id": self.workout.id,
            "workout_name": self.workout.workout_name,
            "workout_date": self.workout.workout_date,
            "completed_on": self.completed_on,
            "athlete_id": self.athlete.id,
            "athlete_name": self.athlete.first_name + " " + self.athlete.last_name,
            "results": self.results,
            "reviewed": self.reviewed,
        }
        
    def single_workout(self):
        return {
            "result_id": self.id,
            "workout_id": self.workout.id,
            "workout_name": self.workout.workout_name,
            "exercise": self.workout.exercise,
            "results": self.results,
            "reps": self.workout.reps,
            "rests": self.workout.rests,
            "target": self.workout.targets
        }
    
class SavedWorkout(models.Model):
    coach = models.ForeignKey(User, related_name=("saved"), on_delete=models.CASCADE)
    saved_workouts = models.ManyToManyField(Workout)
    saved_templates = models.ManyToManyField(WorkoutTemplate)

class TrackedAthlete(models.Model):
    coach = models.ForeignKey(User, related_name=("tracking"), on_delete=models.CASCADE, null=True)
    athlete = models.ForeignKey(User, related_name=("tracked"), on_delete=models.CASCADE, null=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.coach.username + " tracking " + self.athlete.username
    
class WorkoutComment(models.Model):
    comment = models.TextField(null=True)
    workout = models.ForeignKey(Workout, related_name=("comments"),on_delete=models.CASCADE, null=True)
    workout_result = models.ForeignKey(WorkoutResult, related_name=("result_comments"),on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, related_name=("user_comment"), on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.user.username
    
    def serialize(self):
        return {
            "comment": self.comment,
            "user": self.user.username,
            "user_id": self.user.id,
            "workout_name": self.workout.workout_name,
            "workout_results_id": self.workout_result.id,
        }
from django.shortcuts import render
from club.models import Workout,WorkoutResult
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import WorkoutSerializer
# Create your views here.

def not_found(request):
    pass

def workouts(request):
    if request.method == "POST":
        workout_name = request.body.workout_name
        exercise = request.body.exercise
        reps = request.body.reps
        rests = request.body.rests
        targets = request.body.targets
        workout_date = request.body.workout_date
        workout = new Workout(workout_name=workout_name, exercise=exercise, reps=reps, rests=rests, targets=targets, workout_date=workout_date)
        if workout.is_valid():
            workout.save()
            return JsonResponse(workout.serialize(), status=200)
        else:
            return JsonResponse({"message" : "Data invalid"}, status=400)

    try:
        workouts = Workout.objects.all()
        return JsonResponse([workout.serialize() for workout in workouts], status=200, safe=False)
    except Workout.DoesNotExist:
        return JsonResponse({"message" : "Data not found"}, status=400)

    
def dashboard(request):
    # if athlete
            # all = WorkoutResults.objects.filter(athlete=THISATHLETE)
        # get today's
            
            # today = all.filter(workout__workout_date=datetime.date.today())
        
        # get upcoming
            # future = all.exclude(workout__workout_date__lte=datetime.date.today())
            #           .order_by(workout__workout_date)[:3]
        # get past entries
            # past = all.exclude(workout__workout_date__gte=datetime.date.today())
        # get recently completed (x 3)
            # re_com = past.order_by(workout__workout_date)
            #           .filter(completed=True)[:3]

        # get pending results (must be before today)
            # pending = past.exclude(completed=True)
            #           .order_by(workout__workout_date)
    
    # if coach
        get tracked athletes
        get workouts pending review
    
    pass


def new_workout(request):
    # get form data
    # need the following data
    # for ATHLETE 
    # for WORKOUT_DATE
    # workout_name
    # array of exercises
    # array of reps
    # array of targets
    # if based_on_template

    # save workout
        # workout.save()

    # initialise workout result
        # new_result = WorkoutResult(athlete=ATHLETE, workout=WORKOUT)
        # new_result.save()
    # if multiple athletes
        # foreach athlete
        # new_result = WorkoutResult(athlete=ATHLETE, workout=WORKOUT)
        # new_result.save()
    
    pass
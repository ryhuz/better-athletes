from django.shortcuts import render
from club.models import Workout
from django.http import JsonResponse

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
        if form.is_valid():
            form.save()
            return JsonResponse(form.serialize(), status=200)
        else:
            return JsonResponse({"message" : "Data invalid"}, status=400)

    try:
        workouts = Workout.objects.all()
        return JsonResponse([workout.serialize() for workout in workouts], status=200, safe=False)
    except Workout.DoesNotExist:
        return JsonResponse({"message" : "Data not found"}, status=400)

    

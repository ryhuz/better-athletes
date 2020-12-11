from django.shortcuts import render
from club.models import Workout,WorkoutResult
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework import status, permissions
from rest_framework.views import APIView

# Create your views here.

def not_found(request):
    pass

class UserCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Workouts(APIView):

    def get(self, request):
        try:
            workouts = Workout.objects.all()
            return JsonResponse([workout.serialize() for workout in workouts], status=200, safe=False)
        except Workout.DoesNotExist:
            return JsonResponse({"message" : "Data not found"}, status=400)
    
    def post(self, request):
        workout_name = request.body.workout_name
        exercise = request.body.exercise
        reps = request.body.reps
        rests = request.body.rests
        targets = request.body.targets
        workout_date = request.body.workout_date
        workout = Workout(workout_name=workout_name, exercise=exercise, reps=reps, rests=rests, targets=targets, workout_date=workout_date)
        if workout.is_valid():
            workout.save()
            return JsonResponse(workout.serialize(), status=200)
        else:
            return JsonResponse({"message" : "Data invalid"}, status=400)


    
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
        # get tracked athletes
        #     all_ath = TrackedAthlete.objects.filter(tracked_by=COACH)

        # get all athlete workouts
        #     ath_workouts = WorkoutResult.objects.filter(athlete=all_ath)
        # get workouts pending review
        #     pending = ath_workouts.filter(reviwed_by_coach = False)
        # get workouts pending athlete result
        #     pending = ath_workouts.filter(completed = False)
        # get today's
        #     today = ath_workouts.filter(workout__workout_date=datetime.date.today())
    
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
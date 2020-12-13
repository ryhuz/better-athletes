from django.shortcuts import render
from club.models import Workout,WorkoutResult,User,TrackedAthlete, Club, UserDetail
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import ClubSerializer, UserSerializer
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework import status, permissions
from rest_framework.views import APIView
from datetime import date

# Create your views here.

def not_found(request):
    pass

# User Creation
class UserCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        # serialize and check for the basic user details
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # after user is created, only proceed to create the UserDetail model
            # still need to see how to prevent user creation/delete if UserDetail is not created successfully
            club = Club.objects.get(club_name=request.data['club'])
            dob = request.data['dob']
            location = request.data['location']
            phone = request.data['phone']
            height = request.data['height']
            weight = request.data['weight']
            gender = request.data['gender']
            # for public workouts, data comes in as string, need to convert to Boolean
            if request.data['public_workouts'] == 'false':
                public_workouts = False
            else:
                public_workouts = True
            # user detail saved here
            user_detail = UserDetail(base_user=user,club=club, dob=dob, location=location, phone=phone, weight=weight, height=height, gender=gender, public_workouts=public_workouts)
            if user:
                user_detail.save()
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # as of now, unable to get back the error message to React side

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

class Clubs(APIView):
    permission_classes = (permissions.AllowAny,)
    # getting clubs list to populate register selection
    def get(self,request):
        try:
            clubs = Club.objects.all()
            serialize = ClubSerializer(clubs, many=True)
            return Response(serialize.data)
        except Club.DoesNotExist:
            return JsonResponse({"message" : "Data not found"}, status=400)
    
def dashboard(request):
    # get user detais ??????????? from token?
    user = User.objects.get(id=2)
    # get user type ?????????????
    userType = "Athlete"

    if userType == "Coach":
        # Getting coach details and tracked athletes ???????????????? get from token
        all_ath = TrackedAthlete.objects.filter(coach=user)
        
        # coach - get pending coach review
        ath_workouts = WorkoutResult.objects.filter(athlete__in=(x.athlete for x in all_ath))
        pending_coach_review = ath_workouts.filter(completed = True, reviewed = False)

        serialized_ppr = [x.serialize() for x in list(pending_coach_review)]

        # coach - get today's agenda
        today = ath_workouts.filter(workout__workout_date=date.today())
        serialized_today = [x.serialize() for x in list(today)]

        # coach - get pending athlete
        pending_athlete = ath_workouts.filter(completed = False, workout__workout_date__lt=date.today())
        serialized_pending_athlete = [x.serialize() for x in list(pending_athlete)]

        # coach - get recently completed (both coach and athlete done)
        # get past entries
        past = ath_workouts.filter(completed = True, reviewed = True)
        re_com = past.order_by('-workout__workout_date')[:3]
        serialized_past = [x.serialize() for x in list(re_com)]

        dashboard_data = {
            "pending_coach_review": serialized_ppr,
            "today": serialized_today,
            "pending_athlete": serialized_pending_athlete,
            "recent_completed": serialized_past
        }

    else:
        # Get all workout results
        all_results = WorkoutResult.objects.filter(athlete=user)
        
        # athlete - get today's agenda
        today = all_results.filter(workout__workout_date=date.today())
        serialized_today = [x.serialize() for x in list(today)]

        # athlete - get pending results (must be before today)
        pending_complete = all_results.filter(completed = False, workout__workout_date__lt=date.today())
        serialized_pending_complete = [x.serialize() for x in list(pending_complete)]
        
        # athlete - get upcoming
        future = all_results.exclude(workout__workout_date__lte=date.today()).order_by('workout__workout_date')[:3]
        serialized_upcoming = [x.serialize() for x in list(future)]
        
        # athlete - recently completed
        past = all_results.filter(completed = True)
        re_com = past.order_by('-workout__workout_date')[:3]
        serialized_past = [x.serialize() for x in list(re_com)]

        dashboard_data = {
            "pending_results": serialized_pending_complete,
            "today": serialized_today,
            "upcoming": serialized_upcoming,
            "recent_completed": serialized_past
        }

    return JsonResponse(dashboard_data, status=200, safe=False)
    
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
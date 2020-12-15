from django.shortcuts import render
from club.models import Workout,WorkoutResult,User,TrackedAthlete, Club, UserDetail
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import ClubSerializer, UserSerializer, MyTokenObtainPairSerializer, WorkoutResultSerializer
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework import status, permissions
from rest_framework.views import APIView
from datetime import date, datetime
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
import os
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

# Create your views here.

class Login(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

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
            if request.data['is_coach'] == 'false':
                is_coach = False
            else:
                is_coach = True
            # user detail saved here
            user_detail = UserDetail(base_user=user,club=club, dob=dob, location=location, phone=phone, weight=weight, height=height, gender=gender, public_workouts=public_workouts, is_coach=is_coach)
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
       
        # user = User.objects.get(username="tyrone")
        # print(user)
        workout_name = "Running" #body.workout_name
        exercise = [["100M"], ["150M"],["200M"]]#body.exercise
        reps = [["2"], ["2"],["2"]]#body.reps
        rests = [["3min"], ["3min"],["4min"]]#body.rests
        targets = [["2rep"], ["2rep"],["2rep"]]#body.targets
        workout_date = "2020-12-05"#body.workout_date, rests=rests
        
        results = [[0],[0],[0]]
        athlete = request.user
        workout_name2 = Workout.objects.get(pk=15)
        units = [["meters"],["meters"],["meters"]]
        comments = [["None"],["None"],["None"]]
        
        workout = Workout(workout_name=workout_name, exercise=exercise, reps=reps,rests=rests, targets=targets, workout_date=workout_date)
        
        workout.save()
        workout_result = WorkoutResult(athlete=athlete,workout=workout_name2,results=results, units=units, comments=comments)
        workout_result.save()
        return JsonResponse({"message" : "Data isvalid"}, status=200)

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
    # decode - token => id, username, is_coach
    try:
        token = request.headers['Authorization'].split(" ")[1]
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except:
        return JsonResponse({"message": "Fatal Error"}, status=400)
    user_id = decoded_token['user_id']
    is_coach = decoded_token['is_coach']
    user = User.objects.get(id=user_id)

    if is_coach == True:
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
        # serialized_all = [x.serialize() for x in list(all_results)]
        
    
        
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
            "recent_completed": serialized_past,
            # "all_results": serialized_all
        }

    return JsonResponse(dashboard_data, status=200, safe=False)

def profile(request, id):
    try:
        user_profile = UserDetail.objects.get(base_user__id=id)

        data = user_profile.serialize()
        data['recent_workouts'] = []
        data['public'] = False

        if user_profile.public_workouts:
            data['public'] = True
            recent = WorkoutResult.objects.filter(athlete=user_profile.base_user).order_by('-workout__workout_date')[:5]
            serialized_recent = []
            for x in recent:
                serialized_recent.append({
                    'workout_name': x.workout.workout_name,
                    'workout_date': x.workout.workout_date,
                })
            data['recent_workouts'] = serialized_recent
        
        return JsonResponse({
            "found": True,
            "valid": True,
            "profile": data
            }, status=200, safe=False)
    except:
        return JsonResponse({
            "found": True,
            "valid": False,
            }, status=404, safe=False)

def single_club(request):
    token = request.headers['Authorization'].split(" ")[1]
    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    user_id = decoded_token['user_id']
    user = UserDetail.objects.get(base_user__id=user_id)

    club = user.club.serialize()
    members = UserDetail.objects.filter(club=user.club)
    coaches = [x.serialize_for_club() for x in members.filter(is_coach=True)]
    athletes = [x.serialize_for_club() for x in members.filter(is_coach=False)]

    month = datetime.now().month
    workouts_this_month = WorkoutResult.objects.filter(athlete__in=(x.base_user for x in members), workout__workout_date__month=month, completed=True)

    club['coaches'] = coaches
    club['athletes'] = athletes
    club['this_month'] = workouts_this_month.count()
    return JsonResponse(club, status=200, safe=False)

@api_view(['GET'])
def getworkouts(request):
    # find workouts of userid, filter by date
    temp = WorkoutResult.objects.filter(athlete_id=3)
    serialize = [x.serialize() for x in temp]
    if serialize:
        return JsonResponse(serialize, status=200, safe=False)
    else:
        return JsonResponse({"message": "Fatal Error"}, status=400)

def new_workout(request,id):
    result = WorkoutResult.objects.get(id = resultID)

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
@csrf_exempt
def single_workout(request, id):
    
    result = WorkoutResult.objects.get(workout_id=id)
    
    if request.method == "GET":
        return JsonResponse({"result":result.single_workout()}, status=200, safe=False)
    
    elif request.method == "POST":
        print("Hellow")    
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        
        result.results = body["results"]
        result.save()

        return JsonResponse({"message" : "Data saved"}, status=200)
    
@csrf_exempt  
def workout_comment(request,id):
    result = WorkoutResult.objects.get(workout_id=id)
    
    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        result.comments = body["comments"]
        result.save()
        return JsonResponse({"message" : "Data saved"}, status=200)
        
    
    
    
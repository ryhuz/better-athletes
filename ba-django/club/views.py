from django.shortcuts import render
from club.models import Workout, Club, UserDetail
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import ClubSerializer, UserSerializer
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
            club = Club.objects.get(pk=request.data['club'])
            dob = request.data['dob']
            location = request.data['location']
            phone = request.data['phone']
            height = request.data['height']
            weight = request.data['weight']
            gender = request.data['gender']
            public_workouts = request.data['public_workouts']
            user_detail = UserDetail(base_user=user,club=club, dob=dob, location=location, phone=phone, weight=weight, height=height, gender=gender, public_workouts=public_workouts)
            if user:
                user_detail.save()
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

class Clubs(APIView):

    def get(self,request):
        try:
            clubs = Club.objects.all()
            serialize = ClubSerializer(clubs, many=True)
            return Response(serialize.data)
        except Club.DoesNotExist:
            return JsonResponse({"message" : "Data not found"}, status=400)
    

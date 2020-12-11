from django.urls import path
from views import club as club_views

urlpatterns = [
    path('', club_views.index, name='index'),
    path('dashboard', club_views.dashboard, name='dashboard'),
    path('members', club_views.dashboard, name='members')
    
    # member profile (edit if you)
    # club profile (can edit if coach, view if athlete)
    # messages
    
    # my calendar (with workouts in a list or in corresponding calendar days)
    # new workout
    # view single workout (should have fields to key in results if today or past,
    #   or show results if already keyed in)
    
    # saved workouts
    # progress

    # club rankings
]

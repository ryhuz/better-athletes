from django.urls import path
from . import views

urlpatterns = [
    path('workouts', views.workouts, name="workouts"),
    path('', views.not_found, name='not_found'),
    
    # path('login/', api_views.login, name='login'),
    # path('signup/', api_views.signup, name='signup'),
    # path('logout/', api_views.logout, name='logout'),
    # features
    # about
]

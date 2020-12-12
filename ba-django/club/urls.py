from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('workouts', views.Workouts.as_view(), name="workouts"),
    path('', views.not_found, name='not_found'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', views.UserCreate.as_view(), name='signup'),
    # path('logout/', api_views.logout, name='logout'),
    # features
    path('testing/', views.dashboard, name='test'),
    # about
]

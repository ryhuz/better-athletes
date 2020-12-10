from django.urls import path
from views import landing as landing_views

urlpatterns = [
    path('', landing_views.index, name='index'),
    path('login/', landing_views.login, name='login'),
    path('signup/', landing_views.signup, name='signup'),
    path('logout/', landing_views.logout, name='logout'),
    # features
    # about
]

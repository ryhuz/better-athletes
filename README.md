# Better Athletes

*This repo was original hosted on my GA account*
*you can view this app at https://better-athletes.herokuapp.com/*

Manage your workouts better

## Description

Better athletes is a platform which provides the option to make your workouts more specific and track your data more closely. Other apps ask you for distance and time, with no flexibility. But if your workouts are more interval based where you need to track each rep, Better Athletes gives you that option!

## Built With
  - React
  - React-Router-Dom
  - Django
  - Django Rest Framework
  - PostgreSQL
  - Bootstrap/Bootstrap React
  - Axios

## Functions 

  - Register and Login authentication system
  - Dashboard view for recent, upcoming, and today's workouts
  - Reminders to key in results of workout, or reminder for coach to acknowledge results
  - Calendar view for workouts
  - Add workout, add results, and view
  - Comment on workout

## Challenges
  * Implementing JWT authentication was a challenge as we had only used Node/Express before this. Having to refresh the tokens was something we had to look up the documentation and understand.
  * Nested arrays for results
      While we had a clear idea of how to store the data, being 4-times nested and having to rectangularise the arrays for Postgres was tricky and took up a lot of time.

## Wire Frames

|Landing page|Club|Dashboard|
|------------|----|---------|
|![Landing Page](https://github.com/ryhuz/better-athletes/blob/master/Wireframes/Landing.PNG)|![Club](https://github.com/ryhuz/better-athletes/blob/master/Wireframes/Club.PNG)|![Coach Dashboard](https://github.com/ryhuz/better-athletes/blob/master/Wireframes/Dashboard%20Coach.PNG)|
|Profile|Calendar|Add Workout|
|-------|--------|-----------|
|![Profile](https://github.com/ryhuz/better-athletes/blob/master/Wireframes/Profile.PNG)|![Calendar](https://github.com/ryhuz/better-athletes/blob/master/Wireframes/Calendar.PNG)|![Add Workout](https://github.com/ryhuz/better-athletes/blob/master/Wireframes/Add%20Workout.PNG)|
|View Workout|
|------------|
|![View Workout](https://github.com/ryhuz/better-athletes/blob/master/Wireframes/View%20Workout.PNG)|


## Acknowledgements
Tyrone, and Ken, for helping to build this project.

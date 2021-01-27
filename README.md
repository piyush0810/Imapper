## A React + Redux / Django Rest Framework authentication example

### Functionality:

- [x] Login with JWT
- [x] middleware for JWT refresh if expiring
- [x] Registration
- [x] Dynamic navbar switching when user logs in / logs out
- [x] Password Change
- [x] Screen size responsive components & Navbar

### How to use:

- Clone the repo

#### Frontend

1. cd frontend && npm install
2. enter your backend url in actions/backendUrl.js or add an environment variable named REACT_APP_DEV_URL
3. npm start

#### Backend

1. cd backend
2. virtualenv env || python3 -m venv env
3. env\scripts\activate.bat || source env/bin/activate
4. pip install -r requirements/local.txt
5. python manage.py makemigrations custom_user image sensor
6. python manage.py migrate
7. python manage.py createsuperuser
8. python manage.py runserver


Apis Samples:
/sensor/sensors/                Gives Data for all sensors/adds new senso
/sensor/value/(sensor_id)/      Gives data for values on that sensor/add new value
/sensor/(sensor_id)/            Gives data for sensor_id/adds new image


/image/images/                  Gives data for all images/adds new image
/image/dot/(image_id)/          Gives data for dot on that image/add new dot
/image/(image_id)/              Gives data for image_id/adds new image

image/value/(image_id)/(sensor_name)/   gives data for sensor name(value array size should be 3)
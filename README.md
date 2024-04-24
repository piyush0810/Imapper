## IOT DATA MONITORING PLATFORM FOR Multipurpose

### Description
This project focuses on creating an easy-to-use dashboard for monitoring and analyzing data collected by IoT devices. It features a scalable platform designed to accommodate various IoT devices in engineering and medical sectors. The system includes a three-step authentication model with user hierarchies for different access levels, distinguishing between viewing and editing privileges.
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

/image/value/(image_id)/(sensor_name)/   gives data for sensor name(value array size should be 3)

/image/dotdel/(dot_id)/        deletes all data on that dot (either sensor or image)

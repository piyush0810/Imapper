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

1. `cd frontend && npm install`
2. enter your backend url in `actions/backendUrl.js` or add an environment variable named `REACT_APP_DEV_URL`
3. `npm start`

#### Backend

1. `cd backend`
2. `virtualenv env || python3 -m venv env`
3. `env\scripts\activate.bat || source env/bin/activate`
4. `pip install -r requirements/local.txt`
5. `python manage.py makemigrations custom_user image sensor`
6. `python manage.py migrate`
7. `python manage.py createsuperuser`
8. `python manage.py runserver`


### Apis Samples:
#### Sensors
1. `/sensor/sensors/`               gives Data for all sensors/adds new senso
2. `/sensor/value/(sensor_id)/`      gives data for values on that sensor/add new value
3. `/sensor/(sensor_id)/`            gives data for sensor_id/adds new image
#### Images
1. `/image/images/`                  gives data for all images/adds new image
2. `/image/dot/(image_id)/`          gives data for dot on that image/add new dot
3. `/image/(image_id)/`              gives data for image_id/adds new image
4 `/image/value/(image_id)/(sensor_name)/`   gives data for sensor name(value array size should be 3)
5. `/image/dotdel/(dot_id)/`        deletes all data on that dot (either sensor or image)

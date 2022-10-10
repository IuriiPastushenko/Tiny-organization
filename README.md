What needed to be done:
    Create a tiny server app based on Node.js.
    The app should implement simple organization user structure management operations.
    The following user roles should be supported:
    a. Administrator (top-most user)
    b. Boss (any user with at least 1 subordinate)
    c. Regular user (user without subordinates)
    Each user except the Administrator must have a boss (strictly one).
    The following REST API endpoints should be exposed:
    1. Register user
    2. Authenticate as a user
    3. Return list of users, taking into account the following:
    - administrator should see everyone
    - boss should see herself and all subordinates (recursively)
    - regular user can see only herself
    4. Change user's boss (only boss can do that and only for her subordinates)


This task was completed, the application was created on the Express Node.JS framework in the TypeScript language.

Main files:
main.ts - application launch file;
/src/app.ts -  server class;
src/controllers/user_controller.ts - route handler on users(registration, login, list, changedepartment);
/src/midlleware/auth.middleware.ts - token authentication according to the standard JWT;
/src/dbconnection/dbconnect.ts - query file and data processing from the database;
/src/logger/logger_service.ts -  event logger, outputs informational messages to the console and writes the main events to the log file.

Database - built on PostgreSQL.
Table department: id_department, department.
Table jobtitle: id_jobtitle, jobtitle.
Table employee: id_employee, firstname, lastname, email, phone, password, department, jobtitle.






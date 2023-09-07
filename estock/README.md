# E Stock Sample Backend

A sample backend for the estock backend application using Express.js, Docker, Mongo with Mongoose ORM and Postgres with Sequelize ORM.

## Docker

    - To start the backend:
        $ docker build ./
        $ docker-compose up
        
        If you want to run the services in the background, pass the -d flag for detached mode
        $ docker-compose up -d
    
    - To see what is currently running
        $ docker-compose ps

    - To stop the backend:
        $ docker-compose stop
        To remove the containers entirely
        $ docker-compose down
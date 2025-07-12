# PostgreSQL Deployment Guide for Skill Swap

This guide provides instructions for deploying the Skill Swap application with PostgreSQL in a production environment.

## 1. Local Development

For local development, the application uses SQLite by default. This is configured in `backend/settings.py`.

## 2. Production Deployment with PostgreSQL

### 2.1. Option 1: Self-hosted PostgreSQL Server

#### Prerequisites
- PostgreSQL server installed and running
- Database created for the application
- Database user with appropriate permissions

#### Steps:

1. **Set the DATABASE_URL environment variable**:

   ```
   # Format: postgresql://USER:PASSWORD@HOST:PORT/NAME
   DATABASE_URL=postgresql://dbuser:dbpassword@localhost:5432/skillswap
   ```

2. **Run migrations**:

   ```
   python manage.py migrate
   ```

3. **Create a superuser**:

   ```
   python manage.py createsuperuser
   ```

### 2.2. Option 2: Cloud-based PostgreSQL Service (Recommended)

#### Using ElephantSQL (Free PostgreSQL as a Service)

1. **Create an account on ElephantSQL**:
   - Go to https://www.elephantsql.com/
   - Sign up for a free account
   - Create a new instance (Tiny Turtle plan is free)

2. **Get your connection details**:
   - After creating your instance, go to the instance details
   - Copy the URL (it will be in the format: `postgres://username:password@hostname:port/database`)

3. **Set the DATABASE_URL environment variable**:
   - In your production environment, set the DATABASE_URL to the URL from ElephantSQL

4. **Deploy your application**:
   - The application will automatically use PostgreSQL when the DATABASE_URL is set

#### Using Heroku PostgreSQL

1. **Create a Heroku account and install the Heroku CLI**:
   - Sign up at https://signup.heroku.com/
   - Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

2. **Create a new Heroku app**:
   ```
   heroku create skill-swap-app
   ```

3. **Add PostgreSQL add-on**:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Deploy your application**:
   ```
   git push heroku main
   ```

5. **Run migrations**:
   ```
   heroku run python manage.py migrate
   ```

6. **Create a superuser**:
   ```
   heroku run python manage.py createsuperuser
   ```

### 2.3. Option 3: Using Docker with PostgreSQL

1. **Create a `docker-compose.yml` file**:

   ```yaml
   version: '3'
   
   services:
     db:
       image: postgres:14
       volumes:
         - postgres_data:/var/lib/postgresql/data/
       env_file:
         - ./.env
       environment:
         - POSTGRES_PASSWORD=postgres
         - POSTGRES_USER=postgres
         - POSTGRES_DB=skillswap
     
     web:
       build: .
       command: python manage.py runserver 0.0.0.0:8000
       volumes:
         - .:/app
       ports:
         - "8000:8000"
       depends_on:
         - db
       env_file:
         - ./.env
       environment:
         - DATABASE_URL=postgresql://postgres:postgres@db:5432/skillswap
   
   volumes:
     postgres_data:
   ```

2. **Create a `Dockerfile`**:

   ```dockerfile
   FROM python:3.11
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   
   COPY . .
   
   CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
   ```

3. **Create a `requirements.txt` file**:

   ```
   Django==5.2.4
   psycopg2-binary==2.9.10
   dj-database-url==3.0.1
   python-dotenv==1.0.1
   djangorestframework==3.15.0
   djangorestframework-simplejwt==5.3.1
   django-cors-headers==4.3.1
   ```

4. **Run with Docker Compose**:

   ```
   docker-compose up -d
   ```

5. **Run migrations**:

   ```
   docker-compose exec web python manage.py migrate
   ```

6. **Create a superuser**:

   ```
   docker-compose exec web python manage.py createsuperuser
   ```

## 3. Migrating Data from SQLite to PostgreSQL

If you have existing data in SQLite and want to migrate it to PostgreSQL:

1. **Dump data from SQLite**:

   ```
   python manage.py dumpdata --exclude contenttypes --exclude auth.permission --indent 2 > data_backup.json
   ```

2. **Set up PostgreSQL connection**:
   - Configure your PostgreSQL connection as described above

3. **Run migrations on PostgreSQL**:

   ```
   python manage.py migrate
   ```

4. **Load data into PostgreSQL**:

   ```
   python manage.py loaddata data_backup.json
   ```

## 4. Testing the PostgreSQL Connection

You can test your PostgreSQL connection using the `test_db_connection.py` script:

```
python test_db_connection.py
```

If the connection is successful, you'll see a message confirming the connection to the PostgreSQL database.

## 5. Common Issues and Troubleshooting

1. **Connection Refused**:
   - Make sure PostgreSQL is running
   - Check that the host and port are correct
   - Verify that the database exists

2. **Authentication Failed**:
   - Check your username and password
   - Verify that the user has access to the database

3. **Database Does Not Exist**:
   - Create the database using PostgreSQL's createdb command or through a GUI tool like pgAdmin

4. **Migration Issues**:
   - If you encounter migration issues, try resetting the migrations:
     ```
     python manage.py showmigrations
     python manage.py migrate --fake api zero
     python manage.py migrate api
     ```

## 6. Best Practices for Production

1. **Use environment variables for sensitive information**
2. **Regularly backup your database**
3. **Monitor database performance**
4. **Use connection pooling for better performance**
5. **Set up proper indexes for frequently queried fields** 
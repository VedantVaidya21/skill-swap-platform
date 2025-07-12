# PostgreSQL Setup Guide for Windows

## 1. Download PostgreSQL

1. Go to the official PostgreSQL download page: https://www.postgresql.org/download/windows/
2. Click on the "Download the installer" button
3. Select the latest version of PostgreSQL for Windows

## 2. Install PostgreSQL

1. Run the downloaded installer
2. Follow the installation wizard:
   - Choose installation directory (default is fine)
   - Choose components (select all)
   - Choose data directory (default is fine)
   - Enter a password for the database superuser (postgres)
     - Use "postgres" as the password to match our configuration
   - Select the port (default is 5432)
   - Select locale (default is fine)

3. Complete the installation

## 3. Verify Installation

1. Open the Start menu and search for "pgAdmin"
2. Launch pgAdmin to verify the installation
3. Connect to the PostgreSQL server using the password you set during installation

## 4. Create the Database

1. In pgAdmin, expand "Servers" > "PostgreSQL" > right-click on "Databases" and select "Create" > "Database"
2. Enter "skillswap" as the database name and click "Save"

## 5. Update Configuration (if needed)

If you used different settings during installation, update the `db_config.py` file with your specific configuration:

```python
# PostgreSQL database configuration
DB_CONFIG = {
    'NAME': 'skillswap',  # Database name
    'USER': 'postgres',   # Database user
    'PASSWORD': 'your_password_here',  # Database password
    'HOST': 'localhost',  # Database host
    'PORT': '5432',       # Database port
}
```

## 6. Run Migrations

After setting up PostgreSQL and configuring your Django project, run the migrations:

```
python manage.py migrate
```

This will create all the necessary tables in your PostgreSQL database. 
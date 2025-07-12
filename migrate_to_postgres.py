import os
import sys
import django
import subprocess
import json
from datetime import datetime

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def migrate_to_postgres():
    """
    Migrate data from SQLite to PostgreSQL using Django's dumpdata and loaddata commands.
    """
    print("Starting migration from SQLite to PostgreSQL...")
    
    # Backup current database
    backup_dir = "db_backup"
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = os.path.join(backup_dir, f"db_backup_{timestamp}.json")
    
    # Dump data from current database
    print("Dumping data from current database...")
    try:
        subprocess.run(
            ["python", "manage.py", "dumpdata", "--exclude", "contenttypes", "--exclude", "auth.permission", 
             "--indent", "2", "--output", backup_file],
            check=True
        )
        print(f"Data successfully dumped to {backup_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error dumping data: {e}")
        return False
    
    # Update settings to use PostgreSQL
    print("Switching to PostgreSQL...")
    
    # Run migrations on PostgreSQL
    print("Running migrations on PostgreSQL...")
    try:
        subprocess.run(["python", "manage.py", "migrate"], check=True)
        print("Migrations completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"Error running migrations: {e}")
        return False
    
    # Load data into PostgreSQL
    print("Loading data into PostgreSQL...")
    try:
        subprocess.run(["python", "manage.py", "loaddata", backup_file], check=True)
        print("Data loaded successfully into PostgreSQL")
    except subprocess.CalledProcessError as e:
        print(f"Error loading data: {e}")
        return False
    
    print("Migration completed successfully!")
    return True

if __name__ == "__main__":
    migrate_to_postgres() 
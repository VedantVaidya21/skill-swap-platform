import os
import sys
import django
from django.db import connections
from django.db.utils import OperationalError

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_connection():
    try:
        # Try to get a cursor from the default database connection
        db_conn = connections['default']
        db_conn.cursor()
        
        # Get database info
        db_settings = db_conn.settings_dict
        db_engine = db_settings.get('ENGINE', '').split('.')[-1]
        db_name = db_settings.get('NAME', '')
        
        print(f"✅ Successfully connected to {db_engine} database: {db_name}")
        return True
    except OperationalError as e:
        print(f"❌ Could not connect to database: {e}")
        return False

if __name__ == "__main__":
    test_connection() 
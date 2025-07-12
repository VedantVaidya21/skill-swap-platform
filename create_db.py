import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to PostgreSQL server
conn = psycopg2.connect(
    dbname='postgres',
    user='postgres',
    password='postgres',
    host='localhost',
    port='5432'
)

conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cursor = conn.cursor()

# Create the database
try:
    cursor.execute(sql.SQL("CREATE DATABASE {}").format(
        sql.Identifier('skillswap')
    ))
    print("Database 'skillswap' created successfully!")
except psycopg2.errors.DuplicateDatabase:
    print("Database 'skillswap' already exists.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    cursor.close()
    conn.close() 
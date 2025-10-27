import mysql.connector
from mysql.connector import Error

def connect_todo_db():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='todo',
            user='root',
            password='111111')
        if connection.is_connected():
            print("Connection to Todo database was successful.")
            return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None
    
    connection = connect_todo_db()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE")
            record = cursor.fetchall()
        finally:
            cursor.close()
            connection.close()
        
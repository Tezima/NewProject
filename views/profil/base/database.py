from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import sqlite3

app = Flask(__name__)

# Підключення до бази даних (або створення нової, якщо не існує)
def connect_database():
    current_directory = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(current_directory, 'registration.db')
    conn = sqlite3.connect(db_path)
    return conn

# Створення таблиці користувачів
def create_table():
    conn = connect_database()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Додавання нового користувача до бази даних
def create_user(username, email, password):
    conn = connect_database()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO users (username, email, password) VALUES (?, ?, ?)
    ''', (username, email, password))
    conn.commit()
    conn.close()

# Реєстрація нового користувача
@app.route('/registration', methods=['POST'])
def register_user():
    data = request.form
    username = data['username']
    email = data['email']
    password = data['password']
    
    # Додавання користувача до бази даних
    create_user(username, email, password)
    
    return jsonify({'message': 'Registration successful'}), 200

# Ручне вимкнення сервера
@app.route('/shutdown', methods=['GET'])
def shutdown():
    shutdown_server()
    return 'Server shutting down...'

# Функція для вимкнення сервера
def shutdown_server():
    os._exit(0)

if __name__ == '__main__':
    try:
        create_table()  # Створення таблиці користувачів, якщо її ще немає
        print("Server is running...")
        
        # Зазначення папки як статичної
        static_dir = "C:\\OSPanel\\domains\\NewProject1"
        
        # Перевірка, чи існує введена папка
        if not os.path.isdir(static_dir):
            print("Invalid path. Exiting...")
            shutdown_server()
        else:
            app.config['STATIC_FOLDER'] = static_dir
            
            # Запуск сервера
            app.run(debug=True)
    except KeyboardInterrupt:
        print("Server stopped.")

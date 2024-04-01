import sqlite3
import os

# Отримання поточного каталогу, де знаходиться ваш Python-скрипт
current_directory = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_directory, 'registration.db')

# Підключення до бази даних (або створення нової, якщо не існує)
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Створення таблиці користувачів
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
    )
''')

# Збереження змін у базі даних
conn.commit()

# Закриття з'єднання з базою даних
conn.close()

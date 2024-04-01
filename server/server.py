from flask import Flask, request, jsonify, render_template
from profil.base.database import create_user

app = Flask(__name__)

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

if __name__ == '__main__':
    print("Server is running...")
    app.run(debug=True)

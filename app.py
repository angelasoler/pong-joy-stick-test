import RPi.GPIO as GPIO
from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

# Configuração do GPIO
GPIO.setmode(GPIO.BCM)

# Pinos do joystick
UP_PIN = 17
DOWN_PIN = 18

GPIO.setup(UP_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(DOWN_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Função para detectar movimentos do joystick
def joystick_listener():
    while True:
        if GPIO.input(UP_PIN) == GPIO.LOW:
            socketio.emit('joystick_move', {'direction': 'up'})
        elif GPIO.input(DOWN_PIN) == GPIO.LOW:
            socketio.emit('joystick_move', {'direction': 'down'})

@app.route('/')
def index():
    return 'Joystick WebSocket Server Running'

# Iniciar o listener do joystick em uma thread separada
if __name__ == '__main__':
    socketio.start_background_task(target=joystick_listener)
    socketio.run(app, host='0.0.0.0', port=5000)

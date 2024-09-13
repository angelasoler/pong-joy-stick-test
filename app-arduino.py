import serial
from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configuração da porta serial
# Altere 'COM3' para a sua porta serial, ou '/dev/ttyACM0' no Linux/macOS
ser = serial.Serial('COM5', 9600, timeout=1)  # Ajuste para a porta correta
ser.flush()

# Função para detectar movimentos do joystick pela porta Serial
def joystick_listener():
    previous_data = None
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()
            if line != previous_data:  # Apenas enviar quando os dados mudarem
                previous_data = line
                # Processar os dados recebidos
                data_parts = line.split()
                x_value = int(data_parts[0].split(':')[1])
                y_value = int(data_parts[1].split(':')[1])
                button_state = data_parts[2].split(':')[1]

                # Emitir os dados pelo WebSocket
                socketio.emit('joystick_move', {
                    'x': x_value,
                    'y': y_value,
                    'button': button_state
                })

@socketio.on('connect')
def handle_connect():
    print('Cliente conectado')
    emit('message', {'data': 'Conexão estabelecida'})

# Iniciar o listener do joystick em uma thread separada
if __name__ == '__main__':
    socketio.start_background_task(target=joystick_listener)
    socketio.run(app, host='0.0.0.0', port=5000)

void setup() {
  Serial.begin(9600);
  pinMode(2, INPUT_PULLUP);  // Botão conectado ao pino 2 (SW)
}

void loop() {
  int xValue = analogRead(A0);  // Ler eixo X
  int yValue = analogRead(A1);  // Ler eixo Y
  int buttonState = digitalRead(2);  // Ler estado do botão

  // Enviar os valores via Serial para a Raspberry Pi
  Serial.print("X:");
  Serial.print(xValue);
  Serial.print(" Y:");
  Serial.print(yValue);
  Serial.print(" Button:");
  Serial.println(buttonState == LOW ? "Pressed" : "Released");

  delay(100);
}

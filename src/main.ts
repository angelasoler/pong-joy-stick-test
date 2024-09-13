import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null;

function createWindow() {

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,  // Habilitar Node.js no renderizador
      contextIsolation: false
    }
  });
  mainWindow.webContents.openDevTools();

  mainWindow.loadFile('src/index.html'); // Carregar o arquivo HTML no processo de renderização

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

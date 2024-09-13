"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: true, // Habilitar Node.js no renderizador
            contextIsolation: false
        }
    });
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile('src/index.html'); // Carregar o arquivo HTML no processo de renderização
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

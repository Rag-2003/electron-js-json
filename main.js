import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { writeFileSync, readFileSync } from 'fs';
var fs = require('fs')
var path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'), // Ensure this path is correct
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load your React app
  win.loadURL('http://localhost:3000'); // Ensure your React app is running
}

app.whenReady().then(() => {
  createWindow();

  // IPC handlers for JSON file operations
  ipcMain.handle('write-json-file', (event, data) => {
    writeFileSync('product.json', JSON.stringify(data, null, 2));
    return { success: true };
  });

  ipcMain.handle('read-json-file', () => {
    const data = readFileSync('product.json', 'utf8');
    return { success: true, data: JSON.parse(data) };
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
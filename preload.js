// preload.js
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  writeJsonFile: (data) => ipcRenderer.invoke('write-json-file', data),
  readJsonFile: () => ipcRenderer.invoke('read-json-file')
});
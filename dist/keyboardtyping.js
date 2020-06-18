const electron = require("electron");

const ipc = require('electron').ipcRenderer;

document.getElementById("validate").addEventListener("click", () => {
    ipc.send("typing", document.getElementById("lilypond").value);
});
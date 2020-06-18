import { ipcRenderer } from 'electron';
export class KeyBoardTyping {
    static write(str) {
        alert("write");
        ipcRenderer.send('typing', str);
        alert("done");
    }
}
//# sourceMappingURL=KeyBoardTyping.js.map
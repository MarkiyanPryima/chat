import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private socket: Socket;
    private url = 'http://localhost:3000';

    constructor() {
        this.socket = io(this.url, {transports: ['websocket', 'polling', 'flashsocket']});
    }

    joinRoom(data): void {
        this.socket.emit('join', data);
    }

    sendMessage(data): void {
        this.socket.emit('message', data);
    }

    receiveMessage(): Observable<any> {
        return new Observable<{ user: string, message: string }>(obs => {
            this.socket.on('new message', (data) => {
                obs.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        });
    }

    getStorage(): [] {
        const storage: string = localStorage.getItem('chats');
        return storage ? JSON.parse(storage) : [];
    }

    setStorage(data): void {
        localStorage.setItem('chats', JSON.stringify(data));
    }
}

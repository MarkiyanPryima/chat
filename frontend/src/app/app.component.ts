import {Component, OnInit} from '@angular/core';
import {ChatService} from './services/chat/chat.service';
import {userList} from '../assets/users/userList';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    userList;
    roomId: string;
    messageText: string;
    messageArray = [];
    showScreen = false;
    id: string;
    currentUser;
    selectedUser;
    private storageArray = [];

    constructor(
        private chatService: ChatService
    ) {
        this.userList = userList;
    }

    ngOnInit(): void {
        this.chatService.receiveMessage()
            .subscribe(() => {
                if (this.roomId) {
                    this.storageArray = this.chatService.getStorage();
                    const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);
                    this.messageArray = this.storageArray[storeIndex].chats;
                }
            });
    }

    login(): void {
        this.currentUser = this.userList.find(user => user.id === +this.id);
        this.userList = this.userList.filter((user) => user.id !== +this.id);
        this.currentUser.logedIn = true;

        if (this.currentUser) {
            this.showScreen = true;
        }
    }

    selectUserHandler(id: number): void {
        this.selectedUser = this.userList.find(user => user.id === id);
        this.roomId = this.selectedUser.roomId[this.currentUser.id];
        this.messageArray = [];

        this.storageArray = this.chatService.getStorage();
        const storeIndex = this.storageArray
            .findIndex((storage) => storage.roomId === this.roomId);

        if (storeIndex > -1) {
            this.messageArray = this.storageArray[storeIndex].chats;
        }

        this.join(this.currentUser.name, this.roomId);
    }

    join(username: string, roomId: string): void {
        this.chatService.joinRoom({user: username, room: roomId});
    }

    sendMessage(): void {
        this.chatService.sendMessage({
            user: this.currentUser.name,
            room: this.roomId,
            message: this.messageText
        });

        this.storageArray = this.chatService.getStorage();
        const storeIndex = this.storageArray.findIndex((storage) => storage.roomId === this.roomId);

        if (storeIndex > -1) {
            this.storageArray[storeIndex].chats.push({
                user: this.currentUser.name,
                message: this.messageText
            });
        } else {
            const updateStorage = {
                roomId: this.roomId,
                chats: [{
                    user: this.currentUser.name,
                    message: this.messageText
                }]
            };

            this.storageArray.push(updateStorage);
        }

        this.chatService.setStorage(this.storageArray);
        this.messageText = '';
    }

}

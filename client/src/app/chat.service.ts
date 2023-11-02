import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public chatConnection: SignalR.HubConnection =
    new SignalR.HubConnectionBuilder()
      .withUrl('http://localhost:5001/chat')
      .configureLogging(SignalR.LogLevel.Information)
      .build();
  constructor() {
    this.startConnection();
    this.chatConnection.on(
      'ReceiveMessage',
      (user: string, message: string, messageTime: string) => {
        console.log(user, message, messageTime);
      }
    );

    this.chatConnection.on('ConnectedUser', (user: any) => {
      console.log(user);
    });
  }

  public async startConnection() {
    try {
      await this.chatConnection.start();
      console.log('Connection started');
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        this.startConnection();
      }, 5000);
    }
  }

  public async joinRoom(user: string, room: string) {
    try {
      await this.chatConnection.invoke('JoinRoom', { user, room });
    } catch (error) {
      console.log(error);
    }
  }

  public async sendMessage(message: string) {
    try {
      await this.chatConnection.invoke('SendMessage', message);
    } catch (error) {
      console.log(error);
    }
  }

  public async leaveRoom() {
    try {
      await this.chatConnection.stop();
    } catch (error) {
      console.log(error);
    }
  }
}

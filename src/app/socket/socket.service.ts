import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { config } from '../config';

@Injectable()
export class SocketService {
  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect(config.SOCKET, {
      transports: ['websocket', 'polling']
    });
  }

  onQuestion(): Observable<any> {
    return Observable.create(observer => {
      this.socket.on('question', (item: any) => observer.next(item));
    });
  }

  login(params: any) {
    this.socket.emit('login', params);
  }

  onLogin(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('login', (data: any) => {
        observer.next(data);
      });
    });
  }

  onAuth(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('auth', (data: any) => observer.next(data));
    });
  }
  start(id) {
    this.socket.emit('admin', { message: id, command: 1000 });
  }
  nextQuestion(id) {
    this.socket.emit('admin', { message: id, command: 1001 });
  }
  viewerSubmit(answer) {
    this.socket.emit('admin', {
      message: answer,
      command: 3000
    });
  }
  waitViewerSubmit(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('viewerSubmit', (data: any) => {
        observer.next(data);
      });
    });
  }
  waitQuestion(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receiveQuestion', (data: any) => {
        observer.next(data);
      });
    });
  }

  onUser(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user', (data: any) => observer.next(data));
    });
  }

  onConnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('connect', () => observer.complete());
    });
  }

  onDisconnect(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('disconnect', () => observer.complete());
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

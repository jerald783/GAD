import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { AppInitService } from './app-init.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  constructor(private appInit: AppInitService) {}

  // 🔔 Post notifications
  private newPostSubject = new BehaviorSubject<any>(null);
  newPost$ = this.newPostSubject.asObservable();

  // 📅 Event notifications
  private eventAddedSubject = new BehaviorSubject<any>(null);
  private eventUpdatedSubject = new BehaviorSubject<any>(null);
  private eventDeletedSubject = new BehaviorSubject<number | null>(null);

  eventAdded$ = this.eventAddedSubject.asObservable();
  eventUpdated$ = this.eventUpdatedSubject.asObservable();
  eventDeleted$ = this.eventDeletedSubject.asObservable();

  startConnection(): void {
   const signalRUrl = '/hubs/notification';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(signalRUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR error:', err));

    // Listeners
    this.hubConnection.on('PostAdded', data => this.newPostSubject.next(data));
    this.hubConnection.on('EventAdded', event => this.eventAddedSubject.next(event));
    this.hubConnection.on('EventUpdated', event => this.eventUpdatedSubject.next(event));
    this.hubConnection.on('EventDeleted', (id: number) => this.eventDeletedSubject.next(id));
  }
}

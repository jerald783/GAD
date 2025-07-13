import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AdmineventsService } from '../../../services/adminServices/adminevents.service';
import { SignalRService } from '../../../services/signalr.service';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit, OnDestroy {
  EventsList: any[] = [];
  OriginalEventsList: any[] = []; // Store original data for search reset
  searchTerm: string = '';
  isMobile: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private service: AdmineventsService,
    private toastr: ToastrService,
    private signalRService: SignalRService
  ) { }

  ngOnInit(): void {
    this.refreshEventsList();
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen.bind(this));

    this.signalRService.startConnection();

    //Ensure events are fully populated before display
    this.signalRService.eventAdded$.subscribe(event => {
      if (event && event.EventTime) {
        const formattedEvent = {
          ...event,
          EventTime: this.formatEventTime(event.EventTime)
        };
        this.EventsList.unshift(formattedEvent);
        this.OriginalEventsList.unshift(formattedEvent);

      } else {
        // fallback in case of missing fields
        this.refreshEventsList();
      }
    });

    this.signalRService.eventUpdated$.subscribe(event => {
      if (event && event.EventTime) {
        const formattedEvent = {
          ...event,
          EventTime: this.formatEventTime(event.EventTime)
        };

        const index = this.EventsList.findIndex(e => e.Id === formattedEvent.Id);
        if (index !== -1) {
          this.EventsList[index] = formattedEvent;
          this.OriginalEventsList[index] = formattedEvent;
          this.toastr.info('Event updated');
        }
      } else {
        this.refreshEventsList();
      }
    });

    this.signalRService.eventDeleted$.subscribe(id => {
      if (id !== null) {
        this.EventsList = this.EventsList.filter(e => e.Id !== id);
        this.OriginalEventsList = this.OriginalEventsList.filter(e => e.Id !== id);
        this.toastr.warning('Event deleted');
        
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const myButton = document.getElementById('myBtn');
    if (myButton) {
      myButton.style.display = window.scrollY > 20 ? 'block' : 'none';
    }
  }

  topFunction(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }
  refreshEventsList(): void {
    this.service
      .getEventsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          // Format EventTime here
          this.EventsList = data
            .map(event => ({
              ...event,
              EventTime: this.formatEventTime(event.EventTime) // Format time
            }))
            .sort((a, b) => b.Id - a.Id);

          this.OriginalEventsList = [...this.EventsList]; // Backup for search reset
        },
        (error) => {
          this.toastr.error('Failed to load events', 'Error');
        }
      );
  }

  // Format time as 10:00AM
  private formatEventTime(time: string): string {
    const date = new Date(`1970-01-01T${time}`); // Converts "10:00" to Date
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options).replace(' ', ''); // Removes space before AM/PM
  }

  searchEvents(): void {
    if (this.searchTerm.trim() !== '') {
      this.EventsList = this.OriginalEventsList.filter(event =>
        event.EventName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.EventsList = [...this.OriginalEventsList]; // Reset to original list
    }
  }
}

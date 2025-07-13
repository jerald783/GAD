import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdmineventsService } from '../../../../services/adminServices/adminevents.service';

@Component({
  selector: 'app-add-edit-events',
  standalone: false,
  templateUrl: './add-edit-events.component.html',
  styleUrl: './add-edit-events.component.scss'
})
export class AddEditEventsComponent implements OnInit {
  constructor(
    
    private service: AdmineventsService,
    private toastr: ToastrService // private toast: NgToastService
  ) {}
  @Input() events: any;
  Id: string | undefined;
  EventName: string | undefined;
  EventDate: string | undefined;
  EventTime: string | undefined;
  Venue: string | undefined;
  Notif_Date: string | undefined;
  Status: string | undefined;
  Filename:string| undefined;
  UploadedFile:string|undefined;
  PhotoFilePath: string | undefined;
  EventsList : any = [];
  ngOnInit(): void {
    this.loadEventsList();
 
  }

  loadEventsList() {
    this.service.getEventsList().subscribe((data: any) => {
      this.EventsList = data;
      this.Id = this.events.Id;
      this.EventName = this.events.EventName;
      this.EventDate = this.events.EventDate;
      this.EventTime = this.events.EventTime;
      this.Venue = this.events.Venue;
      this.Notif_Date = this.events.Notif_Date;
      this.Status = this.events.Status;
      this.Filename = this.events.Filename;
      this.UploadedFile =this.events.UploadedFile;
  
    });
  }

  addEvents() {
    var val = {
      Id: this.Id,
      EventName: this.EventName,
      EventDate: this.EventDate,
      EventTime: this.EventTime,
      Venue: this.Venue, 
      Notif_Date: this.Notif_Date, 
      Status: this.Status, 
      Filename: this.Filename, 
      UploadedFile: this.UploadedFile
    };
  
    this.service.addEvents(val).subscribe(() => {
      this.toastr.success('Added Successfully', 'Added');
    });
  }
  
  updateEvents() {
    var val = {
      Id: this.Id,
      EventName: this.EventName,
      EventDate: this.EventDate,
      EventTime: this.EventTime,
      Venue: this.Venue, 
      Notif_Date: this.Notif_Date, 
      Status: this.Status, 
      Filename: this.Filename, 
      UploadedFile: this.UploadedFile 
    };
  
    this.service.updateEvents(val).subscribe(() => {
      this.toastr.warning('Updated Successfully', 'Updated');
      
    });
  }
  

  uploadFile(event: any) {
    const file = event.target.files[0];
    if (!file) return; // Add this check
  
    const formData: FormData = new FormData();
    formData.append('uploadedFile', file, file.name);
  
    this.service.uploadFile(formData).subscribe((data: any) => {
      this.UploadedFile = data.toString();
      // this.PhotoFilePath = this.service.PhotoUrl + this.UploadedFile;
    });
  }
  
}

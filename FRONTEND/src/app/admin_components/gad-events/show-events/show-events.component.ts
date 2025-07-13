import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AdmineventsService } from '../../../../services/adminServices/adminevents.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SignalRService } from '../../../../services/signalr.service';
@Component({
  selector: 'app-show-events',
  standalone: false,
  templateUrl: './show-events.component.html',
  styleUrl: './show-events.component.scss'
})
export class ShowEventsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = 
  ['EventName','Status', 'EventDate', 'EventTime', 
  'Venue', 'Notif_Date','Filename',
  'UploadedFile','Options'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ModalTitle: string | undefined;
  ActivateAddEditEventsComp: boolean = false;
  events: any;

  EventsList: any[] = [];
  OriginalEventsList: any[] = [];

  constructor(private service: AdmineventsService, private toastr: ToastrService, private signalRService: SignalRService ) {}
  getFileUrl(fileName: string): string {
    return this.service.photoUrl + fileName;  // Assuming `PhotoUrl` is your base URL
  }
  
ngOnInit(): void {
  this.refreshEventsList();

  this.signalRService.startConnection();



    this.signalRService.startConnection();
// ADD
this.signalRService.eventAdded$.subscribe(() => {
  this.refreshEventsList();
});

// UPDATE
this.signalRService.eventUpdated$.subscribe(() => {
  this.refreshEventsList();
});
// DELETE
  this.signalRService.eventDeleted$.subscribe(id => {
    if (id !== null) {
      this.dataSource.data = this.dataSource.data.filter(e => e.Id !== id);
 
    }
  });
  }






  ngAfterViewInit(): void {
    // Apply paginator and sort to dataSource once the view is initialized
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addClick(): void {
    this.events = {
      Id: 0,
      EventName: '',
      EventDate: '',
      EventTime: '',
      Venue: '',
      Notif_Date: '',
      Status: '',
      FileName:'',
      UploadedFile:''

    };
    this.ModalTitle = 'Add Events';
    this.ActivateAddEditEventsComp = true;
  }

  editClick(item: any): void {
    console.log(item);
    this.events = item;
    this.ModalTitle = 'Edit Events';
    this.ActivateAddEditEventsComp = true;
    console.log(item);
  }

  deleteClick(item: any): void {
    if (confirm('Are you sure you want to delete this repository?')) {
      this.service.deleteEvents(item.Id).subscribe(() => {
        this.toastr.error('Deleted Successfully', 'Deleted');
        this.refreshEventsList();
      });
    }
  }

  closeClick(): void {
    this.ActivateAddEditEventsComp = false;
    this.refreshEventsList();
  }

  refreshEventsList(): void {
    this.service.getEventsList().subscribe((data) => {
      this.dataSource.data = data.sort((a, b) => b.Id - a.Id); 
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      for (let events of this.dataSource.data) {
        // events.PhotoFilePath = this.service.PhotoUrl + events.PhotoFileName;
      }
    });
    
  }
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Events');
  
    // Define Header Row
    const header = [
      'Event Name',
      'Event Date',
      'Event Time',
      'Venue',
      'Notification Date',
      'Status',
      'Filename',
      'Uploaded File'
    ];
  
    // Add Header with Styling
    const headerRow = worksheet.addRow(header);
  
    if (headerRow && typeof headerRow.eachCell === 'function') {
      headerRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF00FF00' } // Green background
        };
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFFFF' } // White font
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
  
        // Initialize column width based on header length
        worksheet.getColumn(colNumber).width = header[colNumber - 1].length + 5;
      });
    }
  
    // Add Data Rows
    this.dataSource.data.forEach((item) => {
      const row = worksheet.addRow([
        item.EventName,
        item.EventDate,
        item.EventTime,
        item.Venue,
        item.Notif_Date,
        item.Status,
        item.Filename,
        item.UploadedFile
      ]);
  
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', wrapText: true };
  
        // Adjust column width if data is longer than header
        const currentWidth = worksheet.getColumn(colNumber).width || 10;
        const newWidth = Math.max(currentWidth, (cell.value?.toString().length || 0) + 5);
        worksheet.getColumn(colNumber).width = newWidth;
      });
    });
  
    // Export to Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Event_List.xlsx');
    });
  }
  exportToPDF(): void {
    const doc = new jsPDF();
  
    // Add logos
    const leftLogo = 'assets/img/UPM_LOGO.png'; // Replace with actual path
    const rightLogo = 'assets/img/Logo.jpg'; // Replace with actual path
  
    const imgWidth = 30;
    const imgHeight = 30;
  
    doc.addImage(leftLogo, 'PNG', 10, 10, imgWidth, imgHeight);
    doc.addImage(rightLogo, 'PNG', 170, 10, imgWidth, imgHeight);
  
    // Add Title
    doc.setFontSize(16);
    const lineHeight = 1.5 * doc.getFontSize(); // Adjust line height based on font size

    doc.text(['Event List Report - 2025', 'Gender and Development Office'], 105, 25, {
      align: 'center',
      lineHeightFactor: 1.5, // This applies 1.5 line spacing
    });
    // doc.text('Event List Report - 2025', 105, 25, { align: 'center' });
    // doc.text('Gender and Development Office', 105, 35, { align: 'center' }); // 10 units below the first line
    
    // Prepare table data
    const headers = [['Event Name', 'Event Date', 'Event Time', 'Venue', 'Notif Date', 'Status', 'Filename', 'Uploaded File']];
    const data = this.dataSource.data.map(item => [
      item.EventName,
      item.EventDate,
      item.EventTime,
      item.Venue,
      item.Notif_Date,
      item.Status,
      item.Filename,
      item.UploadedFile || ''
    ]);
  
    // Add table
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 50,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [220, 53, 69], textColor: 255, halign: 'center' },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
  
    // Save PDF
    doc.save('Event_List_Report.pdf');
  }
}

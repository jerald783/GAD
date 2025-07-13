using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Models
{
    public class EventModel
    {
    public int Id { get; set; }
    public string? EventName { get; set; } 
    public string? EventDate { get; set; }
    public string? EventTime { get; set; }
    public string? Venue { get; set; }
    public string? Notif_Date { get; set; }
    public string? Status { get; set; }
    public string? Filename { get; set; }
    public string? UploadedFile{get;set;}
    }
}
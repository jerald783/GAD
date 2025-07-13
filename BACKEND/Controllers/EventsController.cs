using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using BACKEND.Models;
using MySql.Data.MySqlClient;
using System.Data;
using Microsoft.AspNetCore.SignalR;
using BACKEND.Hubs;
namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        private readonly IHubContext<NotificationHub> _hubContext;

        public EventsController(IConfiguration configuration, IWebHostEnvironment env, IHubContext<NotificationHub> hubContext)
        {
            _configuration = configuration;
            _env = env;
            _hubContext = hubContext;
        }
        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("GadAppCon"));
        }

        [HttpGet]
        public IActionResult Get()
        {
            string query = @"
                SELECT 
                    Id, 
                    EventName, 
                    DATE_FORMAT(EventDate, '%Y-%m-%d') AS EventDate,
                    DATE_FORMAT(EventTime, '%H:%i:%s') AS EventTime,
                    Venue, 
                    DATE_FORMAT(Notif_Date, '%Y-%m-%d') AS Notif_Date, 
                    Status, 
                    Filename,
                    UploadedFile
                FROM Events";

            DataTable table = new();
            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        con.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            table.Load(reader);
                        }
                    }
                }
                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync(EventModel events)
        {
            string insertQuery = @"
        INSERT INTO Events 
        (
            EventName, 
            EventDate,
            EventTime,
            Venue, 
            Notif_Date, 
            Status, 
            Filename,
            UploadedFile
        )
        VALUES (
            @EventName, 
            @EventDate,
            @EventTime,
            @Venue, 
            @Notif_Date, 
            @Status, 
            @Filename,
            @UploadedFile
        )";
            try
            {
                using (var con = GetConnection())
                {
                    using (var insertCmd = new MySqlCommand(insertQuery, con))
                    {
                        insertCmd.Parameters.AddWithValue("@EventName", events.EventName);
                        insertCmd.Parameters.AddWithValue("@EventDate", events.EventDate);
                        insertCmd.Parameters.AddWithValue("@EventTime", events.EventTime);
                        insertCmd.Parameters.AddWithValue("@Venue", events.Venue);
                        insertCmd.Parameters.AddWithValue("@Notif_Date", events.Notif_Date);
                        insertCmd.Parameters.AddWithValue("@Status", events.Status);
                        insertCmd.Parameters.AddWithValue("@Filename", events.Filename);
                        insertCmd.Parameters.AddWithValue("@UploadedFile", events.UploadedFile);
                        con.Open();
                        insertCmd.ExecuteNonQuery();

                    }

                }

                await _hubContext.Clients.All.SendAsync("EventAdded", events);

                return Ok(new { message = "Added Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }

        }

        [HttpPut]
        public async Task<IActionResult> PutAsync(EventModel events)
        {
            string query = @"
                UPDATE Events SET 
                    EventName = @EventName,
                    EventDate = @EventDate, 
                    EventTime = @EventTime, 
                    Venue = @Venue, 
                    Status = @Status,
                    Notif_Date = @Notif_Date,
                    Filename = @Filename,
                    UploadedFile = @UploadedFile
                WHERE Id = @Id";

            try
            {
                using (var con = GetConnection())
                {
                    using (var updatecmd = new MySqlCommand(query, con))
                    {
                        updatecmd.Parameters.AddWithValue("@Id", events.Id);
                        updatecmd.Parameters.AddWithValue("@EventName", events.EventName);
                        updatecmd.Parameters.AddWithValue("@EventDate", events.EventDate);
                        updatecmd.Parameters.AddWithValue("@EventTime", events.EventTime);
                        updatecmd.Parameters.AddWithValue("@Venue", events.Venue);
                        updatecmd.Parameters.AddWithValue("@Notif_Date", events.Notif_Date);
                        updatecmd.Parameters.AddWithValue("@Status", events.Status);
                        updatecmd.Parameters.AddWithValue("@Filename", events.Filename);
                        updatecmd.Parameters.AddWithValue("@UploadedFile", events.UploadedFile);

                        con.Open();
                        updatecmd.ExecuteNonQuery();
                    }
                }
                await _hubContext.Clients.All.SendAsync("EventUpdated", events);

                return Ok(new { message = "Updated Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {
            string query = "DELETE FROM Events WHERE Id = @Id";

            try
            {
                using (var con = GetConnection())
                {
                    using (var delcmd = new MySqlCommand(query, con))
                    {
                        delcmd.Parameters.AddWithValue("@Id", Id);
                        con.Open();
                        delcmd.ExecuteNonQuery();
                    }
                }
                await _hubContext.Clients.All.SendAsync("EventDeleted", Id);
                return Ok(new { message = "Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [Route("SaveFile")]
        [HttpPost]
        public JsonResult SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/Assets/" + "Files/" + filename;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                return new JsonResult(filename);
            }
            catch (Exception)
            {
                return new JsonResult("anonymous.png");
            }
        }
    }
}

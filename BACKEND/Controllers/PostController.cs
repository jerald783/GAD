using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Hubs;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MySql.Data.MySqlClient;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationHub> _hubContext;

        public PostController(IConfiguration configuration, IHubContext<NotificationHub> hubContext)
        {
            _configuration = configuration;
            _hubContext = hubContext;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("GadAppCon"));
        }

        [HttpGet]
        public IActionResult Get()
        {
            string query = @"SELECT Posid, UserPosts, DatePosted FROM UserPost;
";
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
        public async Task<IActionResult> Post(UserPost userPost)
        {
            string query = @"
        INSERT INTO UserPost(UserPosts) VALUES(@UserPosts);";

            try
            {

                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@UserPosts", userPost.UserPosts);
                        con.Open(); ;
                        cmd.ExecuteNonQuery();
                    }
                }

                await _hubContext.Clients.All.SendAsync("PostAdded", userPost);

                return Ok(new { message = "Added Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {
            string query = "DELETE FROM UserPost WHERE Posid= @Posid";
            try
            {
                using (var con = GetConnection())
                {
                    using (var delcmd = new MySqlCommand(query, con))
                    {
                        delcmd.Parameters.AddWithValue("@Posid", Id);
                        con.Open();
                        delcmd.ExecuteNonQuery();
                    }
                    await _hubContext.Clients.All.SendAsync("Post Deleted", Id);
                    return Ok(new { message = "Deleted Succesfully" });
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal Serve Error:{ex.Message}");
        }
     }
    }
}

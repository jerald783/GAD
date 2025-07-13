using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RepoController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RepoController(IConfiguration configuration)
        {
            _configuration = configuration;
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
                    id, 
                    DATE_FORMAT(Date, '%Y-%m-%d') AS Date,
                    Project_Title, 
                    Project_Leader, 
                    Funding_Source, 
                    Budget
                FROM Re_RepoDB";

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
        public IActionResult Post(Repository repo)
        {
            string query = @"
                INSERT INTO Re_RepoDB 
                (Date, Project_Title, Project_Leader, Funding_Source, Budget)
                VALUES (@Date, @Project_Title, @Project_Leader, @Funding_Source, @Budget)";

            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Date", repo.Date);
                        cmd.Parameters.AddWithValue("@Project_Title", repo.Project_Title);
                        cmd.Parameters.AddWithValue("@Project_Leader", repo.Project_Leader);
                        cmd.Parameters.AddWithValue("@Funding_Source", repo.Funding_Source);
                        cmd.Parameters.AddWithValue("@Budget", repo.Budget);

                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "Added Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPut]
        public IActionResult Put(Repository repo)
        {
            string query = @"
                UPDATE Re_RepoDB SET 
                    Date = @Date, 
                    Project_Title = @Project_Title, 
                    Project_Leader = @Project_Leader, 
                    Funding_Source = @Funding_Source, 
                    Budget = @Budget 
                WHERE id = @id";

            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@id", repo.id);
                        cmd.Parameters.AddWithValue("@Date", repo.Date);
                        cmd.Parameters.AddWithValue("@Project_Title", repo.Project_Title);
                        cmd.Parameters.AddWithValue("@Project_Leader", repo.Project_Leader);
                        cmd.Parameters.AddWithValue("@Funding_Source", repo.Funding_Source);
                        cmd.Parameters.AddWithValue("@Budget", repo.Budget);

                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "Updated Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            string query = "DELETE FROM Re_RepoDB WHERE id = @id";

            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@id", id);
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}

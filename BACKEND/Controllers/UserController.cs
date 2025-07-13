using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Crypto.Generators;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("GadAppCon"));
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            string query = @"
                SELECT u.UserId, u.Username, u.Email, r.RoleName 
                FROM Users u
                JOIN Roles r ON u.RoleId = r.RoleId";

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
                return StatusCode(500, new { message = "Error retrieving users", error = ex.Message });
            }
        }

        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            string query = @"
        SELECT UserId, Username, Email, RoleId 
        FROM Users";

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
                return StatusCode(500, new { message = "Error retrieving all users", error = ex.Message });
            }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(user.Email))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
            string query = "INSERT INTO Users (Username, Password, Email, RoleId) VALUES (@Username, @Password, @Email, @RoleId)";

            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Username", user.Username);
                        cmd.Parameters.AddWithValue("@Password", hashedPassword);
                        cmd.Parameters.AddWithValue("@Email", user.Email);
                        cmd.Parameters.AddWithValue("@RoleId", user.RoleId ?? 2);

                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error registering user", error = ex.Message });
            }
        }
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")] // Optional: Only allow Admins to update users
        public IActionResult UpdateUser(int id, [FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest(new { message = "Username and Password are required." });
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

            string query = @"
        UPDATE Users 
        SET Username = @Username, Password = @Password, RoleId = @RoleId 
        WHERE UserId = @UserId";

            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Username", user.Username);
                        cmd.Parameters.AddWithValue("@Password", hashedPassword);
                        cmd.Parameters.AddWithValue("@RoleId", user.RoleId ?? 2);
                        cmd.Parameters.AddWithValue("@UserId", id);

                        con.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                            return Ok(new { message = "User updated successfully." });
                        else
                            return NotFound(new { message = "User not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", error = ex.Message });
            }
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLogin user)
        {
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest(new { message = "Username and Password are required." });
            }

            string query = @"
                SELECT u.Password, r.RoleName 
                FROM Users u
                JOIN Roles r ON u.RoleId = r.RoleId
                WHERE u.Username = @Username";

            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Username", user.Username);
                        con.Open();

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                string storedPassword = reader["Password"].ToString();
                                string roleName = reader["RoleName"].ToString();

                                if (BCrypt.Net.BCrypt.Verify(user.Password, storedPassword))
                                {
                                    return Ok(new { message = "Login successful.", role = roleName });
                                }
                            }
                        }
                    }
                }

                return Unauthorized(new { message = "Invalid username or password." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error during login", error = ex.Message });
            }
        }

        [HttpPost("check-email")]
        public async Task<IActionResult> CheckEmail([FromBody] dynamic requestData)
        {
            string email = requestData?.email;
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email is required" });
            }

            string query = "SELECT RoleId FROM Users WHERE Email = @Email";
            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    con.Open();

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            int roleId = Convert.ToInt32(reader["RoleId"]);
                            return Ok(new { exists = true, roleId = roleId });
                        }
                        else
                        {
                            return Ok(new { exists = false });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error checking email", error = ex.Message });
            }
        }
    }
}

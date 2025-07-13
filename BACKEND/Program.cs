// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.

// builder.Services.AddControllers();
// // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// var app = builder.Build();

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();

// app.UseAuthorization();

// app.MapControllers();

// app.Run();
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json.Serialization;
using BACKEND.Hubs;
var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json");

// ✅ Fix CORS for SignalR + Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
    {
            builder.WithOrigins("https://upmingad.vercel.app")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// Add controllers + JSON settings
builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
});

// ✅ Add SignalR
builder.Services.AddSignalR();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowOrigin");

app.UseAuthorization();

app.MapControllers();

// ✅ Serve static files from Assets folder
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Assets")),
    RequestPath = "/Assets"
});

// ✅ SignalR endpoint
app.MapHub<NotificationHub>("/hubs/notification");

app.Run();












// using Microsoft.Extensions.FileProviders;
// using Newtonsoft.Json.Serialization;
// using BACKEND.Hubs;

// var builder = WebApplication.CreateBuilder(args);

// // ✅ Load appsettings.json
// builder.Configuration.AddJsonFile("appsettings.json");

// // ✅ Fix CORS for SignalR + Angular
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowOrigin", builder =>
//     {
//         builder.WithOrigins("http://192.168.1.10:4200") // Your Angular app
//                .AllowAnyMethod()
//                .AllowAnyHeader()
//                .AllowCredentials();
//     });
// });

// // ✅ Add controllers + JSON settings
// builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
// {
//     options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
//     options.SerializerSettings.ContractResolver = new DefaultContractResolver();
// });

// // ✅ Add SignalR
// builder.Services.AddSignalR();

// var app = builder.Build();

// // ✅ Developer exception page
// if (app.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
// }

// // ✅ Enforce HTTPS
// app.UseHttpsRedirection();

// // ✅ Add global security headers
// app.Use(async (context, next) =>
// {
//     context.Response.Headers.Add("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
//     context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com");
//     context.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
//     context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
//     context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
//     context.Response.Headers.Add("Permissions-Policy", "geolocation=(self), camera=(), microphone=()");

//     await next();
// });

// // ✅ Serve static files (wwwroot)
// app.UseStaticFiles();

// // ✅ Serve static files from Assets folder
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(
//         Path.Combine(Directory.GetCurrentDirectory(), "Assets")),
//     RequestPath = "/Assets"
// });

// // ✅ Routing & CORS
// app.UseRouting();
// app.UseCors("AllowOrigin");

// // ✅ Authorization (if using [Authorize])
// app.UseAuthorization();

// // ✅ Map controllers
// app.MapControllers();

// // ✅ SignalR endpoint
// app.MapHub<NotificationHub>("/hubs/notification");

// // ✅ Run the app
// app.Run();

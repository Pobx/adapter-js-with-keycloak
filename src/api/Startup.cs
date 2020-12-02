using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace api {
  public class Startup {
    public Startup (IConfiguration configuration, IWebHostEnvironment env) {
      Configuration = configuration;
      Environment = env;
    }

    public IConfiguration Configuration { get; }
    public IWebHostEnvironment Environment { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices (IServiceCollection services) {

      services.AddControllers ();
      services.AddSwaggerGen (c => {
        c.SwaggerDoc ("v1", new OpenApiInfo { Title = "api", Version = "v1" });
      });

      services.AddAuthentication (options => {
          options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
          options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

        })
        .AddJwtBearer (options => {
          options.Authority = Configuration["Jwt:Authority"];
          options.Audience = Configuration["Jwt:Audience"];
          options.RequireHttpsMetadata = false;

          options.Events = new JwtBearerEvents () {
            OnAuthenticationFailed = context => {
              context.NoResult ();
              context.Response.StatusCode = 500;
              context.Response.ContentType = "text/plain";
              if (Environment.IsDevelopment ()) {
                return context.Response.WriteAsync (context.Exception.ToString ());
              }
              return context.Response.WriteAsync ("An error occured processing your authentication.");
            }
          };
        });

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure (IApplicationBuilder app, IWebHostEnvironment env) {
      if (env.IsDevelopment ()) {
        app.UseDeveloperExceptionPage ();
        app.UseSwagger ();
        app.UseSwaggerUI (c => c.SwaggerEndpoint ("/swagger/v1/swagger.json", "api v1"));
      }

      app.UseHttpsRedirection ();

      app.UseRouting ();

      app.UseAuthorization ();

      app.UseEndpoints (endpoints => {
        endpoints.MapControllers ();
      });
    }
  }
}
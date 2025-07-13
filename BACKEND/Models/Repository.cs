using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Models
{
  public class Repository
{
    public int id { get; set; }
      public string? Date { get; set; }
            public string? Project_Title { get; set; }
                public string? Project_Leader { get; set; }
                    public string? Funding_Source { get; set; }
                    public string? Budget { get; set; }
}
}
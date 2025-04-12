using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Orders_Repo.Models.RequestModels
{
    public class OrdersRequest
    {
        
        public string SearchKey { get; set; }

        
        public string DateSortOrder { get; set; }

        
        public string OrderNumberSortOrder { get; set; }

    }
}

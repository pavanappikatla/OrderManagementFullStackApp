using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OrdersApi.CustomValidationAttributes; 

namespace OrdersApi.RequestModels
{
    public class OrdersRequest
    {
        [Required(AllowEmptyStrings =true)]
        public string SearchKey { get; set; }

        [Required(AllowEmptyStrings =true)]

        public string DateSortOrder { get; set; } = string.Empty;

        [Required(AllowEmptyStrings = true)]

        public string OrderNumberSortOrder { get; set; } = string.Empty;

    }
}

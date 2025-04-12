using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Orders_Repo.Models
{
    public class OpenOrders
    {
        public int Order_Detail_ID { get; set; }
        public int POLin { get; set; }
        public string JobNo { get; set; }
        public string PO { get; set; }
        public string PartNum { get; set; }
        public string Rev { get; set; }
        public DateTime DueDte { get; set; }
        public DateTime RevDte { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public decimal Ordered { get; set; }
        public decimal Total { get; set; }
        public decimal ToMake { get; set; }
        public decimal Open { get; set; }
        public string Customer { get; set; }
        public decimal RTS { get; set; }
        public decimal RTT { get; set; }
        public string Status { get; set; }
        public string AltPN { get; set; }
        public bool SubAsmbly { get; set; }
        public string ProdCode { get; set; }
        public string HTS { get; set; }
        public bool Processed { get; set; }
        public decimal Price { get; set; }
        public int Order_Header_ID { get; set; }

    }
}

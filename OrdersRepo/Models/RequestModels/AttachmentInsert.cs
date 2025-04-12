using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Orders_Repo.Models.RequestModels
{
    public class AttachmentInsert
    {
        public string Company_Code { get; set; }

        public string Attachment_Filename { get; set; }

        public string Description { get; set; }

        public string Order_Header_ID { get; set; }

        public string Order_Detail_ID { get; set; }

        public string UserText { get; set; }

        public string DocumentType { get; set; }
    }
}

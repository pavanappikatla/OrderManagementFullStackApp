namespace OrdersApi.RequestModels
{
    public class AttachmentInsertDTO
    {

        public string Company_Code { get; set; }

        public string Attachment_Filename { get; set; }

        public string Description { get; set; }

        public string Order_Header_ID { get; set; }

        public string Order_Detail_ID { get; set; }
    }
}

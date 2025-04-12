namespace OrdersApi.RequestModels
{
    public class FileUploadRequest
    {
        public IFormFile FileBytes { get; set; }

        public string FileType { get; set; } = ".jpg";

        public string PONumber { get; set; }

        public string JobNo { get; set; }

        public string Order_Header_ID { get; set; }

        public string Order_Detail_ID { get; set; }

        public string DocumentType { get; set; }

        public string UserText { get; set; }
    }
}

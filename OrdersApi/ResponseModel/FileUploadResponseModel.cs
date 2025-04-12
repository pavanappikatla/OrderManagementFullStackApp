namespace OrdersApi.ResponseModel
{
    public class FileUploadResponseModel
    {
        public bool Status { get; set; }

        public string Message { get; set; }

        public FileUploadResponseModel(bool Status, string Message)
        {
            this.Status = Status;
            this.Message = Message;
        }
    }
}

using Orders_Repo;
using Orders_Repo.Models.RequestModels;
using APIRequestModel = OrdersApi.RequestModels;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using OrdersApi.ResponseModel;
using System.Reflection.Metadata;
using OrdersApi.LoggingService;
using System.Text;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace OrdersApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly OrdersRepository repo;
        private readonly IConfiguration _config;

        public OrdersController(OrdersRepository repo, IConfiguration configuration)
        {
            this.repo = repo;
            _config = configuration;
        }

        [HttpGet("test")]
        public ActionResult TestApi()
        {
            return Ok(new { message = "successful" });
        }

        [HttpPost("open-orders-get")]
        public async Task<ActionResult> GetOpenOrders([FromBody] APIRequestModel.OrdersRequest request)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    OrdersRequest req = new()
                    {
                        DateSortOrder = request.DateSortOrder,
                        OrderNumberSortOrder = request.OrderNumberSortOrder,
                        SearchKey =  request.SearchKey

                    };

                    var openOrders = await this.repo.GetOpenOrders(req);

                    return StatusCode(StatusCodes.Status200OK, openOrders);
                }

                return StatusCode(StatusCodes.Status500InternalServerError, ModelState.ValidationState.ToString());
            }
            catch(Exception Ex)
            {
                LogService.WriteToLog(ControllerContext?.RouteData?.Values["controller"]?.ToString()??"", Ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, ModelState.ValidationState.ToString());
            }
        }

        [HttpPost("copy-file-to-server")]
        public async Task<ActionResult<FileUploadResponseModel>> UploadFileToServer([FromForm] APIRequestModel.FileUploadRequest request)
        {
            try
            {
                if (request.FileBytes == null || request.FileBytes.Length == 0)
                { 
                
                    return BadRequest("File is empty.");
                }

                string? networkPath = _config.GetValue<string>("FileUploadPath") ?? "";


                //string projectRoot = Directory.GetCurrentDirectory(); // Gets the base directory of your project
                //string networkPath = Path.Combine(projectRoot, "Files");

                if (string.IsNullOrEmpty(networkPath))
                { 
                    return BadRequest(new FileUploadResponseModel(false, "Network path does not exist."));
                }
                
                if (!Directory.Exists(networkPath))
                {
                    return BadRequest(new FileUploadResponseModel(false, "Network path does not exist."));
                    
                }
                string poDirectory = Path.Combine(networkPath, request.PONumber);

                if (!Directory.Exists(poDirectory))
                {
                    System.IO.Directory.CreateDirectory(poDirectory);
                }
                string formattedTime = DateTime.Now.ToString("hhmmss tt").Replace(" ", "");
                string generatedFileName = $"{request.JobNo}_{DateTime.Now.ToString("yyyyMMdd")}{formattedTime}.{request.FileType}";

                string filePath = Path.Combine(poDirectory, generatedFileName);

                Byte[] compressedFileBytes = await CompressToUnder400KBAsync(request.FileBytes);

                using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    await fileStream.WriteAsync(compressedFileBytes);
                }

                AttachmentInsert attachmentDTO = new()
                {
                    Attachment_Filename = filePath,
                    Company_Code = "",
                    Description = "Job Picture",
                    Order_Detail_ID = request.Order_Detail_ID,
                    Order_Header_ID = request.Order_Header_ID,
                    DocumentType = request.DocumentType,
                    UserText = request.UserText
                };

                await repo.InsertAttachmentInfo(attachmentDTO);

                return Ok(new FileUploadResponseModel(true, "File Uploaded Successfully."));
                
            }
            catch(Exception ex)
            {
                LogService.WriteToLog(ControllerContext?.RouteData?.Values["controller"]?.ToString() ?? "", ex.Message);
                return BadRequest(new FileUploadResponseModel(false, ex.Message));
            }

        }

        private async Task<byte[]> CompressToUnder400KBAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Invalid file");
            using var inputStream = file.OpenReadStream();
            using Image img = await Image.LoadAsync(inputStream);

            int quality = 90;
            byte[] result;
            do
            {
                using var memoryStream = new MemoryStream();
                var encoder = new JpegEncoder
                {
                    Quality = quality // Reduce quality gradually
                };

                await img.SaveAsJpegAsync(memoryStream, encoder);
                result = memoryStream.ToArray();

                quality -= 5;
            }
            while (result.Length > 400 * 1024 && quality > 10);

            return result;
        }

        [HttpGet("get-files-from-directory/{PO}")]
        public async Task<ActionResult<List<string>>> GetFilesFromDirectory([FromRoute] string PO)
        {
            try
            {

                string? networkPath = _config.GetValue<string>("FileUploadPath") ?? "";


                //string projectRoot = Directory.GetCurrentDirectory(); // Gets the base directory of your project
                //string networkPath = Path.Combine(projectRoot, "Files");

                if (string.IsNullOrEmpty(networkPath))
                {
                    return BadRequest();
                }

                if (!Directory.Exists(networkPath))
                {
                    return BadRequest();

                }
                string poDirectory = Path.Combine(networkPath, PO);

                if (!Directory.Exists(poDirectory))
                {
                    return Ok(null);
                }
                List<string> fileNames = new();
                fileNames.AddRange( Directory.GetFiles(poDirectory));

                List<string> justFileNames = fileNames.Select(x => x.Split(@"\").Last()).ToList();

                return Ok(justFileNames);
                //return Ok(Directory.GetFiles(poDirectory));
            }
            catch (Exception ex)
            {
                LogService.WriteToLog(ControllerContext?.RouteData?.Values["controller"]?.ToString() ?? "", ex.Message);
                return BadRequest(new FileUploadResponseModel(false, ex.Message));
            }

        }

        [HttpGet("download-file/{fileName}/{poNum}")]
        public async Task<ActionResult> DownloadFile([FromRoute] string fileName, [FromRoute]string poNum)
        {
            try
            {
                string directoryPath = _config.GetValue<string>("FileUploadPath") ?? "";

                //string projectRoot = Directory.GetCurrentDirectory(); // Gets the base directory of your project
                //string directoryPath = Path.Combine(projectRoot, "Files");



                string fullFilePath = Path.Combine(directoryPath, poNum, fileName);

                string extension = Path.GetExtension(fullFilePath);

                byte[] FileBytes = await System.IO.File.ReadAllBytesAsync(fullFilePath);

                string contentType = "";

                switch(extension)
                {
                    case ".jpg" or ".jpeg":
                        contentType = "image/jpeg";
                        break;
                    case ".pdf":
                        contentType = "application/pdf";
                        break;
                    case ".png":
                        contentType = "image/png";
                        break;
                }

                return File(FileBytes,contentType);

            }
            catch(Exception ex)
            {
                LogService.WriteToLog(ControllerContext?.RouteData?.Values["controller"]?.ToString() ?? "", ex.Message);
                return BadRequest(null);
            }
        }

        [HttpGet("documenttype")]
        public async Task<ActionResult> GetDocumentTypes()
        {
            try
            {
                var res = await repo.GetDocumentTypes();

                return Ok(res);
            }
            catch(Exception ex)
            {
                LogService.WriteToLog(ControllerContext?.RouteData?.Values["controller"]?.ToString() ?? "", ex.Message);
                return BadRequest();
            }
        }
    }
}

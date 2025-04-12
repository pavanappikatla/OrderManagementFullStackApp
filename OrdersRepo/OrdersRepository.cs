using Orders_Repo.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Web.Http;
using Orders_Repo.Models.RequestModels;
namespace Orders_Repo
{
    public class OrdersRepository(IConfiguration config)
    {
        private readonly string _connectionString = config.GetConnectionString("Dev") ?? "";

        
        public async Task<IEnumerable<OpenOrders>> GetOpenOrders(OrdersRequest request)
        {
            using (SqlConnection con = new(_connectionString))
            {
                return await con.QueryAsync<OpenOrders>(
                                                        @"SELECT TOP 25 * 
                                                          FROM dbo.BHU_OpenOrders 
                                                          WHERE (@SearchKey = '' 
                                                          OR Customer LIKE '%' + @SearchKey + '%'
                                                          OR JobNo LIKE '%'+@SearchKey+'%'
                                                          OR PartNum LIKE '%' +@SearchKey+ '%') 
                                                           ORDER BY 
                                                                  CASE WHEN @DueDateSort = 'asc' THEN DueDte END ASC,
                                                                  CASE WHEN @DueDateSort = 'desc' THEN DueDte END DESC,
                                                                  CASE WHEN @OrderNumberSort = 'asc' THEN JobNo END ASC,
                                                                  CASE WHEN @OrderNumberSort = 'desc' THEN JobNo END DESC,
                                                                                                    JobNo DESC",
                                                        new { SearchKey = request.SearchKey
                                                             , DueDateSort = request.DateSortOrder
                                                            , OrderNumberSort = request.OrderNumberSortOrder}
                                                        , commandTimeout: 180
);
            }
        }

        public async Task<dynamic> InsertAttachmentInfo( AttachmentInsert req)
        {
            using (SqlConnection con = new(_connectionString))
            {
                return await con.QueryAsync(@"INSERT INTO 
                                            dbo.Attachment  (Company_Code
                                                            , Attachment_Filename
                                                            , Description
                                                            , Order_Header_ID
                                                            , Order_Detail_ID
                                                            , Attachment_Type
                                                            , Attachment_Revision_Level
                                                            , Attachment_Revision_Date)
                                            VALUES (@Company_Code,@Attachment_Filename, @Description, @Order_Header_ID,	@Order_Detail_ID, @Attachment_Type,
                                                     @Attachment_Revision_Level, @Attachment_Revision_Date)",
                                            new
                                            {
                                                Company_Code = req.Company_Code,
                                                Attachment_Filename = req.Attachment_Filename,
                                                Description = req.UserText,
                                                Order_Header_ID = req.Order_Header_ID,
                                                Order_Detail_ID = req.Order_Detail_ID,
                                                Attachment_Type = req.DocumentType,
                                                Attachment_Revision_Level = "AppV1",
                                                Attachment_Revision_Date = DateTime.Now
                                            });
            }

        }

        public async Task<IEnumerable<string>> GetDocumentTypes()
        {
            using (SqlConnection con = new(_connectionString))
            {
                return await con.QueryAsync<string>(@"SELECT Document_Type FROM Document_Type WHERE Company_Code = 'OrdersINDSQ'");
            }
        }

    }


}

namespace OrdersApi.AuthMiddleware
{
    public class AuthMiddleware
    {
        RequestDelegate _next;
        List<string> _allowedIpPrefixes;

        public AuthMiddleware(RequestDelegate next) {
            _next = next;
            _allowedIpPrefixes = new List<string>
        {
            "192.168.", // Common LAN
            //"10.",      // Another common LAN
            //"172.16.",  // Private subnet range
            "127.0.0.1", // Localhost
            "::1"       // IPv6 localhost
        };
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string callingIP = context?.Connection?.RemoteIpAddress?.ToString()??"";
            if (string.IsNullOrEmpty(callingIP))
            {
                return;
            }
                if(!_allowedIpPrefixes.Any(x => callingIP.StartsWith(x)))
                {
                    LoggingService.LogService.WriteToLog($"{context.Request.Path}",$"{DateTime.Now.ToString()}Ip tried to access: {callingIP}");
                    return;
                }
                await _next(context);
           
        }
        
    }
}

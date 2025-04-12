namespace OrdersApi.LoggingService
{
    public class LogService
    {
        private static readonly object lockObj = new object();
        private static LogService _obj;
        private  LogService()
        {
        }
        public static LogService GetLogService { 
            get { 
                if(_obj==null)
                {
                    lock (lockObj)
                    {
                        if(_obj==null)
                        {
                            _obj = new LogService();
                        }
                        return _obj;
                    }
                }
                return _obj;
                    }
            private set { }
        }

        public static void WriteToLog(string controllerMethod, string exception)
        {
            string currentDir = Environment.CurrentDirectory;
            string logsDirectory = Path.Combine(currentDir, "Logs");
            string logFileName = Path.Combine(logsDirectory, "logs.txt");

            if(!System.IO.Directory.Exists(logsDirectory))
            {
                System.IO.Directory.CreateDirectory(logsDirectory);
            }

            List<string> exceptions = new List<string>();
            exceptions.Add($"Controller: {controllerMethod} \n {System.DateTime.Now} {exception}");

            File.AppendAllLines(logFileName, exceptions);

        }
    }
}

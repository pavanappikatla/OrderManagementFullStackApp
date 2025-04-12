cd ClientApp
call npm install
call npm run build --configuration=production

REM Clean the wwwroot folder first
rmdir /s /q ..\wwwroot
mkdir ..\wwwroot

REM Copy built Angular files
xcopy /s /y /i dist\app-v1\browser\* ..\wwwroot\
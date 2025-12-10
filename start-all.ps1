# ============================================
# AEON RAILGUARD - START ALL SERVICES
# PowerShell Script to launch all 3 microservices
# in separate terminal windows.
# ============================================
# Usage: Right-click > Run with PowerShell
#    OR: .\start-all.ps1 from terminal
# ============================================

# Get the root directory (where this script is located)
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  AEON RAILGUARD - STARTING ALL SERVICES  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# JENDELA 1: BACKEND GO (central-brain)
# ============================================
Write-Host "[1/3] Starting Go Backend..." -ForegroundColor Green

$GoPath = Join-Path $RootDir "central-brain"
$GoCommand = @"
`$Host.UI.RawUI.WindowTitle = 'SERVER - GO BACKEND'
Set-Location '$GoPath'
Write-Host '========================================' -ForegroundColor Yellow
Write-Host '  AEON RAILGUARD - GO BACKEND SERVER  ' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Yellow
Write-Host ''
go run .
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $GoCommand

# ============================================
# JENDELA 2: AI ENGINE PYTHON (ai-engine)
# ============================================
Write-Host "[2/3] Starting Python AI Engine..." -ForegroundColor Green

$AiPath = Join-Path $RootDir "ai-engine"
$VenvActivate = Join-Path $AiPath ".venv\Scripts\Activate.ps1"
$AiCommand = @"
`$Host.UI.RawUI.WindowTitle = 'BRAIN - PYTHON AI'
Set-Location '$AiPath'
Write-Host '========================================' -ForegroundColor Magenta
Write-Host '  AEON RAILGUARD - PYTHON AI ENGINE   ' -ForegroundColor Magenta
Write-Host '========================================' -ForegroundColor Magenta
Write-Host ''
# Activate virtual environment if exists
if (Test-Path '$VenvActivate') {
    Write-Host '[INFO] Activating virtual environment...' -ForegroundColor Cyan
    & '$VenvActivate'
}
# Run AI Engine with webcam (source 0)
python app.py --source 0
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $AiCommand

# ============================================
# JENDELA 3: FRONTEND NEXT.JS (command-dashboard)
# ============================================
Write-Host "[3/3] Starting Next.js Dashboard..." -ForegroundColor Green

$DashboardPath = Join-Path $RootDir "command-dashboard"
$DashboardCommand = @"
`$Host.UI.RawUI.WindowTitle = 'UI - DASHBOARD'
Set-Location '$DashboardPath'
Write-Host '========================================' -ForegroundColor Blue
Write-Host '  AEON RAILGUARD - NEXT.JS DASHBOARD  ' -ForegroundColor Blue
Write-Host '========================================' -ForegroundColor Blue
Write-Host ''
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $DashboardCommand

# ============================================
# DONE
# ============================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ALL SERVICES LAUNCHED SUCCESSFULLY!     " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [GO BACKEND]    http://localhost:8080" -ForegroundColor Yellow
Write-Host "  [DASHBOARD]     http://localhost:3000" -ForegroundColor Blue
Write-Host "  [AI ENGINE]     Webcam Active" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Press any key to close this launcher..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

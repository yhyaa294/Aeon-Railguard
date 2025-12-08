$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$zipName = "AeonRailguard_CodeOnly_$timestamp.zip"

Write-Host "Creating clean backup ZIP..." -ForegroundColor Cyan

# Exclude these patterns
$exclude = @(
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "__pycache__",
    "ai-engine/datasets/videos*",
    "ai-engine/datasets/*_images",
    "ai-engine/datasets/training_data",
    "ai-engine/datasets/sorted_data",
    "ai-engine/evidence",
    "*/.next",
    "*/out"
)

$filesToZip = Get-ChildItem -Path . -Recurse | Where-Object {
    $item = $_
    $shouldExclude = $false
    
    foreach ($pattern in $exclude) {
        if ($item.FullName -like "*\$pattern*" -or $item.FullName -like "*/$pattern*") {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude -and -not $item.PSIsContainer
}

Write-Host "Compressing files..." -ForegroundColor Yellow

# Create temp directory structure
$tempDir = ".\temp_zip_backup"
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

foreach ($file in $filesToZip) {
    $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
    $destPath = Join-Path $tempDir $relativePath
    $destDir = Split-Path $destPath -Parent
    
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    
    Copy-Item $file.FullName -Destination $destPath -Force
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipName -Force
Remove-Item $tempDir -Recurse -Force

$zipSize = (Get-Item $zipName).Length / 1MB

Write-Host ""
Write-Host "SELESAI!" -ForegroundColor Green
Write-Host "File: $zipName" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host "Location: $(Get-Location)\$zipName" -ForegroundColor Yellow

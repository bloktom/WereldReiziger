# Publiceer de app naar GitHub Pages (bouwt de app + pusht naar de 'gh-pages' branch).
# Gebruik in een terminal in deze map:   .\publiceer.ps1
# (of: klik met rechtermuisknop op dit bestand > "Run with PowerShell")

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

# 1) Zorg dat npm gevonden wordt (ook als Node niet in je PATH staat).
function Resolve-NpmDir {
  if (Get-Command npm -ErrorAction SilentlyContinue) { return $null } # npm staat al op PATH
  $candidates = @(
    "$env:LOCALAPPDATA\anaconda3\envs\nodejs",
    "$env:USERPROFILE\anaconda3\envs\nodejs",
    "$env:USERPROFILE\miniconda3\envs\nodejs",
    "C:\Program Files\nodejs"
  )
  foreach ($c in $candidates) { if (Test-Path (Join-Path $c 'npm.cmd')) { return $c } }
  throw "npm niet gevonden. Installeer Node.js LTS via https://nodejs.org/ en probeer opnieuw."
}
$npmDir = Resolve-NpmDir
if ($npmDir) { $env:Path = "$npmDir;$npmDir\Scripts;" + $env:Path }

# 2) Controleer of er een GitHub-remote ('origin') gekoppeld is.
$origin = $null
try { $origin = (git remote get-url origin) 2>$null } catch {}
if (-not $origin) {
  Write-Host "`nNog geen GitHub-repo gekoppeld." -ForegroundColor Yellow
  Write-Host "Doe dit eerst (1x):" -ForegroundColor Yellow
  Write-Host "  1. Maak op github.com een lege repo met de naam: WereldReiziger"
  Write-Host "  2. Koppel en push:"
  Write-Host "       git remote add origin https://github.com/JOUW-GEBRUIKERSNAAM/WereldReiziger.git"
  Write-Host "       git branch -M main"
  Write-Host "       git push -u origin main"
  Write-Host "  3. Run daarna opnieuw: .\publiceer.ps1`n"
  exit 1
}

# 3) Bouwen + publiceren.
Write-Host "`nApp bouwen en publiceren naar de gh-pages branch..." -ForegroundColor Cyan
npm run deploy

Write-Host "`nKlaar! Laatste stap (1x):" -ForegroundColor Green
Write-Host "  GitHub > jouw repo > Settings > Pages > Source = 'Deploy from a branch' > Branch: gh-pages > /(root) > Save"
Write-Host "  Je link komt daarna op: https://JOUW-GEBRUIKERSNAAM.github.io/WereldReiziger/`n"


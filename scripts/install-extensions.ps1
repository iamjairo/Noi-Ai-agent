# Installs the Noi content pack (configs/extensions/prompts/locales/resources)
# into the Noi Electron app's user-data directory on Windows.
#
# Usage:
#   ./install-extensions.ps1                    # auto-detects %APPDATA%\Noi
#   ./install-extensions.ps1 -DryRun            # print actions only
#   ./install-extensions.ps1 -Target 'C:\path'  # install into a specific dir
#   ./install-extensions.ps1 -NoBackup          # skip backing up replaced files
#
# This script DOES NOT download, modify, or redistribute the Noi application
# itself. You must install Noi separately from https://noib.app first.

[CmdletBinding()]
param(
  [string]$Target,
  [switch]$DryRun,
  [switch]$NoBackup
)

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (Test-Path (Join-Path $ScriptDir 'configs')) {
  $Src = $ScriptDir
} elseif (Test-Path (Join-Path $ScriptDir '..\configs')) {
  $Src = (Resolve-Path (Join-Path $ScriptDir '..')).Path
} else {
  Write-Error "Cannot find configs\ next to this script."
}

if (-not $Target) {
  if (-not $env:APPDATA) { Write-Error "%APPDATA% is not set — use -Target." }
  $Target = Join-Path $env:APPDATA 'Noi'
}

Write-Host "Source: $Src"
Write-Host "Target: $Target"
Write-Host ""

if (-not (Test-Path $Target)) {
  Write-Warning "Target does not exist — is Noi installed and launched at least once?"
  if (-not $DryRun) {
    $ans = Read-Host "Create $Target and continue? [y/N]"
    if ($ans -notmatch '^(y|Y|yes|YES)$') { exit 1 }
    New-Item -ItemType Directory -Path $Target -Force | Out-Null
  }
}

function Invoke-Step([string]$Description, [scriptblock]$Action) {
  Write-Host "  $Description"
  if (-not $DryRun) { & $Action }
}

$Ts = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')

foreach ($dir in @('configs','extensions','prompts','locales','resources')) {
  $srcPath = Join-Path $Src $dir
  $dstPath = Join-Path $Target $dir
  if (-not (Test-Path $srcPath)) { Write-Host "skip ${dir}: not in bundle"; continue }
  if ((Test-Path $dstPath) -and -not $NoBackup) {
    Invoke-Step "backup $dstPath -> $dstPath.bak-$Ts" { Move-Item $dstPath "$dstPath.bak-$Ts" }
  } elseif (Test-Path $dstPath) {
    Invoke-Step "remove existing $dstPath" { Remove-Item -Recurse -Force $dstPath }
  }
  Invoke-Step "copy $srcPath -> $dstPath" { Copy-Item -Recurse $srcPath $dstPath }
}

Write-Host ""
Write-Host "✅ Done. Restart Noi to pick up the changes."
if ($DryRun) { Write-Host "(dry-run only — nothing was actually modified)" }

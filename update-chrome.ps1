param(
  [string]$InstallPath = "$HOME\Downloads\Larpblox-Extension-1.20.17\larpblox-extension"
)

$ErrorActionPreference = 'Stop'
$SourcePath = $PSScriptRoot
$sourceManifestPath = Join-Path $SourcePath 'manifest.json'
$destinationManifestPath = Join-Path $InstallPath 'manifest.json'

if (-not (Test-Path -LiteralPath $sourceManifestPath)) { throw "Extension source is missing: $sourceManifestPath" }
if (-not (Test-Path -LiteralPath $destinationManifestPath)) { throw "Chrome extension folder is missing: $InstallPath" }

$sourceManifest = Get-Content -LiteralPath $sourceManifestPath -Raw | ConvertFrom-Json
$installedManifest = Get-Content -LiteralPath $destinationManifestPath -Raw | ConvertFrom-Json
if ($sourceManifest.name -ne $installedManifest.name) { throw "Extension identity mismatch. Refusing to overwrite '$($installedManifest.name)'." }

function Convert-Version([string]$Version) {
  try { return [version]$Version } catch { throw "Invalid extension version: $Version" }
}

$sourceVersion = Convert-Version $sourceManifest.version
$installedVersion = Convert-Version $installedManifest.version
if ($sourceVersion -lt $installedVersion) {
  throw "Refusing to downgrade Chrome extension $($installedManifest.version) to $($sourceManifest.version)."
}

$relativeFiles = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
[void]$relativeFiles.Add('manifest.json')
foreach ($relativePath in @('remote-loader.js', 'larpbux-game-bridge.js', 'website-bundle.json', 'popup-sandbox.html', 'popup-sandbox.js')) {
  [void]$relativeFiles.Add($relativePath)
}
if ($sourceManifest.background.service_worker) { [void]$relativeFiles.Add($sourceManifest.background.service_worker) }
if ($sourceManifest.action.default_popup) {
  [void]$relativeFiles.Add($sourceManifest.action.default_popup)
  $popupSource = Join-Path $SourcePath $sourceManifest.action.default_popup
  if (Test-Path -LiteralPath $popupSource -PathType Leaf) {
    $popupMarkup = Get-Content -LiteralPath $popupSource -Raw
    foreach ($match in [regex]::Matches($popupMarkup, '(?:src|href)="([^"]+\.(?:js|css))"')) {
      [void]$relativeFiles.Add($match.Groups[1].Value)
    }
  }
}
foreach ($contentScript in $sourceManifest.content_scripts) {
  foreach ($field in @('js', 'css')) {
    foreach ($relativePath in $contentScript.$field) { [void]$relativeFiles.Add($relativePath) }
  }
}
foreach ($resourceGroup in $sourceManifest.web_accessible_resources) {
  foreach ($resourcePattern in $resourceGroup.resources) {
    if ($resourcePattern.Contains('*')) {
      $directory = Split-Path -Parent $resourcePattern
      $pattern = Split-Path -Leaf $resourcePattern
      $searchPath = Join-Path $SourcePath $directory
      if (Test-Path -LiteralPath $searchPath) {
        Get-ChildItem -LiteralPath $searchPath -File -Filter $pattern | ForEach-Object {
          [void]$relativeFiles.Add((Join-Path $directory $_.Name).Replace('\', '/'))
        }
      }
    } else {
      [void]$relativeFiles.Add($resourcePattern)
    }
  }
}

foreach ($relativePath in $relativeFiles) {
  $sourceFile = Join-Path $SourcePath $relativePath
  if (-not (Test-Path -LiteralPath $sourceFile -PathType Leaf)) { throw "Manifest file is missing: $sourceFile" }
  $destinationFile = Join-Path $InstallPath $relativePath
  $destinationDirectory = Split-Path -Parent $destinationFile
  New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null
  Copy-Item -LiteralPath $sourceFile -Destination $destinationFile -Force
}

Write-Output "Updated unpacked extension: $($installedManifest.version) -> $($sourceManifest.version)"
Write-Output "Installed at: $InstallPath"
Write-Output 'In Chrome, click Reload for the unpacked extension at chrome://extensions.'

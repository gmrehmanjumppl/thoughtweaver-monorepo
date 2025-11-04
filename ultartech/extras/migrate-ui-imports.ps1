# PowerShell Script to Migrate UI Component Imports

# This script replaces all imports from '../ui/' to '@thoughtweaver/ui'

$files = Get-ChildItem -Path "apps\web\src" -Recurse -Include *.tsx,*.ts | Where-Object { 
    (Get-Content $_.FullName -Raw) -match "from ['`"](\.\.?\/)+.*\/ui\/"
}

Write-Host "Found $($files.Count) files to update"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace imports like: from '../ui/button' → import { Button } from '@thoughtweaver/ui'
    # Need to collect all imports from ../ui/ and combine them
    
    # Pattern 1: Single import: import { Button } from '../ui/button';
    # Pattern 2: Multiple imports: import { Button, Card } from '../ui/button';
    # Pattern 3: Named imports: import { Sidebar, SidebarContent } from '../ui/sidebar';
    
    # This is complex - need to parse and combine imports
    
    Write-Host "Updating: $($file.FullName)"
}


#!/usr/bin/env pwsh

# Set working directory
Set-Location "c:\Users\gtcam\Downloads\unified-college-interaction-system-web-main (1)\unified-college-interaction-system-web-main"

# Configure git
& git config user.email "attendance-system@example.com"
& git config user.name "Smart Attendance System"

# Stage all files
& git add .

# Create commit
& git commit -m "Smart Attendance System with time-based access control and 7-section support"

# Show status
& git log --oneline -1
& git status

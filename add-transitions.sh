#!/bin/bash

# Add transition-fade class to all main tags in HTML files
find company -name "*.html" -exec sed -i '' 's/<main>/<main class="transition-fade">/' {} \;

echo "Added transition-fade class to all main tags in HTML files."

#!/bin/bash

# Create directories
mkdir -p public/css public/js public/images public/svg public/pages scripts

# Copy files to public directory
cp company/index.html public/
cp company/css/* public/css/
cp company/js/* public/js/
cp company/images/* public/images/
cp company/svg/* public/svg/
cp -r company/pages/* public/pages/

# Copy tokenizer script to scripts directory
cp company/tokenizer_script.py scripts/

# Copy README and other files
cp company/README.md ./
cp company/example_text.txt ./

echo "Files reorganized for Vercel deployment!"
echo "To deploy:"
echo "1. Push this repository to GitHub"
echo "2. Connect your GitHub repository to Vercel"
echo "3. Deploy with default settings"

#!/bin/bash

echo "🚀 Building LoanVision for GitHub Pages..."

# Build the frontend
echo "📦 Building the frontend..."
npm run build

# Copy built files to the right location
echo "📁 Organizing files..."
if [ -d "dist/public" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Built files are ready in: dist/public/"
else
    echo "❌ Build failed - dist/public directory not found"
    exit 1
fi

echo ""
echo "🔧 Next steps:"
echo "1. Initialize git repository: git init"
echo "2. Add all files: git add ."
echo "3. Commit: git commit -m 'Initial commit'"
echo "4. Add GitHub remote: git remote add origin https://github.com/yourusername/loan-vision.git"
echo "5. Push to GitHub: git push -u origin main"
echo "6. Enable GitHub Pages in repository settings"
echo ""
echo "Your site will be available at: https://yourusername.github.io/loan-vision/"
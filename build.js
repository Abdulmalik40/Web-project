#!/usr/bin/env node
/**
 * Simple build script for Saudi Tourism Website
 * This script prepares the project for production deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building Saudi Tourism Website...');

// Create build directory
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy frontend files to build directory
const frontendDir = path.join(__dirname, 'frontend');
const buildFrontendDir = path.join(buildDir, 'frontend');

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // Copy frontend directory
  copyDirectory(frontendDir, buildFrontendDir);
  
  // Copy package.json and README
  fs.copyFileSync(
    path.join(__dirname, 'package.json'),
    path.join(buildDir, 'package.json')
  );
  
  fs.copyFileSync(
    path.join(__dirname, 'README.md'),
    path.join(buildDir, 'README.md')
  );
  
  // Create a simple index.html in build root
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saudi Tourism Website</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #006233, #084826);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .btn {
            display: inline-block;
            padding: 15px 30px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            transition: all 0.3s ease;
            border: 2px solid rgba(255,255,255,0.3);
        }
        .btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🇸🇦 Saudi Tourism</h1>
        <p>Welcome to the Kingdom of Saudi Arabia Tourism Website</p>
        <a href="frontend/pages/" class="btn">Enter Website</a>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
  
  console.log('✅ Build completed successfully!');
  console.log(`📁 Build directory: ${buildDir}`);
  console.log('🚀 Ready for deployment!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

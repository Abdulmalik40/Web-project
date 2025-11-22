#!/usr/bin/env python3
"""
Simple development server for Saudi Tourism Website
Run this script to start a local development server
"""

import http.server
import os
from pathlib import Path
import socketserver
import webbrowser

# Change to frontend directory
frontend_dir = Path(__file__).parent / "frontend"
os.chdir(frontend_dir)

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Saudi Tourism Website Development Server")
        print(f"📁 Serving from: {frontend_dir}")
        print(f"🌐 Server running at: http://localhost:{PORT}")
        print(f"📄 Open: http://localhost:{PORT}/pages/")
        print(f"⏹️  Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Try to open browser automatically
        try:
            webbrowser.open(f"http://localhost:{PORT}/pages/")
        except:
            pass
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
            httpd.shutdown()

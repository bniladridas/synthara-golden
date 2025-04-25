#!/usr/bin/env python3
"""
Simple static file server for Synthara AI
Serves static files only
"""

import sys
import os
from http.server import SimpleHTTPRequestHandler, HTTPServer

class StaticFileHandler(SimpleHTTPRequestHandler):
    """HTTP request handler for static files only"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

    def log_message(self, format, *args):
        """Override to provide more concise logging"""
        print(f"{self.address_string()} - {args[0]} {args[1]} {args[2]}")

def run_server(port=8080):
    """Run the static file server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, StaticFileHandler)
    print(f"Starting static file server on port {port}")
    print(f"Access the application at http://localhost:{port}/")
    httpd.serve_forever()

if __name__ == "__main__":
    # Get port from command line argument or use default
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run_server(port)

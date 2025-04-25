#!/usr/bin/env python3
"""
Run script for the Web Application Generator Agent.

This script provides a simple way to run either the web interface or the command-line interface.
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def check_env_file():
    """Check if .env file exists and create it if it doesn't."""
    env_file = Path(".env")
    env_example = Path(".env.example")

    if not env_file.exists() and env_example.exists():
        print("No .env file found. Creating one from .env.example...")
        with open(env_example, "r") as example:
            with open(env_file, "w") as env:
                env.write(example.read())
        print(".env file created. Please edit it to set your Together API key.")
        print("You can get an API key from https://www.together.ai/")
        return False

    return True

def main():
    """Main function to run the Web Application Generator Agent."""
    # Check for .env file
    env_ready = check_env_file()

    parser = argparse.ArgumentParser(description="Run the Web Application Generator Agent")
    parser.add_argument("--web", action="store_true", help="Run the web interface")
    parser.add_argument("--cli", action="store_true", help="Run the command-line interface")
    parser.add_argument("prompt", nargs="?", help="Text prompt describing the desired web application (for CLI mode)")
    parser.add_argument("--name", default="my_webapp", help="Name of the project (for CLI mode)")
    parser.add_argument("--preview", action="store_true", help="Preview the generated web application (for CLI mode)")
    parser.add_argument("--port", type=int, help="Port to run the preview server on (for CLI mode, overrides .env setting)")
    parser.add_argument("--setup-env", action="store_true", help="Set up or edit the .env file")

    args = parser.parse_args()

    # Handle setup-env flag
    if args.setup_env:
        if not Path(".env.example").exists():
            print("Error: .env.example file not found.")
            sys.exit(1)

        # Create .env file from .env.example if it doesn't exist
        if not Path(".env").exists():
            check_env_file()

        # Open the .env file in the default editor
        if sys.platform == "win32":
            os.system(f"notepad .env")
        elif sys.platform == "darwin":
            os.system(f"open -e .env")
        else:
            editor = os.environ.get("EDITOR", "nano")
            os.system(f"{editor} .env")

        print("Environment file updated. Please restart the application.")
        sys.exit(0)

    # Check if Together API key is set
    if not os.getenv("TOGETHER_API_KEY"):
        print("Warning: TOGETHER_API_KEY environment variable is not set.")
        print("Please set it in your .env file or as an environment variable.")
        print("You can edit the .env file with: python run.py --setup-env")

        if not env_ready:
            print("\nPlease set up your environment first:")
            print("  python run.py --setup-env")
            sys.exit(1)

        print("Continuing without API key, but generation may fail...\n")

    # Run the web interface if --web is specified or no mode is specified
    if args.web or (not args.web and not args.cli and not args.prompt):
        print("Starting web interface...")

        # Get port from .env if available
        port = os.getenv("FLASK_PORT", "5000")
        print(f"Web interface will be available at http://localhost:{port}")

        subprocess.run([sys.executable, "web_interface.py"])

    # Run the command-line interface if --cli is specified or a prompt is provided
    elif args.cli or args.prompt:
        if not args.prompt:
            print("Error: No prompt provided for CLI mode.")
            print("Usage: python run.py --cli 'Your web application description'")
            sys.exit(1)

        cmd = [sys.executable, "agent.py", args.prompt, "--name", args.name]

        if args.preview:
            cmd.append("--preview")
            if args.port:
                cmd.extend(["--port", str(args.port)])

        print(f"Generating web application with prompt: {args.prompt}")
        subprocess.run(cmd)

    else:
        parser.print_help()

if __name__ == "__main__":
    main()

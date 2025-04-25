#!/usr/bin/env python3
"""
Web Application Generator Agent

This agent takes user prompts and generates functional web applications
using HTML, CSS, and JavaScript.
"""

import os
import json
import argparse
import http.server
import socketserver
from pathlib import Path
from dotenv import load_dotenv
from together import Together

# Load environment variables from .env file
load_dotenv()

class WebAppGenerator:
    def __init__(self):
        """Initialize the WebAppGenerator."""
        self.client = Together()
        self.templates_dir = Path("templates")
        self.static_dir = Path("static")
        self.generated_dir = Path("generated")

        # Ensure directories exist
        self.templates_dir.mkdir(exist_ok=True)
        self.static_dir.mkdir(exist_ok=True)
        self.generated_dir.mkdir(exist_ok=True)

        # Initialize template components
        self._init_templates()

    def _init_templates(self):
        """Initialize template components if they don't exist."""
        # Create base HTML template if it doesn't exist
        if not (self.templates_dir / "base.html").exists():
            with open(self.templates_dir / "base.html", "w") as f:
                f.write("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    {{content}}
    <script src="script.js"></script>
</body>
</html>""")

        # Create base CSS template if it doesn't exist
        if not (self.templates_dir / "base.css").exists():
            with open(self.templates_dir / "base.css", "w") as f:
                f.write("""/* Base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    margin-bottom: 20px;
}

nav {
    margin-bottom: 20px;
}

nav ul {
    display: flex;
    list-style: none;
}

nav ul li {
    margin-right: 20px;
}

nav ul li a {
    text-decoration: none;
    color: #333;
}

.container {
    padding: 20px;
}

footer {
    margin-top: 20px;
    text-align: center;
    padding: 20px;
    background-color: #f4f4f4;
}""")

        # Create base JS template if it doesn't exist
        if not (self.templates_dir / "base.js").exists():
            with open(self.templates_dir / "base.js", "w") as f:
                f.write("""// Base JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Web application loaded successfully!');
});

// Helper functions
function getElement(id) {
    return document.getElementById(id);
}

function createElement(tag, attributes = {}, text = '') {
    const element = document.createElement(tag);

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

function appendElement(parent, child) {
    if (typeof parent === 'string') {
        parent = getElement(parent);
    }
    parent.appendChild(child);
}""")

    def generate_app(self, prompt, project_name="my_webapp"):
        """
        Generate a web application based on the user prompt.

        Args:
            prompt (str): User prompt describing the desired web application
            project_name (str): Name of the project/directory to create

        Returns:
            str: Path to the generated web application
        """
        # Create project directory
        project_dir = self.generated_dir / project_name
        project_dir.mkdir(exist_ok=True)

        # Enhance the prompt to get better results
        enhanced_prompt = f"""
        You are a web developer expert in HTML, CSS, and JavaScript.
        Create a complete web application based on this description: "{prompt}"

        Provide your response in VALID JSON format with the following structure:
        {{
            "html": "Complete HTML code for index.html",
            "css": "Complete CSS code for styles.css",
            "js": "Complete JavaScript code for script.js",
            "description": "Brief description of the web application"
        }}

        IMPORTANT: Use standard JSON format. Do NOT use triple quotes or any other non-standard JSON syntax.
        Use escaped quotes for strings within strings, like: "html": "<div class=\\"container\\">Content</div>"

        The HTML, CSS, and JavaScript should be fully functional and work together.
        Include comments to explain key parts of the code.
        """

        # Generate the web application using the Together API
        response = self.client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            messages=[{"role": "user", "content": enhanced_prompt}]
        )

        # Extract the JSON response
        response_content = response.choices[0].message.content

        # Find JSON content in the response (it might be wrapped in markdown code blocks)
        json_start = response_content.find('{')
        json_end = response_content.rfind('}') + 1

        if json_start >= 0 and json_end > json_start:
            json_content = response_content[json_start:json_end]

            # Handle triple quotes in the JSON response
            try:
                # First attempt: Try to parse as is
                app_data = json.loads(json_content)
            except json.JSONDecodeError:
                print("Initial JSON parsing failed. Attempting to fix the format...")
                try:
                    # Replace triple quotes with single quotes
                    fixed_json = json_content
                    # Replace triple double quotes with escaped double quotes
                    fixed_json = fixed_json.replace('"""', '"')
                    # Replace triple single quotes with escaped single quotes
                    fixed_json = fixed_json.replace("'''", "'")

                    # Try to parse the fixed JSON
                    app_data = json.loads(fixed_json)
                    print("JSON parsing successful after fixing the format!")
                except json.JSONDecodeError:
                    print("Error parsing JSON response even after fixing. Attempting manual extraction...")

                    # Manual extraction of HTML, CSS, JS, and description
                    app_data = {}

                    # Extract HTML
                    html_start = json_content.find('"html"')
                    if html_start > 0:
                        html_content_start = json_content.find('"', html_start + 6) + 1
                        html_content_end = json_content.find('",', html_content_start)
                        if html_content_end < 0:  # If no comma, find the last quote
                            html_content_end = json_content.find('"', html_content_start + 1)
                        if html_content_end > html_content_start:
                            app_data["html"] = json_content[html_content_start:html_content_end].replace('"""', '').replace("'''", '')

                    # Extract CSS
                    css_start = json_content.find('"css"')
                    if css_start > 0:
                        css_content_start = json_content.find('"', css_start + 5) + 1
                        css_content_end = json_content.find('",', css_content_start)
                        if css_content_end < 0:  # If no comma, find the last quote
                            css_content_end = json_content.find('"', css_content_start + 1)
                        if css_content_end > css_content_start:
                            app_data["css"] = json_content[css_content_start:css_content_end].replace('"""', '').replace("'''", '')

                    # Extract JS
                    js_start = json_content.find('"js"')
                    if js_start > 0:
                        js_content_start = json_content.find('"', js_start + 4) + 1
                        js_content_end = json_content.find('",', js_content_start)
                        if js_content_end < 0:  # If no comma, find the last quote
                            js_content_end = json_content.find('"', js_content_start + 1)
                        if js_content_end > js_content_start:
                            app_data["js"] = json_content[js_content_start:js_content_end].replace('"""', '').replace("'''", '')

                    # Extract description
                    desc_start = json_content.find('"description"')
                    if desc_start > 0:
                        desc_content_start = json_content.find('"', desc_start + 13) + 1
                        desc_content_end = json_content.find('",', desc_content_start)
                        if desc_content_end < 0:  # If no comma, find the last quote
                            desc_content_end = json_content.find('"', desc_content_start + 1)
                        if desc_content_end > desc_content_start:
                            app_data["description"] = json_content[desc_content_start:desc_content_end].replace('"""', '').replace("'''", '')

                    # If any of the required fields are missing, use the basic template
                    if not all(key in app_data for key in ["html", "css", "js"]):
                        print("Manual extraction incomplete. Generating basic template instead.")
                        app_data = self._generate_basic_template(prompt)
                    else:
                        print("Manual extraction successful!")
        else:
            print("No JSON found in response. Generating basic template instead.")
            app_data = self._generate_basic_template(prompt)

        # Write the files
        with open(project_dir / "index.html", "w") as f:
            f.write(app_data.get("html", ""))

        with open(project_dir / "styles.css", "w") as f:
            f.write(app_data.get("css", ""))

        with open(project_dir / "script.js", "w") as f:
            f.write(app_data.get("js", ""))

        # Create a README file
        with open(project_dir / "README.md", "w") as f:
            f.write(f"# {project_name}\n\n{app_data.get('description', 'A web application.')}")

        return str(project_dir)

    def _generate_basic_template(self, prompt):
        """Generate a basic template if the API response fails."""
        return {
            "html": f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Web App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Generated Web Application</h1>
        <p>Based on: {prompt}</p>
    </header>
    <main>
        <div class="container">
            <p>This is a basic template. The AI was unable to generate a custom application.</p>
        </div>
    </main>
    <footer>
        <p>&copy; 2023 Web App Generator</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>""",
            "css": """/* Basic styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    margin-bottom: 20px;
    text-align: center;
    padding: 20px;
    background-color: #f4f4f4;
}

.container {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

footer {
    margin-top: 20px;
    text-align: center;
    padding: 20px;
    background-color: #f4f4f4;
}""",
            "js": """// Basic JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Web application loaded successfully!');
});""",
            "description": f"A basic web application template based on: {prompt}"
        }

    def preview_app(self, project_path, port=None):
        """
        Start a local server to preview the generated web application.

        Args:
            project_path (str): Path to the generated web application
            port (int, optional): Port to run the server on. If None, uses PREVIEW_PORT from .env or defaults to 8000.

        Returns:
            None
        """
        os.chdir(project_path)

        # Use port from .env if available, otherwise use provided port or default to 8000
        if port is None:
            port = int(os.getenv("PREVIEW_PORT", 8000))

        handler = http.server.SimpleHTTPRequestHandler

        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"Server started at http://localhost:{port}")
            print("Press Ctrl+C to stop the server")
            httpd.serve_forever()


def main():
    """Main function to run the WebAppGenerator."""
    parser = argparse.ArgumentParser(description="Generate web applications from text prompts")
    parser.add_argument("prompt", help="Text prompt describing the desired web application")
    parser.add_argument("--name", default="my_webapp", help="Name of the project")
    parser.add_argument("--preview", action="store_true", help="Preview the generated web application")
    parser.add_argument("--port", type=int, help="Port to run the preview server on (overrides .env setting)")

    args = parser.parse_args()

    # Check if Together API key is set
    if not os.getenv("TOGETHER_API_KEY"):
        print("Warning: TOGETHER_API_KEY environment variable is not set.")
        print("Please set it in your .env file or as an environment variable.")
        print("Continuing without API key, but generation may fail...\n")

    generator = WebAppGenerator()
    project_path = generator.generate_app(args.prompt, args.name)

    print(f"Web application generated at: {project_path}")

    if args.preview:
        print(f"Starting preview server for {project_path}")
        generator.preview_app(project_path, args.port)


if __name__ == "__main__":
    main()

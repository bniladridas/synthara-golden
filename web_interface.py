#!/usr/bin/env python3
"""
Web Interface for the Web Application Generator Agent

This provides a simple web interface for users to interact with the agent.
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from agent import WebAppGenerator

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
generator = WebAppGenerator()

# Directory to store generated apps
GENERATED_DIR = Path("generated")
GENERATED_DIR.mkdir(exist_ok=True)

@app.route('/')
def index():
    """Render the main page."""
    # Get list of generated apps
    generated_apps = [d.name for d in GENERATED_DIR.iterdir() if d.is_dir()]
    return render_template('index.html', generated_apps=generated_apps)

@app.route('/generate', methods=['POST'])
def generate():
    """Generate a new web application."""
    prompt = request.form.get('prompt', '')
    project_name = request.form.get('project_name', 'my_webapp')

    # Sanitize project name (remove spaces and special characters)
    project_name = ''.join(c if c.isalnum() else '_' for c in project_name)

    if not prompt:
        return redirect(url_for('index'))

    # Generate the web application
    project_path = generator.generate_app(prompt, project_name)

    return redirect(url_for('view_app', app_name=project_name))

@app.route('/app/<app_name>')
def view_app(app_name):
    """View a generated web application."""
    app_dir = GENERATED_DIR / app_name

    if not app_dir.exists() or not app_dir.is_dir():
        return redirect(url_for('index'))

    # Read the app files
    html_content = ""
    css_content = ""
    js_content = ""

    if (app_dir / "index.html").exists():
        with open(app_dir / "index.html", "r") as f:
            html_content = f.read()

    if (app_dir / "styles.css").exists():
        with open(app_dir / "styles.css", "r") as f:
            css_content = f.read()

    if (app_dir / "script.js").exists():
        with open(app_dir / "script.js", "r") as f:
            js_content = f.read()

    return render_template(
        'view_app.html',
        app_name=app_name,
        html_content=html_content,
        css_content=css_content,
        js_content=js_content
    )

@app.route('/preview/<app_name>')
def preview_app(app_name):
    """Preview a generated web application."""
    return render_template('preview.html', app_name=app_name)

@app.route('/generated/<app_name>/<file_name>')
def serve_app_file(app_name, file_name):
    """Serve files from the generated app directory."""
    app_dir = GENERATED_DIR / app_name
    return send_from_directory(app_dir, file_name)

@app.route('/delete/<app_name>', methods=['POST'])
def delete_app(app_name):
    """Delete a generated web application."""
    app_dir = GENERATED_DIR / app_name

    if app_dir.exists() and app_dir.is_dir():
        # Delete all files in the directory
        for file in app_dir.iterdir():
            file.unlink()

        # Delete the directory
        app_dir.rmdir()

    return redirect(url_for('index'))

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    templates_dir = Path("templates_flask")
    templates_dir.mkdir(exist_ok=True)

    # Create templates if they don't exist
    if not (templates_dir / "index.html").exists():
        with open(templates_dir / "index.html", "w") as f:
            f.write("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web App Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        form {
            margin-bottom: 20px;
        }
        input[type="text"], textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
        }
        button {
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        .app-list {
            margin-top: 20px;
        }
        .app-item {
            padding: 10px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .app-actions {
            display: flex;
            gap: 10px;
        }
        .app-actions a, .app-actions form button {
            padding: 5px 10px;
            text-decoration: none;
            color: white;
            border-radius: 3px;
        }
        .view-btn {
            background-color: #2196F3;
        }
        .preview-btn {
            background-color: #FF9800;
        }
        .delete-btn {
            background-color: #f44336;
        }
    </style>
</head>
<body>
    <h1>Web Application Generator</h1>

    <div class="container">
        <h2>Generate a New Web Application</h2>
        <form action="/generate" method="post">
            <div>
                <label for="project_name">Project Name:</label>
                <input type="text" id="project_name" name="project_name" placeholder="my_webapp" required>
            </div>
            <div>
                <label for="prompt">Describe your web application:</label>
                <textarea id="prompt" name="prompt" rows="5" placeholder="Describe the web application you want to create..." required></textarea>
            </div>
            <button type="submit">Generate Web App</button>
        </form>
    </div>

    <div class="container">
        <h2>Your Generated Web Applications</h2>
        <div class="app-list">
            {% if generated_apps %}
                {% for app in generated_apps %}
                    <div class="app-item">
                        <div>{{ app }}</div>
                        <div class="app-actions">
                            <a href="{{ url_for('view_app', app_name=app) }}" class="view-btn">View Code</a>
                            <a href="{{ url_for('preview_app', app_name=app) }}" class="preview-btn">Preview</a>
                            <form action="{{ url_for('delete_app', app_name=app) }}" method="post" onsubmit="return confirm('Are you sure you want to delete this app?');">
                                <button type="submit" class="delete-btn">Delete</button>
                            </form>
                        </div>
                    </div>
                {% endfor %}
            {% else %}
                <p>No web applications generated yet.</p>
            {% endif %}
        </div>
    </div>
</body>
</html>""")

    if not (templates_dir / "view_app.html").exists():
        with open(templates_dir / "view_app.html", "w") as f:
            f.write("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ app_name }} - Code View</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .code-container {
            margin-top: 20px;
        }
        .code-section {
            margin-bottom: 20px;
        }
        pre {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .actions {
            margin-top: 20px;
            display: flex;
            gap: 10px;
        }
        .actions a {
            padding: 10px 15px;
            text-decoration: none;
            color: white;
            border-radius: 3px;
        }
        .back-btn {
            background-color: #607D8B;
        }
        .preview-btn {
            background-color: #FF9800;
        }
    </style>
</head>
<body>
    <h1>{{ app_name }} - Code View</h1>

    <div class="container">
        <div class="code-container">
            <div class="code-section">
                <h2>HTML (index.html)</h2>
                <pre><code>{{ html_content }}</code></pre>
            </div>

            <div class="code-section">
                <h2>CSS (styles.css)</h2>
                <pre><code>{{ css_content }}</code></pre>
            </div>

            <div class="code-section">
                <h2>JavaScript (script.js)</h2>
                <pre><code>{{ js_content }}</code></pre>
            </div>
        </div>

        <div class="actions">
            <a href="{{ url_for('index') }}" class="back-btn">Back to Home</a>
            <a href="{{ url_for('preview_app', app_name=app_name) }}" class="preview-btn">Preview App</a>
        </div>
    </div>
</body>
</html>""")

    if not (templates_dir / "preview.html").exists():
        with open(templates_dir / "preview.html", "w") as f:
            f.write("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ app_name }} - Preview</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        .header {
            background-color: #f5f5f5;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
        }
        .header h1 {
            margin: 0;
            font-size: 1.2rem;
        }
        .actions {
            display: flex;
            gap: 10px;
        }
        .actions a {
            padding: 5px 10px;
            text-decoration: none;
            color: white;
            border-radius: 3px;
        }
        .back-btn {
            background-color: #607D8B;
        }
        .view-code-btn {
            background-color: #2196F3;
        }
        .preview-frame {
            flex: 1;
            border: none;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ app_name }} - Preview</h1>
        <div class="actions">
            <a href="{{ url_for('index') }}" class="back-btn">Back to Home</a>
            <a href="{{ url_for('view_app', app_name=app_name) }}" class="view-code-btn">View Code</a>
        </div>
    </div>

    <iframe src="{{ url_for('serve_app_file', app_name=app_name, file_name='index.html') }}" class="preview-frame"></iframe>
</body>
</html>""")

    # Move templates to Flask templates directory
    os.makedirs("templates", exist_ok=True)
    for template in templates_dir.iterdir():
        if template.is_file():
            with open(template, "r") as src:
                with open(Path("templates") / template.name, "w") as dst:
                    dst.write(src.read())

    # Check if Together API key is set
    if not os.getenv("TOGETHER_API_KEY"):
        print("Warning: TOGETHER_API_KEY environment variable is not set.")
        print("Please set it in your .env file or as an environment variable.")
        print("Continuing without API key, but generation may fail...\n")

    # Get Flask settings from .env
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "t", "yes")
    port = int(os.getenv("FLASK_PORT", 5000))

    # Start the Flask app
    print(f"Starting web interface on http://localhost:{port}")
    app.run(debug=debug, port=port)

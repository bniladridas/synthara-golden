# Web Application Generator Agent

This is a software agent that can generate web applications based on user prompts. The agent uses the Together API with Llama-3.3-70B to generate HTML, CSS, and JavaScript code for functional websites.

## Features

- Generate web applications from text prompts
- Create HTML, CSS, and JavaScript code
- Preview generated websites
- Web interface for easy interaction
- Command-line interface for automation

## Installation

1. Clone this repository
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Set up your environment variables:

```bash
# Automatically create and open .env file for editing
python run.py --setup-env
```

This will create a `.env` file from the `.env.example` template and open it for editing. Add your Together API key to this file:

```
TOGETHER_API_KEY=your_api_key_here
```

You can get an API key from [Together AI](https://www.together.ai/).

## Usage

### Web Interface

To use the web interface, run:

```bash
python run.py --web
```

Or simply:

```bash
python run.py
```

Then open your browser and navigate to `http://localhost:5000` (or the port specified in your `.env` file).

### Command Line Interface

To use the command line interface, run:

```bash
python run.py --cli "Your web application description here" --name project_name --preview
```

Or simply:

```bash
python run.py "Your web application description here" --name project_name --preview
```

Options:
- `--name`: Name of the project (default: "my_webapp")
- `--preview`: Preview the generated web application
- `--port`: Port to run the preview server on (overrides the PREVIEW_PORT in .env)
- `--setup-env`: Set up or edit the .env file

### Environment Configuration

You can configure the application by editing the `.env` file:

```
# Together API Key
TOGETHER_API_KEY=your_api_key_here

# Web interface settings
FLASK_PORT=5000
FLASK_DEBUG=True

# Preview server settings
PREVIEW_PORT=8000
```

## Example

```bash
python run.py "Create a business website with a dashboard to view customer reports and a form to submit new reports" --name business_dashboard --preview
```

This will generate a business website with customer reporting functionality and open it in your browser for preview.

You can also use the web interface to create the same application:

1. Run `python run.py` to start the web interface
2. Enter "business_dashboard" as the project name
3. Enter "Create a business website with a dashboard to view customer reports and a form to submit new reports" as the prompt
4. Click "Generate Web App"
5. Once generated, click "Preview" to see the application in your browser

## How It Works

1. The agent takes a user prompt describing the desired web application
2. It uses the Together API with Llama-3.3-70B to generate HTML, CSS, and JavaScript code
3. The generated code is saved to files in the `generated` directory
4. The user can preview the generated website in their browser

## Limitations

- The quality of the generated web applications depends on the quality of the user prompt
- Complex functionality may require additional manual coding
- The agent is limited to generating static websites with client-side functionality
- Server-side functionality is not supported in the generated code

## License

MIT

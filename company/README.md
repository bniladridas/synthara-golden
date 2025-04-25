# Synthara AI - 2025

## Overview

This is the website for Synthara AI, featuring information about our GPT-2 tokenizer with golden ratio analysis.

## Features

- Modern, clean web design
- Information about GPT-2 tokenizer technology
- Golden ratio principles in text analysis
- Transparent algorithm documentation
- Simple static file server
- Standalone tokenizer script for text analysis

## Running the Web Application

### Prerequisites

- Python 3.6 or higher

### Installation

No additional dependencies are required for the static website.

Make the server script executable:

```bash
chmod +x server.py
```

### Starting the Server

Run the server script:

```bash
./server.py
```

Or use the start script:

```bash
./start.sh
```

The server will start on port 8080 by default. You can access the application at:

```
http://localhost:8080/
```

To use a different port, specify it as a command-line argument:

```bash
./server.py 8000
```

## Tokenizer Page

The tokenizer page provides information about our GPT-2 tokenizer and golden ratio principles:

- Explanation of tokenization process
- Documentation of golden ratio alignment metrics
- Efficiency scoring methodology
- Optimization potential analysis
- Test cases and examples

## Standalone Tokenizer Script

We provide a standalone Python script (`tokenizer_script.py`) that implements the GPT-2 tokenizer with golden ratio analysis. This script can be used independently from the web application.

### Prerequisites for the Tokenizer Script

- Python 3.6 or higher
- Transformers library (optional, for GPT-2 tokenizer): `pip install transformers`
- PyTorch (optional, for better performance): `pip install torch`

If the Transformers library isn't available, the script will use its own algorithmic tokenization as a fallback.

### Making the Script Executable

```bash
chmod +x tokenizer_script.py
```

### Running the Tokenizer Script

#### 1. Analyze text directly from the command line:

```bash
./tokenizer_script.py "This is a test of the GPT-2 tokenizer."
```

#### 2. Analyze text from a file:

```bash
./tokenizer_script.py -f input.txt
```

#### 3. Save results to a JSON file:

```bash
./tokenizer_script.py "This is a test." -o results.json
```

#### 4. Get verbose output:

```bash
./tokenizer_script.py "This is a test." -v
```

### Example Results

When you run the tokenizer script, you'll get output similar to this:

```
Text: 'This is a test of the GPT-2 tokenizer with golden ...' tokenized into 17 tokens:
Token IDs: [1212, 318, 257, 1332, 286, 262, 402, 11571, 12, 17]...
Token strings: ['This', 'Ġis', 'Ġa', 'Ġtest', 'Ġof', 'Ġthe', 'ĠG', 'PT', '-', '2']...

Analysis Results:
Token Count: 17
Efficiency Score: 88.6%
Optimization Potential: 82.0%
Golden Ratio Alignment: 65%
Character Count: 65
Word Count: 12
Sentence Count: 1
Average Word Length: 5.42 characters
Average Sentence Length: 12.0 words
Golden Ratio Target: 16.18 words per sentence

First few tokens:
  1212: This
  318: Ġis
  257: Ġa
  1332: Ġtest
  286: Ġof
  262: Ġthe
  402: ĠG
  11571: PT
  12: -
  17: 2
  ... and 7 more tokens
```

Note: The "Ġ" character represents a space before the token in the GPT-2 tokenizer.

## Technical Details

- The web application uses a simple static file server
- All content is pre-rendered HTML, CSS, and images
- No dynamic content or API calls are required
- The server is lightweight and easy to deploy
- The standalone tokenizer script provides all the functionality for text analysis

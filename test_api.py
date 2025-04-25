#!/usr/bin/env python3
"""
Test script to verify the Together API key and test the JSON response format.
"""

import os
import json
from dotenv import load_dotenv
from together import Together

# Load environment variables from .env file
load_dotenv()

# Get the API key from the environment
api_key = os.getenv("TOGETHER_API_KEY")

print(f"API Key: {api_key[:5]}...{api_key[-5:] if api_key else None}")

try:
    # Initialize the Together client
    client = Together()

    # Test 1: Simple API call
    print("\nTest 1: Simple API call")
    response = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages=[{"role": "user", "content": "Say hello in one word."}],
        max_tokens=10
    )

    print("API Response:")
    print(response.choices[0].message.content)

    # Test 2: JSON response format
    print("\nTest 2: JSON response format")
    prompt = """
    You are a web developer expert in HTML, CSS, and JavaScript.
    Create a complete web application based on this description: "Create a simple calculator web app"

    Provide your response in JSON format with the following structure:
    {
        "html": "Complete HTML code for index.html",
        "css": "Complete CSS code for styles.css",
        "js": "Complete JavaScript code for script.js",
        "description": "Brief description of the web application"
    }

    The HTML, CSS, and JavaScript should be fully functional and work together.
    Include comments to explain key parts of the code.
    """

    response = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000
    )

    # Print the raw response content
    print("Raw API Response:")
    content = response.choices[0].message.content
    print(content[:500] + "..." if len(content) > 500 else content)

    # Try to extract JSON from the response
    print("\nAttempting to extract JSON:")
    json_start = content.find('{')
    json_end = content.rfind('}') + 1

    if json_start >= 0 and json_end > json_start:
        json_content = content[json_start:json_end]
        print(f"JSON content found from index {json_start} to {json_end}")
        try:
            app_data = json.loads(json_content)
            print("JSON parsing successful!")
            print(f"Keys in JSON: {list(app_data.keys())}")
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            print(f"First 100 chars of extracted JSON: {json_content[:100]}...")
    else:
        print("No JSON content found in the response")

    print("\nAPI connection successful!")

except Exception as e:
    print(f"\nAPI Error: {str(e)}")
    print("API connection failed.")

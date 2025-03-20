import sys
import json
import logging
import re
import os
from datetime import datetime
from detoxify import Detoxify

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

# Load the Detoxify model once
try:
    model = Detoxify('unbiased')
    logging.info("Detoxify model loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load Detoxify model: {e}")
    sys.exit(1)

def is_url(text: str) -> bool:
    """Check if a string is a URL."""
    url_pattern = re.compile(r'https?://(?:www\.)?\S+|www\.\S+')
    return bool(url_pattern.search(text))

def is_file_name(text: str) -> bool:
    """Check if a string looks like a file name."""
    file_pattern = re.compile(r'\.\w+$|\.\w+/')
    return bool(file_pattern.search(text))

def analyze(text: str) -> dict:
    """
    Analyze the toxicity of a given text.

    Args:
        text (str): The text to analyze.

    Returns:
        dict: A dictionary with toxicity scores as percentages.

    Raises:
        ValueError: If the input text is invalid.
    """
    if not text or not isinstance(text, str):
        raise ValueError("Invalid input text: must be a non-empty string")
    
    logging.debug(f"Analyzing text: {text}")
    
    # Predict toxicity using the Detoxify model
    results = model.predict(text)
    
    # Format results as percentages
    return {key: f"{float(value) * 100:.2f}%" for key, value in results.items()}

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_text = sys.stdin.read().strip()
        logging.info(f"Received input: {input_text}")

        # Ensure valid JSON input
        if not input_text:
            raise ValueError("No input received")

        # Parse JSON input
        try:
            data = json.loads(input_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON input: {e}")

        logging.debug(f"Parsed JSON: {data}")

        # Check for 'sentences' key
        if "sentences" not in data:
            raise ValueError("Missing 'sentences' key in input")

        sentences = data["sentences"]

        # Validate input format
        if not isinstance(sentences, list) or not all(isinstance(s, str) for s in sentences):
            raise ValueError("Invalid input: 'sentences' must be a list of strings")

        # Filter out URLs and file names
        filtered_sentences = [sentence for sentence in sentences if not is_url(sentence) and not is_file_name(sentence) and sentence.strip()]

        # Analyze each sentence individually
        all_results = []
        for sentence in filtered_sentences:
            results = analyze(sentence)
            all_results.append({
                "sentence": sentence,
                "results": results,  # Toxicity scores for this sentence
            })

        # Add a timestamp
        timestamp = datetime.utcnow().isoformat() + "Z"

        # Output the results as JSON
        output = {
            "success": True,
            "results": all_results,  # Results for each sentence
            "timestamp": timestamp,
            "model": "unbiased",  # Add model information
        }
        print(json.dumps(output, indent=2))

    except Exception as e:
        # Log the error and return it as JSON response
        logging.error(f"Error: {e}", exc_info=os.getenv("ENV") == "development")
        print(json.dumps({"success": False, "error": str(e)}))
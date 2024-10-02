import json
import sys

# Check if the user provided a file path
if len(sys.argv) != 2:
    print("Usage: python3 count_items.py <file_path>")
    sys.exit(1)

# Get the file path from the command line argument
json_file_path = sys.argv[1]

# Load the JSON file
try:
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)
except FileNotFoundError:
    print(f"File not found: {json_file_path}")
    sys.exit(1)
except json.JSONDecodeError:
    print(f"Error decoding JSON from file: {json_file_path}")
    sys.exit(1)

# Count the number of items in the JSON (assuming the 'Items' key holds the data)
if 'Items' in data:
    item_count = len(data['Items'])
    print(f'Total number of items in the JSON file: {item_count}')
else:
    print("The JSON file does not contain an 'Items' key.")


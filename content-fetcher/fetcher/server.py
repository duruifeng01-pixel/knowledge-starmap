from flask import Flask, request, jsonify
from extractors import extract_from_url
from mindmap import generate_mindmap
import os

app = Flask(__name__)

@app.route('/extract', methods=['POST'])
def extract():
    url = request.json.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400

    try:
        content = extract_from_url(url)
        return jsonify(content)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/mindmap', methods=['POST'])
def mindmap():
    content = request.json.get('content', '')
    api_key = request.headers.get('X-API-Key')

    try:
        result = generate_mindmap(content, api_key)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('FETCHER_PORT', 3001)))
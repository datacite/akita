from flask import Flask, jsonify
from datacitekit.extractors import extract_doi
from datacitekit.related_works import get_full_corpus_doi_attributes
from datacitekit.reports import RelatedWorkReports
import os

DOI_API = os.getenv("DATACITE_API_URL", "https://api.stage.datacite.org/dois/")
app = Flask(__name__)

@app.route("/api", methods=["GET"])
def home():
    return jsonify({"message": "Hello from the Python API!"})

@app.route("/api/doi/related-graph/<path:doi>", methods=["GET"])
def related_works(doi):
    doi = extract_doi(doi)
    if not doi:
        return jsonify({"error": "Does not match DOI format"}), 400

    full_doi_attributes = get_full_corpus_doi_attributes(doi, DOI_API)
    if not full_doi_attributes:
        return jsonify({"error": "DOI not found"}), 404
    report = RelatedWorkReports(full_doi_attributes)

    graph = {
        "nodes": report.aggregate_counts,
        "links": report.type_connection_report
    }

    return jsonify(graph)


if __name__ == '__main__':
    app.run(debug=True)

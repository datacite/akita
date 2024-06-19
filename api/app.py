import os

from datacitekit.extractors import extract_doi
from datacitekit.related_works import get_full_corpus_doi_attributes
from datacitekit.reports import RelatedWorkReports
from flask import Flask, jsonify

DOI_API = os.getenv("DATACITE_API_URL", "https://api.stage.datacite.org/dois/")
app = Flask(__name__)


@app.route("/api/doi/related-graph/<path:doi>", methods=["GET"])
def related_works(doi):
    doi = extract_doi(doi)
    if not doi:
        return jsonify({"error": "Does not match DOI format"}), 400

    full_doi_attributes = get_full_corpus_doi_attributes(doi, DOI_API)
    if not full_doi_attributes:
        return jsonify({"error": "DOI not found"}), 404
    report = RelatedWorkReports(full_doi_attributes)

    non_zero_nodes = [agg for agg in report.aggregate_counts if agg["count"] > 0]
    graph = {"nodes": non_zero_nodes, "links": report.type_connection_report}

    return jsonify(graph)


if __name__ == "__main__":
    app.run(debug=True)

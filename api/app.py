import json
import os
from io import StringIO

import networkx as nx
from datacitekit.extractors import extract_doi
from datacitekit.related_works import get_full_corpus_doi_attributes
from datacitekit.resource_type_graph import RelatedWorkReports
from flask import Flask, jsonify
from pyvis.network import Network

DOI_API = os.getenv("DATACITE_API_URL", "https://api.stage.datacite.org/dois/")
app = Flask(__name__)


@app.route("/api/doi/related-graph/<path:doi>", methods=["GET"])
def related_works(doi):
    doi = extract_doi(doi)
    if not doi:
        return jsonify({"error": "Does not match DOI format"}), 400

    full_doi_attributes = get_full_corpus_doi_attributes(
        doi_query=doi, parser=RelatedWorkReports.parser, api_url=DOI_API
    )
    if not full_doi_attributes:
        return jsonify({"error": "DOI not found"}), 404
    report = RelatedWorkReports(full_doi_attributes)

    non_zero_nodes = [agg for agg in report.aggregate_counts if agg["count"] > 0]
    graph = {"nodes": non_zero_nodes, "links": report.type_connection_report}

    return jsonify(graph)


@app.route("/api/doi/network-view/<path:doi>", methods=["GET"])
def network_view(doi):
    network = get_network(doi)
    return network.generate_html()


@app.route("/api/doi/network-graph/<path:doi>", methods=["GET"])
def network_graph(doi):
    network = get_network(doi)

    nodes, edges, heading, height, width, options = network.get_network_data()
    # return jsonify(net.to_json())
    return jsonify(
        {
            "nodes": nodes,
            "edges": edges,
            "options": json.loads(options),
        }
    )


def get_network(doi):
    doi = extract_doi(doi)
    if not doi:
        return jsonify({"error": "Does not match DOI format"}), 400

    graph_data = {
        "links": [
            {"count": 2, "source": "Other", "target": "Study Registration"},
            {"count": 5, "source": "Other", "target": "Project"},
            {"count": 3, "source": "Other", "target": "Output Management Plan"},
            {"count": 2, "source": "Other", "target": "Dataset"},
            {"count": 2, "source": "Other", "target": "Other"},
            {"count": 1, "source": "Other", "target": "Text"},
            {"count": 2, "source": "Software", "target": "Study Registration"},
            {"count": 4, "source": "Software", "target": "Project"},
            {"count": 2, "source": "Software", "target": "Output Management Plan"},
            {"count": 2, "source": "Software", "target": "Dataset"},
            {"count": 2, "source": "Software", "target": "Software"},
            {"count": 4, "source": "Report", "target": "Project"},
            {"count": 5, "source": "Report", "target": "Text"},
            {"count": 7, "source": "Report", "target": "Report"},
            {"count": 2, "source": "Report", "target": "Journal Article"},
            {"count": 1, "source": "Report", "target": "Output Management Plan"},
            {"count": 3, "source": "Text", "target": "Project"},
            {"count": 3, "source": "Text", "target": "Report"},
            {"count": 4, "source": "Text", "target": "Text"},
            {"count": 1, "source": "Text", "target": "Output Management Plan"},
            {"count": 1, "source": "Project", "target": "Output Management Plan"},
            {"count": 8, "source": "Project", "target": "Study Registration"},
            {"count": 7, "source": "Project", "target": "Text"},
            {"count": 3, "source": "Project", "target": "Report"},
            {"count": 1, "source": "Project", "target": "Journal Article"},
            {"count": 1, "source": "Project", "target": "Project"},
            {"count": 1, "source": "Dataset", "target": "Study Registration"},
            {"count": 2, "source": "Dataset", "target": "Project"},
            {"count": 1, "source": "Dataset", "target": "Output Management Plan"},
            {"count": 1, "source": "Dataset", "target": "Software"},
            {"count": 1, "source": "Dataset", "target": "Other"},
            {"count": 4, "source": "Study Registration", "target": "Project"},
            {
                "count": 1,
                "source": "Study Registration",
                "target": "Output Management Plan",
            },
            {"count": 1, "source": "Study Registration", "target": "Dataset"},
            {"count": 1, "source": "Study Registration", "target": "Software"},
            {"count": 1, "source": "Study Registration", "target": "Other"},
        ],
        "nodes": [
            {"count": 3, "title": "Other"},
            {"count": 2, "title": "Software"},
            {"count": 7, "title": "Report"},
            {"count": 10, "title": "Text"},
            {"count": 2, "title": "Project"},
            {"count": 1, "title": "Dataset"},
            {"count": 1, "title": "Journal Article"},
            {"count": 4, "title": "Study Registration"},
            {"count": 1, "title": "Output Management Plan"},
        ],
    }

    # Define the color mapping
    domain = [
        "Audiovisual",
        "Book",
        "Book Chapter",
        "Collection",
        "Computational Notebook",
        "Conference Paper",
        "Conference Proceeding",
        "Data Paper",
        "Dataset",
        "Dissertation",
        "Event",
        "Image",
        "Instrument",
        "Interactive Resource",
        "Journal",
        "Journal Article",
        "Model",
        "Output Management Plan",
        "Peer Review",
        "Physical Object",
        "Preprint",
        "Project",
        "Report",
        "Service",
        "Software",
        "Sound",
        "Standard",
        "Study Registration",
        "Text",
        "Workflow",
        "Other",
        "People",
        "Organizations",
    ]
    color_range = [
        "#AEC7E8",
        "#FF7F0E",
        "#FFBB78",
        "#D62728",
        "#FF9896",
        "#9467BD",
        "#C5B0D5",
        "#8C564B",
        "#1F77B4",
        "#C49C94",
        "#E377C2",
        "#F7B6D2",
        "#35424A",
        "#7F7F7F",
        "#C7C7C7",
        "#BCBD22",
        "#DBDB8D",
        "#17BECF",
        "#9EDAE5",
        "#3182BD",
        "#6BAED6",
        "#AB8DF8",
        "#9ECAE1",
        "#C6DBEF",
        "#E6550D",
        "#FD8D3C",
        "#FDAE6B",
        "#6DBB5E",
        "#FDD0A2",
        "#9F4639",
        "#C59088",
        "#A83",
        "#FAD",
    ]

    # Define the color mapping

    color_map = dict(zip(domain, color_range))

    G = nx.DiGraph()
    net = Network(
        height="750px",
        width="100%",
        notebook=False,
    )

    # Add nodes with their attributes
    for node in graph_data["nodes"]:
        G.add_node(node["title"], count=node["count"])

    # Add edges with their attributes
    for link in graph_data["links"]:
        G.add_edge(link["source"], link["target"], count=link["count"])

    # Create a PyVis network
    net = Network(notebook=True, directed=True, cdn_resources="remote")
    # Load the NetworkX graph into the PyVis network
    net.from_nx(G)
    # Customize the appearance of nodes and edges
    for node in net.nodes:
        node["label"] = f"{node['id']}\n {G.nodes[node['id']]['count']}"
        node["value"] = G.nodes[node["id"]]["count"]
        # Set color based on type mapping. Default to grey if no match
        node["color"] = color_map.get(node["id"], "#999999")

    for edge in net.edges:
        edge["title"] = f"{edge['from']} -> {edge['to']}: {edge['count']}"
        edge["width"] = edge["count"] * 0.5

    net.set_options(
        """
        var options = {
            "clickToUse": true,
            "nodes": {
                "labelHighlightBold": true,
                "font": {
                    "align": "center"
                    }
                },
            "interaction": {
                "zoomView": false,
                "dragView": true,
                "multiselect": false,
                "navigationButtons": true,
                "hoverConnectedEdges": true
                }
            }
        """
    )

    return net


if __name__ == "__main__":
    app.run(debug=False)

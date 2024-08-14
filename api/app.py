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


def get_graph_data(doi):
    doi = extract_doi(doi)
    full_doi_attributes = get_full_corpus_doi_attributes(
        doi_query=doi, parser=RelatedWorkReports.parser, api_url=DOI_API
    )
    if not full_doi_attributes:
        return jsonify({"error": "DOI not found"}), 404
    report = RelatedWorkReports(full_doi_attributes)

    non_zero_nodes = [agg for agg in report.aggregate_counts if agg["count"] > 0]
    graph = {"nodes": non_zero_nodes, "links": report.type_connection_report}

    return graph


@app.route("/api/doi/related-graph/<path:doi>", methods=["GET"])
def related_works(doi):
    doi = extract_doi(doi)
    if not doi:
        return jsonify({"error": "Does not match DOI format"}), 400

    graph = get_graph_data(doi)

    return jsonify(graph)


@app.route("/api/doi/network-view/<path:doi>", methods=["GET"])
def network_view(doi):
    doi = extract_doi(doi)
    if not doi:
        return jsonify({"error": "Does not match DOI format"}), 400
    network = get_network(doi)
    return network.generate_html()


@app.route("/api/doi/network-graph/<path:doi>", methods=["GET"])
def network_graph(doi):
    network = get_network(doi)

    nodes, edges, heading, height, width, options = network.get_network_data()
    return jsonify(
        {
            "nodes": nodes,
            "edges": edges,
            "options": json.loads(options),
        }
    )


def get_network(doi):
    graph_data = get_graph_data(doi)

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

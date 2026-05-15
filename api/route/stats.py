from flask import Blueprint, jsonify
import json

stats_bp = Blueprint("stats", __name__)

with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@stats_bp.route("/stats")
def get_stats():
    nb_lignes = len(lignes)
    nb_total_arrets = sum(len(l["listeArrets"]) for l in lignes)
    ligne_max = max(lignes, key=lambda l: len(l["listeArrets"]))
    return jsonify({
        "nombre_de_lignes": nb_lignes,
        "nombre_total_arrets": nb_total_arrets,
        "ligne_plus_darrets": ligne_max["id"]
    })
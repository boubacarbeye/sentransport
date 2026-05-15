from flask import Blueprint, jsonify, request
import json

lignes_bp = Blueprint("lignes", __name__)

with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@lignes_bp.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>", "/arrets", "/stats", "/lignes/recherche?q="]
    })

@lignes_bp.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@lignes_bp.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

@lignes_bp.route("/lignes/recherche")
def recherche_ligne():
    q = request.args.get("q", "").lower()
    resultats = [
        l for l in lignes
        if q in l["depart"].lower() or q in l["arrivee"].lower()
    ]
    return jsonify(resultats)
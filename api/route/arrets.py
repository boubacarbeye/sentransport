from flask import Blueprint, jsonify
import json

arrets_bp = Blueprint("arrets", __name__)

with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@arrets_bp.route("/arrets")
def get_arrets():
    tous_les_arrets = set()
    for ligne in lignes:
        for arret in ligne["listeArrets"]:
            tous_les_arrets.add(arret)
    return jsonify(list(tous_les_arrets))
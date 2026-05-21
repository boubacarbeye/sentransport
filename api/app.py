import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Charger les donnees depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)


with open("arrets.json", "r") as f:
    arrets = json.load(f)

@app.route("/arrets")
def get_arrets():
    return jsonify(arrets)


@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>", "/arrets", "/stats", "/lignes/recherche?q="]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

@app.route("/stats")
def get_stats():
    nb_lignes = len(lignes)
    nb_total_arrets = sum(len(l["listeArrets"]) for l in lignes)
    ligne_max = max(lignes, key=lambda l: len(l["listeArrets"]))
    return jsonify({
        "nombre_de_lignes": nb_lignes,
        "nombre_total_arrets": nb_total_arrets,
        "ligne_plus_darrets": ligne_max["id"]
    })

# Exercice 3 : recherche par départ ou arrivée
@app.route("/lignes/recherche")
def recherche_ligne():
    q = request.args.get("q", "").lower()
    resultats = [
        l for l in lignes
        if q in l["depart"].lower() or q in l["arrivee"].lower()
    ]
    return jsonify(resultats)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
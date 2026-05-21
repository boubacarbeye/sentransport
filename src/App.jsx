import { useEffect, useState } from "react";

import Header from "./Header";
import Recherche from "./Recherche";
import LigneBus from "./LigneBus";
import DetailLigne from "./DetailLigne";
import Footer from "./Footer";
import Carte from "./Carte";

function App() {

    // États
    const [lignes, setLignes] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState(null);
    const [recherche, setRecherche] = useState("");
    const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

    // ✅ EXERCICE 3 : États pour le chargement du détail
    const [chargementDetail, setChargementDetail] = useState(false);
    const [erreurDetail, setErreurDetail] = useState(null);

    // Chargement de la liste (résumés seulement)
    useEffect(() => {
        fetch("http://localhost:5000/lignes")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur serveur : " + response.status);
                }
                return response.json();
            })
            .then(data => {
                setLignes(data);
                setChargement(false);
            })
            .catch(error => {
                setErreur(error.message);
                setChargement(false);
            });
    }, []);

    // Filtrage des lignes
    const lignesFiltrees = lignes.filter(l =>
        l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
        l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
        l.numero.includes(recherche)
    );

    // ✅ EXERCICE 3 : Au clic, on fetch GET /lignes/<id> pour avoir le détail complet
    function handleClickLigne(ligne) {

        // Désélection si on clique sur la ligne déjà sélectionnée
        if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
            setLigneSelectionnee(null);
            return;
        }

        // Chargement du détail depuis l'API
        setChargementDetail(true);
        setErreurDetail(null);

        fetch(`http://localhost:5000/lignes/${ligne.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur détail : " + response.status);
                }
                return response.json();
            })
            .then(detail => {
                setLigneSelectionnee(detail); // ← données fraîches du serveur
                setChargementDetail(false);
            })
            .catch(error => {
                setErreurDetail(error.message);
                setChargementDetail(false);
            });
    }

    // Écran de chargement initial
    if (chargement) {
        return (
            <div className="App">
                <Header />
                <main className="contenu">
                    <p className="message-chargement">Chargement des lignes...</p>
                </main>
            </div>
        );
    }

    // Écran d'erreur initial
    if (erreur) {
        return (
            <div className="App">
                <Header />
                <main className="contenu">
                    <div className="message-erreur">
                        <p>Impossible de charger les lignes.</p>
                        <p className="erreur-detail">{erreur}</p>
                        <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
                    </div>
                </main>
            </div>
        );
    }

    // Écran normal
    return (
        <div className="App">
            <Header />
            <main className="contenu">

                <Recherche
                    valeur={recherche}
                    onChange={setRecherche}
                />

                <p className="resultat-recherche">
                    {lignesFiltrees.length} ligne
                    {lignesFiltrees.length > 1 ? "s" : ""} trouvée
                    {lignesFiltrees.length > 1 ? "s" : ""}
                </p>

                {lignesFiltrees.map(ligne => (
                    <LigneBus
                        key={ligne.id}
                        numero={ligne.numero}
                        depart={ligne.depart}
                        arrivee={ligne.arrivee}
                        arrets={ligne.arrets}
                        estSelectionnee={
                            ligneSelectionnee &&
                            ligneSelectionnee.id === ligne.id
                        }
                        onClick={() => handleClickLigne(ligne)}
                    />
                ))}

                {/*  Indicateur pendant le chargement du détail */}
                {chargementDetail && (
                    <p className="message-chargement">Chargement du détail...</p>
                )}

                {/*  Erreur détail */}
                {erreurDetail && (
                    <p className="erreur-detail">Erreur : {erreurDetail}</p>
                )}

                {/*  Détail chargé depuis l'API */}
                {ligneSelectionnee && !chargementDetail && (
                    <DetailLigne ligne={ligneSelectionnee} />
                )}

                <Carte/> 

            </main>
            <Footer />
        </div>
    );
}

export default App;
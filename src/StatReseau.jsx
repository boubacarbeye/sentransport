import './StatReseau.css'
function StatReseau({lignes}) {
    function TotalArret() {
        let total = 0;
        lignes.forEach(ligne => {
            total += Number(ligne.arrets);
        });
        return total;
    }
    function PlusGrandArret() {
        let grand =lignes[0];
        lignes.forEach(ligne => {
            if(grand.arrets < Number(ligne.arrets))
                grand= ligne;
        });        

        return grand.numero;
    }
    return(
        <div className='Stat'>
            <div>Nombre Total Ligne: {lignes.length}</div>
            <div>Nombre Total d'arrêts: {TotalArret()}</div>
            <div>Ligne avec plus grand nombre arrets: {PlusGrandArret()}</div>
        </div>
    );
}
export default StatReseau;
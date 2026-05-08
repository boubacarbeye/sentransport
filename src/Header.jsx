import './Header.css';
function Header() {
    return(
        <header className='header'>
            <h1 className='header-titre'>
                <p className="header-soustitre">
                    Votre guide du transport en commun à Dakar
                </p>
                <p>{new Date().toLocaleDateString('fr-FR')}</p>
            </h1>
        </header>
    );
}

export default Header
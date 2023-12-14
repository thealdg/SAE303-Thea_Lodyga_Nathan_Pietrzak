// Fonction pour récupérer les données JSON depuis l'URL
async function fetchJsonData(url) {
    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

// URL du fichier JSON
const jsonUrl = 'https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json';

// Appeler la fonction pour récupérer les données JSON
fetchJsonData(jsonUrl)
    .then(jsonData => {
        const families = {};

        // Collecter les familles uniques
        jsonData[2].data.forEach(item => {
            const family = item.family;
            families[family] = true;
        });

        // Créer des balises <a> pour chaque famille
        const lesProblemesDiv = document.querySelector('.lesProblemes');
        Object.keys(families).forEach(family => {
            const link = document.createElement('a');
            link.href = 'probleme.html';
            link.textContent = family;
            link.addEventListener('click', function (event) {
                // Empêcher le comportement par défaut du lien
                event.preventDefault();

                // Stocker la variable family dans le localStorage
                localStorage.setItem('selectedFamily', family);

                // Rediriger vers la page "probleme"
                window.location.href = 'probleme.html';
            });
            lesProblemesDiv.appendChild(link);
        });
    });

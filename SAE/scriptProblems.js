
async function fetchJsonData(url) {
    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

const jsonUrl = 'https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json';

fetchJsonData(jsonUrl)
    .then(jsonData => {
        const families = {};

        jsonData[2].data.forEach(item => {
            const family = item.family;
            families[family] = true;
        });

        const lesProblemesDiv = document.querySelector('.lesProblemes');
        Object.keys(families).forEach(family => {
            const link = document.createElement('a');
            link.href = 'probleme.html';
            link.textContent = family;
            link.addEventListener('click', function (event) {
                event.preventDefault();

                localStorage.setItem('selectedFamily', family);

                window.location.href = 'probleme.html';
            });
            lesProblemesDiv.appendChild(link);
        });
    });

document.addEventListener('DOMContentLoaded', function () {
    const selectedFamily = localStorage.getItem('selectedFamily');
    if (selectedFamily) {
        console.log('Selected family:', selectedFamily);
    }

    const maFamily = selectedFamily;

    const h2Element = document.querySelector('h2');
    h2Element.textContent += selectedFamily;

    async function fetchJsonData(url) {
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error fetching JSON data:', error);
        }
    }

    function createLineChart(family, data) {
        const container = document.getElementById('myChart');

        if (family !== maFamily) {
            return;
        }

        const datasets = [];
        const fullnames = [];

        data.forEach(item => {
            const fullname = item.fullname;
            const time = parseFloat(item.time);
            const nbVariables = item.nb_variables;

            if (!fullnames.includes(fullname)) {
                fullnames.push(fullname);

                let dataset = {
                    label: fullname,
                    data: [],
                    backgroundColor: '#FFA05E',
                    borderColor: '#FFA05E',
                    fill: false,
                };

                datasets.push(dataset);
            }

            const dataset = datasets.find(ds => ds.label === fullname);

            dataset.data.push({
                x: fullname, 
                y: nbVariables,
            });
        });

        const filteredDatasets = datasets.filter(dataset => dataset.data.length > 0);

        const ctx = container.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: fullnames, 
                datasets: filteredDatasets,
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Fullname',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Variables',
                        },
                    },
                },
                legend: {
                    display: false, // Hide the legend
                },
            },
        });
    }

    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    const jsonUrl = 'https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json';

    fetchJsonData(jsonUrl)
        .then(jsonData => {
            const families = {};

            jsonData[2].data.forEach(item => {
                const family = item.family;
                if (!families[family]) {
                    families[family] = [item];
                } else {
                    families[family].push(item);
                }
            });

            Object.keys(families).forEach(family => {
                createLineChart(family, families[family]);
            });
        });

    fetchJsonData(jsonUrl)
        .then(jsonData => {
            const families = jsonData[2].data;

            createBarCharts(families);
        });
});

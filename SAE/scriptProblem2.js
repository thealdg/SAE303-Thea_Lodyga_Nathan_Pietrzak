document.addEventListener('DOMContentLoaded', function () {
        const selectedFamily = localStorage.getItem('selectedFamily');
        if (selectedFamily) {
            console.log('Selected family:', selectedFamily);
        }

        async function fetchJsonData(url) {
            try {
                const response = await fetch(url);
                const jsonData = await response.json();
                return jsonData;
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        }

        function createBarCharts(data) {
            const solverContainer = document.getElementById('barChartsContainer');
            solverContainer.innerHTML = ''; // Clear previous content

            const names = Array.from(new Set(data.map(item => item.name)));

            names.forEach(name => {
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                solverContainer.appendChild(chartContainer);

                const h2Element2 = document.createElement('h2');
                h2Element2.textContent = name;
                chartContainer.appendChild(h2Element2);

                const leCanvas = document.createElement('div');
                leCanvas.className = 'leCanvas';
                chartContainer.appendChild(leCanvas);

                const statusCanvas = document.createElement('div');
                statusCanvas.className = 'statusCanvas';
                chartContainer.appendChild(statusCanvas);

                const barCanvas = document.createElement('canvas');
                barCanvas.width = 650;
                barCanvas.height = 200;
                leCanvas.appendChild(barCanvas);

                const statusList = document.createElement('ul');
                statusList.className = 'status-list';
                statusCanvas.appendChild(statusList);

                const statusTitle = document.createElement('h3');
                statusTitle.textContent = 'Statut renvoyé par le résolveur:';
                statusList.appendChild(statusTitle);

                const pieCanvas = document.createElement('canvas');
                pieCanvas.width = 200;
                pieCanvas.height = 200;
                statusCanvas.appendChild(pieCanvas);

                const ctxPie = pieCanvas.getContext('2d');
                const nameDataPie = data.filter(item => item.name === name && item.family === selectedFamily);
                const statusesPie = nameDataPie.map(item => item.status);

                const pieData = {};
                statusesPie.forEach(status => {
                    if (pieData[status]) {
                        pieData[status]++;
                    } else {
                        pieData[status] = 1;
                    }
                });

                new Chart(ctxPie, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(pieData),
                        datasets: [{
                            data: Object.values(pieData),
                            backgroundColor: ['#5EFFB1', '#FF725E', '#FFEA5E', '#745EFF'],
                            borderWidth: 0,
                        }],
                    },
                });

                const ctxBar = barCanvas.getContext('2d');
                const nameDataBar = data.filter(item => item.name === name && item.family === selectedFamily);
                const timesBar = nameDataBar.map(item => parseFloat(item.time));
                const statusesBar = nameDataBar.map(item => item.status);

                const filteredData = nameDataBar.filter(item => parseFloat(item.time) !== 10000);

                new Chart(ctxBar, {
                    type: 'bar',
                    data: {
                        labels: filteredData.map(item => item.fullname),
                        datasets: [{
                            label: name,
                            data: filteredData.map(item => parseFloat(item.time)),
                            backgroundColor: '#FFA05E',
                            borderColor: '#FFA05E',
                            borderWidth: 1,
                        }],
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'category',
                                labels: filteredData.map(item => item.fullname),
                            },
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }
                });

                statusesBar.forEach((status, index) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${nameDataBar[index].fullname} : ${status}`;
                    statusList.appendChild(listItem);
                });
            });
        }

        function updateSolverSelector(data) {
            const solverSelector = document.getElementById('solverSelector');
            solverSelector.innerHTML = ''; // Clear previous content

            const solverNames = Array.from(new Set(data.map(item => item.name)));

            solverNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                solverSelector.appendChild(option);
            });

            solverSelector.addEventListener('change', function () {
                const selectedSolver = solverSelector.value;
                const selectedFamily = localStorage.getItem('selectedFamily');
                const selectedSolverData = data.filter(item => item.name === selectedSolver && item.family === selectedFamily);

                createBarCharts(selectedSolverData);
            });
        }

        fetchJsonData('https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json')
            .then(jsonData => {
                const families = jsonData[2].data;

                updateSolverSelector(families);
                createBarCharts(families);
            });
    });
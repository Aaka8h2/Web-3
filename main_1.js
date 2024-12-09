const apiKey = '11e44db60939154f8d5bc8e311c945133970cbc22dd5606ae78dc99d7348c0cb';

async function fetchData() {
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=XRP&tsym=USD&limit=365&api_key=${apiKey}`);
    const data = await response.json();
    return data.Data.Data.map(item => [item.time * 1000, item.close]);  // Преобразование формата данных
}

async function fetchCurrentPrice() {
    const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=XRP&tsyms=USD&api_key=${apiKey}`);
    const data = await response.json();
    return data.USD;
}

// async function fetchData() {
//     const response = await fetch('https://api.coingecko.com/api/v3/coins/ripple/market_chart?vs_currency=usd&days=365');
//     const data = await response.json();
//     return data.prices;
// }
// async function fetchCurrentPrice() {
//     const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
//     const data = await response.json();
//     return data.ripple.usd;
// }

function formatData(prices) {
    const labels = [];
    const values = [];

    for (let i = 0; i < prices.length; i += 20) {
        const date = new Date(prices[i][0]);
        labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
        values.push(prices[i][1]);
    }

    return { labels, values };
}

function calculateChange(values) {
    const firstValue = values[0];
    const latestValue = values[values.length - 1];
    const change = latestValue - firstValue;
    const percentage = ((change / firstValue) * 100).toFixed(2);
    return {
        change: change.toFixed(2),
        percentage: percentage
    };
}

async function createChart() {
    const prices = await fetchData();
    const { labels, values } = formatData(prices);

    const latestDate = new Date(prices[prices.length - 1][0]);
    labels.push(`${latestDate.getMonth() + 1}/${latestDate.getDate()}`);
    values.push(prices[prices.length - 1][1]);

    const { change, percentage } = calculateChange(values);

    // const currentPrice = await fetchCurrentPrice();
    // const now = new Date();
    // const nowLabel = `${now.getMonth() + 1}/${now.getDate()}`;
    // labels.push(nowLabel);
    // values.push(currentPrice);

    const course_graph = document.getElementById('course');
    const course_header = document.getElementById('h-course');
    const procent_graph = document.getElementById('procent');
    const procent_header = document.getElementById('h-procent');

    if (course_graph) {
        course_graph.innerText = `1 XRP = $${values[values.length - 1].toFixed(3)}`;
    }
    if (course_header) {
        course_header.innerText = `1 XRP = $${values[values.length - 1].toFixed(3)}`;
    }
    if (procent_graph) {
        procent_graph.innerHTML = `${change >= 0 ? `+${change}` : change} <span class="graph-${change >= 0 ? 'up' : 'down'} wth-icon"><img src="/assets/img/icons/arrow-${change >= 0 ? 'up' : 'down'}.svg" /> ${percentage >= 0 ? `+${percentage}%` : `${percentage}%`}</span>`;
    }
    if (procent_header) {
        procent_header.innerHTML = `<span class="graph-${change >= 0 ? 'up' : 'down'} wth-icon"><img src="/assets/img/icons/arrow-${change >= 0 ? 'up' : 'down'}.svg" /> ${percentage >= 0 ? `+${percentage}%` : `${percentage}%`}</span>`;
    }

    const chart = document.getElementById('chart').getContext('2d');
    const gradient = chart.createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, 'rgba(0, 140, 255, 0.32)');
    gradient.addColorStop(0.3, 'rgba(0, 140, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 140, 255, 0)');

    const data = {
        labels: labels,
        datasets: [{
            label: 'XRP/USD',
            backgroundColor: gradient,
            pointBackgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: '#008CFF',
            pointRadius: 3,
            pointHoverRadius: 5,
            data: values,
            fill: true
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            easing: 'easeInOutQuad',
            duration: 1500
        },
        // scales: {
        //     yAxes: [{
        //         ticks: {
        //             fontColor: '#848484',
        //             beginAtZero: true
        //         },
        //         gridLines: {
        //             color: 'rgba(200, 200, 200, 0.08)',
        //             lineWidth: 1
        //         }
        //     }],
        //     xAxes: [{
        //         ticks: {
        //             fontColor: '#848484'
        //         },
        //         gridLines: {
        //             display: false
        //         }
        //     }]
        // },
        elements: {
            line: {
                tension: 0.4
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            titleFontFamily: 'Inter',
            backgroundColor: 'rgba(0,0,0,0.4)',
            titleFontColor: 'white',
            caretSize: 5,
            cornerRadius: 2,
            xPadding: 20,
            yPadding: 20
        }
    };

    new Chart(chart, {
        type: 'line',
        data: data,
        options: options
    });
}

createChart();
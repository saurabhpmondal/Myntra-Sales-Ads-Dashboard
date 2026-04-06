let chartStore = {}; // 🔥 multiple charts support

export function renderLineChart(id, labels, dataA, dataB, labelA, labelB){

    const ctx = document.getElementById(id);

    if (!ctx) return;

    // 🔥 destroy only this chart (not global)
    if (chartStore[id]) {
        chartStore[id].destroy();
    }

    chartStore[id] = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: labelA,
                    data: dataA,
                    borderWidth: 2,
                    tension: 0.35,
                    pointRadius: 2,
                    pointHoverRadius: 5
                },
                {
                    label: labelB,
                    data: dataB,
                    borderWidth: 2,
                    tension: 0.35,
                    pointRadius: 2,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context){
                            const val = context.raw || 0;

                            // smart formatting
                            if (val > 1000) {
                                return context.dataset.label + ": " + val.toLocaleString();
                            }
                            return context.dataset.label + ": " + val;
                        }
                    }
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: "#f1f5f9"
                    },
                    ticks: {
                        callback: function(value){
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    return chartStore[id];
}
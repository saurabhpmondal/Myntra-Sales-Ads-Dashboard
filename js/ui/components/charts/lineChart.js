let chartStore = {};

export function renderLineChart(id, labels, dataA, dataB, labelA, labelB){

    const ctx = document.getElementById(id);
    if (!ctx) return;

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
                    borderColor: "#3b82f6",
                    yAxisID: "y",
                    tension: 0.35
                },
                {
                    label: labelB,
                    data: dataB,
                    borderColor: "#22c55e",
                    yAxisID: "y1",
                    tension: 0.35
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: "index", intersect: false },

            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(ctx){

                            const gmv = dataA[ctx.dataIndex] || 0;
                            const units = dataB[ctx.dataIndex] || 0;
                            const asp = units ? gmv / units : 0;

                            return [
                                "GMV: ₹ " + gmv.toLocaleString(),
                                "Units: " + units.toLocaleString(),
                                "ASP: ₹ " + Math.round(asp).toLocaleString()
                            ];
                        }
                    }
                }
            },

            scales: {
                y: {
                    position: "left",
                    ticks: {
                        callback: v => v.toLocaleString()
                    }
                },
                y1: {
                    position: "right",
                    grid: { drawOnChartArea: false },
                    ticks: {
                        callback: v => v.toLocaleString()
                    }
                }
            }
        }
    });

    return chartStore[id];
}
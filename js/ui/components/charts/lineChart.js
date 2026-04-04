let chartInstance = null;

export function renderLineChart(id, labels, dataA, dataB, labelA, labelB){

    const ctx = document.getElementById(id);

    // 🔥 DESTROY OLD CHART (GLOBAL SAFE FIX)
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: labelA,
                    data: dataA,
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: labelB,
                    data: dataB,
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            }
        }
    });

    return chartInstance;
}
export function renderLineChart(canvasId, labels, data1, data2, label1, label2) {

    const ctx = document.getElementById(canvasId);

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: label1,
                    data: data1,
                    borderColor: "#3b82f6",
                    tension: 0.4
                },
                {
                    label: label2,
                    data: data2,
                    borderColor: "#22c55e",
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: "#fff" }
                }
            },
            scales: {
                x: { ticks: { color: "#aaa" }},
                y: { ticks: { color: "#aaa" }}
            }
        }
    });
}
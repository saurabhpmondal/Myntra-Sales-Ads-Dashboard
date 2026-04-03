let visible = 100;

export function renderTraffic(data) {

    const content = document.getElementById("content");

    const rows = Object.entries(data)
        .slice(0, visible)
        .map(([k, v]) => `
            <tr>
                <td>${k}</td>
                <td>${v}</td>
            </tr>
        `).join("");

    content.innerHTML = `
        <div class="card">
            <h3>Traffic</h3>

            <table class="table">
                <tbody>${rows}</tbody>
            </table>

            <button id="more">Load More</button>
        </div>
    `;

    document.getElementById("more").onclick = () => {
        visible += 100;
        renderTraffic(data);
    };
}
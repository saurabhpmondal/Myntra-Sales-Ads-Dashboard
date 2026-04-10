import { buildStyleIntelligence } from "../styleIntelligence/engine.js";
import { renderLineChart } from "../../ui/components/charts/lineChart.js";

export function renderDeepDive(){

    const container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div class="card">
            <h3>Deep Dive</h3>

            <div class="top-style-filters">
                <input id="ddSearch" placeholder="Enter Style ID..." />
                <button id="ddSearchBtn">Search</button>
            </div>

            <div id="ddResult" style="margin-top:16px;"></div>
        </div>
    `;

    document.getElementById("ddSearchBtn").onclick = runSearch;

    function runSearch(){

        const styleId = document.getElementById("ddSearch").value.trim();

        if (!styleId){
            alert("Enter style ID");
            return;
        }

        const data = buildStyleIntelligence(styleId);

        if (!data){
            document.getElementById("ddResult").innerHTML =
                `<p style="color:red;">❌ Style not found</p>`;
            return;
        }

        renderFull(data);
    }
}

/* ========================= */

function renderFull(d){

    const el = document.getElementById("ddResult");

    el.innerHTML = `
        <div class="card">

            <h3>${safe(d.style_id)} • ${safe(d.brand)}</h3>

            <!-- 🔥 HERO BLOCK -->
            <div class="dd-hero">

                <div class="dd-score">
                    <div class="dd-big">${d.score?.value || 0}</div>
                    <div class="dd-label">${d.score?.label}</div>
                </div>

                <div class="dd-momentum ${momentumClass(d.momentum?.value)}">
                    ${pct(d.momentum?.value)} • ${d.momentum?.label}
                </div>

            </div>

            <!-- 🔥 INSIGHTS -->
            <div class="dd-insights">
                ${
                    (d.insights || []).length
                    ? d.insights.map(i => `
                        <span class="badge ${i.type}">
                            ${i.text}
                        </span>
                    `).join("")
                    : `<span class="badge">No major issues</span>`
                }
            </div>

            <!-- KPI GRID -->
            <div class="si-kpi-grid clean">
                ${kpi("Units", d.kpi?.units)}
                ${kpi("Revenue", d.kpi?.revenue)}
                ${kpi("ASP", d.kpi?.asp)}

                ${kpi("Ad Spend", d.kpi?.ad_spend)}
                ${kpi("Ad Revenue", d.kpi?.ad_revenue)}
                ${kpi("ROI", d.kpi?.roi)}

                ${kpi("Impressions", d.kpi?.impressions)}
                ${kpi("Clicks", d.kpi?.clicks)}
                ${kpi("CVR", d.kpi?.cvr)}
            </div>

            <!-- 🔥 INVENTORY -->
            <div class="card">
                <h3>Inventory Intelligence</h3>

                <div class="si-kpi-grid clean">
                    ${kpi("SJIT", d.inventory?.sjit)}
                    ${kpi("SOR", d.inventory?.sor)}
                    ${kpi("Seller", d.inventory?.seller)}
                    ${kpi("Total Stock", d.inventory?.total)}
                    ${kpi("Days Cover", fmt2(d.inventory?.days_cover))}
                    ${kpi("TP", fmt2(d.product?.tp))}
                </div>
            </div>

            <!-- SALES TREND -->
            <div class="card">
                <h3>Sales Trend</h3>
                <canvas id="ddChart"></canvas>
            </div>

            <!-- FUNNEL -->
            <div class="card">
                <h3>Traffic Funnel</h3>
                <div class="si-funnel clean">
                    ${box("Impressions", d.traffic?.impressions)}
                    ${arrow()}
                    ${box("Clicks", d.traffic?.clicks)}
                    ${arrow()}
                    ${box("ATC", d.traffic?.atc)}
                    ${arrow()}
                    ${box("Orders", d.traffic?.orders)}
                </div>
            </div>

        </div>
    `;

    /* 🔥 FIX: ONLY CURRENT MONTH TREND */

    const state = window.APP_STATE || {};
    const from = state.from;
    const to = state.to;

    const trend = d.trend || {};

    const filteredKeys = Object.keys(trend).filter(k => {
        if (from && k < from) return false;
        if (to && k > to) return false;
        return true;
    });

    const labels = filteredKeys;
    const revenue = labels.map(k => trend[k]?.revenue || 0);

    if (labels.length){
        renderLineChart("ddChart", labels, revenue, [], "Revenue", "");
    }
}

/* ========================= */

function kpi(t,v){
    return `
        <div class="si-kpi clean-box">
            <span>${t}</span>
            <strong>${fmt(v)}</strong>
        </div>
    `;
}

function box(t,v){
    return `<div class="si-funnel-box clean-box">${t}<br><strong>${fmt(v)}</strong></div>`;
}

function arrow(){
    return `<div class="si-arrow">→</div>`;
}

function safe(v){
    return v || "-";
}

function fmt(n){ return Number(n||0).toLocaleString(); }
function fmt2(n){ return Number(n||0).toFixed(2); }
function pct(n){ return ((n||0)*100).toFixed(1)+"%"; }

function momentumClass(v){
    if (v > 0.2) return "kpi-good";
    if (v < -0.1) return "kpi-bad";
    return "";
}
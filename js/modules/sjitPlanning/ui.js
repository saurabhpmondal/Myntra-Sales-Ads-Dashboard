// 🔥 ONLY CHANGES INSIDE EXISTING LOGIC — NOTHING REMOVED

// Replace ONLY this part inside renderTable() map:

let shipment = r.shipment;
let recall = r.recall;
let remarks = [];

const status = (r.status || "").toLowerCase();

/* =========================
   🔥 STATUS STRICT
========================= */

if (["discontinued","special","clearance"].includes(status)){
    shipment = 0;
    recall = r.sjit;
    remarks.push("DO NOT SHIP");
}

/* =========================
   🔥 RETURN LOGIC FIX
========================= */

if (r.return_pct > 0.45){
    if (!(r.gross >= 30)){
        remarks.push("HIGH RETURN");
    }
}

if (r.return_pct > 0.35 && r.return_pct < 0.45){
    remarks.push("RISK OF RETURN");
}

/* =========================
   🔥 RECALL FLAG
========================= */

const isRecall = r.sc >= 90;
if (isRecall){
    remarks.push("RECALL");
}

/* =========================
   🔥 EXISTING
========================= */

if (r.remark){
    remarks.push(r.remark);
}

/* =========================
   🔥 FINAL (NO DUPLICATES)
========================= */

remarks = [...new Set(remarks)];

const finalRemark = remarks.join(" | ") || "-";
let state = {
    totalFiles: 5,
    currentFile: 0,
    currentName: "",
    rows: 0,
    stage: "Initializing"
};

function createUI(){

    if(document.getElementById("appLoader")) return;

    const wrap = document.createElement("div");
    wrap.id = "appLoader";

    wrap.innerHTML = `
        <div class="loader-card">
            <div class="loader-title">Loading Data...</div>
            <div class="loader-stage" id="loaderStage"></div>
            <div class="loader-rows" id="loaderRows"></div>
            <div class="loader-bar">
                <div id="loaderFill"></div>
            </div>
        </div>
    `;

    document.body.appendChild(wrap);

    const style = document.createElement("style");
    style.innerHTML = `
        #appLoader{
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.3);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:9999;
        }

        .loader-card{
            background:#fff;
            padding:20px 24px;
            border-radius:12px;
            width:260px;
            box-shadow:0 10px 30px rgba(0,0,0,0.2);
            text-align:center;
        }

        .loader-title{
            font-weight:600;
            margin-bottom:10px;
        }

        .loader-stage{
            font-size:13px;
            margin-bottom:6px;
            color:#374151;
        }

        .loader-rows{
            font-size:12px;
            margin-bottom:10px;
            color:#6b7280;
        }

        .loader-bar{
            height:6px;
            background:#e5e7eb;
            border-radius:6px;
            overflow:hidden;
        }

        #loaderFill{
            height:100%;
            width:0%;
            background:linear-gradient(90deg,#6366f1,#22c55e);
            transition:width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

function updateUI(){

    const stage = document.getElementById("loaderStage");
    const rows = document.getElementById("loaderRows");
    const fill = document.getElementById("loaderFill");

    if(!stage || !fill) return;

    stage.innerText = state.stage + " " + state.currentName;

    if(state.rows){
        rows.innerText = state.rows.toLocaleString() + " rows";
    }

    const percent = (state.currentFile / state.totalFiles) * 100;
    fill.style.width = percent + "%";
}

export function startLoader(){
    createUI();
    updateUI();
}

export function updateFileProgress(name, rows=0){
    state.currentName = name;
    state.rows = rows;
    updateUI();
}

export function nextFile(){
    state.currentFile++;
    updateUI();
}

export function setStage(s){
    state.stage = s;
    updateUI();
}

export function stopLoader(){
    const el = document.getElementById("appLoader");
    if(el){
        el.style.opacity = "0";
        setTimeout(()=> el.remove(), 300);
    }
}
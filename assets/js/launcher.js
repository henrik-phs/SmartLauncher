let apps = [];
let appElements = [];
let focusedIndex = 0;
const cols = 3;

function getSavedApps() {
    const saved = localStorage.getItem("customLauncherApps");
    return saved ? JSON.parse(saved) : getDefaultApps();
}

function getDefaultApps() {
    return [
        {
            name: "Navegador",
            appId: "com.webos.app.browser",
            icon: "https://cdn-icons-png.flaticon.com/512/3178/3178158.png"
        },
        {
            name: "YouTube",
            appId: "youtube.leanback.v4",
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
        },
        {
            name: "Netflix",
            appId: "netflix",
            icon: "https://cdn-icons-png.flaticon.com/512/5977/5977590.png"
        },{
            name: "YouTube2",
            appId: "youtube.leanback.v42",
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
        },{
            name: "YouTube3",
            appId: "youtube.leanback.v43",
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
        },{
            name: "YouTube4",
            appId: "youtube.leanback.v44",
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
        }
    ];
}

function saveApps() {
    localStorage.setItem("customLauncherApps", JSON.stringify(apps));
}

function createAppCard(app, index, isConfig = false) {
    const div = document.createElement("div");
    div.className = "app";
    div.tabIndex = 0;
    div.innerHTML = `
        <img src="${app.icon}" alt="${app.name}">
        <div>${app.name}</div>
    `;

    if (isConfig) {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌ Remover";
        removeBtn.onclick = () => {
            apps.splice(index, 1);
            renderConfigScreen();
        };
        div.appendChild(removeBtn);
    } else {
        div.addEventListener("click", () => launchApp(app.appId));
        appElements.push(div);
    }

    return div;
}

function renderLauncher() {
    const appGrid = document.getElementById("appGrid");
    appGrid.innerHTML = "";
    appElements = [];
    focusedIndex = 0;
    apps.forEach((app, index) => {
        appGrid.appendChild(createAppCard(app, index));
    });
    focusApp(focusedIndex);
}

function renderConfigScreen() {
    const configGrid = document.getElementById("configAppGrid");
    configGrid.innerHTML = "";
    apps.forEach((app, index) => {
        configGrid.appendChild(createAppCard(app, index, true));
    });
}

function focusApp(index) {
    if (appElements[index]) {
        appElements[index].focus();
    }
}

function handleKeyNavigation(event) {
    const total = appElements.length;

    switch (event.key) {
        case "ArrowRight":
            if (focusedIndex + 1 < total) focusedIndex++;
            break;
        case "ArrowLeft":
            if (focusedIndex - 1 >= 0) focusedIndex--;
            break;
        case "ArrowDown":
            if (focusedIndex + cols < total) focusedIndex += cols;
            break;
        case "ArrowUp":
            if (focusedIndex - cols >= 0) focusedIndex -= cols;
            break;
        case "Enter":
        case "OK":
            appElements[focusedIndex].click();
            break;
    }

    focusApp(focusedIndex);
}

function launchApp(appId) {
    if (typeof webOS !== "undefined") {
        webOS.service.request("luna://com.webos.applicationManager", {
            method: "launch",
            parameters: { id: appId },
            onSuccess: function () {
                console.log(`App ${appId} lançado com sucesso.`);
            },
            onFailure: function (err) {
                console.error("Erro ao lançar o app:", err);
                alert("Erro ao abrir o app.");
            }
        });
    } else {
        alert("webOS não detectado.");
    }
}

function openSettings() {
    document.getElementById("launcherScreen").classList.remove("active");
    document.getElementById("configScreen").classList.add("active");
    renderConfigScreen();
}

function saveAndBack() {
    saveApps();
    document.getElementById("configScreen").classList.remove("active");
    document.getElementById("launcherScreen").classList.add("active");
    renderLauncher();
}

function addApp(event) {
    event.preventDefault();
    const name = document.getElementById("appName").value.trim();
    const appId = document.getElementById("appId").value.trim();
    const icon = document.getElementById("appIcon").value.trim();

    if (name && appId && icon) {
        apps.push({ name, appId, icon });
        renderConfigScreen();
        event.target.reset();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    apps = getSavedApps();
    renderLauncher();
    document.addEventListener("keydown", handleKeyNavigation);
    document.getElementById("addAppForm").addEventListener("submit", addApp);
});

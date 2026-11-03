const STORAGE_KEYS = {
    projects: "portfolio.projects",
    theme: "portfolio.theme",
    collapsed: "portfolio.projectsCollapsed"
};

const DEFAULT_ICON = "📁";

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Не удалось сохранить данные в localStorage (" + key + "):", error);
    }
}
 
function loadFromStorage(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? null : JSON.parse(raw);
    } catch (error) {
        console.error("Не удалось прочитать данные из localStorage (" + key + "):", error);
        return null;
    }
}

function getCardData(card) {
    const title = card.querySelector("h4");
    const description = card.querySelector(".stack");
    const icon = card.querySelector(".project-icon");
 
    let modifier = "";
    card.classList.forEach(function (cls) {
        if (cls.startsWith("project-card--")) {
            modifier = cls;
        }
    });
 
    return {
        title: title ? title.textContent.trim() : "Без названия",
        description: description ? description.textContent.trim() : "",
        icon: icon ? icon.textContent.trim() : DEFAULT_ICON,
        modifier: modifier
    };
}

function createProjectCard(data) {
    const article = document.createElement("article");
    article.classList.add("project-card");
    if (data.modifier) {
        article.classList.add(data.modifier);
    }
 
    const icon = document.createElement("div");
    icon.className = "project-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = data.icon || DEFAULT_ICON;
 
    const body = document.createElement("div");
    body.className = "project-body";
 
    const title = document.createElement("h4");
    title.textContent = String(data.title || "Без названия");
 
    const description = document.createElement("p");
    description.className = "stack";
    description.textContent = String(data.description || "Описание пока не добавлено.");
 
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn";
    button.textContent = "Подробнее";
 
    body.appendChild(title);
    body.appendChild(description);
    body.appendChild(button);
 
    article.appendChild(icon);
    article.appendChild(body);
 
    return article;
}
 
function getProjectCards(container) {
    return container.querySelectorAll(".project-card");
}
 
function saveProjects(container) {
    const data = Array.from(getProjectCards(container)).map(getCardData);
    saveToStorage(STORAGE_KEYS.projects, data);
    console.log("Сохранено проектов в localStorage: " + data.length);
}
 
function restoreProjects(container) {
    const saved = loadFromStorage(STORAGE_KEYS.projects);
 
    if (!Array.isArray(saved)) {
        console.log("Сохранённых проектов нет — используются проекты из HTML");
        return;
    }
 
    getProjectCards(container).forEach(function (card) {
        card.remove();
    });
 
    saved.forEach(function (item) {
        container.appendChild(createProjectCard(item));
    });
 
    console.log("Восстановлено проектов из localStorage: " + saved.length);
}

function initPage() {
    const container = document.querySelector(".projects-list");
    const addButton = document.getElementById("add-project-btn");
    const removeButton = document.getElementById("remove-project-btn");
    const toggleButton = document.getElementById("toggle-projects-btn");
    const themeButton = document.getElementById("theme-toggle");
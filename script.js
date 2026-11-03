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

    const required = [
        [container, "контейнер .projects-list"],
        [addButton, "кнопка #add-project-btn"],
        [removeButton, "кнопка #remove-project-btn"],
        [toggleButton, "кнопка #toggle-projects-btn"],
        [themeButton, "кнопка #theme-toggle"]
    ];
    
    let allFound = true;
    required.forEach(function (pair) {
        const element = pair[0];
        const name = pair[1];
        if (!element) {
            console.error("Ошибка: не найден элемент — " + name);
            allFound = false;
        }
    });
 
    if (!allFound) {
        console.error("Скрипт остановлен: на странице не хватает нужных элементов.");
        return;
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        document.body.classList.toggle("theme-dark", isDark);
        document.body.classList.toggle("theme-light", !isDark);
        themeButton.textContent = isDark ? "☀️ Светлая тема" : "🌙 Тёмная тема";
        themeButton.setAttribute("aria-pressed", String(isDark));
    }

    function updateToggleButton(isHidden) {
        toggleButton.textContent = isHidden ? "Развернуть проекты" : "Свернуть проекты";
        toggleButton.setAttribute("aria-expanded", String(!isHidden));
    }

    restoreProjects(container);
 
    const savedTheme = loadFromStorage(STORAGE_KEYS.theme);
    applyTheme(savedTheme === "dark" ? "dark" : "light");
 
    const savedCollapsed = loadFromStorage(STORAGE_KEYS.collapsed) === true;
    if (savedCollapsed) {
        container.classList.add("hidden");
    }
    updateToggleButton(savedCollapsed);

    addButton.addEventListener("click", function () {
        const title = prompt("Название проекта:", "");
        if (title === null) {
            console.log("Добавление проекта отменено");
            return;
        }
        if (title.trim() === "") {
            alert("Название проекта не может быть пустым");
            return;
        }
 
        const description = prompt("Краткое описание проекта:", "");
        if (description === null) {
            console.log("Добавление проекта отменено");
            return;
        }
 
        const card = createProjectCard({
            title: title.trim(),
            description: description.trim() || "Описание пока не добавлено.",
            icon: DEFAULT_ICON
        });
        container.appendChild(card);
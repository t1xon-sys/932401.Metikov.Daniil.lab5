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
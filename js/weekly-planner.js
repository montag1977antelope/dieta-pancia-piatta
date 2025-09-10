// Logica per il piano settimanale
let currentWeekOffset = 0;
let currentEditingMeal = null;
let selectedFoods = [];
let weeklyPlanData = {};

// Template piano originale dalla dieta
const originalPlanTemplate = {
    "lunedi": {
        "breakfast": [
            { id: "pera", quantity: 150, alternatives: ["mela", "banana"] },
            { id: "mandorle", quantity: 25, alternatives: ["noci", "nocciole"] },
            { id: "tisana_finocchio", quantity: 250 }
        ],
        "snack1": [
            { id: "noci", quantity: 20, alternatives: ["mela", "mandorle"] }
        ],
        "lunch": [
            { id: "pollo_grigliato", quantity: 150, alternatives: ["tacchino_grigliato", "merluzzo_vapore", "uova"] },
            { id: "fagiolini", quantity: 150 },
            { id: "carote", quantity: 100 },
            { id: "farro_perlato", quantity: 40, alternatives: ["orzo_perlato", "riso_basmati"] }
        ],
        "snack2": [
            { id: "burro_arachidi", quantity: 15 },
            { id: "sedano", quantity: 100 }
        ],
        "dinner": [
            { id: "merluzzo_vapore", quantity: 150, alternatives: ["sgombro_naturale", "orata_forno", "uova"] },
            { id: "zucchine", quantity: 150 },
            { id: "patata_dolce", quantity: 120, alternatives: ["riso_basmati", "wasa"] }
        ]
    },
    "martedi": {
        "breakfast": [
            { id: "uova", quantity: 2 },
            { id: "mela", quantity: 150 },
            { id: "te_verde", quantity: 250 }
        ],
        "snack1": [
            { id: "mandorle", quantity: 15, alternatives: ["anacardi"] }
        ],
        "lunch": [
            { id: "tacchino_grigliato", quantity: 150 },
            { id: "rucola", quantity: 100 },
            { id: "cetrioli", quantity: 100 },
            { id: "orzo_perlato", quantity: 50 }
        ],
        "snack2": [
            { id: "burro_arachidi", quantity: 15 },
            { id: "sedano", quantity: 100 }
        ],
        "dinner": [
            { id: "orata_forno", quantity: 150 },
            { id: "carote", quantity: 100 },
            { id: "lattuga", quantity: 100 },
            { id: "riso_basmati", quantity: 40 }
        ]
    },
    "mercoledi": {
        "breakfast": [
            { id: "banana", quantity: 120 },
            { id: "noci", quantity: 20 },
            { id: "tisana_drenante", quantity: 250 }
        ],
        "snack1": [
            { id: "wasa", quantity: 1 },
            { id: "pera", quantity: 75 }
        ],
        "lunch": [
            { id: "sgombro_naturale", quantity: 150 },
            { id: "fagiolini", quantity: 150 },
            { id: "riso_integrale", quantity: 40 }
        ],
        "snack2": [
            { id: "carote", quantity: 150 },
            { id: "burro_arachidi", quantity: 15 }
        ],
        "dinner": [
            { id: "pollo_grigliato", quantity: 150 },
            { id: "zucchine", quantity: 150 },
            { id: "patata_dolce", quantity: 120 }
        ]
    },
    "giovedi": {
        "breakfast": [
            { id: "mela", quantity: 150 },
            { id: "pistacchi", quantity: 25 },
            { id: "tisana_finocchio", quantity: 250 }
        ],
        "snack1": [
            { id: "wasa", quantity: 1 },
            { id: "kiwi", quantity: 100 }
        ],
        "lunch": [
            { id: "branzino_forno", quantity: 120 },
            { id: "fagiolini", quantity: 150 },
            { id: "farro_perlato", quantity: 50 }
        ],
        "snack2": [
            { id: "frutti_bosco", quantity: 150 }
        ],
        "dinner": [
            { id: "legumi_decorticati", quantity: 60 },
            { id: "zucchine", quantity: 150 },
            { id: "carote", quantity: 100 },
            { id: "riso_basmati", quantity: 40 }
        ]
    },
    "venerdi": {
        "breakfast": [
            { id: "pera", quantity: 150 },
            { id: "nocciole", quantity: 25 },
            { id: "te_verde", quantity: 250 }
        ],
        "snack1": [
            { id: "mela", quantity: 120 }
        ],
        "lunch": [
            { id: "tacchino_grigliato", quantity: 150 },
            { id: "spinaci", quantity: 100 },
            { id: "finocchi", quantity: 100 },
            { id: "orzo_perlato", quantity: 40 }
        ],
        "snack2": [
            { id: "mela", quantity: 150 },
            { id: "peperoni_grigliati", quantity: 100 }
        ],
        "dinner": [
            { id: "orata_forno", quantity: 150 },
            { id: "carote", quantity: 100 },
            { id: "fagiolini", quantity: 150 },
            { id: "patata_dolce", quantity: 120 }
        ]
    },
    "sabato": {
        "breakfast": [
            { id: "uova", quantity: 2 },
            { id: "mela", quantity: 150 },
            { id: "tisana_drenante", quantity: 250 }
        ],
        "snack1": [
            { id: "wasa", quantity: 1 },
            { id: "mandorle", quantity: 10 }
        ],
        "lunch": [
            { id: "carne_rossa_magra", quantity: 150 },
            { id: "rucola", quantity: 100 },
            { id: "cetrioli", quantity: 100 },
            { id: "spinaci", quantity: 50 },
            { id: "farro_perlato", quantity: 50 }
        ],
        "snack2": [
            { id: "banana", quantity: 120 },
            { id: "wasa", quantity: 1 }
        ],
        "dinner": [
            { id: "tonno_fresco", quantity: 150 },
            { id: "peperoni_grigliati", quantity: 150 },
            { id: "zucchine", quantity: 150 },
            { id: "riso_basmati", quantity: 40 }
        ]
    },
    "domenica": {
        "breakfast": [
            { id: "banana", quantity: 120 },
            { id: "mandorle", quantity: 25 },
            { id: "te_verde", quantity: 250 }
        ],
        "snack1": [
            { id: "mela", quantity: 150 }
        ],
        "lunch": [
            { id: "orata_forno", quantity: 150 },
            { id: "fagiolini", quantity: 150 },
            { id: "riso_basmati", quantity: 40 }
        ],
        "snack2": [
            { id: "pera", quantity: 150, alternatives: ["kiwi"] }
        ],
        "dinner": [
            { id: "sgombro_naturale", quantity: 150 },
            { id: "zucchine", quantity: 150 },
            { id: "carote", quantity: 100 },
            { id: "wasa", quantity: 2 }
        ]
    }
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    loadWeeklyPlan();
    renderWeek();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Ricerca alimenti nel modal
    document.getElementById('foodSearchInput').addEventListener('input', debounce((e) => {
        searchFoodsForMeal(e.target.value);
    }, 300));

    // Template selector
    document.querySelectorAll('input[name="template"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('fileUploadSection').style.display = 
                e.target.value === 'file' ? 'block' : 'none';
        });
    });
}

// Carica piano settimanale salvato
function loadWeeklyPlan() {
    const saved = localStorage.getItem('weeklyPlan');
    if (saved) {
        weeklyPlanData = JSON.parse(saved);
    }
}

// Salva piano settimanale
function saveWeeklyPlan() {
    localStorage.setItem('weeklyPlan', JSON.stringify(weeklyPlanData));
    showNotification('Piano settimanale salvato con successo!');
}

// Cambia settimana
function changeWeek(offset) {
    currentWeekOffset += offset;
    renderWeek();
}

// Renderizza la settimana
function renderWeek() {
    const startDate = getWeekStartDate(currentWeekOffset);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    // Aggiorna display settimana
    const weekDisplay = document.getElementById('weekDisplay');
    const options = { day: 'numeric', month: 'short' };
    weekDisplay.textContent = `${startDate.toLocaleDateString('it-IT', options)} - ${endDate.toLocaleDateString('it-IT', options)}`;
    
    // Renderizza giorni
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';
    
    const dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    const dayKeys = ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica'];
    
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(dayDate.getDate() + i);
        const isToday = isDateToday(dayDate);
        
        const dayCard = createDayCard(dayNames[i], dayDate, dayKeys[i], isToday);
        daysGrid.appendChild(dayCard);
    }
}

// Crea card del giorno
function createDayCard(dayName, date, dayKey, isToday) {
    const dayCard = document.createElement('div');
    dayCard.className = `day-card ${isToday ? 'today' : ''}`;
    
    const dateStr = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'numeric' });
    const dayData = weeklyPlanData[getWeekKey(currentWeekOffset)]?.[dayKey] || {};
    
    dayCard.innerHTML = `
        <div class="day-header">
            <h3>${dayName}</h3>
            <span class="day-date">${dateStr}</span>
        </div>
        ${createMealSections(dayKey, dayData)}
        ${createDaySummary(dayData)}
    `;
    
    return dayCard;
}

// Crea sezioni pasti
function createMealSections(dayKey, dayData) {
    const mealTypes = [
        { key: 'breakfast', name: '🌅 Colazione', time: '7:30' },
        { key: 'snack1', name: '🍎 Spuntino', time: '10:30' },
        { key: 'lunch', name: '🍽️ Pranzo', time: '13:00' },
        { key: 'snack2', name: '🥜 Merenda', time: '16:30' },
        { key: 'dinner', name: '🌙 Cena', time: '20:00' }
    ];
    
    return mealTypes.map(meal => `
        <div class="meal-section">
            <div class="meal-type">
                <span>${meal.name} - ${meal.time}</span>
                <button class="btn-icon" onclick="editMeal('${dayKey}', '${meal.key}')" title="Modifica">
                    ✏️
                </button>
            </div>
            <div class="meal-items">
                ${renderMealItems(dayData[meal.key] || [])}
            </div>
        </div>
    `).join('');
}

// Renderizza alimenti del pasto
function renderMealItems(mealItems) {
    if (!mealItems || mealItems.length === 0) {
        return '<div class="empty-meal">Nessun alimento</div>';
    }
    
    return mealItems.map(item => {
        const food = getFoodById(item.id);
        if (!food) return '';
        
        return `
            <div class="meal-item">
                <span class="meal-item-name">${food.nome}</span>
                <span class="meal-item-info">${item.quantity}${food.unita_misura || 'g'}</span>
            </div>
        `;
    }).join('');
}

// Crea sommario giornaliero
function createDaySummary(dayData) {
    const totals = calculateDayTotals(dayData);
    
    return `
        <div class="day-summary">
            <div class="summary-item">
                <span class="summary-label">Calorie</span>
                <span class="summary-value">${Math.round(totals.calories)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Proteine</span>
                <span class="summary-value">${Math.round(totals.proteins)}g</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Grassi</span>
                <span class="summary-value">${Math.round(totals.fats)}g</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Carb.</span>
                <span class="summary-value">${Math.round(totals.carbs)}g</span>
            </div>
        </div>
    `;
}

// Calcola totali del giorno
function calculateDayTotals(dayData) {
    let totals = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
    
    Object.values(dayData).forEach(mealItems => {
        if (Array.isArray(mealItems)) {
            mealItems.forEach(item => {
                const food = getFoodById(item.id);
                if (food) {
                    const nutrition = calculateNutritionForPortion(food, item.quantity);
                    totals.calories += nutrition.calories;
                    totals.proteins += nutrition.proteins;
                    totals.fats += nutrition.fats;
                    totals.carbs += nutrition.carbs;
                }
            });
        }
    });
    
    return totals;
}

// Modal functions
function showImportModal() {
    document.getElementById('importModal').classList.add('active');
}

function closeImportModal() {
    document.getElementById('importModal').classList.remove('active');
}

function selectTemplate(templateType) {
    document.querySelectorAll('.template-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function importSelectedTemplate() {
    const selected = document.querySelector('input[name="template"]:checked').value;
    
    switch (selected) {
        case 'original':
            importOriginalPlan();
            break;
        case 'empty':
            importEmptyPlan();
            break;
        case 'file':
            importFromFile();
            break;
    }
}

// Importa piano originale
function importOriginalPlan() {
    const weekKey = getWeekKey(currentWeekOffset);
    weeklyPlanData[weekKey] = JSON.parse(JSON.stringify(originalPlanTemplate));
    saveWeeklyPlan();
    renderWeek();
    closeImportModal();
    showNotification('Piano originale importato con successo!');
}

// Importa piano vuoto
function importEmptyPlan() {
    const weekKey = getWeekKey(currentWeekOffset);
    weeklyPlanData[weekKey] = {
        lunedi: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] },
        martedi: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] },
        mercoledi: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] },
        giovedi: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] },
        venerdi: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] },
        sabato: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] },
        domenica: { breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [] }
    };
    saveWeeklyPlan();
    renderWeek();
    closeImportModal();
    showNotification('Piano vuoto creato!');
}

// Importa da file
function importFromFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Seleziona un file da importare', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            const weekKey = getWeekKey(currentWeekOffset);
            weeklyPlanData[weekKey] = imported;
            saveWeeklyPlan();
            renderWeek();
            closeImportModal();
            showNotification('Piano importato con successo!');
        } catch (error) {
            showNotification('Errore nell\'importazione del file', 'error');
        }
    };
    reader.readAsText(file);
}

// Esporta piano settimanale
function exportWeekPlan() {
    const weekKey = getWeekKey(currentWeekOffset);
    const weekData = weeklyPlanData[weekKey];
    
    if (!weekData) {
        showNotification('Nessun piano da esportare per questa settimana', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(weekData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportName = `piano_settimanale_${weekKey}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
    
    showNotification('Piano esportato con successo!');
}

// Modifica pasto
function editMeal(dayKey, mealType) {
    currentEditingMeal = { dayKey, mealType };
    const weekKey = getWeekKey(currentWeekOffset);
    
    // Carica alimenti attuali
    selectedFoods = weeklyPlanData[weekKey]?.[dayKey]?.[mealType] || [];
    selectedFoods = JSON.parse(JSON.stringify(selectedFoods)); // Deep copy
    
    // Aggiorna titolo
    const mealNames = {
        breakfast: 'Colazione',
        snack1: 'Spuntino Mattina',
        lunch: 'Pranzo',
        snack2: 'Spuntino Pomeriggio',
        dinner: 'Cena'
    };
    document.getElementById('editMealTitle').textContent = `Modifica ${mealNames[mealType]} - ${dayKey}`;
    
    // Mostra modal
    document.getElementById('editMealModal').classList.add('active');
    renderSelectedFoods();
    searchFoodsForMeal('');
}

function closeEditMealModal() {
    document.getElementById('editMealModal').classList.remove('active');
    currentEditingMeal = null;
    selectedFoods = [];
}

// Ricerca alimenti per pasto
function searchFoodsForMeal(searchTerm) {
    const results = searchFoods(searchTerm);
    const resultsDiv = document.getElementById('searchResults');
    
    resultsDiv.innerHTML = results.map(food => `
        <div class="meal-item" style="padding: 0.5rem; border: 1px solid var(--border-color); margin-bottom: 0.5rem; border-radius: 0.375rem; cursor: pointer;"
             onclick="addFoodToMeal('${food.id}')">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span><strong>${food.nome}</strong> - ${food.categoriaNome}</span>
                <button class="btn btn-small btn-primary">+ Aggiungi</button>
            </div>
            <div style="font-size: 0.813rem; color: var(--text-secondary); margin-top: 0.25rem;">
                ${food.porzione_standard}${food.unita_misura || 'g'} • 
                ${food.calorie_per_100g || food.calorie_per_unita} kcal
            </div>
        </div>
    `).join('') || '<p style="text-align: center; color: var(--text-secondary);">Nessun alimento trovato</p>';
}

// Aggiungi alimento al pasto
function addFoodToMeal(foodId) {
    const food = getFoodById(foodId);
    if (!food) return;
    
    selectedFoods.push({
        id: foodId,
        quantity: food.porzione_standard
    });
    
    renderSelectedFoods();
}

// Renderizza alimenti selezionati
function renderSelectedFoods() {
    const listDiv = document.getElementById('selectedFoodsList');
    
    if (selectedFoods.length === 0) {
        listDiv.innerHTML = '<p style="color: var(--text-secondary);">Nessun alimento selezionato</p>';
        return;
    }
    
    listDiv.innerHTML = selectedFoods.map((item, index) => {
        const food = getFoodById(item.id);
        return `
            <div class="meal-item" style="padding: 0.5rem; border: 1px solid var(--border-color); margin-bottom: 0.5rem; border-radius: 0.375rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${food.nome}</span>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="number" value="${item.quantity}" min="1" 
                               style="width: 80px; padding: 0.25rem;"
                               onchange="updateFoodQuantity(${index}, this.value)">
                        <span>${food.unita_misura || 'g'}</span>
                        <button class="btn-icon delete" onclick="removeFoodFromMeal(${index})">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Aggiorna quantità
function updateFoodQuantity(index, quantity) {
    selectedFoods[index].quantity = parseFloat(quantity) || 0;
}

// Rimuovi alimento
function removeFoodFromMeal(index) {
    selectedFoods.splice(index, 1);
    renderSelectedFoods();
}

// Salva modifiche pasto
function saveMealChanges() {
    if (!currentEditingMeal) return;
    
    const weekKey = getWeekKey(currentWeekOffset);
    
    // Inizializza struttura se non esiste
    if (!weeklyPlanData[weekKey]) {
        weeklyPlanData[weekKey] = {};
    }
    if (!weeklyPlanData[weekKey][currentEditingMeal.dayKey]) {
        weeklyPlanData[weekKey][currentEditingMeal.dayKey] = {};
    }
    
    // Salva alimenti
    weeklyPlanData[weekKey][currentEditingMeal.dayKey][currentEditingMeal.mealType] = selectedFoods;
    
    saveWeeklyPlan();
    renderWeek();
    closeEditMealModal();
    showNotification('Pasto aggiornato con successo!');
}

// Utility functions
function getWeekStartDate(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + (offset * 7));
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
}

function getWeekKey(offset = 0) {
    const startDate = getWeekStartDate(offset);
    return `week_${startDate.getFullYear()}_${startDate.getMonth() + 1}_${startDate.getDate()}`;
}

function isDateToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Ottieni alimento per ID (compatibilità con database)
function getFoodById(foodId) {
    // Cerca in tutte le categorie
    for (const [catId, catData] of Object.entries(dietaDB.categorie)) {
        const food = catData.alimenti.find(f => f.id === foodId);
        if (food) {
            return food;
        }
    }
    return null;
}

// Funzione debounce locale se non disponibile da utils
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

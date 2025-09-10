// Logica principale dell'applicazione Dieta Pancia Piatta

// Stato globale dell'app
const appState = {
    currentDate: new Date(),
    meals: {
        breakfast: [],
        snack1: [],
        lunch: [],
        snack2: [],
        dinner: []
    },
    dailyTargets: {
        calories: 1800,
        proteins: 120,
        fats: 60,
        carbs: 180,
        fiber: 25
    }
};

// Inizializzazione app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Carica dati salvati
    loadSavedData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Aggiorna UI
    updateUI();
    
    // Registra Service Worker per PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed'));
    }
}

// Carica dati salvati da localStorage
function loadSavedData() {
    const savedMeals = localStorage.getItem('todayMeals');
    if (savedMeals) {
        const data = JSON.parse(savedMeals);
        // Verifica se i dati sono di oggi
        if (data.date === formatDate(appState.currentDate)) {
            appState.meals = data.meals;
        }
    }
    
    // Carica target personalizzati se esistono
    const savedTargets = localStorage.getItem('dailyTargets');
    if (savedTargets) {
        appState.dailyTargets = JSON.parse(savedTargets);
    }
}

// Salva dati in localStorage
function saveMealsData() {
    const dataToSave = {
        date: formatDate(appState.currentDate),
        meals: appState.meals
    };
    localStorage.setItem('todayMeals', JSON.stringify(dataToSave));
}

// Setup event listeners
function setupEventListeners() {
    // Listener per navigazione
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', handleNavigation);
    });
    
    // Listener per modal (se presente)
    if (document.getElementById('foodModal')) {
        document.getElementById('foodModal').addEventListener('click', function(e) {
            if (e.target.id === 'foodModal') {
                closeFoodModal();
            }
        });
    }
}

// Gestione navigazione
function handleNavigation(e) {
    // Per ora previene il comportamento di default
    // In futuro gestirà la navigazione SPA
    if (e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
}

// Aggiorna UI con i dati correnti
function updateUI() {
    updateDateTime();
    updateDailySummary();
    updateMealsDisplay();
    updateWeeklyStats();
}

// Aggiorna data e ora
function updateDateTime() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateEl.textContent = appState.currentDate.toLocaleDateString('it-IT', options);
    }
}

// Aggiorna riepilogo giornaliero
function updateDailySummary() {
    const totals = calculateDailyTotals();
    
    // Aggiorna calorie
    const caloriesEl = document.getElementById('todayCalories');
    if (caloriesEl) {
        caloriesEl.textContent = Math.round(totals.calories);
    }
    
    // Aggiorna proteine
    const proteinsEl = document.getElementById('todayProteins');
    if (proteinsEl) {
        proteinsEl.textContent = `${Math.round(totals.proteins)}g`;
    }
    
    // Aggiorna grassi
    const fatsEl = document.getElementById('todayFats');
    if (fatsEl) {
        fatsEl.textContent = `${Math.round(totals.fats)}g`;
    }
    
    // Aggiorna carboidrati
    const carbsEl = document.getElementById('todayCarbs');
    if (carbsEl) {
        carbsEl.textContent = `${Math.round(totals.carbs)}g`;
    }
}

// Calcola totali giornalieri
function calculateDailyTotals() {
    let totals = {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
        fiber: 0
    };
    
    // Somma i nutrienti di tutti i pasti
    Object.values(appState.meals).forEach(mealFoods => {
        mealFoods.forEach(food => {
            totals.calories += food.calories || 0;
            totals.proteins += food.proteins || 0;
            totals.fats += food.fats || 0;
            totals.carbs += food.carbs || 0;
            totals.fiber += food.fiber || 0;
        });
    });
    
    return totals;
}

// Aggiorna visualizzazione pasti
function updateMealsDisplay() {
    const mealTypes = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];
    
    mealTypes.forEach(mealType => {
        const contentEl = document.getElementById(`${mealType}Content`);
        if (contentEl) {
            const foods = appState.meals[mealType];
            
            if (foods.length === 0) {
                contentEl.innerHTML = '<p class="meal-empty">Nessun pasto registrato</p>';
            } else {
                contentEl.innerHTML = foods.map(food => `
                    <div class="meal-item">
                        <span>${food.name} (${food.portion}${food.unit})</span>
                        <span class="meal-calories">${Math.round(food.calories)} kcal</span>
                    </div>
                `).join('');
            }
        }
    });
}

// Aggiorna statistiche settimanali
function updateWeeklyStats() {
    // Per ora usa dati demo
    // In futuro calcolerà dalle statistiche reali salvate
}

// Aggiungi pasto
function addMeal(mealType) {
    // Per ora mostra alert
    // In futuro aprirà modal selezione cibo
    const mealNames = {
        breakfast: 'colazione',
        snack1: 'spuntino mattina',
        lunch: 'pranzo',
        snack2: 'spuntino pomeriggio',
        dinner: 'cena'
    };
    
    console.log(`Aggiungi ${mealNames[mealType]}`);
    
    // Placeholder per test
    showFoodSelectionModal(mealType);
}

// Mostra modal selezione cibo (placeholder)
function showFoodSelectionModal(mealType) {
    alert(`Seleziona alimenti per ${mealType}.\nQuesta funzionalità sarà disponibile a breve!`);
}

// Funzioni utility
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--secondary-color)' : 'var(--danger-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.375rem;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Esporta funzioni per uso globale
window.addMeal = addMeal;
window.showNotification = showNotification;

// Funzioni di utilità per l'app Dieta Pancia Piatta

// === Calcoli Nutrizionali ===

// Calcola valori nutrizionali per una porzione specifica
function calculateNutritionForPortion(food, portion) {
    const multiplier = portion / 100;
    
    // Se l'alimento ha valori per unità invece che per 100g
    if (food.calorie_per_unita) {
        const units = portion / (food.porzione_standard || 1);
        return {
            calories: (food.calorie_per_unita || 0) * units,
            proteins: (food.proteine_per_unita || 0) * units,
            fats: (food.grassi_per_unita || 0) * units,
            carbs: (food.carboidrati_per_unita || 0) * units,
            fiber: (food.fibre_per_unita || 0) * units
        };
    }
    
    // Calcolo standard per 100g
    return {
        calories: (food.calorie_per_100g || 0) * multiplier,
        proteins: (food.proteine_per_100g || 0) * multiplier,
        fats: (food.grassi_per_100g || 0) * multiplier,
        carbs: (food.carboidrati_per_100g || 0) * multiplier,
        fiber: (food.fibre_per_100g || 0) * multiplier,
        sugars: (food.zuccheri_per_100g || 0) * multiplier,
        sodium: (food.sodio_per_100g || 0) * multiplier
    };
}

// Calcola le calorie dai macronutrienti
function calculateCaloriesFromMacros(proteins, fats, carbs) {
    return (proteins * 4) + (fats * 9) + (carbs * 4);
}

// Verifica coerenza tra calorie dichiarate e calcolate
function validateMacroCalories(calories, proteins, fats, carbs, tolerance = 5) {
    const calculatedCalories = calculateCaloriesFromMacros(proteins, fats, carbs);
    const difference = Math.abs(calculatedCalories - calories);
    const percentDifference = (difference / calories) * 100;
    
    return {
        isValid: percentDifference <= tolerance,
        calculatedCalories,
        difference,
        percentDifference
    };
}

// Calcola percentuali di macronutrienti
function calculateMacroPercentages(calories, proteins, fats, carbs) {
    if (calories === 0) return { proteins: 0, fats: 0, carbs: 0 };
    
    return {
        proteins: ((proteins * 4) / calories * 100).toFixed(1),
        fats: ((fats * 9) / calories * 100).toFixed(1),
        carbs: ((carbs * 4) / calories * 100).toFixed(1)
    };
}

// === Gestione Pasti ===

// Genera ID univoco per pasto
function generateMealId() {
    return `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Ottieni nome italiano del pasto
function getMealNameInItalian(mealType) {
    const mealNames = {
        breakfast: 'Colazione',
        snack1: 'Spuntino Mattina',
        lunch: 'Pranzo',
        snack2: 'Spuntino Pomeriggio',
        dinner: 'Cena'
    };
    return mealNames[mealType] || mealType;
}

// === Ricerca e Filtri ===

// Cerca alimenti nel database
function searchFoods(searchTerm, category = null) {
    const results = [];
    const term = searchTerm.toLowerCase();
    
    Object.entries(dietaDB.categorie).forEach(([catId, catData]) => {
        if (category && catId !== category) return;
        
        catData.alimenti.forEach(food => {
            if (food.nome.toLowerCase().includes(term) || 
                food.id.toLowerCase().includes(term)) {
                results.push({
                    ...food,
                    categoriaId: catId,
                    categoriaNome: catData.nome
                });
            }
        });
    });
    
    return results;
}

// Ottieni alimento per ID
function getFoodById(foodId) {
    for (const [catId, catData] of Object.entries(dietaDB.categorie)) {
        const food = catData.alimenti.find(f => f.id === foodId);
        if (food) {
            return {
                ...food,
                categoriaId: catId,
                categoriaNome: catData.nome
            };
        }
    }
    return null;
}

// === Formattazione e Display ===

// Formatta numero con decimali
function formatNumber(num, decimals = 1) {
    return Number(num).toFixed(decimals);
}

// Formatta data in italiano
function formatDateItalian(date) {
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    return date.toLocaleDateString('it-IT', options);
}

// Formatta orario
function formatTime(date) {
    return date.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// === Storage e Persistenza ===

// Salva dati con timestamp
function saveToStorage(key, data) {
    const dataWithTimestamp = {
        data: data,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
}

// Carica dati con verifica timestamp
function loadFromStorage(key, maxAgeHours = 24) {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    try {
        const parsed = JSON.parse(stored);
        const storedTime = new Date(parsed.timestamp);
        const now = new Date();
        const hoursDiff = (now - storedTime) / (1000 * 60 * 60);
        
        if (hoursDiff <= maxAgeHours) {
            return parsed.data;
        }
    } catch (e) {
        console.error('Error loading from storage:', e);
    }
    
    return null;
}

// === Validazione ===

// Valida input numerico
function validateNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

// Valida dati alimento
function validateFoodData(foodData) {
    const errors = [];
    
    if (!foodData.nome || foodData.nome.trim() === '') {
        errors.push('Nome alimento obbligatorio');
    }
    
    if (!foodData.categoria) {
        errors.push('Categoria obbligatoria');
    }
    
    if (!validateNumber(foodData.porzione_standard, 0.1)) {
        errors.push('Porzione standard non valida');
    }
    
    if (!validateNumber(foodData.calorie_per_100g, 0)) {
        errors.push('Calorie non valide');
    }
    
    // Verifica coerenza macro
    const macroCheck = validateMacroCalories(
        foodData.calorie_per_100g,
        foodData.proteine_per_100g || 0,
        foodData.grassi_per_100g || 0,
        foodData.carboidrati_per_100g || 0
    );
    
    if (!macroCheck.isValid) {
        errors.push(`Calorie e macronutrienti non coerenti (differenza: ${macroCheck.percentDifference.toFixed(1)}%)`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

// === Export/Import ===

// Esporta database in JSON
function exportDatabase() {
    const dataStr = JSON.stringify(dietaDB, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportName = `dieta_database_${formatDate(new Date())}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
}

// Importa database da file
function importDatabase(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const imported = JSON.parse(e.target.result);
                // Valida struttura base
                if (imported.categorie && imported.metadata) {
                    resolve(imported);
                } else {
                    reject(new Error('Formato file non valido'));
                }
            } catch (err) {
                reject(new Error('Errore parsing JSON: ' + err.message));
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Errore lettura file'));
        };
        
        reader.readAsText(file);
    });
}

// === Statistiche ===

// Calcola statistiche periodo
function calculatePeriodStats(meals, startDate, endDate) {
    const stats = {
        totalDays: 0,
        averageCalories: 0,
        averageProteins: 0,
        averageFats: 0,
        averageCarbs: 0,
        adherenceDays: 0,
        totalMeals: 0
    };
    
    // Implementazione calcoli statistiche
    // ...
    
    return stats;
}

// === Utility Generiche ===

// Deep clone oggetto
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Debounce function
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

// Formatta date per input
function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

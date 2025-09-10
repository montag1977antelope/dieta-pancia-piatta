// /js/utils.js — funzioni condivise (globali)
function debounce(fn, wait=300){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }
function todayISO(d=new Date()){ const tz=d.getTimezoneOffset(); return new Date(d - tz*60000).toISOString().slice(0,10); }

// Accesso DB (usiamo ciò che espone database.js)
function getDB(){
  if (typeof loadDatabase === 'function') return loadDatabase();
  if (typeof dietaDB !== 'undefined') return dietaDB;
  console.error('DB non caricato'); return { categorie:{} };
}

// Cerca alimento per id in tutte le categorie
function getFoodById(foodId){
  const db = getDB();
  for (const [catId, catData] of Object.entries(db.categorie||{})) {
    const f = (catData.alimenti||[]).find(x => x.id === foodId);
    if (f) return { ...f, categoriaId: catId, categoriaNome: catData.nome };
  }
  return null;
}

// Ricerca alimenti per testo (opz. per categoria)
function searchFoods(term='', category=null){
  const db = getDB(); const t = String(term).toLowerCase();
  const res = [];
  for (const [catId, cat] of Object.entries(db.categorie||{})){
    if (category && catId !== category) continue;
    for (const f of (cat.alimenti||[])){
      if (!t || f.nome.toLowerCase().includes(t) || f.id.toLowerCase().includes(t)){
        res.push({ ...f, categoriaId: catId, categoriaNome: cat.nome });
      }
    }
  }
  return res;
}

// Calcolo nutrienti per porzione (supporta per-100g, per-100ml, per-unità/fetta)
function calculateNutritionForPortion(food, portion){
  // per-unità
  if (food.calorie_per_unita || food.calorie_per_fetta){
    const perUnit = (food.porzione_standard || 1);
    const units = portion / perUnit;
    const pick = (g,u,f)=> g ?? u ?? f ?? 0;
    return {
      calories: pick(food.calorie_per_unita, food.calorie_per_fetta)*units,
      proteins: pick(food.proteine_per_unita, food.proteine_per_fetta)*units,
      fats:     pick(food.grassi_per_unita,   food.grassi_per_fetta)*units,
      carbs:    pick(food.carboidrati_per_unita, food.carboidrati_per_fetta)*units,
      fiber:    pick(food.fibre_per_unita, food.fibra_per_unita),
      sugars:   pick(food.zuccheri_per_unita, 0)
    };
  }

  // per-100 (g/ml)
  const isMl = food.unita_misura && String(food.unita_misura).toLowerCase().includes('ml');
  const mult = portion / 100;
  const kcalKey = isMl ? 'calorie_per_100ml' : 'calorie_per_100g';
  const protKey = isMl ? 'proteine_per_100ml' : 'proteine_per_100g';
  const fatKey  = isMl ? 'grassi_per_100ml'   : 'grassi_per_100g';
  const carbKey = isMl ? 'carboidrati_per_100ml' : 'carboidrati_per_100g';
  const fibKey  = isMl ? 'fibre_per_100ml'    : 'fibre_per_100g';
  const sugKey  = isMl ? 'zuccheri_per_100ml' : 'zuccheri_per_100g';

  return {
    calories: (food[kcalKey] || 0) * mult,
    proteins: (food[protKey] || 0) * mult,
    fats:     (food[fatKey]  || 0) * mult,
    carbs:    (food[carbKey] || 0) * mult,
    fiber:    (food[fibKey]  || 0) * mult,
    sugars:   (food[sugKey]  || 0) * mult
  };
}

// Validazione coerenza macro → kcal (4/9/4)
function validateMacroCalories(kcal, p, f, c){
  const calc = (p*4) + (f*9) + (c*4);
  const diff = Math.abs(calc - (kcal||0));
  return { isValid: diff <= Math.max(30, kcal*0.05), difference: (calc-(kcal||0)), calculatedCalories: calc };
}

// Percentuali macro rispetto alle kcal totali
function calculateMacroPercentages(kcal, p, f, c){
  const calc = (p*4)+(f*9)+(c*4); const base = kcal || calc || 1;
  const pct = x => ((x/base)*100).toFixed(1);
  return { proteins: pct(p*4), fats: pct(f*9), carbs: pct(c*4) };
}

// Export in window per uso in altri script non-modulari
window.DietUtils = {
  debounce, todayISO,
  getFoodById, searchFoods,
  calculateNutritionForPortion,
  validateMacroCalories, calculateMacroPercentages
};

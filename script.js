// Состояние игры
let game = {
    points: 0,
    clickPower: 1,
    autoClicker: 0,
    gems: 0,
    upgrades: {
        clickPower: { level: 0, baseCost: 10 },
        autoClicker: { level: 0, baseCost: 50 }
    },
    boost: { active: false, multiplier: 1 }
};

// Загрузка сохранения
function loadGame() {
    const saved = localStorage.getItem('bubaDarkSave');
    if (saved) game = JSON.parse(saved);
    updateUI();
}

// Сохранение игры
function saveGame() {
    localStorage.setItem('bubaDarkSave', JSON.stringify(game));
}

// Клик по БУБЕ
document.getElementById('click-btn').addEventListener('click', () => {
    game.points += game.clickPower * game.boost.multiplier;
    updateUI();
    
    // Простая анимация
    const btn = document.getElementById('click-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = 'scale(1)', 100);
});

// Автокликер
setInterval(() => {
    game.points += game.autoClicker * game.boost.multiplier;
    updateUI();
}, 1000);

// Покупка улучшения
function buyUpgrade(type) {
    const upgrade = game.upgrades[type];
    const cost = upgrade.baseCost * (upgrade.level + 1);
    
    if (game.points >= cost) {
        game.points -= cost;
        upgrade.level++;
        
        if (type === 'clickPower') game.clickPower += 1;
        if (type === 'autoClicker') game.autoClicker += 1;
        
        updateUI();
        saveGame();
    }
}

// Буст ×2
document.getElementById('x2-booster').addEventListener('click', () => {
    if (game.points >= 100 && !game.boost.active) {
        game.points -= 100;
        game.boost.active = true;
        game.boost.multiplier = 2;
        
        const booster = document.getElementById('x2-booster');
        booster.style.opacity = '0.6';
        booster.style.pointerEvents = 'none';
        
        setTimeout(() => {
            game.boost.active = false;
            game.boost.multiplier = 1;
            booster.style.opacity = '1';
            booster.style.pointerEvents = 'auto';
        }, 10000);
        
        updateUI();
    }
});

// Престиж
function prestige() {
    if (game.points >= 10000) {
        game.gems += Math.floor(game.points / 10000);
        game.points = 0;
        game.clickPower = 1;
        game.autoClicker = 0;
        game.upgrades.clickPower.level = 0;
        game.upgrades.autoClicker.level = 0;
        
        updateUI();
        saveGame();
    }
}

// Обновление интерфейса
function updateUI() {
    document.getElementById('points').textContent = Math.floor(game.points);
    document.getElementById('gems').textContent = game.gems;
    
    // Улучшения
    document.getElementById('clickPower-value').textContent = game.clickPower;
    document.getElementById('clickPower-level').textContent = game.upgrades.clickPower.level;
    document.getElementById('clickPower-cost').textContent = game.upgrades.clickPower.baseCost * (game.upgrades.clickPower.level + 1);
    
    document.getElementById('autoClicker-value').textContent = game.autoClicker;
    document.getElementById('autoClicker-level').textContent = game.upgrades.autoClicker.level;
    document.getElementById('autoClicker-cost').textContent = game.upgrades.autoClicker.baseCost * (game.upgrades.autoClicker.level + 1);
}

// Запуск игры
window.onload = loadGame;
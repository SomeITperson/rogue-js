// Получение поля
var field = document.getElementById('field');

// Инициализация параметров поля изменяемыми значениями
var fieldConfig = {
    fieldHeight: Math.floor(field.clientHeight / 50),
    fieldWidth: Math.floor(field.clientWidth / 50),
    mapParam: [],
    minRoomSize: 3,
    maxRoomSize: 8,
    minNumRooms: 5,
    maxNumRooms: 10,
    minNumPass: 3,
    maxNumPass: 5,
    maxSwords: 2,
    maxEnemies: 4,
    maxPotions: 3,
    fps: 60,
}

// Конфигурация предметов
var items = {
    swords: {
        power: 30,
        position: Array.from({ length: fieldConfig.maxSwords }).map(()=>[]),
        // position: [[], []],
        createPositions: () => {  
            function makePos(index) {
                items.swords.position[index] = [getRandInt(0, 11), getRandInt(0, 19)];
            }
            for(var j = 0; j < fieldConfig.maxSwords; j++) {
                while(!isClearAround(items.swords.position[j][1], items.swords.position[j][0], 1)){
                    makePos(j);
                }
            }
        },
    },
    potion: {
        health: 30,
        positions: Array.from({ length: fieldConfig.maxPotions }).map(() => []),
        createPositions: () => {
            function makePos(index) {
                items.potion.positions[index] = [getRandInt(0, 11), getRandInt(0, 19)];
            }
            for(var l = 0; l < fieldConfig.maxPotions; l++) {
                while(!isClearAround(items.potion.positions[l][1], items.potion.positions[l][0], 1)) {
                    makePos(l);
                }
            }
        }
    }
}

// Конфигурация противников
var enemiesConf = {
    health: 100,
    damage: 20,
    speed: 5,
    moves: {
        ways: ["top", "right", "bottom", "left"],
        move: () => {
            enemiesConf.positions.forEach((value) => {
                var wayIndex = getRandInt(0, enemiesConf.moves.ways.length - 1);
                try {
                    switch(enemiesConf.moves.ways[wayIndex]) {
                        case "top":
                            if(fieldConfig.mapParam[value[0] + 1][value[1]] !== 1 && value[0] -1 > -1) { value[0] -= 1};
                            break;
                        case "right":
                            if(fieldConfig.mapParam[value[0]][value[1] + 1] !== 1 && value[1] + 1 < fieldConfig.fieldWidth) { value[1] += 1};
                            break;
                        case "bottom":
                            if(fieldConfig.mapParam[value[0] + 1][value[1]] !== 1 && value[0] + 1 < fieldConfig.fieldHeight) { value[0] += 1};
                            break;
                        case "left":
                            if(fieldConfig.mapParam[value[0]][value[1] - 1] !== 1 && value[1] -1 > -1) { value[1] -= 1};
                            break;
                    }
                } catch {
                    return false;
                }
            })
        }
    },
    positions: Array.from({ length: fieldConfig.maxEnemies }).map(() => []),
    createPositions: () => {
        function makePos(index) {
            enemiesConf.positions[index] = [getRandInt(0, 11), getRandInt(0, 19)];
        }
        for(var l = 0; l < fieldConfig.maxEnemies; l++) {
            while(!isClearAround(enemiesConf.positions[l][1], enemiesConf.positions[l][0], 1)) {
                makePos(l);
            }
            enemiesConf.positions[l][2] = enemiesConf.health;
        }
    }
}

// Конфигурация героя
var heroConfig = {
    health: 100,
    damage: 70,
    side: "right",
    position: [],
    isAttack: false,
    createPosition: () => {
        function makePos() {
            heroConfig.position = [getRandInt(0, 19), getRandInt(0, 11)];
        }
        while(!isClearAround(heroConfig.position[0], heroConfig.position[1], 1)) {
            makePos();
        }
    },
}

// Проверка клеток вокруг на отсутствие препятствий для спавна
var isClearAround = (x, y, target, positions=[]) => {
    try {
        if((fieldConfig.mapParam[y + 1][x] != target
            || fieldConfig.mapParam[y - 1][x] != target
            || fieldConfig.mapParam[y][x + 1] != target
            || fieldConfig.mapParam[y][x - 1] != target)
            && fieldConfig.mapParam[y][x] != target
        ) {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    } 
}

// Получить случайное число в диапозоне
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Заполнить поле 0
var fillFieldByZero = () => {
    for(let num = 0; num < fieldConfig.fieldHeight; num++) {
        fieldConfig.mapParam[num] = new Array(fieldConfig.fieldWidth).fill(0);
    }
}

// Создать комнаты
var createRooms = () => {
    const numRooms = getRandInt(fieldConfig.minNumRooms, fieldConfig.minNumRooms);
    for (let i = 0; i < numRooms; i++) {
        const roomWidth = getRandInt(fieldConfig.minRoomSize, fieldConfig.maxRoomSize);
        const roomHeight = getRandInt(fieldConfig.minRoomSize, fieldConfig.maxRoomSize);
        const roomX = getRandInt(0, fieldConfig.fieldWidth - roomWidth);
        const roomY = getRandInt(0, fieldConfig.fieldHeight - roomHeight);
        for (let y = roomY; y < roomY + roomHeight; y++) {
            for (let x = roomX; x < roomX + roomWidth; x++) {
                fieldConfig.mapParam[y][x] = 1;
            }
        }
    }
}

// Расположение зелий
var placePotions = () => {
    for(var i = 0; i < items.potion.positions.length; i++) {
        fieldConfig.mapParam[items.potion.positions[i][0]][items.potion.positions[i][1]] = 3;
    }
}

// Расположение противников
var placeEnemies = () => {
    for(var i = 0; i < enemiesConf.positions.length; i++) {
        try {
            fieldConfig.mapParam[enemiesConf.positions[i][0]][enemiesConf.positions[i][1]] = 4;
        } catch {}
    }
}

// Расположение мечей
var placeSwords = () => {
    for(var i = 0; i < items.swords.position.length; i++) {
        fieldConfig.mapParam[items.swords.position[i][0]][items.swords.position[i][1]] = 2;
    }
}

// Атака героя
var attackHero = () => {
    heroConfig.isAttack = true;
    setTimeout(() => heroConfig.isAttack = false, 300);
    var isAtack = checkIsHeroCanMove(heroConfig.position[0], heroConfig.position[1], "attack");
    if(isAtack[0]) {
        enemiesConf.health -= heroConfig.damage;
        enemiesConf.positions.forEach((value, index) => {
            if(isAtack[1] === "top") {
                if(heroConfig.position[1] === value[0] + 1 && heroConfig.position[0] === value[1]) { value[2] -= heroConfig.damage };
            } else if(isAtack[1] === "bottom") {
                if(heroConfig.position[1] === value[0] - 1 && heroConfig.position[0] === value[1]) { value[2] -= heroConfig.damage };
            } else if(isAtack[1] === "right") {
                if(heroConfig.position[0] === value[1] - 1 && heroConfig.position[1] === value[0]) { value[2] -= heroConfig.damage };
            } else if(isAtack[1] === "left") {
                if(heroConfig.position[0] === value[1] + 1 && heroConfig.position[1] === value[0]) { value[2] -= heroConfig.damage };
            }
            if(value[2] <= 0) {
                fieldConfig.mapParam[value[0]][value[1]] = 0;
                enemiesConf.positions = enemiesConf.positions.filter(x => x !== value);
            }
        })
    }
}

// Атака противника
var enemyAttack = () => {
    // try {
        if(fieldConfig.mapParam[heroConfig.position[1] + 1][heroConfig.position[0]] === 4
            || fieldConfig.mapParam[heroConfig.position[1] - 1][heroConfig.position[0]] === 4
            || fieldConfig.mapParam[heroConfig.position[1]][heroConfig.position[0] + 1] === 4
            || fieldConfig.mapParam[heroConfig.position[1]][heroConfig.position[0] - 1] === 4) 
        {
                heroConfig.health -= enemiesConf.damage;
        }
    // } catch {}
}


// Зарисовать одну ячейку
var drawOneCell = (x, y, n, k, tile) => {
    tile.classList.add('tile');
    tile.style.top = k * 50 + "px";
    tile.style.left = n * 50 + "px";
    if(x === n && y === k) {
        if(heroConfig.isAttack) {
            let attack = document.createElement('img');
            attack.src = "images/attack-sword-new.png";
            attack.classList.add('attack__img');
            tile.appendChild(attack);
        }
        tile.classList.add('tileP');
        heroConfig.side === "right" ? tile.style.transform = "scale(1, 1)" : tile.style.transform = "scale(-1, 1)";
        let hpTile = document.createElement('div');
        hpTile.classList.add("health");
        hpTile.style.width = heroConfig.health + "%";
        tile.appendChild(hpTile);
    } else if(fieldConfig.mapParam[k][n] === 4) {
        tile.classList.add('tileE');
        let hpTile = document.createElement('div');
        hpTile.classList.add("health");
        enemiesConf.positions.forEach((value)=>{
            if(value[0] === k && value[1] == n) { hpTile.style.width = value[2] + "%"};
        })
        tile.appendChild(hpTile);
    } else if(fieldConfig.mapParam[k][n] === 3) {
        tile.classList.add('tileHP');
    } else {
        fieldConfig.mapParam[k][n] === 1 ? tile.classList.add('tileW') : (fieldConfig.mapParam[k][n] === 2 ? tile.classList.add('tileSW') : tile.classList.add('tile'));
    }
}

// Нарисовать поле
var drawField = () => {
    field.innerHTML = '';
    for(let k = 0; k < fieldConfig.mapParam.length; k++) {
        for(let n = 0; n < fieldConfig.mapParam[k].length; n++) {
            let tile = document.createElement('div');
            drawOneCell(heroConfig.position[0], heroConfig.position[1], n, k, tile);
            field.appendChild(tile);
        }
    }
}

// Создать проходы
var createPass = () => {
    const doorsCount = getRandInt(fieldConfig.minNumPass, fieldConfig.maxNumPass);
    const directions = ['horizontal', 'vertical'];
    for (let i = 0; i < doorsCount; i++) {
        const direction = directions[getRandInt(0, 1)];
        var x, y;
        if (direction === 'horizontal') {
            y = getRandInt(1, fieldConfig.fieldHeight - 2);
            for (x = 0; x < fieldConfig.fieldWidth; x++) {
                fieldConfig.mapParam[y][x] = 0;
            }
        } else {
            x = getRandInt(1, fieldConfig.fieldWidth - 2);
            for (y = 0; y < fieldConfig.fieldHeight; y++) {
                fieldConfig.mapParam[y][x] = 0;
            }
        }
    }
}

// Проверка, может ли герой двигаться в нужную сторону
var checkIsHeroCanMove = (posX, posY, side) => {
    if(side === "right" || side === "left") {
        switch(side) {
            case "right":
                heroConfig.side = "right";
                break;
            case "left":
                heroConfig.side = "left";
                break;
        }
    }
    switch(side) {
        case "right":
            return (fieldConfig.mapParam[posY][posX + 1] !== 1 && fieldConfig.mapParam[posY][posX + 1] !== 4) && (posX + 1 < fieldConfig.fieldWidth) ? true : false;
        case "left":
            return (fieldConfig.mapParam[posY][posX - 1] !== 1 && fieldConfig.mapParam[posY][posX - 1] !== 4) && (posX > 0) ? true : false;
        case "top":
            return (fieldConfig.mapParam[posY - 1][posX] !== 1 && fieldConfig.mapParam[posY - 1][posX] !== 4) && (posY > 0) ? true : false;
        case "bottom":
            return (fieldConfig.mapParam[posY + 1][posX] !== 1 && fieldConfig.mapParam[posY + 1][posX] !== 4) && (posY + 1 < fieldConfig.fieldHeight) ? true : false;
        case "attack":
            if(fieldConfig.mapParam[posY + 1][posX] !== undefined && fieldConfig.mapParam[posY + 1][posX] === 4){ return [true, "bottom"]}
            else if(fieldConfig.mapParam[posY - 1][posX] !== undefined && fieldConfig.mapParam[posY - 1][posX] === 4) {return [true, "top"]}
            else if(fieldConfig.mapParam[posY][posX + 1] !== undefined && fieldConfig.mapParam[posY][posX + 1] === 4) {return [true, "right"]}
            else if(fieldConfig.mapParam[posY][posX - 1] !== undefined && fieldConfig.mapParam[posY][posX - 1] === 4) {return [true, "left"]}
            else {return false};
    }
}

// Вывести sidebar
var drawSidebar = () => {
    document.getElementById('hp').innerHTML = heroConfig.health;
    document.getElementById('damage').innerHTML = heroConfig.damage;
}

// Действия при попадании на блок с зельем/мечом
var checkCurrentPosition = () => {
    switch(fieldConfig.mapParam[heroConfig.position[1]][heroConfig.position[0]]) {
        case 2:
            heroConfig.damage = heroConfig.damage + items.swords.power;
            fieldConfig.mapParam[heroConfig.position[1]][heroConfig.position[0]] = 0;
            drawSidebar();
            break;
        case 3:
            heroConfig.health = heroConfig.health + items.potion.health;
            fieldConfig.mapParam[heroConfig.position[1]][heroConfig.position[0]] = 0;
            drawSidebar();
            break;
    }
}

// Слушатель нажатий
window.addEventListener("keypress", (e) => {
    switch(e.key) {
        case "w":
        case "ц":
            enemiesConf.moves.move();
            checkIsHeroCanMove(heroConfig.position[0], heroConfig.position[1], "top") ? heroConfig.position[1] -= 1 : heroConfig.position[1];
            break;
        case "s":
        case "ы":
            checkIsHeroCanMove(heroConfig.position[0], heroConfig.position[1], "bottom") ? heroConfig.position[1] += 1 : heroConfig.position[1];
            break;
        case "d":
        case "в":
            checkIsHeroCanMove(heroConfig.position[0], heroConfig.position[1], "right") ? heroConfig.position[0] += 1 : heroConfig.position[0];
            break;
        case "a":
        case "ф":
            checkIsHeroCanMove(heroConfig.position[0], heroConfig.position[1], "left") ? heroConfig.position[0] -= 1 : heroConfig.position[0];
            break;
        case " ":
            attackHero();
    }
    checkCurrentPosition();
    drawSidebar();
})


fillFieldByZero();
createRooms();
createPass();
// Создать координаты герою
heroConfig.createPosition();
// Создать координаты для мечей
items.swords.createPositions();
// Создать координаты для противников
enemiesConf.createPositions();
// Создать координаты зелий
items.potion.createPositions();
placeSwords();
placeEnemies();
placePotions();
drawSidebar();
// Отрисовка карты
var collectAll = () => {
    fieldConfig.mapParam.forEach((value, index) => {
        value.forEach((e, i) => {
            if(fieldConfig.mapParam[index][i] === 4) {
                fieldConfig.mapParam[index][i] = 0;
            }
        })
    })
    placeEnemies();
    drawField();
}

var moveEnemy = () => {
    enemyAttack();
    enemiesConf.moves.move();
}
setInterval(() => moveEnemy(), 1000);
setInterval(()=> collectAll(), 1000 / fieldConfig.fps);
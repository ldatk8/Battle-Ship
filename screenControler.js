import { p } from "./player.js";
import { logicControl } from "./gameLogicControl.js";

let ships = {
    '1': {
        src: "./assert/image/ship1.png",
        size: 6,
    },
    '2': {
        src: "./assert/image/ship2.png",
        size: 5,
    },
    '3': {
        src: "./assert/image/ship3.png",
        size: 4,
    },
    '4': {
        src: "./assert/image/ship4.png",
        size: 3,
    },
    '5': {
        src: "./assert/image/ship5.png",
        size: 2,
    }
}

const screenControler = (() => {
    let board = document.querySelectorAll('.grid');
    let sz = 13;

    function drawBoard(b) {
        b.innerHTML = '';
        for (let i = 1; i <= sz; i++) {
            for (let j = 1; j <= sz; j++) {
                let div = document.createElement('div');
                div.className = 'cell';
                div.style["grid-area"] = `${i}/${j}/${i + 1}/${j + 1}`;
                b.appendChild(div);
            }
        }
        b.addEventListener('click', logicControl.fire);
    }

    // make sure two player also have the save ship
    let shipsContainer = document.querySelectorAll('.ships');
    function addShip(type) {
        type = String(type);
        shipsContainer.forEach(s => {
            let div = document.createElement('div');
            div.className = 'ship';
            div.innerHTML = `<img src="${ships[type].src}" id=${crypto.randomUUID().split('-').join('')} alt="${type}">`;
            s.appendChild(div);
        })
    }
    function drawInitShip() {
        shipsContainer.forEach(s => s.innerHTML = '');
        // for (let type of Object.keys(ships)) addShip(type);
        addShip('5'); // simple for test 
        // addShip('4');
    }
    const dirX = [-1, 0, 1, 0]; // URDL
    const dirY = [0, 1, 0, -1];
    function drawShipsToBoard(shipInfo, pos, type, board) {
        // ! NOTE: some ship display wrong, but I will igrone, and fix it later
        drawBoard(board);
        // shipInfo is input of createRandomPosition in board
        // shipInfo [[len], 'id'], [2, 'afsa32'], [4, 'sdf12'], [1, 'asf]]] 
        // pos contain object like {x, y, dir}
        // type: just for get ship src

        for (let i = 0; i < shipInfo.length; i++) {
            let img = document.createElement('img');
            // img.id = shipInfo[i].id; donot need it
            img.alt = type[i];
            img.src = ships[type[i]].src;
            let x = pos[i].i, y = pos[i].j, dir = pos[i].dir

            if (dir % 2 == 1) {
                img.src = img.src.substr(0, img.src.length - 4) + "_ngang.png";
                console.log(img.src);
            }

            if (dir == 0)  // grid line is 1 base-indexed
                img.style["grid-area"] = `${x + 2 - shipInfo[i].len}/${y + 1}/${x + 2}/${y + 2}`;
            else if (dir == 1)
                img.style["grid-area"] = `${x + 1}/${y + 1}/${x + 2}/${y + 1 + shipInfo[i].len}`;
            else if (dir == 2) 
                img.style["grid-area"] = `${x + 1}/${y + 1}/${x + 1 + shipInfo[i].len}/${y + 2}`;
            else if (dir == 3)
                img.style["grid-area"] = `${x + 1}/${y + 2 - shipInfo[i].len}/${x + 2}/${y + 2}`;

            board.appendChild(img);
        }
    }

    function drawPlayerCard(player) {
        player.dom.player_card.querySelector('.name').textContent = player.name;
        player.dom.player_card.querySelector('.win').textContent = player.win;
        player.dom.player_card.querySelector('img[alt="Avatar"]').src = player.avatarSrc;
    }

    function addPlayerDOMInfo() {
        p[0].dom.board = document.querySelector('.grid.my-grid');
        p[0].dom.ships = document.querySelector('.flex_box.mine .ships');
        p[0].dom.feature = document.querySelector('.flex_box.mine .advanceFeature')
        p[0].dom.player_card = document.querySelector('.card.my');
        
        p[1].dom.board = document.querySelector('.grid.opponment-grid');
        p[1].dom.ships = document.querySelector('.flex_box.opponment .ships');
        p[1].dom.feature = document.querySelector('.flex_box.opponment .advanceFeature')
        p[1].dom.player_card = document.querySelector('.card.opponment');
    }
    
    let shipsUse = document.querySelector('.shipsUse');
    function addShipToPopup(src) {
        let div = document.createElement('div');
        div.className = 'shipWithRM';
        div.innerHTML = `
            <svg width="15" viewbox="0 0 50 50">
                <circle cx="25" cy="25" r="20" stroke="gray" stroke-width="4" fill="transparent"></circle>
                <line x1="10" y1="10" x2="40" y2="40" stroke-width="3" stroke="gray"></line>
                <line x1="10" y1="40" x2="40" y2="10" stroke-width="3" stroke="gray"></line>
            </svg>
            <img src="${src}">`
        div.querySelector('svg').addEventListener('click', (e) => {
            console.log(e.target);
            removeShip(e.target.closest('.shipWithRM'));
        });
        shipsUse.appendChild(div);
    }
    function chooseShip(img) {
        console.log(img.alt)
        addShip(img.alt);
        addShipToPopup(img.src);
    }
    function removeShip(shipWithRM) {
        let index = (Array.from(shipWithRM.parentElement.children)).findIndex(x => x ==shipWithRM);
        console.log({index});
        document.querySelectorAll(`.ships img:nth-child(${index + 1})`).forEach(e => {
            console.log(e);
            e.parentElement.remove();
        })
        shipWithRM.remove();
    }
    function fetchShipToPopup() {
        let shipUse = shipsUse;
        shipUse.innerHTML = '';
        let allExitShips = document.querySelector('.ships');
        for (let s of allExitShips.children) {
            let img = s.querySelector('img');
            addShipToPopup(img.src, img.id);
        }
    }
    function init() {
        board.forEach(b => {
            drawBoard(b);
        })
        drawInitShip();
        addPlayerDOMInfo();
        drawPlayerCard(p[0]);
        drawPlayerCard(p[1]);
        fetchShipToPopup();

        // hidden some button until it need
        document.querySelectorAll('.random, .addShip, .advanceFeature')
            .forEach(element => element.style.display = 'none')
        document.querySelectorAll('.grid').forEach(e => e.classList.add('disable-click'));
    }

    init();
    return { drawBoard, drawInitShip, drawShipsToBoard, drawPlayerCard, chooseShip};
})();

const eventHandle = (() => {
    document.querySelector('.mine button.random').addEventListener('click', (e) => {
        logicControl.randomShuffe(p[0]);
    });
    document.querySelector('.mine .advanceFeature .plane').addEventListener('click', (e) => {
        logicControl.usePlane(0);
    });
    
    document.querySelector('.opponment button.random').addEventListener('click', (e) => {
        logicControl.randomShuffe(p[1]);
    });
    document.querySelector('.opponment .advanceFeature .plane').addEventListener('click', (e) => {
        logicControl.usePlane(1);
    });

    document.querySelector('.control button.play').addEventListener('click', logicControl.clickPlay);

    let overlay = document.querySelector('.overlay');
    window.onclick = () => {
        overlay.style.display = 'none';
    }
    document.querySelector('.flex_box .addShip').onclick = (e) => {
        overlay.style.display = 'flex';
        e.stopPropagation();
    }
    overlay.querySelector('.content').addEventListener('click', (e) => {
        e.stopPropagation();
    })
    overlay.querySelectorAll('.shipAvailable img')
        .forEach(e => {
            e.addEventListener('click', () => {screenControler.chooseShip(e)})
        });
    return {};
})();

export {screenControler, eventHandle, ships};
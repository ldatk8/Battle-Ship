import { p } from "./player.js";
import { screenControler, ships } from "./screenControler.js";

const logicControl = (() => {
    let state = 0;
    /*
        state = 0: game not started yet
              = 1: Played 1 have put ship into board
              = 2: Played 2 have put ship into board
              = 3: They are playing game -> do nothing
              = 4: Game is finish
    */
    function clickPlay() {
        if (state == 0) {
            document.querySelector('.mine .random').style.display = 'inline-block';
            document.querySelector('.mine .addShip').style.display = 'inline-block';
        } else if (state == 1) {
            document.querySelector('.mine .random').style.display = 'none';
            document.querySelector('.mine .addShip').style.display = 'none';
            document.querySelector('.flex_box.opponment .random').style.display = 'inline-block';
            p[0].dom.board.querySelectorAll('.cell').forEach(c => {
                c.classList.add('relative');
            });
        } else if (state == 2) {
            document.querySelector('.flex_box.opponment .random').style.display = 'none';
            document.querySelectorAll('.advanceFeature').forEach(adv => {
                adv.style.display = 'flex';
            });
            document.querySelector('.flex_box.opponment .random').style.display = 'none';
            p[1].dom.board.querySelectorAll('.cell').forEach(c => {
                c.classList.add('relative');
            });
            // we don't need this button in this time, just hide it for more space to make notification
            document.querySelector('.control .play').style.display = 'none';
            p[1].dom.board.classList.remove('disable-click');
            state = 3;
        } else if (state == 3) {
            
        }
    }
    let turn = 0, r = (turn) => (turn + 1) % 2;
    let out = document.querySelector('.control output.mess');
    function resetShip(player) {
        Array.from(player.dom.ships.querySelectorAll('img')).forEach(s => {
            s.classList.remove('destroyed');
        })
    }
    function winProcess() {
        console.log(`Winner is ${p[turn].name}`);
        out.textContent = `Winner is: \n ${p[turn].name}`
        p[turn].win++;
        resetShip(p[0]); resetShip(p[1]);
        screenControler.drawPlayerCard(p[turn]);
        state = 0;
        setTimeout(() => {
            out.textContent = '';
            document.querySelector('.control .play').style.display = 'inline-block';
        }, 3000);
    }
    function changeTurn() {
        p[turn].dom.board.classList.remove('disable-click');
        turn = r(turn);
        p[turn].dom.board.classList.add('disable-click');
    }
    function process_cell(cell) {
        if (state != 3) return;
        let [i, j] = cell.style["grid-area"].split('/').map(pos => Number(pos) - 1);
        try {
            // Step 2: Fire
            let id = p[r(turn)].board.fire(i, j);
            cell.classList.add('hidden');
            if (id != null) {
                cell.classList.add('fire');
                if (p[r(turn)].board.allPartDestroyed(id)) {
                    document.getElementById(id).classList.add('destroyed');
                }
                if (p[r(turn)].board.isLose()) {
                    winProcess();
                }
            }
            // Step 3:
            return true;
        } catch (err) {
            console.log(i, j, turn, err);
            return false;
        }
    }
    function fire(b) {
        // Step 1: get position of this cell
        let cell = b.target;
        if (!cell.classList.contains('cell')) return;
        if (process_cell(cell))
            changeTurn();
    }
    function usePlane(player) {
        let canFire = player.board.notFirePosition();
        let index = new Set();
        while (index.size < 5 || index.size < canFire.length) {
            index.add(Math.floor(Math.random() * 100000 % canFire.length));
        }
        console.log(canFire, index);
        console.log(index.length, canFire.length)
        for (let cur of index) {
            let i = canFire[cur].i, j = canFire[cur].j; 
            let cell = player.dom.board.
            querySelector(`.cell[style="grid-area: ${i + 1}/${j + 1}/${i + 2}/${j + 2}"]`);
            // style="grid-area: 1 / 12 / 2 / 13;"
            process_cell(cell);
        }
        changeTurn();
    }
    function randomShuffe(player) {
        let shipInfo = [], type = [];
        for (let s of player.dom.ships.children) {
            let img = s.querySelector('img');
            shipInfo.push({id: img.id, len: ships[img.alt].size});
            type.push(img.alt); // to get ship src img later
        };

        try {
            let pos = player.board.createRandomPosition(shipInfo);
            screenControler.drawShipsToBoard(shipInfo, pos, type, player.dom.board);

            if (player == p[0]) state = 1;
            else if (player == p[1]) state = 2;
        } catch(err) {
            console.log(err);
        }
    }

    return {fire, randomShuffe, clickPlay, usePlane};
})();

export {logicControl};


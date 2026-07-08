function Board() {
    // note that all is 0-indexed
    let board, sz = 0;
    let shipInBoard = {};
    function Ship(size) {
        let remain = size;
        return {size, remain};
    }
    function init(n) {
        sz = n;
        board = [];
        for (let i = 1; i <= n; i++) {
            let arr = [];
            for (let j = 1; j <= n; j++) {
                arr.push('.');
            }
            board.push(arr);
        }
        shipInBoard = {};
    }
    function ok(x, y) {
        return (0 <= x && x < sz) && (0 <= y && y < sz);
    }
    const dirX = [-1, 0, 1, 0]; // URDL
    const dirY = [0, 1, 0, -1];
    function put(x, y, dir, size, id) {
        /*
            return -1 mean something is invail
        */
        if (!ok(x, y)) return -1;
        if (Object.hasOwnProperty(id)) throw Error("Have same ID");
        for (let i = 0; i < size; i++) {
            if (!ok(x + i*dirX[dir], y + i*dirY[dir]) || board[x + i*dirX[dir]][y + i*dirY[dir]] != '') return -1;
        }
        for (let i = 0; i < size; i++) {
            board[x + i*dirX[dir]][y + i*dirY[dir]] = id;
        }

        shipInBoard[id] = Ship(size);
        return 1;
    }
    function fire(x, y) {
        if (!ok(x, y)) throw Error("invail position");
        let idReturn = null;
        if (board[x][y] == 'x') {
            return "Repeat fire";
        } else if (board[x][y] != '.') {
            shipInBoard[board[x][y]].remain--;
            idReturn = board[x][y];
        }
        board[x][y] = 'x';
        return idReturn;
    }
    function isLose() {
        for (let id of Object.keys(shipInBoard))
            if (shipInBoard[id].remain != 0) return false;
        return true;
    }
    function allPartDestroyed(id) {
        return shipInBoard[id].remain == 0;
    }
    function printBoard(printFiredOnly = false) {
        for (let row of board) {
            let tmp = [...row];
            if (printFiredOnly) {
                for (let i = 0; i < tmp.length; i++) 
                    if (tmp[i] != 'x') tmp[i] = '.';
            }
            console.log(tmp.join(' '));
        }
    }

    return {init, put, fire, isLose, allPartDestroyed, printBoard};
};

class Player {
    win = 0;
    constructor(name, avatarSrc) {
        this.name = name;
        this.id = crypto.randomUUID();        
        this.avatarSrc = avatarSrc;
        this.board = Board();
    }
};

const playInConsole = (() => {
    let players = [new Player("Dat"), new Player("Lang")];    
    function play(n) {
        players.forEach(p => p.board.init(n));

        for (let turn = 0;; turn = (turn == 0 ? 1 : 0)) {
            const curBoard = players[(turn == 0 ? 1 : 0)].board;
            console.log(`This is turn of player ${players[turn].name}`);

            while (turn != -1) {
                console.log("This is board of your opponent")
                curBoard.printBoard(true);
                let [x, y] = prompt('Please input position:').split(' ').map(num => Number(num));
                let res = curBoard.fire(x, y);
                console.log(res);
                if (res == "Repeat fire") {
                    console.log("You have enter repeat position");
                } else {
                    if (res != null && curBoard.allPartDestroyed(res)) {
                        console.log(`You destroyed ship of size ${curBoard.shipInBoard[res].size}.`)
                        if (curBoard.isLose()) {
                            console.log(`Congratulation! player ${players[turn].name} win this game`);
                            players[turn].win++;
                            turn = -1;
                            break;
                        }
                        console.log("You have another fire");
                        continue;
                    }
                    break;
                }
            }
        }

        console.log(players);
    }

    return {play};
})();

playInConsole.play(5);
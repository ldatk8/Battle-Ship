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
        if (shipInBoard.hasOwnProperty(id)) throw Error("Have same ID");
        for (let i = 0; i < size; i++) {
            if (!ok(x + i*dirX[dir], y + i*dirY[dir]) || board[x + i*dirX[dir]][y + i*dirY[dir]] != '.') return -1;
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
            throw Error("Repeat fire");
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

    function notFirePosition() {
        let arr = [];
        for (let i = 0; i < sz; i++) {
            for (let j = 0; j < sz; j++) {
                if (board[i][j] != 'x') arr.push({i, j});
            }
        }
        return arr;
    }
    function allVaildPosition(len, blacklist) {
        // performance of this function is so bad
        let valid = [];
        for (let i = 0; i < sz; i++) {
            for (let j = 0; j < sz; j++) {
                for (let dir = 0; dir < 3; dir++) {
                    let pass = true;
                    for (let k = 0; k < len; k++) {
                        if (!ok(i + k*dirX[dir], j + k*dirY[dir]) ||
                            board[i + k*dirX[dir]][j + k*dirY[dir]] != '.') pass = false;
                    }
                    if (pass && !blacklist[i][j].includes(dir)) {
                        valid.push({i, j, dir});
                    }
                }
            }
        }
        return valid;
    }
    function createRandomPosition(ships) {
        if (sz == 0) throw Error("Board have not been init");
        init(sz);
        // ships = [[len], 'id'], [2, 'afsa32'], [4, 'sdf12'], [1, 'asf]]] 
        let pos = []; // contain object like {x, y, dir}, 
        let blacklists = Array(sz).fill(Array(sz).fill(Array(sz).fill([])));
        // blacklists will 3D array
        // it will help ful for backup (delete in board) if some ship later cannot put anywhere
        // Để hạn chế phải xếp lại, thì mình sắp xếp thứ tự từ to nhất đến nhỏ nhất
        ships.sort((a, b) => b.len - a.len);
        function removeShip(ship) { // to easy maintain
            // blacklists[ship].push(pos[ship]);
            blacklists[ship][pos[ship].x][pos[ship].y].push(pos[ship].dir);
            for (let k = 0; k < len; k++) {
                board[pos[ship].x + k*dirX[dir]][pos[ship].y + k*dirY[dir]] = '.';
            }
            delete shipInBoard[ships[ship].id];
        }
        for (let ship = 0; ship < ships.length; ship++) {
            // Step1: list all vaild choice to place, include x, y and direction
            let vaild = allVaildPosition(ships[ship].len, blacklists[ship]);

            if (vaild.length == 0) {
                if (ship == 0) {
                    throw Error("The input ships cannot fit in the board, please try to change ship size");
                } 
                removeShip(ship - 1);
                ship -= 2;
            } else {
                // Step2: just random some choice
                let index = Math.floor(Math.random()*1000);
                pos[ship] = vaild[index % vaild.length];
                put(pos[ship].i, pos[ship].j, pos[ship].dir, ships[ship].len, ships[ship].id);
            }
        }
        return pos;
    }


    return {init, put, fire, isLose, allPartDestroyed, printBoard, createRandomPosition, notFirePosition};
};

export {Board};


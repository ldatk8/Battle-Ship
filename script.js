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
                arr.push('');
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
        let idReturn = '';
        if (board[x][y] == 'x') {
            return "Repeat fire";
        } else if (board[x][y] != '') {
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
    function printBoard() {
        for (let row of board) {
            console.log(row);
        }
    }

    return {init, put, fire, isLose, allPartDestroyed, printBoard};
};

import { Board } from "./board.js";

class Player {
    win = 0;
    constructor(name, avatarSrc) {
        this.name = name;
        this.id = crypto.randomUUID();        
        this.avatarSrc = avatarSrc;
        this.board = Board();
        this.win = 0;
        this.planeUse = 0;
    }
    // This for easy maintain DOM
    dom = {};
    addDom(board, ships, feature) {
        dom = {board, ships};
    }
};

let p = [new Player("Lang Dat", "./assert/image/avt.jpg"),
         new Player("Computer", "./assert/image/avt2.jpg")
];

p.forEach(x => x.board.init(13));

export {Player, p};
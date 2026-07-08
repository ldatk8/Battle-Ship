import { Board } from "./board.js";

class Player {
    win = 0;
    constructor(name, avatarSrc) {
        this.name = name;
        this.id = crypto.randomUUID();        
        this.avatarSrc = avatarSrc;
        this.board = Board();
    }
};


export {Player};
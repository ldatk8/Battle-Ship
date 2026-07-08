import { Board } from "./board.js";
import { Player } from "./player.js";

const playInConsole = (() => {
    let players = [new Player("Dat"), new Player("Lang")];    
    function play(n) {
        let ships = [{len: 4, id: '1'},
                     {len: 3, id: '2'},
                     {len: 2, id: '5'},
                     {len: 1, id: '6'},
                     {len: 3, id: '3'},
                     {len: 1, id: '7'},
                     {len: 2, id: '4'},
        ];

        players.forEach(p => {
            p.board.init(n)
            p.board.createRandomPosition(ships);
            p.board.printBoard();
        });

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

export {playInConsole};
# Battle-Ship
This file contain how I do in this project

Rule:
    Two player place their ship in n*n board. Then in turn gusse where is the oponment'ship'postion to destroy
    One win when he find all ship of oponment
Core feature:
    Play with human and play with computer
    Computer have intelligent strategy
    We can drag and drop ship in to board
    Change the number of ship when begin
    Have a special fire can detroy 9 cell in once (init have one, when consecusive detroy 3 ship will recive another)

Build process
    Make run in console first
        Some Object we need
            Board:
                board: 2-D array contain status of board
                    'num': contain number of board (like 1, 2, 3)
                    'x': This cell have been destroy
                    '' (empty): this is just empty cell and hasn't destroy
                fire(x, y): Attack in cell (x, y) and reported status
                    'destroyed': Attack in destroyed cell (request for new fire)
                    'num': id of ship in this cell
                    'empty': fire on empty cell
                checkExit(id) -> true if ship have not been destroy all part
                isLose() -> true if all ship is destroyed
                put(x, y, dir, size) -> put ship in the board

            Player:
                contain board object
                play method

    

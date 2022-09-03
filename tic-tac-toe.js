

const gameBoard = (() => {
    const boardArray = new Array(3);

    const newBoard = () => {
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = new Array(3).fill('');
        }
    }

    const isThreeVerticalX = () => {
        for (let i = 0; i < 3; i++) {
            if (('x' === boardArray[0][i]) && ('x' === boardArray[1][i]) && ('x' === boardArray[2][i])) return true;
        }
        return false;
    }

    const isThreeVerticalO = () => {
        for (let i = 0; i < 3; i++) {
            if (('o' === boardArray[0][i]) && ('o' === boardArray[1][i]) && ('o' === boardArray[2][i])) return true;
        }
        return false;
    }

    const isThreeHorizontalX = () => {
        for (let i = 0; i < 3; i++) {
            if (('x' === boardArray[i][0]) && ('x' === boardArray[i][1]) && ('x' === boardArray[i][2])) return true;
        }
        return false;
    }

    const isThreeHorizontalO = () => {
        for (let i = 0; i < 3; i++) {
            if (('o' === boardArray[i][0]) && ('o' === boardArray[i][1]) && ('o' === boardArray[i][2])) return true;
        }
        return false;
    }

    const isThreeDiagonalX = () => {
        if (('x' === boardArray[0][0]) && ('x' === boardArray[1][1]) && ('x' === boardArray[2][2])) return true;
        if (('x' === boardArray[0][2]) && ('x' === boardArray[1][1]) && ('x' === boardArray[2][0])) return true;

        return false;
    }

    const isThreeDiagonalO = () => {
        if (('o' === boardArray[0][0]) && ('o' === boardArray[1][1]) && ('o' === boardArray[2][2])) return true;
        if (('o' === boardArray[0][2]) && ('o' === boardArray[1][1]) && ('o' === boardArray[2][0])) return true;

        return false;
    }

    const isBoardFull = () =>  {
        for (let i = 0; i < boardArray.length; ++i) {
            if (boardArray[i].includes('')) return false;
        }
        return true;
    }

    const isGameOver = () => {
        return isThreeVerticalX() || isThreeVerticalO() ||
        isThreeHorizontalX() || isThreeHorizontalO() ||
        isThreeDiagonalX() || isThreeDiagonalO() || isBoardFull();
    }

    const displayBoard = () =>  {
        let board = document.querySelector('#board');
        let rows = board.querySelectorAll('tr');
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rows[i].children[j].textContent = boardArray[i][j];
            }
         }
    }

    const getBoardArray = () => boardArray;

    const setBoardArray = (row, column, char) => {
        boardArray[row][column] = char;
    }

    return {
        newBoard, isBoardFull, isGameOver,
        displayBoard, getBoardArray, setBoardArray,
        isThreeHorizontalX, isThreeHorizontalO, isThreeVerticalX,
        isThreeVerticalO, isThreeDiagonalX, isThreeDiagonalO
     };
  })();

  const playerFactory = (char) => {

    let name;

    const getName = () => name;

    const setName = input => {
        name = input;
    }

    const getChar = () => char;

    return { getName, setName, getChar};
  };

  const ai = (char) => {

    const {getName, getChar, setName} = playerFactory(char);
    setName('computer');

    const evaluate = () => {
        if ((gameBoard.isThreeHorizontalX() || gameBoard.isThreeVerticalX() || gameBoard.isThreeDiagonalX())) {
            if (char === 'x') {
                return 10;
            } else {
                return -10;
            }
        }

        if ((gameBoard.isThreeHorizontalO() || gameBoard.isThreeVerticalO() || gameBoard.isThreeDiagonalO())) {
            if (char === 'o') {
                return 10;
            } else {
                return -10;
            }
        }

        return 0;
        
    }

    const minimax = (isMax, opponentChar) => {
        let score = evaluate();

        if (score == 10) return score;

        if (score == -10) return score;

        if (gameBoard.isGameOver()) return score;

        let best;

        if (isMax) {
            best = -100;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {

                    if (gameBoard.getBoardArray()[i][j]=='') {

                        gameBoard.setBoardArray(i, j, char);
                        best = Math.max(best, minimax(!isMax, opponentChar));
                        gameBoard.setBoardArray(i, j, '');
                    }
                }
            }
        } else {
            best = 100;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {

                    if (gameBoard.getBoardArray()[i][j]=='') {

                        gameBoard.setBoardArray(i, j, opponentChar);
                        best = Math.min(best, minimax(!isMax, opponentChar));
                        gameBoard.setBoardArray(i, j, '');
                    }
                }
            }
        }
        return best;
    }

    // adapted from geeksforgeeks: https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
    const makeMove = (opponentChar) => {

        let bestVal = -1000;
        let bestRow = -1;
        let bestCol = -1;
    
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                
                if (gameBoard.getBoardArray()[i][j] == '') {
                    
                    gameBoard.setBoardArray(i, j, char);
                    let moveVal = minimax(false, opponentChar);
                    gameBoard.setBoardArray(i, j, '');
                    if (moveVal > bestVal) {
                        bestRow = i;
                        bestCol = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        gameBoard.setBoardArray(bestRow, bestCol, char);
    }

    return { getName, getChar, makeMove};
  };


  const gameFlow = (() => {

    let xTurn = true;
    let computer = false;

    let x;
    let o;

    const cells = document.querySelectorAll('td');
    const gameStatus = document.querySelector('p');
    const gameFormatContainer = document.getElementsByClassName('container')[0];
    const computerFirstBtn = document.getElementById('computerFirst');
    const computerSecondBtn = document.getElementById('computerSecond');
    const twoHumansBtn = document.getElementById('twoHumans');
    const nameBox = document.querySelector('input');
    const submitBtn = document.getElementById('submit');
    const againBtn = document.getElementById('again');


    const playGame = () => {
        xTurn = true;
        if (x.getName() === 'computer') {
            x.makeMove();
            xTurn = false;
        }
        gameStatus.textContent = displayTurn();
        gameBoard.displayBoard();
        cells.forEach((cell) => {
            cell.addEventListener('click', handleMove);
        });
    }

    const handleMove = e => {
        e.target.removeEventListener('click', handleMove);
        if (xTurn === true) {
            gameBoard.setBoardArray(e.target.parentNode.rowIndex, e.target.cellIndex, x.getChar())
        } else {
            gameBoard.setBoardArray(e.target.parentNode.rowIndex, e.target.cellIndex, o.getChar())
        }

        if (gameBoard.isGameOver()){
            gameBoard.displayBoard();
            handleEndGame(false);
        } else {
            if (computer) {
                if (xTurn) {
                    o.makeMove(x.getChar());
                } else {
                    x.makeMove(o.getChar());
                }
                gameBoard.displayBoard();
                if (gameBoard.isGameOver()){
                    handleEndGame(true);
                } else {
                    gameStatus.textContent = displayTurn();
                }
            } else {
                xTurn = !xTurn;
                gameStatus.textContent = displayTurn();
            }
        }
    }

    const setUpGame = () => {
        gameBoard.newBoard();
        computerFirstBtn.addEventListener('click', setGameFormat);
        computerSecondBtn.addEventListener('click', setGameFormat);
        twoHumansBtn.addEventListener('click', setGameFormat);
    }

    const setGameFormat = event => {
        gameFormatContainer.classList.toggle('not-active');

        nameBox.classList.toggle('not-active');
        submitBtn.classList.toggle('not-active');
        gameStatus.classList.toggle('not-active');

        const formatChoice = event.target.id;
        if (formatChoice === 'computerSecond') {
            computer = true;
            gameStatus.textContent = "x's player's name:";
            x = playerFactory('x');
            o = ai('o');
            submitBtn.addEventListener('click', buttonXName);
            nameBox.addEventListener('keydown', enterXName);
        } else if (formatChoice === 'computerFirst') {
            computer = true;
            gameStatus.textContent = "o's player's name:";
            x = ai('x');
            o = playerFactory('o');
            submitBtn.addEventListener('click', buttonOName);
            nameBox.addEventListener('keydown', enterOName);
        } else if (formatChoice === 'twoHumans') {
            x = playerFactory('x');
            o = playerFactory('o');
            gameStatus.textContent = "x's player's name:";
            submitBtn.addEventListener('click', buttonXName);
            nameBox.addEventListener('keydown', enterXName);
        }
    }

    const buttonXName = event => {
        let input = document.querySelector('input').value;

        if (input.length < 1) {
            gameStatus.textContent = 'Username must contain at least 1 character';

        } else {
            x.setName(input);
            submitBtn.removeEventListener('click', buttonXName);
            nameBox.removeEventListener('keydown', enterXName);
            document.querySelector('input').value = "";
            if (!computer) {
                gameStatus.textContent = "o's player's name:";
                submitBtn.addEventListener('click', buttonOName);
                nameBox.addEventListener('keydown', enterOName);
            } else {
                submitBtn.classList.toggle('not-active');
                nameBox.classList.toggle('not-active');
                playGame();
            }
        }
    }


    const enterXName = event => {

        if (event.key == "Enter") {
            let input = document.querySelector('input').value;

            if (input.length < 1) {
                gameStatus.textContent = 'Username must contain at least 1 character';
    
            } else {
                x.setName(input);
                submitBtn.removeEventListener('click', buttonXName);
                nameBox.removeEventListener('keydown', enterXName);
                document.querySelector('input').value = "";

                if (!computer) {
                    gameStatus.textContent = "o's player's name:";
                    submitBtn.addEventListener('click', buttonOName);
                    nameBox.addEventListener('keydown', enterOName);
                } else {
                    submitBtn.classList.toggle('not-active');
                    nameBox.classList.toggle('not-active');
                    playGame();
                }
            }
        }
    }

    const buttonOName = () => {
        let input = document.querySelector('input').value;

        if (input.length < 1) {
            gameStatus.textContent = 'Username must contain at least 1 character';

        } else {
            o.setName(input);
            document.querySelector('input').value = "";
            gameStatus.textContent = displayTurn();
            submitBtn.removeEventListener('click', buttonOName);
            nameBox.removeEventListener('keydown', enterOName);
            submitBtn.classList.toggle('not-active');
            nameBox.classList.toggle('not-active');
            playGame();
        }
    }

    const enterOName = event => {
        let input = document.querySelector('input').value;

        if (event.key == "Enter") {
            if (input.length < 1) {
                gameStatus.textContent = 'Username must contain at least 1 character';

            } else {
                o.setName(input);
                document.querySelector('input').value = "";
                gameStatus.textContent = displayTurn();
                submitBtn.removeEventListener('click', buttonOName);
                nameBox.removeEventListener('keydown', enterOName);
                nameBox.classList.toggle('not-active');
                submitBtn.classList.toggle('not-active');
                playGame();
            }
        }
    }

    const playAgain = event => {
        againBtn.classList.toggle('not-active');
        gameBoard.newBoard();
        playGame();
    }

    const handleEndGame = (computer) => {
        againBtn.classList.toggle('not-active');
        againBtn.addEventListener('click', playAgain);

        if (computer) {
            if (gameBoard.isBoardFull()) {
                gameStatus.textContent = "It's a draw.";
            } else {
                gameStatus.textContent = 'Computer wins :('
            }
        } else {
            if (xTurn && !gameBoard.isBoardFull()) {
                gameStatus.textContent = x.getName() + ' wins!'
            } else if (!xTurn && !gameBoard.isBoardFull()) {
                gameStatus.textContent = o.getName() + ' wins!'
            } else { gameStatus.textContent = "It's a draw."};
        }

        cells.forEach((cell) => {
            cell.removeEventListener('click', handleMove);
        });
    }

    const displayTurn = () => {
        if (xTurn) {
            return x.getName() + "'s turn (" + x.getChar() + ")";
        }
        else {
            return o.getName() + "'s turn (" + o.getChar() + ")";
        }
    }

    return { setUpGame };
})();


gameFlow.setUpGame();
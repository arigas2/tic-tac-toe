

const gameBoard = (() => {
    const boardArray = new Array(3);

    const newBoard = () => {
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = new Array(3).fill('');
        }
    }

    const isThreeVertical = () => {
        for (let i = 0; i < 3; i++) {
            if (('x' === boardArray[0][i]) && ('x' === boardArray[1][i]) && ('x' === boardArray[2][i])) return true;
            if (('o' === boardArray[0][i]) && ('o' === boardArray[1][i]) && ('o' === boardArray[2][i])) return true;
        }
        return false;
    }

    const isThreeHorizontal = () => {
        for (let i = 0; i < 3; i++) {
            if (('x' === boardArray[i][0]) && ('x' === boardArray[i][1]) && ('x' === boardArray[i][2])) return true;
            if (('o' === boardArray[i][0]) && ('o' === boardArray[i][1]) && ('o' === boardArray[i][2])) return true;
        }
        return false;
  }

    const isThreeDiagonal = () => {
        if (('x' === boardArray[0][0]) && ('x' === boardArray[1][1]) && ('x' === boardArray[2][2])) return true;
        if (('o' === boardArray[0][0]) && ('o' === boardArray[1][1]) && ('o' === boardArray[2][2])) return true;

        if (('x' === boardArray[0][2]) && ('x' === boardArray[1][1]) && ('x' === boardArray[2][0])) return true;
        if (('o' === boardArray[0][2]) && ('o' === boardArray[1][1]) && ('o' === boardArray[2][0])) return true;

        return false;
    }

    const isBoardFull = () =>  {
        for (let i = 0; i < boardArray.length; ++i) {
            if (boardArray[i].includes('')) return false;
        }
        return true;
    }

    const isGameOver = () => isThreeVertical() || isThreeHorizontal() || isThreeDiagonal() || isBoardFull();

    const displayBoard = () =>  {
        let board = document.querySelector('#board');
        let rows = board.querySelectorAll('tr');
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                rows[i].children[j].textContent = boardArray[i][j];
            }
         }
    }

    return { newBoard, isBoardFull, isGameOver, displayBoard, boardArray };
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

    const makeMove = () => {
        let row = Math.floor(Math.random() * 2);
        let column = Math.floor(Math.random() * 2);
        if (gameBoard.boardArray[row][column] != '') {
            makeMove();
        } else {
            gameBoard.boardArray[row][column] = char;
        }
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
            gameBoard.boardArray[e.target.parentNode.rowIndex][e.target.cellIndex] = x.getChar();
        } else {
            gameBoard.boardArray[e.target.parentNode.rowIndex][e.target.cellIndex] = o.getChar();
        }

        if (gameBoard.isGameOver()){
            handleEndGame();
        } else {
            if (computer) {
                if (xTurn) {
                    o.makeMove();
                } else {
                    x.makeMove();
                }
            } else {
                xTurn = !xTurn;
            }
            gameBoard.displayBoard();
            gameStatus.textContent = displayTurn();
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

    const handleEndGame = () => {
        // gameBoard.displayBoard();
        againBtn.classList.toggle('not-active');
        againBtn.addEventListener('click', playAgain);

        if (xTurn && !gameBoard.isBoardFull()) {
            gameStatus.textContent = x.getName() + ' wins!'
        } else if (!xTurn && !gameBoard.isBoardFull()) {
            gameStatus.textContent = o.getName() + ' wins!'
        } else { gameStatus.textContent = "it's a draw :("};

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
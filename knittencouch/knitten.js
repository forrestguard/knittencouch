document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const currentPlayerDisplay = document.getElementById('current-player');
    const turnStepDisplay = document.getElementById('turn-step');
    const colors = ['yellow', 'blue', 'red'];
    const cards = [
        { shape: 'L', color: 'red', points: 2 },
        { shape: 'L', color: 'blue', points: 2 },
        { shape: 'L', color: 'yellow', points: 2 },
        { shape: 'J', color: 'red', points: 2 },
        { shape: 'J', color: 'blue', points: 2 },
        { shape: 'J', color: 'yellow', points: 2 },
        { shape: 'O', color: 'red', points: 2 },
        { shape: 'O', color: 'blue', points: 2 },
        { shape: 'O', color: 'yellow', points: 2 },
        { shape: 'T', color: 'red', points: 2 },
        { shape: 'T', color: 'blue', points: 2 },
        { shape: 'T', color: 'yellow', points: 2 },
        { shape: 'I', color: 'red', points: 1 },
        { shape: 'I', color: 'blue', points: 1 },
        { shape: 'I', color: 'yellow', points: 1 },
        { shape: 'Dia', color: 'red', points: 2 },
        { shape: 'Dia', color: 'blue', points: 2 },
        { shape: 'Dia', color: 'yellow', points: 2 },
        { shape: 'S', color: 'red', points: 3 },
        { shape: 'S', color: 'blue', points: 3 },
        { shape: 'S', color: 'yellow', points: 3 },
        { shape: 'Z', color: 'red', points: 3 },
        { shape: 'Z', color: 'blue', points: 3 },
        { shape: 'Z', color: 'yellow', points: 3 },
        { shape: 'C', color: 'red', points: 1 },
        { shape: 'C', color: 'blue', points: 1 },
        { shape: 'C', color: 'yellow', points: 1 },
    ];
    let grid = Array(3).fill().map(() => Array(3).fill(null));
    let currentPlayer = 1;
    let currentTurnStep = 1; 
    let playerHands = { 1: [], 2: [] };
    let bag = Array(6).fill('yellow').concat(Array(6).fill('blue')).concat(Array(6).fill('red'));
    let drawnYarn = null;
    let scores = {
        1: 0, 
        2: 0  
    };
    const playedCards = document.getElementById(`player${currentPlayer}-played`);
    const messageToCardMap = cards.reduce((map, card) => {
        const message = `${card.color[0].toUpperCase()}${card.shape[0].toUpperCase()}`; 
        map[message] = { color: card.color, shape: card.shape };
        return map;
    }, {});
    
    function updateCurrentPlayerDisplay() {
        currentPlayerDisplay.textContent = `Current Player: ${currentPlayer}`;
        turnStepDisplay.textContent = getTurnStepText();
    }

    function playerHasCard(player, color, shape) {
        return playerHands[player].some(card => card.color === color && card.shape === shape);
    }    

    function getTurnStepText() {
        switch (currentTurnStep) {
            case 1: return 'Step 1: Draw a Card';
            case 2: return 'Step 2: Draw a Yarn';
            case 3: return 'Step 3: Push a Yarn';
            case 4: return 'Step 4: Check Cards';
            default: return '';
        }
    }

    function advanceTurnStep() {
        currentTurnStep++;
        if (currentTurnStep > 4) {
            currentTurnStep = 1;
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
        if (currentTurnStep === 4) {
            checkCustomPatterns();
            currentTurnStep = 1;
            currentPlayer = currentPlayer === 1 ? 2 : 1;
        }
        updateCurrentPlayerDisplay();
    }


    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                board.appendChild(cell);
            }
        }
    }

    function initializeBoard() {
        const initialColors = ['yellow', 'yellow', 'yellow', 'blue', 'blue', 'blue', 'red', 'red', 'red'];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * initialColors.length);
                const color = initialColors.splice(randomIndex, 1)[0];
                placeYarn(i, j, color);
            }
        }
    }

    function placeYarn(row, col, color) {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        const yarn = document.createElement('div');
        yarn.classList.add('yarn', color);
        cell.appendChild(yarn);
        grid[row][col] = color;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    let shuffledDeck = shuffleDeck([...cards]);

    function distributeInitialCards() {
        for (let player = 1; player <= 2; player++) {
            for (let i = 0; i < 2; i++) { 
                if (shuffledDeck.length > 0) {
                    const drawnCard = shuffledDeck.pop();
                    playerHands[player].push(drawnCard);
                    displayCardInHand(player, drawnCard);
                }
            }
        }
    }

    function drawCard() {
        if (currentTurnStep !== 1) {
            alert('It is not time to draw a card.');
            return;
        }
        if (shuffledDeck.length === 0) {
            alert('No cards left in the deck!');
            return;
        }
        const drawnCard = shuffledDeck.pop();
        playerHands[currentPlayer].push(drawnCard);
        displayCardInHand(currentPlayer, drawnCard);
        console.log(`Player ${currentPlayer} drew a card:`, drawnCard);
        advanceTurnStep();
    }

    function displayCardInHand(player, card) {
        const playerHandContainer = document.getElementById(`player${player}-hand`);
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', card.color, card.shape);
        cardDiv.textContent = `${card.shape} (${card.color})`;
        playerHandContainer.appendChild(cardDiv);
    }
    
    function updateScore(player, points) {
        if (scores[player] !== undefined) {
            scores[player] += points;
            console.log(`Oyuncu ${player}'ın yeni skoru: ${scores[player]}`);
            updateScoreDisplay(player); 
        } else {
            console.log(`Geçersiz oyuncu: ${player}`);
        }
    }
    
    function updateScoreDisplay(player) {
        const scoreElement = document.getElementById(`player${player}-score`);
        if (scoreElement) {
            scoreElement.textContent = `Player ${player} Score: ${scores[player]}`;
        }
    }
    
    

    function moveCardToPlayed(color, shape) {
        if (!playerHasCard(currentPlayer, color, shape)) {
            console.log(`Oyuncu ${currentPlayer} elinde ${color} ${shape} kartı yok!`);
            return;
        }
    
        const card = document.querySelector(`.card.${color}.${shape}`);
        if (card) {
            const playedCards = document.getElementById(`player${currentPlayer}-played`);
            playedCards.appendChild(card);
    
            playerHands[currentPlayer] = playerHands[currentPlayer].filter(
                card => !(card.color === color && card.shape === shape)
            );
    
            const cardPoints = cards.find(c => c.color === color && c.shape === shape)?.points || 0;
            updateScore(currentPlayer, cardPoints);
    
            console.log(`${color} ${shape} kartı Oyuncu ${currentPlayer}'ın oynanmış kartlarına taşındı.`);
        } else {
            console.log(`${color} ${shape} kartı bulunamadı.`);
        }
    }
    
    
    function pushYarns(row, col, color, direction) {
        if (currentTurnStep !== 3) {
            alert('It is not time to push a yarn.');
            return;
        }
        if (direction === 'down') {
            for (let i = 0; i < 2; i++) {
                grid[i][col] = grid[i + 1][col];
            }
            grid[2][col] = color;
            updateColumn(col);
        } else if (direction === 'up') {
            for (let i = 2; i > 0; i--) {
                grid[i][col] = grid[i - 1][col];
            }
            grid[0][col] = color;
            updateColumn(col);
        } else if (direction === 'right') {
            for (let j = 0; j < 2; j++) {
                grid[row][j] = grid[row][j + 1];
            }
            grid[row][2] = color;
            updateRow(row);
        } else if (direction === 'left') {
            for (let j = 2; j > 0; j--) {
                grid[row][j] = grid[row][j - 1];
            }
            grid[row][0] = color;
            updateRow(row);
        }
        checkCustomPatterns();
        advanceTurnStep();
    }

    function updateRow(row) {
        for (let j = 0; j < 3; j++) {
            updateCell(row, j);
        }
    }

    function updateColumn(col) {
        for (let i = 0; i < 3; i++) {
            updateCell(i, col);
        }
    }

    function updateCell(row, col) {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.innerHTML = '';
        if (grid[row][col] !== null) {
            const yarn = document.createElement('div');
            yarn.classList.add('yarn', grid[row][col]);
            cell.appendChild(yarn);
        }
    }

    function drawYarn() {
        if (currentTurnStep !== 2) {
            alert('It is not time to draw a yarn.');
            return;
        }
        if (bag.length === 0) {
            alert('The game is over! All yarn balls are used.');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * bag.length);
        const color = bag.splice(randomIndex, 1)[0];
        drawnYarn = color;
        displayDrawnYarn(color);
        updateYarnCountDisplay(); 
        advanceTurnStep();
        return color;
    }
    

    function displayDrawnYarn(color) {
        const container = document.getElementById('drawn-yarn-container');
        container.innerHTML = '';
        const yarn = document.createElement('div');
        yarn.classList.add('yarn', color);
        container.appendChild(yarn);
    }

    function checkCustomPatterns() {
        const patterns = [
            {
                color: 'blue',
                messages: ['BI'],
                coordinates: [
                    [[0, 0], [0, 1], [0, 2]],
                    [[1, 0], [1, 1], [1, 2]], 
                    [[2, 0], [2, 1], [2, 2]],
                    [[0, 0], [1, 0], [2, 0]],
                    [[0, 1], [1, 1], [2, 1]],
                    [[0, 2], [1, 2], [2, 2]]
                ]
            },
            {
                color: 'red',
                messages: ['RI'],
                coordinates: [
                    [[0, 0], [0, 1], [0, 2]],
                    [[1, 0], [1, 1], [1, 2]], 
                    [[2, 0], [2, 1], [2, 2]],
                    [[0, 0], [1, 0], [2, 0]],
                    [[0, 1], [1, 1], [2, 1]],
                    [[0, 2], [1, 2], [2, 2]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YI'],
                coordinates: [
                    [[0, 0], [0, 1], [0, 2]],
                    [[1, 0], [1, 1], [1, 2]], 
                    [[2, 0], [2, 1], [2, 2]],
                    [[0, 0], [1, 0], [2, 0]],
                    [[0, 1], [1, 1], [2, 1]],
                    [[0, 2], [1, 2], [2, 2]]
                ]
            },
            {
                color: 'blue',
                messages: ['BDia'],
                coordinates: [
                    [[0, 0], [1, 1], [2, 2]],
                    [[2, 0], [1, 1], [0, 2]]
                ]
            },
            {
                color: 'red',
                messages: ['RDia'],
                coordinates: [
                    [[0, 0], [1, 1], [2, 2]],
                    [[2, 0], [1, 1], [0, 2]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YDia'],
                coordinates: [
                    [[0, 0], [1, 1], [2, 2]],
                    [[2, 0], [1, 1], [0, 2]]
                ]
            },
            {
                color: 'blue',
                messages: ['BC'],
                coordinates: [
                    [[0, 0], [1, 0], [1, 1]],
                    [[1, 0], [2, 0], [2, 1]],
                    [[0, 1], [1, 1], [1, 2]],
                    [[1, 1], [2, 1], [2, 2]],
                    
                    [[0, 0], [1, 0], [0, 1]],
                    [[1, 0], [2, 0], [1, 1]],
                    [[0, 1], [1, 1], [0, 2]],
                    [[1, 1], [2, 1], [1, 2]],

                    [[0, 1], [1, 0], [1, 1]],
                    [[1, 1], [2, 0], [2, 1]],
                    [[0, 2], [1, 1], [1, 2]],
                    [[1, 2], [2, 1], [2, 2]],

                    [[0, 0], [1, 1], [0, 1]],
                    [[1, 0], [2, 1], [1, 1]],
                    [[0, 1], [1, 2], [0, 2]],
                    [[1, 1], [2, 2], [1, 2]]
                    
                ]
            },
            {
                color: 'red',
                messages: ['RC'],
                coordinates: [
                    [[0, 0], [1, 0], [1, 1]],
                    [[1, 0], [2, 0], [2, 1]],
                    [[0, 1], [1, 1], [1, 2]],
                    [[1, 1], [2, 1], [2, 2]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YC'],
                coordinates: [
                    [[0, 0], [1, 0], [1, 1]],
                    [[1, 0], [2, 0], [2, 1]],
                    [[0, 1], [1, 1], [1, 2]],
                    [[1, 1], [2, 1], [2, 2]]
                ]
            },
            {
                color: 'blue',
                messages: ['BL'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 2]], 
                    [[2, 0], [2, 1], [2, 2], [1, 2]],
                    [[0, 0], [1, 0], [2, 0], [2, 1]],
                    [[0, 1], [1, 1], [2, 1], [2, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 0]], 
                    [[1, 0], [1, 1], [1, 2], [2, 0]],
                    [[0, 2], [1, 2], [2, 2], [0, 1]],
                    [[0, 1], [1, 1], [2, 1], [0, 0]]
                ]
            },
            {
                color: 'Red',
                messages: ['RL'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 2]], 
                    [[2, 0], [2, 1], [2, 2], [1, 2]],
                    [[0, 0], [1, 0], [2, 0], [2, 1]],
                    [[0, 1], [1, 1], [2, 1], [2, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 0]], 
                    [[1, 0], [1, 1], [1, 2], [2, 0]],
                    [[0, 2], [1, 2], [2, 2], [0, 1]],
                    [[0, 1], [1, 1], [2, 1], [0, 0]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YL'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 2]], 
                    [[2, 0], [2, 1], [2, 2], [1, 2]],
                    [[0, 0], [1, 0], [2, 0], [2, 1]],
                    [[0, 1], [1, 1], [2, 1], [2, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 0]], 
                    [[1, 0], [1, 1], [1, 2], [2, 0]],
                    [[0, 2], [1, 2], [2, 2], [0, 1]],
                    [[0, 1], [1, 1], [2, 1], [0, 0]]
                ]
            },
            {
                color: 'blue',
                messages: ['BJ'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 0]], 
                    [[2, 0], [2, 1], [2, 2], [1, 0]],
                    [[0, 0], [1, 0], [2, 0], [0, 1]],
                    [[0, 1], [1, 1], [2, 1], [0, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 2]], 
                    [[1, 0], [1, 1], [1, 2], [2, 2]],
                    [[0, 2], [1, 2], [2, 2], [2, 1]],
                    [[0, 1], [1, 1], [2, 1], [2, 0]]
                ]
            },
            {
                color: 'red',
                messages: ['RJ'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 0]], 
                    [[2, 0], [2, 1], [2, 2], [1, 0]],
                    [[0, 0], [1, 0], [2, 0], [0, 1]],
                    [[0, 1], [1, 1], [2, 1], [0, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 2]], 
                    [[1, 0], [1, 1], [1, 2], [2, 2]],
                    [[0, 2], [1, 2], [2, 2], [2, 1]],
                    [[0, 1], [1, 1], [2, 1], [2, 0]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YJ'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 0]], 
                    [[2, 0], [2, 1], [2, 2], [1, 0]],
                    [[0, 0], [1, 0], [2, 0], [0, 1]],
                    [[0, 1], [1, 1], [2, 1], [0, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 2]], 
                    [[1, 0], [1, 1], [1, 2], [2, 2]],
                    [[0, 2], [1, 2], [2, 2], [2, 1]],
                    [[0, 1], [1, 1], [2, 1], [2, 0]]
                ]
            },
            {
                color: 'blue',
                messages: ['BT'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 1]], 
                    [[2, 0], [2, 1], [2, 2], [1, 1]],
                    [[0, 0], [1, 0], [2, 0], [1, 1]],
                    [[0, 1], [1, 1], [2, 1], [1, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 1]], 
                    [[1, 0], [1, 1], [1, 2], [2, 1]],
                    [[0, 2], [1, 2], [2, 2], [1, 1]],
                    [[0, 1], [1, 1], [2, 1], [1, 0]]
                ]
            },
            {
                color: 'red',
                messages: ['RT'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 1]], 
                    [[2, 0], [2, 1], [2, 2], [1, 1]],
                    [[0, 0], [1, 0], [2, 0], [1, 1]],
                    [[0, 1], [1, 1], [2, 1], [1, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 1]], 
                    [[1, 0], [1, 1], [1, 2], [2, 1]],
                    [[0, 2], [1, 2], [2, 2], [1, 1]],
                    [[0, 1], [1, 1], [2, 1], [1, 0]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YT'],
                coordinates: [
                    [[1, 0], [1, 1], [1, 2], [0, 1]], 
                    [[2, 0], [2, 1], [2, 2], [1, 1]],
                    [[0, 0], [1, 0], [2, 0], [1, 1]],
                    [[0, 1], [1, 1], [2, 1], [1, 2]],
                    [[0, 0], [0, 1], [0, 2], [1, 1]], 
                    [[1, 0], [1, 1], [1, 2], [2, 1]],
                    [[0, 2], [1, 2], [2, 2], [1, 1]],
                    [[0, 1], [1, 1], [2, 1], [1, 0]]
                ]
            },
            {
                color: 'blue',
                messages: ['BO'],
                coordinates: [
                    [[0, 0], [0, 1], [1, 0], [1, 1]], 
                    [[1, 0], [1, 1], [2, 0], [2, 1]],
                    [[0, 1], [0, 2], [1, 1], [1, 2]],
                    [[1, 1], [1, 2], [2, 1], [2, 2]]
                ]
            },
            {
                color: 'red',
                messages: ['RO'],
                coordinates: [
                    [[0, 0], [0, 1], [1, 0], [1, 1]], 
                    [[1, 0], [1, 1], [2, 0], [2, 1]],
                    [[0, 1], [0, 2], [1, 1], [1, 2]],
                    [[1, 1], [1, 2], [2, 1], [2, 2]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YO'],
                coordinates: [
                    [[0, 0], [0, 1], [1, 0], [1, 1]], 
                    [[1, 0], [1, 1], [2, 0], [2, 1]],
                    [[0, 1], [0, 2], [1, 1], [1, 2]],
                    [[1, 1], [1, 2], [2, 1], [2, 2]]
                ]
            },
            {
                color: 'blue',
                messages: ['BS'],
                coordinates: [
                    [[0, 1], [0, 2], [1, 0], [1, 1]], 
                    [[1, 1], [1, 2], [2, 0], [2, 1]],
                    [[0, 0], [1, 0], [1, 1], [2, 1]],
                    [[0, 1], [1, 1], [1, 2], [2, 2]]
                ]
            },
            {
                color: 'red',
                messages: ['RS'],
                coordinates: [
                    [[0, 1], [0, 2], [1, 0], [1, 1]], 
                    [[1, 1], [1, 2], [2, 0], [2, 1]],
                    [[0, 0], [1, 0], [1, 1], [2, 1]],
                    [[0, 1], [1, 1], [1, 2], [2, 2]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YS'],
                coordinates: [
                    [[0, 1], [0, 2], [1, 0], [1, 1]], 
                    [[1, 1], [1, 2], [2, 0], [2, 1]],
                    [[0, 0], [1, 0], [1, 1], [2, 1]],
                    [[0, 1], [1, 1], [1, 2], [2, 2]]
                ]
            },
            {
                color: 'blue',
                messages: ['BZ'],
                coordinates: [
                    [[0, 0], [0, 1], [1, 1], [1, 2]], 
                    [[1, 0], [1, 1], [2, 1], [2, 2]],
                    [[0, 1], [1, 0], [1, 1], [2, 0]],
                    [[0, 2], [1, 1], [1, 2], [2, 1]]
                ]
            },
            {
                color: 'red',
                messages: ['RZ'],
                coordinates: [
                    [[0, 0], [0, 1], [1, 1], [1, 2]], 
                    [[1, 0], [1, 1], [2, 1], [2, 2]],
                    [[0, 1], [1, 0], [1, 1], [2, 0]],
                    [[0, 2], [1, 1], [1, 2], [2, 1]]
                ]
            },
            {
                color: 'yellow',
                messages: ['YZ'],
                coordinates: [
                    [[0, 0], [0, 1], [1, 1], [1, 2]], 
                    [[1, 0], [1, 1], [2, 1], [2, 2]],
                    [[0, 1], [1, 0], [1, 1], [2, 0]],
                    [[0, 2], [1, 1], [1, 2], [2, 1]]
                ]
            },



            
        ];
    
        let matchedMessages = []; 
    
        for (const pattern of patterns) {
            for (const coordSet of pattern.coordinates) {
                if (coordSet.every(([row, col]) => grid[row][col] === pattern.color)) {
                    
                    matchedMessages = matchedMessages.concat(pattern.messages);
                }
            }
        }
        
        matchedMessages.forEach(message => {
            console.log(message);
            const card = messageToCardMap[message];
            if (card) {
                moveCardToPlayed(card.color, card.shape); 
            }
        });
    }
   
    function checkWinner() {
        if (scores[1] > scores[2]) {
            console.log("Player 1 won!");
        } else if (scores[1] < scores[2]) {
            console.log("player 2 won!");
        } else {
            console.log(" Tie!");
        }
    }
    
    function updateYarnCountDisplay() {
        const yarnCountDisplay = document.getElementById('yarn-count-display');
        yarnCountDisplay.textContent = `Kesede kalan yumak: ${bag.length}`;
    }
      
    createBoard();
    initializeBoard();
    distributeInitialCards();
    updateCurrentPlayerDisplay();

    document.querySelectorAll('.control-btn').forEach(button => {
        button.addEventListener('click', event => {
            const direction = event.target.dataset.direction;
            let row, col;
            if (direction === 'up' || direction === 'down') {
                col = parseInt(event.target.dataset.col);
                row = direction === 'up' ? 2 : 0;
            } else if (direction === 'left' || direction === 'right') {
                row = parseInt(event.target.dataset.row);
                col = direction === 'left' ? 2 : 0;
            }
            pushYarns(row, col, drawnYarn, direction);
            drawnYarn = null;
        });
    });
   
    console.log('checkCustomPatterns çağrıldı.');

    function checkGameEnd() {
        if (bag.length === 0 || (playerHands[1].length === 0 && playerHands[2].length === 0)) {
            checkWinner();
        }
    }
    
    


    document.getElementById('draw-yarn-btn').addEventListener('click', drawYarn);
    document.getElementById('draw-card-btn').addEventListener('click', drawCard);
});

let cardsDistributed = false; 

function distributeInitialCards() {
    if (cardsDistributed) return; 

    for (let player = 1; player <= 2; player++) {
        for (let i = 0; i < 2; i++) {
            if (shuffledDeck.length > 0) {
                const drawnCard = shuffledDeck.pop();
                playerHands[player].push(drawnCard);
                displayCardInHand(player, drawnCard);
            }
        }
    }

    cardsDistributed = true; 
}
// SELECTIONS
const hitButton = document.querySelector('#hit');
const standButton = document.querySelector('#stand');
const dealButton = document.querySelector('#deal');
const yourCount = document.querySelector('#your-count');
const dealerCount = document.querySelector('#dealer-count');
const yourScore = document.querySelector('#your-score');
const tieScore = document.querySelector('#tie-score');
const dealerScore = document.querySelector('#dealer-score');
const yourScreen = document.querySelector('#card-container');
const dealerScreen = document.querySelector('#dealer-card-container');
// sounds 
let hitSound = new Audio('./sounds/swish.m4a');
let winSound = new Audio('./sounds/cash.mp3');
let loseSound = new Audio('./sounds/aww.mp3');
//------------------------------------------------------------------------------------------------

// FUNCTIONS
// handles the picking of a random card
const randomCard = () => {
    let cardBank = ['./images/a.png', './images/2.png', './images/3.png', './images/4.png',
    './images/5.png', './images/6.png', './images/7.png', './images/8.png', './images/9.png',
    './images/10.png', './images/j.jpg', './images/q.jpg', './images/k.jpg'];
    let cardIndex = Math.floor(Math.random() * 13);
    return cardBank[cardIndex];
}
// returns the value of the random card picked above
const cardValue = (card) => {
    const cardsMap = {
        './images/a.png': 1,
        './images/2.png': 2,
        './images/3.png': 3,
        './images/4.png': 4,
        './images/5.png': 5,
        './images/6.png': 6,
        './images/7.png': 7,
        './images/8.png': 8,
        './images/9.png': 9,
        './images/10.png': 10,
        './images/j.jpg': 10,
        './images/q.jpg': 10,
        './images/k.jpg': 10,
    };
    return cardsMap[card];
}
// creates a new img element from a random source
const createElement = (source) => {
    let image = document.createElement('img');
    image.src = source;
    image.classList.add('cardElement');
    image.style.height = '130px';
    image.style.width = '90px';
    image.style.border = '2px solid black';
    image.style.borderRadius = '1rem';
    image.style.margin = '1.5rem';
    return image;
}
// checks if the user has gone beyond 21. also displays it to the screen
const bustCheck = (element) => {
    if (parseInt(element.innerHTML) > 21) {
        element.innerHTML = `Bust!`
        element.style.color = 'red';
    }
}
// accepts you and the dealer's count and displays the result on the screen
const decideWinner = (you, dealer, element) => {
    const win = 'rgb(20, 240, 20)';
    const lose = 'red';
    const tie = 'black';

    if (you === 'Bust!' && dealer === 'Bust!') {
        element.style.color = tie;
        return '~ Tie ~';
    } else if (you === 'Bust!' && dealer !== 'Bust!') {
        element.style.color = lose;
        return 'You Lose !';
    } else if (you !== 'Bust!' && dealer === 'Bust!') {
        element.style.color = win;
        return 'You Win !';
    } else if (Number(you) === Number(dealer)) {
        element.style.color = tie;
        return '~ Tie ~';
    } else if (Number(you) > Number(dealer)) {
        element.style.color = win;
        return 'You Win !';
    } else {
        element.style.color = lose;
        return 'You Lose !';
    }
}
// updates the scores based on wins, losses and draws(tie)
const scoreHandler = (decision, yourScoreNode, tieScoreNode, dealerScoreNode) => {
    switch (decision) {
        case ('~ Tie ~'):
            tieScoreNode.innerHTML = parseInt(tieScoreNode.innerHTML) + 1;
            console.log('draw');
            break;
        case ('You Win !'):
            winSound.play();
            yourScoreNode.innerHTML = parseInt(yourScoreNode.innerHTML) + 1;
            console.log('you win');
            break;
        case ('You Lose !'):
            loseSound.play();
            dealerScoreNode.innerHTML = parseInt(dealerScoreNode.innerHTML) + 1;
            console.log('you lose');
            break;
        default:
            break;
    }
}
//------------------------------------------------------------------------------------------------


// EVENT LISTENERS
// click listener for the Hit button
hitButton.addEventListener('click', () => {
    if (dealerScreen.children.length === 0) {
        let source = randomCard();
        let image = createElement(source);
        hitSound.play();
        yourScreen.appendChild(image);
        let score = parseInt(yourCount.innerHTML) + cardValue(source);
        if (source == './images/a.png' && score <= 11) {
            score += 10; // ace can be 1 or 11 based on the score
        }
        yourCount.innerHTML = score;
        bustCheck(yourCount);
    } // this condition is to prevent any form of bugs from the hit button
});

// click listener for the Stand button
standButton.addEventListener('click', () => {
    if (Number(dealerCount.innerHTML) === 0 && yourScreen.children.length !== 0) {
        (function dealerPlay() {
            let source = randomCard();
            let image = createElement(source);
            hitSound.play();
            dealerScreen.appendChild(image);
            score = parseInt(dealerCount.innerHTML) + cardValue(source);
            if (source == './images/a.png' && score <= 11) {
                score += 10;
            }
            dealerCount.innerHTML = score;
            bustCheck(dealerCount);
    
            if (score < 19) {
                setTimeout(dealerPlay, 500);
            } 
            else if (score >= 19) {
                // Logic of calculatin the scores of the players
                let player = yourCount.innerHTML;
                let computer = dealerCount.innerHTML;
                const field = document.querySelector('.vs');
                const decision = decideWinner(player, computer, field);
                field.innerHTML = decision;
                scoreHandler(decision, yourScore, tieScore, dealerScore);
            } 
        })();
    } // this condition is used to disable bugs from the stand button
});

// click listener for the Deal button.
dealButton.addEventListener('click', () => {
    if (yourCount.innerHTML == 'Bust!') {
        yourCount.style.color = 'orange';
    }
    if (dealerCount.innerHTML == 'Bust!') {
        dealerCount.style.color = 'orange';
    }

    // reset player and dealer count to 0
    yourCount.innerHTML = 0;
    dealerCount.innerHTML = 0;

    // delets the cards from both screens
    let cards = document.querySelectorAll('.cardElement');
    cards.forEach((item) => {
        item.remove();
    });

    // reset the decision to VS
    const versus = document.querySelector('.vs');
    versus.innerHTML = 'VS';
    versus.style.color = 'white';
});



// Async JS can also be used for simulating play by the dealer
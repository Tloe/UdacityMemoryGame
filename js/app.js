// Array holding the card stack
let cards = ["fa-diamond",
             "fa-paper-plane-o",
             "fa-anchor",
             "fa-bolt",
             "fa-cube",
             "fa-leaf",
             "fa-bicycle",
             "fa-bomb"];

cards = cards.concat(card);

// Holds the open card or null if no card is open
let openCardElement = null;
// Counter for the number of moves
let movesCount;
// Counter for the number of matches
let matchCount;
// Current number of stars
let stars;
// holds the game time. Incremented every second
let gameTime;
// array with all the card Element objects
let cardElements;
// moves Element object that show the moves count to the user
let movesElement;
// winning screen <div> Element
let winningScreenElement;
// Element holding info to the user on moves, stars and seconds of the winning game
let winratingElement;
// Elements holder the star rating icons
let starsElements;
// True when animation is running and we shouldn't handle user input
let waitForAnimation;

/**
 * Shuffle function from; http://stackoverflow.com/a/2450976
 *
 * @param {array} array Array to be shuffled
 * @returns {array} Shuffled array
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * Restarts the game
 *
 */
function restart() {
    hideWinningScreen();
    shuffle(cards);
    for(let i = 0; i < cards.length; i++) {
        cardElements[i].children[0].className = "fa " + cards[i];
        cardElements[i].className = "card";
    }
    updateGameTime(true);
    updateMoves(true);
    matchCount = 0;
    stars = 3;
    gameTime = 0;
    waitForAnimation = false;
    openCardElement = null;
}

/**
 * Sets two cards to a match state.
 *
 * @param {Element} card0 First card of the match
 * @param {Element} card1 Second card of the match
 */
function setMatch(card0, card1){
    card0.className = "card match";
    card1.className = "card match";
    openCardElement = null;
    ++matchCount;
}

/**
 * Opens a card
 *
 * @param {Element} card The card to open
 */
function openCard(card) {
    card.className = "card open show";
    openCardElement = card;
}

/**
 * Close a card
 *
 * @param {Element} card The card to close
 */
function closeCard(card){
    card.className = "card"
    if(openCardElement == card)
        openCardElement = null;
}

/**
 * Updates the move counter and information on screen. Also check to see if the star rating should be lowered
 *
 * @param {bool} true if movesCount should be reset, default false
 */
function updateMoves(reset=false) {
    if(reset)
        movesCount = 0;
    else
        ++movesCount;

    movesElement.innerHTML = movesCount + " moves";
    if(movesCount == 12)
    {
        --stars;
        starsElements[2].className = "fa fa-star-o"; 
    }
    if(movesCount == 17)
    {
        --stars;
        starsElements[1].className = "fa fa-star-o";
    }
}

/**
 * Checks for a match between two cards
 *
 * @param {Element} card0 First card
 * @param {Element} card1 Second card
 * @returns {bool} True if cards match
 */
function checkMatch(card0, card1) {
    return card0.children[0].classList.contains(card1.children[0].classList[1]);
}

/**
 * Sets cards in wrong state. Sets timeout to close cards after 0.5 seconds
 *
 * @param {Element} card0 First card
 * @param {Element} card1 Second card
 */
function setWrongGuess(card0, card1) {
    card0.className = "card wrong";
    card1.className = "card wrong";
    waitForAnimation = true;
    setTimeout(() => {
        closeCard(card0);
        closeCard(card1);
        waitForAnimation = false;
    }, 500);
}

/**
 * Updates the winning screen with current game information and shows it to the user.
 *
 */
function showWinningScreen(){
    winratingElement.innerHTML = 
        movesCount + " moves and " + stars + " stars in " + gameTime + " seconds";
    winningScreenElement.style.display = "block";
}

/**
 * Hides the winning screen
 *
 */
function hideWinningScreen(){
    winningScreenElement.style.display = "none";
}

/**
 * Logic for when a card is clicked. If there are no other cards open; open the card, otherwise check for match
 *
 * @param {Event} e click event object
 */
function cardClicked(e) {
    card = e.target;
    if(waitForAnimation || card.className != "card")
        return;

    if(openCardElement) {
        updateMoves();
        if(checkMatch(card, openCardElement))
            setMatch(card, openCardElement);
        else
            setWrongGuess(card, openCardElement);
    } else {
        openCard(card);
    }

    if(matchCount == 8)
        showWinningScreen();
}
 
/* Updates the game time and sets a timeout for the next update.
 * This will not be 100% accurate, but is good enough for this purpouse.
 *
 * @param {bool} reset reset timer if true, default: false
 */
function updateGameTime(reset=false) {
    if(matchCount == 8)
        return;

    if(reset)
        gameTime = 0;
    else
        ++gameTime;
    document.querySelector(".gameTime").innerHTML = gameTime + " seconds";
    setTimeout(updateGameTime, 1000);
}

/**
 * Initialize script called when the DOM is ready
 *
 */
document.addEventListener('DOMContentLoaded', () => {
    cardElements = document.querySelectorAll(".card");
    movesElement = document.querySelector(".moves");
    winningScreenElement = document.querySelector(".winning-screen");
    winratingElement = document.querySelector(".win-rating");
    starsElements = document.querySelectorAll(".fa-star");

    for(const card of cardElements)
        card.addEventListener('click', cardClicked)
    document.querySelector(".playagain-btn").addEventListener('click', restart);
    document.querySelector(".restart").addEventListener('click', restart);

    restart();
});

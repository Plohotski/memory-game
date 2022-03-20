const cards = document.querySelectorAll('.card');

const switchSolution = document.querySelectorAll('.switch')
const lastGamesWrapper = document.querySelector('.last-games-wrapper')
const skip = document.querySelector('.skip')
const win = document.querySelector('.win-wrapper')

const contries = ['aut', 'bel', 'bul', 'cro', 'cyp', 'cze', 'den', 'esp', 'est', 'fin', 'fra', 'ger', 'gre', 'hun', 'irl', 'ita', 'lat', 'ltu', 'lux', 'mlt', 'ned', 'pl', 'por', 'rou', 'slo', 'svk', 'swe']
const fullContriesName = {
    'aut': 'Austria', 'bel': 'Belgium', 'bul': 'Bulgaria', 'cro': 'Croatia', 'cyp': 'Cyprus', 'cze': 'Czech Republic', 'den': 'Denmark', 'esp': 'Spain', 'est': 'Estonia', 'fin': 'Finland', 'fra': ' France', 'ger': 'Germany', 'gre': 'Greece', 'hun': 'Hungary', 'irl': 'Ireland', 'ita': 'Italy', 'lat': 'Latvia', 'ltu': 'Lithuania', 'lux': 'Luxembourg', 'mlt': 'Malta', 'ned': ' Netherlands', 'pl': 'Poland', 'por': 'Portugal', 'rou': 'Romania', 'slo': 'Romania', 'svk': 'Slovakia', 'swe': 'Sweden' 
}
let saveGames = []
let counter = 0

const fullContriesNameInput = document.querySelector('.full-name-contries')

let globalLevel = 7
let globalLevelName = 'Easy'

let hasturnpedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function setLocalStorage() {
    localStorage.setItem('globalLevel', globalLevel);
    localStorage.setItem('globalLevelName', globalLevelName);
    localStorage.setItem('saveGames', saveGames);
}
window.addEventListener('beforeunload', setLocalStorage)
function getLocalStorage() {
    if (localStorage.getItem('globalLevelName')){
        const sizeName = localStorage.getItem('globalLevelName');
        globalLevelName = sizeName;
        
    }
    if (localStorage.getItem('saveGames')) {
        const games = (localStorage.getItem('saveGames')).split(',');
        saveGames = games
        addLastGame()
    }
    if (localStorage.getItem('globalLevel')) {
        const size = localStorage.getItem('globalLevel');
        globalLevel = size
        visibleCards()
    } 
}
window.addEventListener('load', getLocalStorage)


function turnCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    counter++
    this.classList.add('turn');

    if (!hasturnpedCard) {
        hasturnpedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();

}

function checkForMatch() {
    fullContriesNameInput.innerHTML = ''
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unturnCards();
}

function disableCards() {
    firstCard.removeEventListener('click', turnCard);
    secondCard.removeEventListener('click', turnCard);
    fullContriesNameInput.insertAdjacentHTML('beforeend', fullContriesName[firstCard.dataset.name]);
    checkWin();
    resetBoard();
}

function unturnCards() {
    setTimeout(() => {
        firstCard.classList.remove('turn');
        secondCard.classList.remove('turn');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    hasturnpedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

function shuffle() {
    cards.forEach(card => {
        card.style.order = Math.ceil(Math.random() * 48);
    });
};

function visibleCards() {
    hiddenActiveWindows() 
    cards.forEach(card => card.style.display = 'none');
    cards.forEach(card => card.classList.remove('turn'));
    cards.forEach(card => card.addEventListener('click', turnCard))
    fullContriesNameInput.innerHTML = ''
    shuffle()
    counter = 0
    let copyContries = Object.assign([], contries)

    for (let i = 0; i < globalLevel; i++) {
        let temp = copyContries[Math.floor(Math.random() * copyContries.length)]
        cards.forEach(card => { if (card.dataset.name === temp) card.style.display = 'block' });
        copyContries.splice(copyContries.indexOf(temp), 1)
    }

}

const levelBtns = document.querySelectorAll('.btn-level')

levelBtns.forEach(btn => btn.addEventListener('click', switchLevel))

function switchLevel() {
    globalLevel = this.dataset.level
    globalLevelName = this.innerText
    visibleCards()
    resetBoard()
}


visibleCards()

function checkWin() {
    if (globalLevel * 2 === document.querySelectorAll('.turn').length) {
        console.log('WIN')
        win.classList.add('show')
        if (saveGames.length === 20) {
            saveGames.shift()
            saveGames.shift()
        }
        saveGames.push(globalLevelName)
        saveGames.push(counter)
        score.innerHTML = ''
        score.insertAdjacentHTML('beforeend', counter);
        addLastGame()
    }
}

switchSolution.forEach(solution => solution.addEventListener('click', switchActionWin))
function switchActionWin() {
    if (this.dataset.solution === 'yes')
        visibleCards()
    hiddenActiveWindows();
}

cards.forEach(card => card.addEventListener('click', turnCard));

addLastGame()

function addLastGame() {
    let lastGames = document.querySelector('.last-games')
    lastGames.innerHTML = ''
    if (saveGames.length === 0) {
        const tt = `<span class="names">
                NO HISTORY
                </span>`
        lastGames.insertAdjacentHTML('beforeend', tt);
        return
    }

    const tt = `<div class="score-wrapper">
                <span class="level" > Level </span>
                <span class="score"> Score </span>
                </div>`
    lastGames.insertAdjacentHTML('beforeend', tt);
    for (let i = 0; i < saveGames.length; i += 2) {
        const newScore = `<div class="score-wrapper">
        <span class="level" >${saveGames[i]} </span>
        <span class="score">${saveGames[i + 1]} </span>
        </div>`
        lastGames.insertAdjacentHTML('beforeend', newScore);
    }
}

function hiddenActiveWindows() { 
    lastGamesWrapper.classList.remove('show')
    win.classList.remove('show')
}

const btnHistory = document.querySelector('.btn-history')
btnHistory.addEventListener('click', function () { win.classList.remove('show');lastGamesWrapper.classList.toggle('show') })

const btnNewGame = document.querySelector('.btn-new')
btnNewGame.addEventListener('click', visibleCards)

skip.addEventListener('click', function () { lastGamesWrapper.classList.remove('show') })
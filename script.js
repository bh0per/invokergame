let timeLeft = 10;
let combos = [
    ['Q', 'W', 'E', 'R'],      // standardowy combo Q-W-E-R
    ['Q', 'Q', '4', 'D'],      // combo Q-Q-Ward-Flash
    ['4', 'D', 'R', 'Q'],      // alternatywne rozłożenie
    ['E', 'W', 'R', '4'],      // inne combo E-W-R-4
    ['D', 'W', 'Q', 'R']       // kolejne unikalne combo
];
let correctCombo;
let userInputs = [];
let timerInterval;
let startTime;

function startTimer() {
    startTime = Date.now(); // Zapisujemy czas startu
    timerInterval = setInterval(function() {
        timeLeft = Math.max(0, 10 - Math.floor((Date.now() - startTime) / 1000)); // Czas w sekundach, nie idzie poniżej 0
        document.getElementById('time').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkCombo();
        }
    }, 1000);
}

function generateRandomCombo() {
    const randomIndex = Math.floor(Math.random() * combos.length);
    correctCombo = combos[randomIndex];  // Losujemy kombinację

    document.getElementById('combo-text').textContent = correctCombo.join(' -> '); // Wyświetlamy wybraną kombinację

    displayKeys(); // Wyświetlenie klawiszy, które mają być naciśnięte
}

function displayKeys() {
    const keyButtonsContainer = document.getElementById('key-buttons');
    keyButtonsContainer.innerHTML = '';
    const keyImages = {
        'Q': 'https://media.discordapp.net/attachments/852993484288688198/1318007112240070697/image.png?ex=6760c146&is=675f6fc6&hm=95ece208f298f4f38fe4b3d594232848e86ca39ab580b9f975e25a013b3e5e1d&=&format=webp&quality=lossless&width=70&height=71',
        'W': 'https://media.discordapp.net/attachments/852993484288688198/1318007142917341275/image.png?ex=6760c14e&is=675f6fce&hm=54564b29cf9241bfddaa629ec75754177a46c392d72827c23d9319cfe72de7de&=&format=webp&quality=lossless&width=71&height=68',
        'E': 'https://media.discordapp.net/attachments/852993484288688198/1318007177071562854/image.png?ex=6760c156&is=675f6fd6&hm=1b5f8f63df7b6bde206fc2c225186fc9b0438ea363b187600083f95a1e2aebf6&=&format=webp&quality=lossless&width=66&height=73',
        'R': 'https://media.discordapp.net/attachments/852993484288688198/1318007207773736960/image.png?ex=6760c15d&is=675f6fdd&hm=5bb66e7ee2c6e10562baac0d6ed608c9d074ea339e04c51b0e4d1a00cdf9c909&=&format=webp&quality=lossless&width=67&height=70',
        'D': 'https://media.discordapp.net/attachments/852993484288688198/1318008111981924474/qlaui8cx4gd71.png?ex=6760c235&is=675f70b5&hm=e37cd5ad882f8d108349534e111d933b35a9dcdc63dc4416dbd2f055d1f21e3d&=&format=webp&quality=lossless&width=220&height=220',
        '4': 'https://media.discordapp.net/attachments/852993484288688198/1318007666693505085/image.png?ex=6760c1cb&is=675f704b&hm=aa70e9da28190b1d9efecdea0f0cf6c5db6176461c1b1a8938ccf778b8022c66&=&format=webp&quality=lossless&width=265&height=270'
    };

    correctCombo.forEach(key => {
        let keyElement = document.createElement('div');
        keyElement.id = 'key-' + key;
        keyElement.classList.add('key-container');
        keyElement.style.backgroundImage = `url(${keyImages[key]})`;
        keyButtonsContainer.appendChild(keyElement);
    });
}

function checkCombo() {
    if (JSON.stringify(userInputs) === JSON.stringify(correctCombo)) {
        clearInterval(timerInterval); // Stop timer if user completes combo
        displayCompletionTime();
        displayCompletionMessage();
    } else {
        displayFeedback();
        resetGame();
    }
}

function handleKeyPress(event) {
    const key = event.key.toUpperCase();
    const keyElement = document.getElementById('key-' + key);

    if (correctCombo[userInputs.length] === key) {
        userInputs.push(key);
        keyElement.classList.add('correct');  // Dodanie klasy correct
        if (userInputs.length === correctCombo.length) {
            clearInterval(timerInterval); // Stop timer if user completes combo
            checkCombo();
        }
    } else {
        keyElement.classList.add('incorrect');
        displayFeedback();
        resetGame();
    }
}


function displayFeedback() {
    let feedbackElement = document.getElementById('feedback');
    feedbackElement.innerHTML = '';
    
    for (let i = 0; i < correctCombo.length; i++) {
        if (userInputs[i] === correctCombo[i]) {
            feedbackElement.innerHTML += `<span class="correct">${correctCombo[i]} </span>`;
        } else {
            feedbackElement.innerHTML += `<span class="incorrect">${userInputs[i] || '_'} </span>`;
        }
    }
}

function displayCompletionTime() {
    let endTime = Date.now();
    let elapsedTime = endTime - startTime; // Obliczamy czas miniony od startu
    let seconds = Math.floor(elapsedTime / 1000); // Liczymy sekundy
    let milliseconds = elapsedTime % 1000; // Resztkowe milisekundy
    
    document.getElementById('completion-time').textContent = `Combo completed in: ${seconds}s.${milliseconds.toString().padStart(3, '0')}ms`;
}

function displayCompletionMessage() {
    let messageElement = document.getElementById('completion-message');
    messageElement.style.display = 'block'; // Pokazuje komunikat
}

function resetGame() {
    timeLeft = 10;
    userInputs = [];
    document.getElementById('time').textContent = timeLeft;
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('completion-time').textContent = '';
    document.getElementById('completion-message').style.display = 'none'; // Ukrywa komunikat
    startTimer();

    document.querySelectorAll('.key-container').forEach(function(el) {
        el.classList.remove('correct', 'incorrect');
    });

    generateRandomCombo();
}

document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        resetGame();
    }
});

// Initialize random combo
generateRandomCombo();
startTimer();

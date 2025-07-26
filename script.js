const spaceship = document.getElementById('spaceship');
const planetContainer = document.getElementById('planet-container');
const scoreBoard = document.getElementById('score-board');
const countdown = document.getElementById('countdown');
const gameOver = document.getElementById('game-over');
const ccc1 = document.getElementById('ccc1');
const refreshButton = document.getElementById('refresh-button');
const footerText = document.getElementById('footer-text');
const finalScoreDisplay = document.getElementById('final-score');

let score = 0;
let timeLeft = 60;
let planetSpeed = 3;

// Intervals to control game flow
let countdownInterval;
let planetCreationInterval;
let speedIncreaseIntervalId; // Renamed to avoid conflict with constant

// Function to initialize and start the game logic
function startGameLogic() {
    score = 0; // Reset score
    timeLeft = 60; // Reset time
    planetSpeed = 3; // Reset speed
    scoreBoard.textContent = `Score: ${score}`;
    countdown.textContent = timeLeft;

    // Ensure game-over screen is hidden when starting a new game
    gameOver.style.display = 'none'; 
    refreshButton.style.display = 'none';
    footerText.style.display = 'none';
    
    // Add event listener for bullet firing (only when game starts)
    document.addEventListener('click', fireBullet);
    document.addEventListener('mousemove', handleSpaceshipMove); // Ensure mousemove is active

    startCountdown();
    startPlanetCreation();
    startSpeedIncrease();
}

// Geri sayım fonksiyonu
function startCountdown() {
    countdownInterval = setInterval(() => {
        timeLeft--;
        countdown.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);
}

// Oyun bitiş fonksiyonu
function endGame() {
    // Stop all active intervals
    clearInterval(countdownInterval);
    clearInterval(planetCreationInterval);
    clearInterval(speedIncreaseIntervalId);

    document.removeEventListener('click', fireBullet);
    document.removeEventListener('mousemove', handleSpaceshipMove); // Stop spaceship movement

    // Remove any remaining planets from the screen
    document.querySelectorAll('.planet').forEach(planet => {
        planet.remove();
    });

    // Show game over screen with final score
    showGameOverScreen(score);

    ccc1.style.opacity = 1; // Assuming ccc1 is part of the game-over screen animation

    // Show refresh button and footer text after a delay
    setTimeout(() => {
        refreshButton.style.display = 'block';
        footerText.style.display = 'block';
    }, 2000); // Reduced delay for better user experience
}

// Oyun bittiğinde çağrılacak fonksiyon
function showGameOverScreen(finalScore) {
    finalScoreDisplay.textContent = `Final Score: ${finalScore}`;
    gameOver.style.display = 'flex';
}

// Refresh butonu
refreshButton.addEventListener('click', () => {
    location.reload(); // Reloads the page to restart the game from the intro screen
});

// Uzay gemisini fare ile hareket ettirme
function handleSpaceshipMove(e) {
    spaceship.style.left = `${e.clientX - spaceship.offsetWidth / 2}px`;
}
// Initially, mousemove listener is not added until game starts

// Gezegen oluşturma fonksiyonu
function createPlanet() {
    const planet = document.createElement('div');
    planet.classList.add('planet');
    planet.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
    planetContainer.appendChild(planet);

    let planetFallInterval = setInterval(() => {
        const planetTop = parseInt(planet.style.top) || 0;
        planet.style.top = `${planetTop + planetSpeed}px`;

        if (planetTop > window.innerHeight) {
            planet.remove();
            clearInterval(planetFallInterval); // Fix typo: planetFallFallInterval -> planetFallInterval
        }
    }, 20);
}

// Start planet creation
function startPlanetCreation() {
    planetCreationInterval = setInterval(createPlanet, 1000);
}

// Mermi ateşleme fonksiyonu
function fireBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${spaceship.offsetLeft + spaceship.offsetWidth / 2 - 45}px`;
    bullet.style.bottom = `${spaceship.offsetHeight}px`;
    document.body.appendChild(bullet);

    const bulletInterval = setInterval(() => {
        const bulletBottom = parseInt(bullet.style.bottom);
        bullet.style.bottom = `${bulletBottom + 10}px`;

        const planets = document.querySelectorAll('.planet');
        planets.forEach(planet => {
            const planetRect = planet.getBoundingClientRect();
            const bulletRect = bullet.getBoundingClientRect();

            // Collision detection
            if (
                bulletRect.bottom >= planetRect.top &&
                bulletRect.top <= planetRect.bottom && // Added check for bullet top with planet bottom
                bulletRect.right >= planetRect.left &&
                bulletRect.left <= planetRect.right
            ) {
                const explosionNumber = Math.floor(Math.random() * 10) + 1;
                planet.style.backgroundImage = `url('explosion${explosionNumber}.png')`;
                planet.classList.add('explosion');

                setTimeout(() => planet.remove(), 500); // Remove planet after explosion animation

                score++;
                scoreBoard.textContent = `Score: ${score}`;

                bullet.remove();
                clearInterval(bulletInterval);
            }
        });

        if (bulletBottom > window.innerHeight) {
            bullet.remove();
            clearInterval(bulletInterval);
        }
    }, 20);
}

// Gezegen hızını artırma fonksiyonu
function increasePlanetSpeed() {
    planetSpeed += speedIncrement;
    console.log(`Gezegen hızı arttı: ${planetSpeed}`);
}

// Start speed increase
function startSpeedIncrease() {
    speedIncreaseIntervalId = setInterval(increasePlanetSpeed, speedIncreaseInterval);
}

// Initial state: Game logic does NOT start until `startGameLogic()` is called by `index.html`
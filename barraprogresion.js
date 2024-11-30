const audio = document.getElementById('audio');
const playButton = document.getElementById('play-button');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('current-time');
const volumeControl = document.getElementById('volume-control'); // Control de volumen

// Función para formatear el tiempo en m:s
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}


// Actualizar la barra de progreso y el tiempo actual mientras se reproduce
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime); // Mostrar el tiempo actual
});

// Hacer que la barra de progreso sea interactiva
progressBar.addEventListener('click', (event) => {
    // es un método que devuelve un objeto con el tamaño y 
    // la posición de un elemento en relación a la ventana 
    // de visualización (viewport).
    const rect = progressBar.getBoundingClientRect();
    // Esto nos da la posición del clic (clickX) en píxeles 
    // dentro de la barra de progreso.
    const clickX = event.clientX - rect.left;
    // Aquí calculamos el porcentaje de la barra en la que se hizo clic.
    const percent = clickX / rect.width;
    // Multiplicamos percent por audio.duration para obtener el tiempo 
    // exacto que queremos establecer para la reproducción del audio.
    audio.currentTime = percent * audio.duration;
});

// Reproducir o pausar el audio al hacer clic en el botón
playButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playButton.textContent = 'Pausar';
    } else {
        audio.pause();
        playButton.textContent = 'Reproducir';
    }
});

// Controlar el volumen del audio
volumeControl.addEventListener('input', (event) => {
    audio.volume = event.target.value; // Ajustar el volumen en función del valor del slider
});

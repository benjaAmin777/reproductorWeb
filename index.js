// Definimos el arreglo de donde se ubican todas mis canciones
const audioFiles = [
    'audio/tonight.mp3',
    'audio/andoSoltero.mp3'
];

// Función para obtener los metadatos de la canción que se está reproduciendo
function displayMeta(archivo, indice){
    // Vaciamos el contenido del div de metadatos y cambiamos la imagen
    document.getElementById("metadata").innerHTML = ""; // Vacía el contenido de metadatos
    document.getElementById("cover").src = "img/placeholderArt.png"; // Restablece la imagen a un placeholder


    // Obtenemos el archivo desde la URL
    fetch(archivo)
        .then(response => response.blob()) // Convertimos la respuesta a un blob
        .then(blob => {
            jsmediatags.read(blob, {
                onSuccess: function(tag) {
                    // Guardamos las tags de los metadatos
                    const metadata = tag.tags;

                    // Creamos el HTML para mostrar los metadatos
                    let metadataHtml = `<p>`;
                    let metadataHtmlImg = "";

                    // Mostramos el nombre de la canción y el álbum si existen
                    if(metadata.title) metadataHtml += `${metadata.title}`;
                    if(metadata.album){
                        metadataHtml += `<br>${metadata.album}`;
                    }else{
                        metadataHtml += `<br>unknow`;
                    }
                    metadataHtml += `</p>`;
                    
                    // Metadato de la imagen
                    if(metadata.picture){
                        const base64String = metadata.picture.data.reduce((data, byte) => {
                            return data + String.fromCharCode(byte);
                        }, '');
                        const base64Image = `data:${metadata.picture.format};base64,${window.btoa(base64String)}`;
                        metadataHtmlImg = `${base64Image}`;  // Agregamos la imagen como un <img>
                    }

                    // Añadimos los metadatos al HTML
                    document.getElementById('metadata').innerHTML = metadataHtml;
                    document.getElementById("cover").src = metadataHtmlImg;
                },
                onError: function(error) {
                    console.log('Error al leer los metadatos: ', error);
                }
            });
        });
}   

// El índice por defecto 
let currentIndex = 0;
// Guarda el elemento del reproductor de audio
const audioPlayer = document.getElementById('player');

// Función para reproducir una canción dependiendo del índice
function loadSong(index){
    audioPlayer.src = audioFiles[index];
    audioPlayer.play();
}

// Función para ir a la siguiente canción
function nextSong(){
    currentIndex++;
    if(currentIndex >= audioFiles.length){
        currentIndex = 0; // Si llegamos a la última canción entonces volvemos a la primera
    }
    loadSong(currentIndex);
    displayMeta(audioFiles[currentIndex], currentIndex);
}

// Función para retroceder de la canción
function previousSong(){
    if (currentIndex > 0) {        
        currentIndex--;  // Retrocede una canción
        loadSong(currentIndex);   
        displayMeta(audioFiles[currentIndex], currentIndex);
    }
    // Si currentIndex es 0, no pasa nada y no se ejecuta loadSong
}

// Función para ver en qué canción estamos
function isCurrentSong(index){
    // Comparar el archivo actual del reproductor con el archivo correspondiente al índice
    const currentSrc = audioPlayer.src.split('/').pop();  // Solo obtenemos el nombre del archivo
    const fileSrc = audioFiles[index].split('/').pop();   // Solo obtenemos el nombre del archivo en el índice
    return currentSrc === fileSrc;
}

// Función para ver si alguna canción ha sido cargada
function isSongLoaded(){
    // Devuelve TRUE si hay alguna canción cargada
    return audioPlayer.readyState !== 0;
}

// Función para play y pause en un solo botón
function play_pause(){
    // checamos si una canción ha sido cargada
    if(isSongLoaded()){
        
        // si sí ha sido cargada alguna canción, checamos a ver si es la primer canción
        if(isCurrentSong(0)){
            
            // si sí se trata de la primer canción entonces checamos si se está reproduciendo o si está pausada
            if(audioPlayer.paused){
                // si está pausada la reproducimos
                audioPlayer.play();
                document.getElementById("play_pause").src = "img/icons/bx-pause-circle.svg";
            }else{
                // si está reproduciendo la pausamos
                audioPlayer.pause();
                document.getElementById("play_pause").src = "img/icons/bx-play-circle.svg";  // Cambio al icono de play
            }
        }else if (audioPlayer.paused) {
            // si no se trataba de la primer canción tons solo checamos si se estaba reproduciendo o no
            audioPlayer.play(); // Si está pausado, comienza a reproducir
            document.getElementById("play_pause").src = "img/icons/bx-pause-circle.svg";
        } else {
            audioPlayer.pause(); // Si está reproduciendo, pausa la reproducción
            document.getElementById("play_pause").src = "img/icons/bx-play-circle.svg";  // Cambio al icono de play
        }
    }else{
        // sino hay una canción cargada, entonces cargamos una
        console.log("usamos esta linea");
        loadSong(currentIndex);
        displayMeta(audioFiles[currentIndex], currentIndex);
        document.getElementById("play_pause").src = "img/icons/bx-pause-circle.svg";
    }
}


// Evento que detecta cuando la canción terminó y pasa automáticamente a la siguiente
audioPlayer.addEventListener('ended', nextSong);

// funcion para poder mostrar la lista de canciones
function obtenerLista(archivo, indice) {
    fetch(archivo)
        .then(response => response.blob())
        .then(blob => {
            // Ahora llamamos a nuestra API para que lea ese blob
            jsmediatags.read(blob, {
                onSuccess: function(tag) {
                    const metadata = tag.tags;
                    const li = document.createElement('li');
                    indice = indice + 1;

                    // Crear el contenido de li y añadir cada campo uno a uno
                    const titulo = metadata.title ? `<div class="titulo">${metadata.title}</div>` : '<div class="titulo">_</div>';
                    const artista = metadata.artist ? `<div class="artista">Artist: ${metadata.artist}</div>` : '<div class="artista">unknow</div>';

                    
                    li.innerHTML = `${titulo}${artista}`;

                    // Agregar evento de clic al elemento li
                    li.addEventListener('click', function() {
                        console.log(`Reproduciendo: ${metadata.title} de ${metadata.artist} con indice real ${indice-1}`);
                        // Aquí puedes agregar la lógica para reproducir la canción
                        // el indice que nos da no es correcto si queremos mandar ese parametro para poder realizar otros métodos
                        // así que mejor le restamos 1
                        let indiceReal = indice - 1; 
                        if(isCurrentSong){ //esto nos va a arrojar un false si es diferente
                          console.log("Sí es diferenete");
                          loadSong(indiceReal);
                          displayMeta(audioFiles[indiceReal], indiceReal);
                          currentIndex = indiceReal;
                          document.getElementById("play_pause").src = "img/icons/bx-pause-circle.svg";
                        }
                    });

                    const playlistContainer = document.getElementById('playlist'); // Obtener el ul de la playlist
                    playlistContainer.appendChild(li); // Agregar el elemento li a la lista
                },
                onError: function(error) {
                    console.log('Error en la lectura de metadatos', error);
                }
            });
        });
}


// iteramos sobre el arreglo de canciones para obtener sus datos
audioFiles.forEach( (archivo, indice) =>{
    obtenerLista(archivo, indice);
});


//para hacer la barra de progresión y control de volumen
const audio = document.getElementById('player');
const playButton = document.getElementById('play');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('current-time');
const volumeControl = document.getElementById('volume-control'); // Control de volumen

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
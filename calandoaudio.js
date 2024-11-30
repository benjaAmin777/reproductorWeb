
// mi arreglo donde pongo las direcciones de mis canciones
const audioFiles = [
    'audio/tonight.mp3',
    'audio/andoSoltero.mp3'
  ];
  
  // Función para procesar cada archivo de audio y obtener sus metadatos, lo uso primordialmente 
  // para la canción que se anda reproduciendo en ese momento 
  function obtenerMetadatos(archivo, indice) {
    //primero vaciamos el div porque lo vamos a rellenar de nuevo
    document.getElementById("metadata").innerHTML = "";
    fetch(archivo)  // Usamos fetch para obtener el archivo desde la URL
      .then(response => response.blob())  // Convertimos la respuesta a un blob
      .then(blob => {
        jsmediatags.read(blob, {
          onSuccess: function(tag) {
            const metadata = tag.tags;

            let metadataHtml = `<h2>Metadatos de la Canción ${indice + 1}:</h2>`; 
            
            
            // Mostrar algunos metadatos comunes
            if (metadata.title) metadataHtml += `<p><strong>Título:</strong> ${metadata.title}</p>`;
            if (metadata.artist) metadataHtml += `<p><strong>Artista:</strong> ${metadata.artist}</p>`;
            if (metadata.album) metadataHtml += `<p><strong>Álbum:</strong> ${metadata.album}</p>`;
            if (metadata.genre) metadataHtml += `<p><strong>Género:</strong> ${metadata.genre}</p>`;
            if (metadata.year) metadataHtml += `<p><strong>Año:</strong> ${metadata.year}</p>`;

            // Si tiene imagen de portada, mostrarla
            if (metadata.picture) {
              const base64String = metadata.picture.data.reduce((data, byte) => {
                return data + String.fromCharCode(byte);
              }, '');
              const base64Image = `data:${metadata.picture.format};base64,${window.btoa(base64String)}`;
              metadataHtml += `<img src="${base64Image}" alt="Cover Image" style="max-width: 200px;">`;
            }

            // Agregar los metadatos al div #metadata
            document.getElementById('metadata').innerHTML += metadataHtml;
          },
          onError: function(error) {
            console.log('Error leyendo metadatos:', error);
          }
        });
      });
  }
  
  //inicializamos el indice en 0 en una variable que puede cambiar
  let currentIndex = 0;
  //guardo el indice actual de la canción actual
  const audioPlayer = document.getElementById('player');
  
  //función par comenzar a reproducir audio, dependiendo del indice
  function loadSong(index) {
    audioPlayer.src = audioFiles[index];
    audioPlayer.play();
  }
  
  
  
  // Función para ir a la siguiente canción
  function nextSong() {
    currentIndex++;
    if (currentIndex >= audioFiles.length) {
      currentIndex = 0;  // Si llega al final del arreglo, vuelve al inicio
    }
    loadSong(currentIndex);
    console.log("siguiente canción");
    obtenerMetadatos(audioFiles[currentIndex], currentIndex);
  }
// función para retroceder de la canción
function previousSong(){
    if (currentIndex != 0) {
        
        currentIndex = currentIndex - 1;  // Retrocede una canción
        loadSong(currentIndex);   
        obtenerMetadatos(audioFiles[currentIndex], currentIndex);
        console.log(currentIndex);        // Carga la canción solo si no es la primera
    }
    // Si currentIndex es 0, no pasa nada y no se ejecuta loadSong
}


//   funcion para ver en qué canción estamos
  function isCurrentSong(index) {
    // Compara el src del reproductor con el archivo correspondiente al índice
    return audioPlayer.src.includes(audioFiles[index]);
    // estamos basicamente comparando la ruta del archivo de audio que andamos reproduciciendo,
    //  con la ruta contiene la ruta relativa del archivo en el índice proporcionemos
    // si sí se trata de la misma nos arroja un true
  }

//   funcion para ver si alguna canción ha sido cargada
  function isSongLoaded() {
    // checar si alguna canción ha sida cargada
    return audioPlayer.readyState !== 0;  // Devuelve true si hay una canción cargada
  }
  
  //función para play y pause en un solo boton
  function play_pause(){
    // checamos si una canción ha sido cargada
    if(isSongLoaded()){
        
        // si sí ha sido cargada alguna canción, checamos a ver si es la primer canción
        if(isCurrentSong(0)){
            
            // si sí se trata de la primer canción entonces checamos si se está reproduciendo o si está pausada
            if(audioPlayer.paused){
                // si está pausada la reproducimos
                audioPlayer.play();
            }else{
                // si está reproduciendo la pausamos
                audioPlayer.pause();
            }
        }else if (audioPlayer.paused) {
            // si no se trataba de la primer canción tons solo checamos si se estaba reproduciendo o no
            audioPlayer.play(); // Si está pausado, comienza a reproducir
        } else {
            audioPlayer.pause(); // Si está reproduciendo, pausa la reproducción
        }
    }else{
        // sino hay una canción cargada, entonces cargamos una
        loadSong(currentIndex);
        obtenerMetadatos(audioFiles[currentIndex], currentIndex);
    }
    
    
      
  }


  // Evento que detecta cuando la canción terminó y pasa automáticamente a la siguiente
  audioPlayer.addEventListener('ended', nextSong);

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
                    const artista = metadata.artist ? `<div class="artista">Artist: ${metadata.artist}</div>` : '<div class="artista"></div>';

                    
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
                          obtenerMetadatos(audioFiles[indiceReal], indiceReal);
                          currentIndex = indiceReal;
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






  
      
      
      
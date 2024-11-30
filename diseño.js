const audioFiles =[
    'audio/tonight.mp3',
    'audio/andoSoltero.mp3'
];

// función para procesar los archivos de audio
function obtenerMetadatos(archivo, indice){
    fetch(archivo)
    .then(response => response.blob())
    .then(blob =>{
        // ahora llamamos a nuestra API para que lea ese blob
        jsmediatags.read(blob, {
            onSuccess: function(tag){
                const metadata = tag.tags;
                
                const li = document.createElement('li');
                indice = indice + 1;

                // Crear el contenido de li y añadir cada campo uno a uno
                const titulo = metadata.title ? `<div class="titulo">${metadata.title}</div>` : '<div class="titulo">_</div>';
                const artista = metadata.artist ? `<div class="artista">Artist: ${metadata.artist}</div>` : '<div class="artista">_</div>';
                const album = metadata.album ? `<div class="album">Album: ${metadata.album}</div>` : '<div class="album">_</div>';
                
                li.innerHTML = `${titulo}${artista}${album}`;

                const playlistContainer = document.getElementById('playlist'); // Obtener el ul de la playlist
                playlistContainer.appendChild(li); // Agregar el elemento li a la lista
            },
            onError: function(error){
                console.log('Error en la lectura de metadatos', error);
            }
        });
    });
}

// iteramos sobre el arreglo de canciones para obtener sus datos
audioFiles.forEach( (archivo, indice) =>{
    obtenerMetadatos(archivo, indice);
});

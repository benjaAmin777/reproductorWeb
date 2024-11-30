const audioFiles =[
    'audio/tonight.mp3'
];

// funcion para procesar los archivos de audio
function obtenerMetadatos(archivo, indice){
    // usamos fetch para obtener el archivo desde la url (o sea nuestro arreglo de audios)
    fetch(archivo)
    // convertimos la respuesta a un blob (objeto que almacena datos binarios)
    .then(response => response.blob())
    .then(blob =>{
        // ahora llamamos a nuesrta API para que lea ese blob
        jsmediatags.read(blob,{
            onSuccess: function(tag){
                // declaramos donde va a recibir la meta
                const metadata = tag.tags;
                const li = document.createElement('li');
                indice = indice + 1;
                // li.innerHTML = `
                //             <div class="titulo">${cancion.Titulo}</div>
                //             <div class="artista">Artista: ${cancion.Artista}</div>
                //             <div class="album">Álbum: ${cancion.Album}</div>
                //             <div class="duracion">Duración: ${cancion.Duracion}</div>
                //             <br>
                // `;
                if(metadata.tittle){
                    li.innerHTML=`<div class="titulo">${metadata.tittle}</div>`
                }else{
                    li.innerHTML=`<div class="titulo">Unkown</div>`
                }
                if(metadata.tittle){
                    li.innerHTML=`<div class="artista">Artist: ${metadata.artist}</div>`
                }else{
                    li.innerHTML=`<div class="artista">Unkown</div>`
                }
                if(metadata.tittle){
                    li.innerHTML=`<div class="album">Album: ${metadata.album}</div>`
                }else{
                    li.innerHTML=`<div class="album">Unkown</div>`
                }
                
                 
                playlistContainer.appendChild(li) = document.getElementById('playlist');
            },
            onError: function(error){
                console.log('error in the meta reading', error);
            }
        });
    });
}

// iteramos sobre el arrreglo de las canciones para obtener sus datos
audioFiles.forEach( (archivo, indice) =>{
    obtenerMetadatos(archivo, indice);
});
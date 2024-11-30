// Aquí creas un arreglo con los archivos de audio que tienes en tu proyecto.
    // Para este ejemplo, se asume que los archivos están en la carpeta "assets/audio"
    const audioFiles = [
        'audio/tonight.mp3',
        
      ];
  
      // Función para procesar cada archivo de audio
      function obtenerMetadatos(archivo, indice) {
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
  
      // Iteramos sobre el arreglo de canciones para extraer sus metadatos
      audioFiles.forEach((archivo, indice) => {
        obtenerMetadatos(archivo, indice);
      });
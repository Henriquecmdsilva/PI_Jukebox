document.addEventListener('DOMContentLoaded', () => {
    // Elementos principais
    const uploadButton = document.getElementById('upload-button');
    const uploadOptions = document.getElementById('upload-options');
    const loadFolderButton = document.getElementById('load-folder');
    const loadFilesButton = document.getElementById('load-files');
    const noAlbumSelected = document.getElementById('no-album-selected');
    const songsListElement = document.getElementById('songs-list');
    const songsPreviewSection = document.getElementById('songs-preview');
    const goToPlayerButton = document.getElementById('go-to-player');

    // Estado inicial
    setupInitialUIState();

    // Carregar músicas do localStorage
    let songsList = loadSongsFromLocalStorage();

    // Exibir músicas já carregadas se houver
    if (songsList.length) {
        displaySongs(songsList);
    }

    // Alterna visibilidade das opções de upload
    uploadButton.addEventListener('click', toggleUploadOptions);

    // Função principal para carregar músicas
    function loadMusicFiles(isFolder) {
        const fileInput = createFileInput(isFolder);
        fileInput.addEventListener('change', handleFileSelection);
        fileInput.click();
    }

    function createFileInput(isFolder) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.multiple = true;

        if (isFolder) {
            fileInput.webkitdirectory = true;
        }

        return fileInput;
    }

    function handleFileSelection(event) {
        const files = Array.from(event.target.files);
        if (!files.length) {
            return alert("Por favor, selecione pelo menos um arquivo de música.");
        }

        displaySongsPreview();
        let processed = 0;

        files.forEach((file, index) => {
            const song = createBaseSong(file, index);

            jsmediatags.read(file, {
                onSuccess: (tag) => {
                    enrichSongWithTags(song, tag.tags);
                    addSong(song, file);
                },
                onError: () => addSong(song, file)
            });
        });

        function addSong(song, file) {
            songsList.push(song);
            processed++;

            renderSongItem(song);

            if (processed === files.length) {
                saveSongsToLocalStorage(songsList);
                goToPlayerButton.style.display = 'block';
            }
        }
    }

    function createBaseSong(file, index) {
        return {
            songId: Date.now() + index,
            songName: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Desconhecido",
            genre: "Desconhecido",
            composer: "Desconhecido",
            file: URL.createObjectURL(file),
            liked: false,
            cover: 'default-cover.jpg', // Capa padrão
            album: file.webkitRelativePath ? file.webkitRelativePath.split('/')[0] : 'Álbum Desconhecido',
            isYouTube: false
        };
    }

    function enrichSongWithTags(song, tags) {
        song.artist = tags.artist || song.artist;
        song.songName = tags.title || song.songName;
        song.album = tags.album || song.album;

        if (tags.picture) {
            const { data, format } = tags.picture;
            const base64String = btoa(String.fromCharCode(...new Uint8Array(data)));
            song.cover = `data:${format};base64,${base64String}`;
        }
    }

    function renderSongItem(song) {
        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.innerHTML = `
            ${song.cover ? `<img src="${song.cover}" alt="Capa" style="width: 50px; height: 50px; object-fit: cover;">` : ''}
            <div>
                <strong>${song.songName}</strong><br>
                <span style="font-size: 0.8rem;">${song.artist}</span>
            </div>
        `;

        li.addEventListener('click', () => {
            localStorage.setItem('jukeboxCurrentSong', JSON.stringify(song));
            window.location.href = `../Player/index.html`;
        });

        songsListElement.appendChild(li);
    }

    // Atualiza a UI de acordo com o estado das músicas
    function displaySongs(songs) {
        noAlbumSelected.style.display = 'none';
        songsPreviewSection.style.display = 'block';
        songs.forEach(song => renderSongItem(song));
        goToPlayerButton.style.display = 'block';
    }

    function setupInitialUIState() {
        songsPreviewSection.style.display = 'none';
        noAlbumSelected.style.display = 'block';
    }

    function toggleUploadOptions(event) {
        event.preventDefault();
        uploadOptions.style.display = (uploadOptions.style.display === 'none') ? 'flex' : 'none';
    }

    function saveSongsToLocalStorage(songs) {
        localStorage.setItem('jukeboxSongs', JSON.stringify(songs));
    }

    function loadSongsFromLocalStorage() {
        const storedSongs = localStorage.getItem('jukeboxSongs');
        return storedSongs ? JSON.parse(storedSongs) : [];
    }

    // Exibe as músicas carregadas e prepara a interface para visualizá-las
    function displaySongsPreview() {
        noAlbumSelected.style.display = 'none';
        uploadOptions.style.display = 'none';
        songsPreviewSection.style.display = 'block';
        songsListElement.innerHTML = '';
    }

    // Botões de seleção
    loadFolderButton.addEventListener('click', (e) => {
        e.preventDefault();
        loadMusicFiles(true);
    });

    loadFilesButton.addEventListener('click', (e) => {
        e.preventDefault();
        loadMusicFiles(false);
    });

    goToPlayerButton.addEventListener('click', () => {
        window.location.href = `../Player/index.html`;
    });
});

const albumLink = document.getElementById('open-album-options');
const albumOptions = document.getElementById('album-options');

albumLink.addEventListener('click', (e) => {
  e.preventDefault();
  // Alternar visibilidade
  albumOptions.style.display = albumOptions.style.display === 'none' ? 'flex' : 'none';
});

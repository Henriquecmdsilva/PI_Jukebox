/**
 * Jukebox Music Player with Delete Functionality and Fixed Album Listing
 * Manages a music playlist with IndexedDB storage, playback controls, song deletion, and album organization.
 * Ensures albums are correctly listed in the sidebar, including "MusicasJukebox" for individual files.
 */

// Configurações do banco de dados
const DB_NAME = 'JukeboxDB';
const DB_VERSION = 1;
const STORE_NAME = 'musicas';

// Estado global
let db;
let isPlaying = false;
let isShuffling = false;
let isRepeating = false;
let currentSongIndex = 0;
let noteInterval = null;
let isDragging = false;

// Elementos do DOM
const elements = {
    songName: document.getElementById('song-name'),
    bandName: document.getElementById('band-name'),
    song: document.getElementById('audio'),
    play: document.getElementById('play'),
    next: document.getElementById('next'),
    previous: document.getElementById('previous'),
    shuffle: document.getElementById('shuffle'),
    repeat: document.getElementById('repeat'),
    likeButton: document.getElementById('like'),
    volume: document.getElementById('volume'),
    currentProgress: document.getElementById('current-progress'),
    currentTime: document.getElementById('current-time'),
    totalTime: document.getElementById('total-time'),
    cover: document.getElementById('cover'),
    musicalNotesContainer: document.querySelector('.musical-notes'),
    progressContainer: document.getElementById('progress-container'),
    albumsContainer: document.getElementById('albums-container'),
    fileInput: document.getElementById('file-input'),
    albumLink: document.getElementById('open-album-options'),
    playerContainer: document.getElementById('player-container')
};

// Playlist padrão
const playlistDataDefault = [
    { nome: "Alo", artista: "Bruno e Barretto", genero: "Sertanejo", capa: "../musicas/img-audios/Music-alo.jpg", arquivo: "../musicas/audio/bruno e barreto-alo.mp3", liked: false, album: "Álbum 1" },
    { nome: "Amor de Cana", artista: "Bruno e Barretto", genero: "Sertanejo", capa: "../musicas/img-audios/Music-Amor de cana.jpg", arquivo: "../musicas/audio/brunoebarretto-amor-de-cana.mp3", liked: false, album: "Álbum 1" },
    { nome: "Arruma um Cantinho", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "../musicas/img-audios/Music-Arruma um cantinho.jpg", arquivo: "../musicas/audio/henriqueejulianooficial-arruma-um-cantinho.mp3", liked: false, album: "Álbum 2" },
    { nome: "Desbeijar Minha Boca", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "../musicas/img-audios/Music-deseijar.jpg", arquivo: "../musicas/audio/henriqueejulianooficial-desbeijar-minha-boca.mp3", liked: false, album: "Álbum 2" },
    { nome: "Amor e Fe", artista: "Hungria Hip Hop", genero: "Hip-Hop", capa: "../musicas/img-audios/Music-Amor e fe.jpg", arquivo: "../musicas/audio/hungriahiphop-amor-e-fe.mp3", liked: false, album: "Álbum 3" },
    { nome: "Beijo com Trap", artista: "Hungria Hip Hop", genero: "Hip-Hop", capa: "../musicas/img-audios/Music-beijo com trap.jpg", arquivo: "../musicas/audio/hungriahiphop-beijo-com-trap.mp3", liked: false, album: "Álbum 3" },
    { nome: "Coracao de Aco", artista: "Hungria Hip Hop", genero: "Hip-Hop", capa: "../musicas/img-audios/Music-coraçao de aco.jpg", arquivo: "../musicas/audio/hungriahiphop-coracao-de-aco.mp3", liked: false, album: "Álbum 3" },
    { nome: "Solinho do Brabo", artista: "Japaozin", genero: "Funk", capa: "../musicas/img-audios/Music-solinho brabo.jpg", arquivo: "../musicas/audio/japaozin-solinho-do-brabo.mp3", liked: false, album: "Álbum 4" },
    { nome: "A Maior Saudade", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "../musicas/img-audios/Music-a maior saudade.jpg", arquivo: "../musicas/audio/henrique e juliano-a-maior-saudade.mp3", liked: false, album: "Álbum 2" },
    { nome: "Eu Amo Voce", artista: "Leo Magalhaes", genero: "Sertanejo", capa: "../musicas/img-audios/Music-eu amo voce.jpg", arquivo: "../musicas/audio/leomagalhaes-eu-amo-voce.mp3", liked: false, album: "Álbum 5" },
    { nome: "Pense em Mim", artista: "Leo Magalhaes", genero: "Sertanejo", capa: "../musicas/img-audios/Music-pense em mim.jpg", arquivo: "../musicas/audio/leomagalhaes-pense-em-mim.mp3", liked: false, album: "Álbum 5" },
    { nome: "Do Job Grelo da Seresta", artista: "MC Tuto", genero: "Funk", capa: "../musicas/img-audios/Music-Do job Grelo da Seresta.jpg", arquivo: "../musicas/audio/MCTuto2t-do-job-grelo-da-seresta-mc-tuto.mp3", liked: false, album: "Álbum 6" },
    { nome: "Nao Me Olha na Cara", artista: "MC Tuto e MC Joaozinho VT", genero: "Funk", capa: "../musicas/img-audios/Music-Nao Me Olha na Cara.jpg", arquivo: "../musicas/audio/MCTuto2t-nao-me-olha-na-cara-mc-tuto-mc-joaozinho-vt.mp3", liked: false, album: "Álbum 6" },
    { nome: "Virei Cachorro da Pior Qualidade Gato Preto", artista: "MC Tuto", genero: "Funk", capa: "../musicas/img-audios/music-Virei Cachorro da Pior Qualidade Gato Preto.jpg", arquivo: "../musicas/audio/MCTuto2t-virei-cachorro-da-pior-qualidade-gato-preto-mc-tuto.mp3", liked: false, album: "Álbum 6" },
    { nome: "50 Por Cento", artista: "Naiara Azevedo e Marilia Mendonca", genero: "Sertanejo", capa: "../musicas/img-audios/Music-50 Por Cento.jpg", arquivo: "../musicas/audio/naiaraazevedo-50-por-cento-naiara-azevedo-marilia-mendonca.mp3", liked: false, album: "Álbum 7" },
    { nome: "Tu cheira", artista: "Biu Do Piseiro", genero: "Piseiro", capa: "../musicas/img-audios/cd_cover.jpeg", arquivo: "../musicas/audio/RASPADINHA AO VIVO.mp3", liked: false, album: "Álbum 8" },
    { id: 1, nome: "Evidências", artista: "Chitãozinho & Xororó", genero: "Sertanejo", capa: "img/sertanejo/evidencias.jpg", arquivo: "../musicas/audio/ep08-evidencias.mp3", liked: false, album: "Álbum 9" },
    { id: 2, nome: "Fio de Cabelo", artista: "Chitãozinho & Xororó", genero: "Sertanejo", capa: "img/sertanejo/fio_de_cabelo.jpg", arquivo: "../Playlist/audio/sertanejo/fio_de_cabelo.mp3", liked: false, album: "Álbum 9" },
    { id: 3, nome: "Romaria", artista: "Renato Teixeira", genero: "Sertanejo", capa: "img/sertanejo/romaria.jpg", arquivo: "../Playlistaudio/sertanejo/romaria.mp3", liked: false, album: "Álbum 10" },
    { id: 4, nome: "Alô", artista: "Bruno e Marrone", genero: "Sertanejo", capa: "img/sertanejo/alo.jpg", arquivo: "audio/sertanejo/alo.mp3", liked: false, album: "Álbum 11" },
    { id: 5, nome: "Amor de Madrugada", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/amor_de_madrugada.jpg", arquivo: "../Playlistaudio/sertanejo/amor_de_madrugada.mp3", liked: false, album: "Álbum 12" },
    { id: 6, nome: "Telefone Mudo", artista: "Zezé Di Camargo & Luciano", genero: "Sertanejo", capa: "img/sertanejo/telefone_mudo.jpg", arquivo: "audio/sertanejo/telefone_mudo.mp3", liked: false, album: "Álbum 13" },
    { id: 7, nome: "Amo Noite e Dia", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/amo_noite_e_dia.jpg", arquivo: "../Playlistaudio/sertanejo/amo_noite_e_dia.mp3", liked: false, album: "Álbum 12" },
    { id: 8, nome: "Fui Fiel", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/fui_fiel.jpg", arquivo: "../Playlistaudio/sertanejo/fui_fiel.mp3", liked: false, album: "Álbum 12" },
    { id: 9, nome: "Despedida de Solteiro", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "img/sertanejo/despedida_de_soltiero.jpg", arquivo: "../Playlistaudio/sertanejo/despedida_de_soltiero.mp3", liked: false, album: "Álbum 2" },
    { id: 10, nome: "Coração de Aço", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "img/sertanejo/coracao_de_aco.jpg", arquivo: "../Playlistaudio/sertanejo/coracao_de_aco.mp3", liked: false, album: "Álbum 2" }
];

let playlistData = [...playlistDataDefault];

// Processa músicas passadas via URL
const urlParams = new URLSearchParams(window.location.search);
const songsFromUpload = urlParams.get('songs');
if (songsFromUpload) {
    try {
        const parsedSongs = JSON.parse(decodeURIComponent(songsFromUpload));
        if (Array.isArray(parsedSongs)) {
            playlistData = parsedSongs;
            currentSongIndex = 0;
        }
    } catch (e) {
        console.error("Erro ao processar músicas recebidas via URL:", e);
    }
}

// Funções do IndexedDB
async function abrirBanco() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => {
            console.error('Erro ao abrir o IndexedDB:', event.target.error);
            reject(event.target.error);
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Banco de dados carregado com sucesso');
            resolve();
        };
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('arquivo', 'arquivo', { unique: false });
            }
        };
    });
}

async function salvarMusicaNoBanco(musica, blob) {
    try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const musicaComBlob = { ...musica, blob };
        const request = store.add(musicaComBlob);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`Música "${musica.nome}" salva no IndexedDB com ID ${request.result}`);
                resolve(request.result);
            };
            request.onerror = (event) => {
                console.error(`Erro ao salvar música "${musica.nome}" no IndexedDB:`, event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Erro na transação do IndexedDB:', error);
        throw error;
    }
}

async function carregarMusicasSalvas() {
    try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const musicasSalvas = event.target.result;
                console.log(`Carregadas ${musicasSalvas.length} músicas do IndexedDB`);
                musicasSalvas.forEach(musica => {
                    if (musica.blob && musica.isUserUploaded) {
                        const blobUrl = URL.createObjectURL(musica.blob);
                        const songData = {
                            id: musica.id,
                            nome: musica.nome,
                            artista: musica.artista || "Desconhecido",
                            genero: musica.genero || "Desconhecido",
                            capa: musica.capa || "default-cover.jpg",
                            arquivo: blobUrl,
                            liked: musica.liked || false,
                            album: musica.album || "MusicasJukebox",
                            isUserUploaded: musica.isUserUploaded
                        };
                        if (!playlistData.some(s => s.id === musica.id)) {
                            playlistData.push(songData);
                            console.log(`Música "${musica.nome}" (ID: ${musica.id}) adicionada à playlistData, álbum: ${songData.album}`);
                        }
                    }
                });
                resolve();
            };
            request.onerror = (event) => {
                console.error('Erro ao carregar músicas do IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Erro na transação do IndexedDB:', error);
        throw error;
    }
}

async function updateSongInDatabase(song) {
    try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(song);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`Música "${song.nome}" atualizada no IndexedDB`);
                resolve();
            };
            request.onerror = (event) => {
                console.error(`Erro ao atualizar música "${song.nome}" no IndexedDB:`, event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Erro na transação do IndexedDB:', error);
        throw error;
    }
}

async function deleteSongFromDatabase(songId) {
    try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(songId);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`Música com ID ${songId} excluída do IndexedDB`);
                // Remove da playlist
                const songIndex = playlistData.findIndex(s => s.id === songId);
                if (songIndex !== -1) {
                    const song = playlistData[songIndex];
                    if (song.isUserUploaded) {
                        URL.revokeObjectURL(song.arquivo);
                    }
                    playlistData.splice(songIndex, 1);
                    // Ajusta o índice atual se necessário
                    if (songIndex === currentSongIndex && playlistData.length > 0) {
                        currentSongIndex = Math.max(0, songIndex - 1);
                        loadSong(currentSongIndex);
                    } else if (playlistData.length === 0) {
                        elements.song.src = '';
                        elements.songName.textContent = '';
                        elements.bandName.textContent = '';
                        elements.cover.src = '';
                        elements.cover.alt = '';
                        songPause();
                    }
                }
                resolve();
            };
            request.onerror = (event) => {
                console.error(`Erro ao excluir música com ID ${songId} do IndexedDB:`, event.target.error);
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Erro na transação do IndexedDB:', error);
        throw error;
    }
}

// Funções de interface
function createMusicalNote() {
    const note = document.createElement('div');
    note.classList.add('musical-note');
    note.innerHTML = '♪';
    note.style.left = `${Math.random() * elements.musicalNotesContainer.clientWidth}px`;
    note.style.bottom = '0';
    elements.musicalNotesContainer.appendChild(note);
    setTimeout(() => note.remove(), 2000);
}

function toggleNotes() {
    if (isPlaying && !noteInterval) {
        noteInterval = setInterval(createMusicalNote, 800);
    } else if (!isPlaying && noteInterval) {
        clearInterval(noteInterval);
        noteInterval = null;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function togglePlayPause() {
    isPlaying ? songPause() : songPlay();
}

function songPlay() {
    if (!elements.song.src) {
        console.error('No audio source set');
        alert('Por favor, selecione um arquivo de áudio válido.');
        return;
    }
    elements.play.querySelector('i').classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
    elements.song.play().catch(err => {
        console.error("Erro ao reproduzir música:", err);
        alert('Falha ao reproduzir a faixa. O arquivo pode estar ausente ou não ser suportado.');
    });
    isPlaying = true;
    toggleNotes();
}

function songPause() {
    elements.play.querySelector('i').classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill');
    elements.song.pause();
    isPlaying = false;
    toggleNotes();
}

function loadSong(index) {
    if (index < 0 || index >= playlistData.length) {
        console.error('Índice de música inválido:', index);
        return;
    }
    const song = playlistData[index];
    currentSongIndex = index;
    elements.song.src = song.arquivo;
    elements.songName.textContent = song.nome;
    elements.bandName.textContent = song.artista;
    elements.cover.src = song.capa;
    elements.cover.alt = `Capa de ${song.nome} por ${song.artista}`;
    updateLikeButton(song.liked);

    elements.song.load();
    elements.song.addEventListener('error', () => {
        console.error('Erro ao carregar arquivo de áudio:', song.arquivo);
        alert(`Falha ao carregar ${song.nome}. O arquivo pode estar ausente ou não ser suportado.`);
        playNext();
    }, { once: true });

    elements.song.addEventListener('canplaythrough', () => {
        songPlay();
    }, { once: true });

    elements.song.addEventListener('ended', () => {
        if (song.isUserUploaded) {
            URL.revokeObjectURL(song.arquivo);
        }
        isRepeating ? (elements.song.currentTime = 0, songPlay()) : playNext();
    }, { once: true });
}

function updateProgress() {
    if (!elements.song.duration) return;
    const progress = (elements.song.currentTime / elements.song.duration) * 100;
    elements.currentProgress.style.width = `${progress}%`;
    elements.currentTime.textContent = formatTime(elements.song.currentTime);
    elements.totalTime.textContent = formatTime(elements.song.duration);
    elements.progressContainer.setAttribute('aria-valuenow', Math.round(progress));
}

function updateLikeButton(isLiked) {
    const likeIcon = elements.likeButton.querySelector('i');
    likeIcon.classList.toggle('bi-heart', !isLiked);
    likeIcon.classList.toggle('bi-heart-fill', isLiked);
}

function playNext() {
    const nextIndex = isShuffling
        ? Math.floor(Math.random() * playlistData.length)
        : (currentSongIndex + 1) % playlistData.length;
    loadSong(nextIndex);
}

function playPrevious() {
    const prevIndex = (currentSongIndex - 1 + playlistData.length) % playlistData.length;
    loadSong(prevIndex);
}

function setSongPosition(e) {
    const rect = elements.progressContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const newTime = (offsetX / progressWidth) * elements.song.duration;
    if (!isNaN(newTime)) {
        elements.song.currentTime = newTime;
    }
}

function getAlbumsFromPlaylist() {
    const albums = {};
    playlistData.forEach(song => {
        const albumName = song.album || "MusicasJukebox";
        albums[albumName] = albums[albumName] || [];
        albums[albumName].push(song);
    });
    console.log('Álbuns encontrados:', Object.keys(albums));
    return albums;
}

// Funções de UI para álbuns e músicas
function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        height: 100%;
        background-color: #1e1e1e;
        color: white;
        padding: 20px;
        z-index: 9999;
        box-shadow: -2px 0 5px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(sidebar);

    const title = document.createElement('h2');
    title.textContent = "Escolha um álbum:";
    sidebar.appendChild(title);

    const uploadOptions = document.createElement("div");
    uploadOptions.className = "upload-options";
    uploadOptions.style.cssText = 'display: flex; flex-direction: column; gap: 10px; align-items: stretch;';

    const buttonFile = document.createElement("button");
    buttonFile.className = "upload-button";
    buttonFile.textContent = "🎵 Carregar Arquivo de Música";
    buttonFile.title = "Selecionar arquivos de música";
    buttonFile.style.cssText = `
        padding: 10px 20px;
        background: linear-gradient(135deg, rgb(56, 50, 65), rgb(80, 0, 70));
        color: #ecf0f1;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1em;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        text-align: center;
    `;
    buttonFile.addEventListener("mouseover", () => {
        buttonFile.style.background = "#ff00ff";
        buttonFile.style.transform = "scale(1.05)";
    });
    buttonFile.addEventListener("mouseout", () => {
        buttonFile.style.background = "linear-gradient(135deg, rgb(56, 50, 65), rgb(80, 0, 70))";
        buttonFile.style.transform = "scale(1)";
    });
    buttonFile.addEventListener("click", () => {
        elements.fileInput.webkitdirectory = false;
        elements.fileInput.multiple = true;
        elements.fileInput.value = null;
        elements.fileInput.accept = "audio/mpeg,audio/wav,audio/ogg";
        elements.fileInput.click();
    });

    const buttonFolder = document.createElement("button");
    buttonFolder.className = "upload-button";
    buttonFolder.textContent = "📁 Carregar Pasta de Músicas";
    buttonFolder.title = "Selecionar pasta com músicas";
    buttonFolder.style.cssText = `
        padding: 10px 20px;
        background: linear-gradient(135deg, rgb(56, 50, 65), rgb(80, 0, 70));
        color: #ecf0f1;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1em;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        text-align: center;
    `;
    buttonFolder.addEventListener("mouseover", () => {
        buttonFolder.style.background = "#ff00ff";
        buttonFolder.style.transform = "scale(1.05)";
    });
    buttonFolder.addEventListener("mouseout", () => {
        buttonFolder.style.background = "linear-gradient(135deg, rgb(56, 50, 65), rgb(80, 0, 70))";
        buttonFolder.style.transform = "scale(1)";
    });
    buttonFolder.addEventListener("click", () => {
        elements.fileInput.webkitdirectory = true;
        elements.fileInput.multiple = true;
        elements.fileInput.value = null;
        elements.fileInput.accept = "audio/mpeg,audio/wav,audio/ogg";
        elements.fileInput.click();
    });

    const backButton = document.createElement("button");
    backButton.className = "upload-button";
    backButton.textContent = "🔄 Voltar ao Início";
    backButton.title = "Voltar ao estado inicial da página";
    backButton.style.cssText = `
        padding: 10px 20px;
        background: linear-gradient(135deg, rgb(56, 50, 65), rgb(80, 0, 70));
        color: #ecf0f1;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1em;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        text-align: center;
    `;
    backButton.addEventListener("mouseover", () => {
        backButton.style.background = "#ff00ff";
        backButton.style.transform = "scale(1.05)";
    });
    backButton.addEventListener("mouseout", () => {
        backButton.style.background = "linear-gradient(135deg, rgb(56, 50, 65), rgb(80, 0, 70))";
        backButton.style.transform = "scale(1)";
    });
    backButton.addEventListener("click", () => {
        window.location.reload();
    });

    uploadOptions.appendChild(buttonFile);
    uploadOptions.appendChild(buttonFolder);
    uploadOptions.appendChild(backButton);
    sidebar.appendChild(uploadOptions);

    const musicBlockContainer = document.createElement('div');
    musicBlockContainer.id = 'music-blocks';
    musicBlockContainer.style.cssText = `
        margin-top: 20px;
        max-height: 400px;
        overflow-y: auto;
    `;
    sidebar.appendChild(musicBlockContainer);

    return sidebar;
}

function loadAlbums() {
    const musicBlockContainer = document.getElementById('music-blocks');
    if (!musicBlockContainer) {
        console.error('Elemento music-blocks não encontrado no DOM');
        return;
    }
    musicBlockContainer.innerHTML = '';

    const albums = getAlbumsFromPlaylist();
    const userAlbums = Object.keys(albums)
        .filter(albumName => albums[albumName].some(song => song.isUserUploaded))
        .sort();

    console.log('Álbuns de usuário encontrados:', userAlbums);

    if (userAlbums.length === 0) {
        const noAlbumsMessage = document.createElement('div');
        noAlbumsMessage.textContent = 'Nenhum álbum carregado.';
        noAlbumsMessage.style.cssText = 'color: #aaa; padding: 10px;';
        musicBlockContainer.appendChild(noAlbumsMessage);
        console.log('Nenhum álbum de usuário para exibir');
        return;
    }

    userAlbums.forEach(albumName => {
        const albumSongs = albums[albumName].filter(song => song.isUserUploaded);
        if (albumSongs.length > 0) {
            const albumItem = document.createElement('div');
            albumItem.classList.add('album-item');
            albumItem.style.cssText = `
                background-color: #333;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
            `;
            albumItem.innerHTML = `
                <img src="${albumSongs[0].capa}" alt="${albumName}" style="width: 50px; height: 50px; margin-right: 10px; object-fit: cover;" />
                <span>${albumName} (${albumSongs.length} música${albumSongs.length > 1 ? 's' : ''})</span>
            `;
            albumItem.addEventListener('click', () => showSongs(albumName));
            musicBlockContainer.appendChild(albumItem);
            console.log(`Álbum "${albumName}" adicionado à sidebar com ${albumSongs.length} músicas`);
        }
    });
}

function showSongs(albumName) {
    const musicBlockContainer = document.getElementById('music-blocks');
    if (!musicBlockContainer) {
        console.error('Elemento music-blocks não encontrado no DOM');
        return;
    }
    musicBlockContainer.innerHTML = '';
    musicBlockContainer.style.display = 'block';
    elements.playerContainer.style.display = 'none';

    const backButton = document.createElement('button');
    backButton.textContent = '← Voltar para álbuns';
    backButton.style.cssText = `
        margin-bottom: 15px;
        padding: 8px 12px;
        background-color: #444;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    `;
    backButton.addEventListener('click', () => {
        musicBlockContainer.style.display = 'none';
        elements.playerContainer.style.display = 'none';
        elements.albumsContainer.style.display = 'flex';
        loadAlbums();
    });
    musicBlockContainer.appendChild(backButton);

    const userSongs = playlistData.filter(song => song.album === albumName && song.isUserUploaded);
    if (userSongs.length === 0) {
        const noSongsMessage = document.createElement('div');
        noSongsMessage.textContent = 'Nenhuma música carregada neste álbum.';
        noSongsMessage.style.cssText = 'color: #aaa; padding: 10px;';
        musicBlockContainer.appendChild(noSongsMessage);
        console.log(`Nenhuma música encontrada para o álbum "${albumName}"`);
        return;
    }

    userSongs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.classList.add('song-item');
        songItem.style.cssText = `
            color: #fff;
            padding: 8px;
            margin-bottom: 6px;
            background-color: #222;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        songItem.innerHTML = `
            <span style="cursor: pointer;" class="song-title">${index + 1}. ${song.nome}</span>
            <button class="delete-button" style="padding: 4px 8px; background-color: #e74c3c; color: #fff; border: none; border-radius: 4px; cursor: pointer;" title="Excluir ${song.nome}">🗑️</button>
        `;
        const songTitle = songItem.querySelector('.song-title');
        songTitle.addEventListener('click', () => {
            const indexInPlaylist = playlistData.findIndex(s => s.id === song.id);
            if (indexInPlaylist !== -1) {
                loadSong(indexInPlaylist);
                elements.playerContainer.style.display = 'block';
                musicBlockContainer.style.display = 'none';
            }
        });
        const deleteButton = songItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', async () => {
            if (confirm(`Deseja realmente excluir "${song.nome}" do álbum ${albumName}?`)) {
                try {
                    await deleteSongFromDatabase(song.id);
                    alert(`Música "${song.nome}" excluída com sucesso!`);
                    showSongs(albumName); // Atualiza a lista de músicas
                } catch (error) {
                    alert('Erro ao excluir a música. Tente novamente.');
                    console.error('Erro ao excluir música:', error);
                }
            }
        });
        musicBlockContainer.appendChild(songItem);
        console.log(`Música "${song.nome}" listada no álbum "${albumName}"`);
    });
}

// Inicialização da sidebar
const sidebar = createSidebar();

// Event Listeners
function setupEventListeners() {
    elements.play.addEventListener('click', togglePlayPause);
    elements.next.addEventListener('click', playNext);
    elements.previous.addEventListener('click', playPrevious);
    elements.song.addEventListener('timeupdate', updateProgress);
    elements.song.addEventListener('ended', () => {
        isRepeating ? (elements.song.currentTime = 0, songPlay()) : playNext();
    });
    elements.likeButton.addEventListener('click', () => {
        playlistData[currentSongIndex].liked = !playlistData[currentSongIndex].liked;
        updateLikeButton(playlistData[currentSongIndex].liked);
        updateSongInDatabase(playlistData[currentSongIndex]);
    });
    elements.shuffle.addEventListener('click', () => {
        isShuffling = !isShuffling;
        elements.shuffle.classList.toggle('active', isShuffling);
    });
    elements.repeat.addEventListener('click', () => {
        isRepeating = !isRepeating;
        elements.repeat.classList.toggle('active', isRepeating);
    });
    elements.volume.addEventListener('input', () => {
        elements.song.volume = elements.volume.value;
    });
    elements.progressContainer.addEventListener('click', setSongPosition);
    elements.progressContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        setSongPosition(e);
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) setSongPosition(e);
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    elements.fileInput.style.display = "none";
    if (elements.albumLink) {
        elements.albumLink.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
            elements.playerContainer.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
            console.log('Sidebar toggled, chamando loadAlbums');
            loadAlbums();
        });
    } else {
        console.warn('Elemento com id="open-album-options" não encontrado.');
    }

    elements.fileInput.addEventListener('change', async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) {
            alert('Nenhum arquivo selecionado.');
            console.log('Nenhum arquivo detectado no input.');
            return;
        }

        console.log(`Processando ${files.length} arquivos`);

        const supportedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
        const newSongs = Array.from(files)
            .map(file => {
                const isSupported = supportedTypes.includes(file.type) || /\.(mp3|wav|ogg)$/i.test(file.name);
                if (!isSupported) {
                    console.warn(`Arquivo ${file.name} não suportado. Tipo: ${file.type}`);
                    return null;
                }
                const albumName = file.webkitRelativePath && file.webkitRelativePath.includes('/')
                    ? file.webkitRelativePath.split('/')[0]
                    : "MusicasJukebox";
                return {
                    nome: file.name.replace(/\.[^/.]+$/, ""),
                    artista: "Desconhecido",
                    genero: "Desconhecido",
                    capa: "default-cover.jpg",
                    arquivo: URL.createObjectURL(file),
                    liked: false,
                    album: albumName,
                    isUserUploaded: true,
                    blob: file
                };
            })
            .filter(song => song !== null);

        if (newSongs.length === 0) {
            alert('Nenhum arquivo de áudio suportado selecionado. Formatos aceitos: MP3, WAV, OGG.');
            console.log('Nenhum arquivo válido após filtragem.');
            return;
        }

        console.log(`Encontradas ${newSongs.length} músicas válidas para salvar`);

        let successCount = 0;
        for (const song of newSongs) {
            if (!playlistData.some(s => s.nome === song.nome && s.album === song.album)) {
                try {
                    const songId = await salvarMusicaNoBanco(song, song.blob);
                    const blobUrl = URL.createObjectURL(song.blob);
                    const songData = { ...song, id: songId, arquivo: blobUrl };
                    playlistData.push(songData);
                    successCount++;
                    console.log(`Música "${song.nome}" (ID: ${songId}) adicionada à playlist no álbum "${song.album}"`);
                } catch (error) {
                    console.error(`Falha ao salvar "${song.nome}":`, error);
                }
            } else {
                console.log(`Música "${song.nome}" já existe no álbum "${song.album}"`);
            }
        }

        if (successCount > 0) {
            alert(`${successCount} música(s) carregada(s) com sucesso!`);
            elements.playerContainer.style.display = 'block';
            sidebar.style.display = 'none';
            console.log('Recarregando álbuns após upload');
            loadAlbums();
        } else {
            alert('Nenhuma música nova foi adicionada. Verifique se os arquivos já existem ou são suportados.');
        }

        elements.fileInput.value = null;
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await abrirBanco();
        await carregarMusicasSalvas();
        setupEventListeners();

        const musicaId = urlParams.get('id');
        const musica = decodeURIComponent(urlParams.get('musica') || '');
        if (musicaId) {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(Number(musicaId));
            request.onsuccess = (event) => {
                const song = event.target.result;
                if (song && song.blob) {
                    const blobUrl = URL.createObjectURL(song.blob);
                    const songData = {
                        id: song.id,
                        nome: song.nome,
                        artista: song.artista || "Desconhecido",
                        genero: song.genero || "Desconhecido",
                        capa: song.capa || "default-cover.jpg",
                        arquivo: blobUrl,
                        liked: song.liked || false,
                        album: song.album || "MusicasJukebox",
                        isUserUploaded: song.isUserUploaded
                    };
                    const songIndex = playlistData.findIndex(s => s.id === song.id);
                    if (songIndex === -1) {
                        playlistData.push(songData);
                        loadSong(playlistData.length - 1);
                    } else {
                        loadSong(songIndex);
                    }
                } else {
                    console.warn('Música não encontrada no IndexedDB:', musicaId);
                    alert('A música selecionada não está disponível. Por favor, escolha outra música.');
                }
            };
            request.onerror = () => {
                console.error('Erro ao buscar música no IndexedDB:', musicaId);
                alert('Erro ao carregar a música selecionada.');
            };
        } else if (musica) {
            const songIndex = playlistData.findIndex(song => song.arquivo === musica);
            if (songIndex !== -1) {
                loadSong(songIndex);
            } else {
                console.warn('Música especificada não encontrada na playlist:', musica);
                alert('A música selecionada não está disponível. Por favor, escolha outra música.');
            }
        }
        console.log('Inicialização completa, chamando loadAlbums');
        loadAlbums();
    } catch (error) {
        console.error('Erro na inicialização:', error);
        alert('Erro ao inicializar o player. Tente recarregar a página.');
    }
});
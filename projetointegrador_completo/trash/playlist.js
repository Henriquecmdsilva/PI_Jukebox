// Configuração: Define se o clique na playlist redireciona diretamente para o player
const REDIRECT_ON_PLAYLIST_CLICK = false; // Altere para true se desejar redirecionar diretamente

// Verificar suporte ao localStorage
function isLocalStorageAvailable() {
    try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Dados das músicas por gênero
const musicasSertanejo = [
    { id: 1, nome: "Evidências", artista: "Chitãozinho & Xororó", genero: "Sertanejo", capa: "img/sertanejo/evidencias.jpg", arquivo: "audio/sertanejo/EVIDÊNCIAS_-_CHITÃOZINHO_E_XORORÓ.mp3", liked: false, album: "Sertanejo Clássicos" },
    { id: 2, nome: "Fio de Cabelo", artista: "Chitãozinho & Xororó", genero: "Sertanejo", capa: "img/sertanejo/fio_de_cabelo.jpg", arquivo: "audio/sertanejo/fio_de_cabelo.mp3", liked: false, album: "Sertanejo Clássicos" },
    { id: 3, nome: "Romaria", artista: "Renato Teixeira", genero: "Sertanejo", capa: "img/sertanejo/romaria.jpg", arquivo: "audio/sertanejo/romaria.mp3", liked: false, album: "Sertanejo Raiz" },
    { id: 4, nome: "Alô", artista: "Bruno e Marrone", genero: "Sertanejo", capa: "img/sertanejo/alo.jpg", arquivo: "audio/sertanejo/alo.mp3", liked: false, album: "Sertanejo Romântico" },
    { id: 5, nome: "Amor de Madrugada", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/amor_de_madrugada.jpg", arquivo: "audio/sertanejo/amor_de_madrugada.mp3", liked: false, album: "Sertanejo Moderno" },
    { id: 6, nome: "Telefone Mudo", artista: "Zezé Di Camargo & Luciano", genero: "Sertanejo", capa: "img/sertanejo/telefone_mudo.jpg", arquivo: "audio/sertanejo/telefone_mudo.mp3", liked: false, album: "Sertanejo Clássicos" },
    { id: 7, nome: "Amo Noite e Dia", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/amo_noite_e_dia.jpg", arquivo: "audio/sertanejo/amo_noite_e_dia.mp3", liked: false, album: "Sertanejo Moderno" },
    { id: 8, nome: "Fui Fiel", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/fui_fiel.jpg", arquivo: "audio/sertanejo/fui_fiel.mp3", liked: false, album: "Sertanejo Moderno" },
    { id: 9, nome: "Despedida de Solteiro", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "img/sertanejo/despedida_de_solteiro.jpg", arquivo: "audio/sertanejo/despedida_de_solteiro.mp3", liked: false, album: "Sertanejo Moderno" },
    { id: 10, nome: "Coração de Aço", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "img/sertanejo/coracao_de_aco.jpg", arquivo: "audio/sertanejo/coracao_de_aco.mp3", liked: false, album: "Sertanejo Moderno" },
];

const musicasRock = [
    { id: 11, nome: "Bohemian Rhapsody", artista: "Queen", genero: "Rock", capa: "img/rock/bohemian_rhapsody.jpg", arquivo: "audio/rock/bohemian_rhapsody.mp3", liked: false, album: "Rock Clássico" },
    { id: 12, nome: "Stairway to Heaven", artista: "Led Zeppelin", genero: "Rock", capa: "img/rock/stairway_to_heaven.jpg", arquivo: "audio/rock/stairway_to_heaven.mp3", liked: false, album: "Rock Clássico" },
    { id: 13, nome: "Smells Like Teen Spirit", artista: "Nirvana", genero: "Rock", capa: "img/rock/smells_like_teen_spirit.jpg", arquivo: "audio/rock/smells_like_teen_spirit.mp3", liked: false, album: "Grunge" },
    { id: 14, nome: "Sweet Child O' Mine", artista: "Guns N' Roses", genero: "Rock", capa: "img/rock/sweet_child_o_mine.jpg", arquivo: "audio/rock/sweet_child_o_mine.mp3", liked: false, album: "Hard Rock" },
    { id: 15, nome: "Another Brick in the Wall", artista: "Pink Floyd", genero: "Rock", capa: "img/rock/another_brick_in_the_wall.jpg", arquivo: "audio/rock/another_brick_in_the_wall.mp3", liked: false, album: "Rock Progressivo" },
    { id: 16, nome: "Hotel California", artista: "Eagles", genero: "Rock", capa: "img/rock/hotel_california.jpg", arquivo: "audio/rock/hotel_california.mp3", liked: false, album: "Rock Clássico" },
    { id: 17, nome: "Let It Be", artista: "The Beatles", genero: "Rock", capa: "img/rock/let_it_be.jpg", arquivo: "audio/rock/let_it_be.mp3", liked: false, album: "Rock Clássico" },
    { id: 18, nome: "Back in Black", artista: "AC/DC", genero: "Rock", capa: "img/rock/back_in_black.jpg", arquivo: "audio/rock/back_in_black.mp3", liked: false, album: "Hard Rock" },
    { id: 19, nome: "Paint It Black", artista: "The Rolling Stones", genero: "Rock", capa: "img/rock/paint_it_black.jpg", arquivo: "audio/rock/paint_it_black.mp3", liked: false, album: "Rock Clássico" },
    { id: 20, nome: "Under the Bridge", artista: "Red Hot Chili Peppers", genero: "Rock", capa: "img/rock/under_the_bridge.jpg", arquivo: "audio/rock/under_the_bridge.mp3", liked: false, album: "Rock Alternativo" },
];

const musicasPop = [
    { id: 21, nome: "Thriller", artista: "Michael Jackson", genero: "Pop", capa: "img/pop/thriller.jpg", arquivo: "audio/pop/thriller.mp3", liked: false, album: "Pop Clássico" },
    { id: 22, nome: "Like a Prayer", artista: "Madonna", genero: "Pop", capa: "img/pop/like_a_prayer.jpg", arquivo: "audio/pop/like_a_prayer.mp3", liked: false, album: "Pop Clássico" },
    { id: 23, nome: "Shape of You", artista: "Ed Sheeran", genero: "Pop", capa: "img/pop/shape_of_you.jpg", arquivo: "audio/pop/shape_of_you.mp3", liked: false, album: "Pop Moderno" },
    { id: 24, nome: "Rolling in the Deep", artista: "Adele", genero: "Pop", capa: "img/pop/rolling_in_the_deep.jpg", arquivo: "audio/pop/rolling_in_the_deep.mp3", liked: false, album: "Pop Moderno" },
    { id: 25, nome: "Uptown Funk", artista: "Mark Ronson ft. Bruno Mars", genero: "Pop", capa: "img/pop/uptown_funk.jpg", arquivo: "audio/pop/uptown_funk.mp3", liked: false, album: "Pop Moderno" },
    { id: 26, nome: "Bad Romance", artista: "Lady Gaga", genero: "Pop", capa: "img/pop/bad_romance.jpg", arquivo: "audio/pop/bad_romance.mp3", liked: false, album: "Pop Moderno" },
    { id: 27, nome: "Happy", artista: "Pharrell Williams", genero: "Pop", capa: "img/pop/happy.jpg", arquivo: "audio/pop/happy.mp3", liked: false, album: "Pop Moderno" },
    { id: 28, nome: "Blinding Lights", artista: "The Weeknd", genero: "Pop", capa: "img/pop/blinding_lights.jpg", arquivo: "audio/pop/blinding_lights.mp3", liked: false, album: "Pop Moderno" },
    { id: 29, nome: "Despacito", artista: "Luis Fonsi ft. Daddy Yankee", genero: "Pop", capa: "img/pop/despacito.jpg", arquivo: "audio/pop/despacito.mp3", liked: false, album: "Pop Latino" },
];

const musicasHipHop = [
    { id: 30, nome: "Lose Yourself", artista: "Eminem", genero: "Hip-Hop", capa: "img/hiphop/lose_yourself.jpg", arquivo: "audio/hiphop/lose_yourself.mp3", liked: false, album: "Hip-Hop Clássico" },
    { id: 31, nome: "Juicy", artista: "The Notorious B.I.G.", genero: "Hip-Hop", capa: "img/hiphop/juicy.jpg", arquivo: "audio/hiphop/juicy.mp3", liked: false, album: "Hip-Hop Clássico" },
    { id: 32, nome: "Gold Digger", artista: "Kanye West", genero: "Hip-Hop", capa: "img/hiphop/gold_digger.jpg", arquivo: "audio/hiphop/gold_digger.mp3", liked: false, album: "Hip-Hop Moderno" },
    { id: 33, nome: "HUMBLE.", artista: "Kendrick Lamar", genero: "Hip-Hop", capa: "img/hiphop/humble.jpg", arquivo: "audio/hiphop/humble.mp3", liked: false, album: "Hip-Hop Moderno" },
    { id: 34, nome: "Sicko Mode", artista: "Travis Scott", genero: "Hip-Hop", capa: "img/hiphop/sicko_mode.jpg", arquivo: "audio/hiphop/sicko_mode.mp3", liked: false, album: "Hip-Hop Moderno" },
    { id: 35, nome: "God's Plan", artista: "Drake", genero: "Hip-Hop", capa: "img/hiphop/gods_plan.jpg", arquivo: "audio/hiphop/gods_plan.mp3", liked: false, album: "Hip-Hop Moderno" },
    { id: 36, nome: "Old Town Road", artista: "Lil Nas X", genero: "Hip-Hop", capa: "img/hiphop/old_town_road.jpg", arquivo: "audio/hiphop/old_town_road.mp3", liked: false, album: "Hip-Hop Moderno" },
    { id: 37, nome: "Hotline Bling", artista: "Drake", genero: "Hip-Hop", capa: "img/hiphop/hotline_bling.jpg", arquivo: "audio/hiphop/hotline_bling.mp3", liked: false, album: "Hip-Hop Moderno" },
    { id: 38, nome: "In Da Club", artista: "50 Cent", genero: "Hip-Hop", capa: "img/hiphop/in_da_club.jpg", arquivo: "audio/hiphop/in_da_club.mp3", liked: false, album: "Hip-Hop Clássico" },
    { id: 39, nome: "Rapper's Delight", artista: "Sugarhill Gang", genero: "Hip-Hop", capa: "img/hiphop/rappers_delight.jpg", arquivo: "audio/hiphop/rappers_delight.mp3", liked: false, album: "Hip-Hop Old School" },
];

const musicasFunk = [
    { id: 40, nome: "Baile de Favela", artista: "MC João", genero: "Funk", capa: "img/funk/baile_de_favela.jpg", arquivo: "audio/funk/baile_de_favela.mp3", liked: false, album: "Funk Carioca" },
    { id: 41, nome: "Cerol na Mão", artista: "Bonde do Tigrão", genero: "Funk", capa: "img/funk/cerol_na_mao.jpg", arquivo: "audio/funk/cerol_na_mao.mp3", liked: false, album: "Funk Clássico" },
    { id: 42, nome: "Só Que Não", artista: "MC Livinho", genero: "Funk", capa: "img/funk/so_que_nao.jpg", arquivo: "audio/funk/so_que_nao.mp3", liked: false, album: "Funk Moderno" },
    { id: 43, nome: "Que Tiro Foi Esse", artista: "Jojo Todynho", genero: "Funk", capa: "img/funk/que_tiro_foi_esse.jpg", arquivo: "audio/funk/que_tiro_foi_esse.mp3", liked: false, album: "Funk Moderno" },
    { id: 44, nome: "Deu Onda", artista: "MC G15", genero: "Funk", capa: "img/funk/deu_onda.jpg", arquivo: "audio/funk/deu_onda.mp3", liked: false, album: "Funk Moderno" },
    { id: 45, nome: "Senta Novinha", artista: "MC Naldinho", genero: "Funk", capa: "img/funk/senta_novinha.jpg", arquivo: "audio/funk/senta_novinha.mp3", liked: false, album: "Funk Moderno" },
    { id: 46, nome: "Tudo de Bom", artista: "MC Kekel", genero: "Funk", capa: "img/funk/tudo_de_bom.jpg", arquivo: "audio/funk/tudo_de_bom.mp3", liked: false, album: "Funk Moderno" },
    { id: 47, nome: "Funk do Estudante", artista: "MC Bruninho", genero: "Funk", capa: "img/funk/funk_do_estudante.jpg", arquivo: "audio/funk/funk_do_estudante.mp3", liked: false, album: "Funk Moderno" },
    { id: 48, nome: "Para de Marra", artista: "MC Pedrinho", genero: "Funk", capa: "img/funk/para_de_marra.jpg", arquivo: "audio/funk/para_de_marra.mp3", liked: false, album: "Funk Moderno" },
    { id: 49, nome: "Bumbum Granada", artista: "MC Zaac & Jerry Smith", genero: "Funk", capa: "img/funk/bumbum_granada.jpg", arquivo: "audio/funk/bumbum_granada.mp3", liked: false, album: "Funk Moderno" },
];

const musicasEletronica = [
    { id: 50, nome: "One More Time", artista: "Daft Punk", genero: "Eletrônica", capa: "img/eletronica/one_more_time.jpg", arquivo: "audio/eletronica/one_more_time.mp3", liked: false, album: "Eletrônica Clássica" },
    { id: 51, nome: "Levels", artista: "Avicii", genero: "Eletrônica", capa: "img/eletronica/levels.jpg", arquivo: "audio/eletronica/levels.mp3", liked: false, album: "EDM" },
    { id: 52, nome: "Wake Me Up", artista: "Avicii", genero: "Eletrônica", capa: "img/eletronica/wake_me_up.jpg", arquivo: "audio/eletronica/wake_me_up.mp3", liked: false, album: "EDM" },
    { id: 53, nome: "Strobe", artista: "Deadmau5", genero: "Eletrônica", capa: "img/eletronica/strobe.jpg", arquivo: "audio/eletronica/strobe.mp3", liked: false, album: "House Progressivo" },
    { id: 54, nome: "Titanium", artista: "David Guetta ft. Sia", genero: "Eletrônica", capa: "img/eletronica/titanium.jpg", arquivo: "audio/eletronica/titanium.mp3", liked: false, album: "EDM" },
    { id: 55, nome: "Animals", artista: "Martin Garrix", genero: "Eletrônica", capa: "img/eletronica/animals.jpg", arquivo: "audio/eletronica/animals.mp3", liked: false, album: "Big Room" },
    { id: 56, nome: "Don't You Worry Child", artista: "Swedish House Mafia", genero: "Eletrônica", capa: "img/eletronica/dont_you_worry_child.jpg", arquivo: "audio/eletronica/dont_you_worry_child.mp3", liked: false, album: "EDM" },
    { id: 57, nome: "Clarity", artista: "Zedd ft. Foxes", genero: "Eletrônica", capa: "img/eletronica/clarity.jpg", arquivo: "audio/eletronica/clarity.mp3", liked: false, album: "EDM" },
    { id: 58, nome: "Get Lucky", artista: "Daft Punk ft. Pharrell Williams", genero: "Eletrônica", capa: "img/eletronica/get_lucky.jpg", arquivo: "audio/eletronica/get_lucky.mp3", liked: false, album: "Eletrônica Clássica" },
    { id: 59, nome: "Take Over Control", artista: "Afrojack ft. Eva Simons", genero: "Eletrônica", capa: "img/eletronica/take_over_control.jpg", arquivo: "audio/eletronica/take_over_control.mp3", liked: false, album: "EDM" },
];

// Mapa de gêneros para arrays de músicas
const genreMap = {
    "Sertanejo": musicasSertanejo,
    "Rock": musicasRock,
    "Pop": musicasPop,
    "Hip-Hop": musicasHipHop,
    "Funk": musicasFunk,
    "Eletrônica": musicasEletronica
};

// Estado global
let playlists = [];
let userUploadedSongs = [];
let playlistMusicas = [];

// Seleção de elementos DOM com fallback
const playlistContainer = document.getElementById('playlist') || document.createElement('div');
const playlistsContainer = document.getElementById('playlists-list') || document.createElement('div');
const playlistsSection = document.getElementById('playlists-section') || document.createElement('div');
const mensagemConfirmacao = document.getElementById('mensagem-confirmacao') || document.createElement('div');
const genresContainer = document.getElementById('genres-container') || document.createElement('div');
const mainContainer = document.querySelector('.container-centralizador-grid') || document.createElement('div');
const createPlaylistContainer = document.querySelector('.create-playlist-container') || document.createElement('div');
const textContainer = document.querySelector('.text') || document.createElement('div');
const backButtonContainer = document.querySelector('.back-button-container') || document.createElement('div');

// Função para sanitizar input contra XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input || '';
    return div.innerHTML;
}

// Função para carregar músicas do IndexedDB
function carregarMusicasDoIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('JukeboxDB', 1);

        request.onerror = (event) => {
            console.error('Erro ao abrir o banco de dados:', event.target.error);
            reject([]);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('musicas', 'readonly');
            const store = transaction.objectStore('musicas');
            const getAll = store.getAll();

            getAll.onsuccess = () => {
                resolve(getAll.result || []);
            };

            getAll.onerror = () => {
                console.error('Erro ao recuperar músicas do IndexedDB:', getAll.error);
                reject([]);
            };
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('musicas', { keyPath: 'id', autoIncrement: true });
        };
    });
}

// Função para salvar playlists no localStorage
function savePlaylists() {
    if (isLocalStorageAvailable()) {
        try {
            localStorage.setItem('playlists', JSON.stringify(playlists));
        } catch (e) {
            exibirMensagem('Erro ao salvar playlists no armazenamento local.', 'error');
            console.error('Erro ao salvar playlists:', e);
        }
    } else {
        exibirMensagem('Armazenamento local não disponível.', 'error');
    }
}

// Função para ocultar todos os elementos principais
function hideAllContent() {
    const elements = [
        playlistsSection,
        mainContainer,
        createPlaylistContainer,
        textContainer,
        backButtonContainer,
        playlistContainer,
        document.getElementById('playlist-musicas'),
        document.getElementById('musicas-container'),
        document.getElementById('genres-heading'),
        document.getElementById('genres-container'),
        document.getElementById('playlist-title')
    ];
    elements.forEach(el => {
        if (el) el.style.display = 'none';
    });
    if (playlistContainer) playlistContainer.innerHTML = '';
    if (document.getElementById('musicas-container')) {
        document.getElementById('musicas-container').innerHTML = '';
    }
    console.log('hideAllContent: Todos os elementos principais ocultos');
}

// Função para criar um item de música
function criarItemMusica(musica, playlistContext = null) {
    const musicItem = document.createElement('div');
    musicItem.className = 'music-item';
    musicItem.setAttribute('role', 'listitem');
    musicItem.setAttribute('aria-label', `Música ${sanitizeInput(musica.nome)} por ${sanitizeInput(musica.artista)}`);
    musicItem.innerHTML = `
        <img src="${sanitizeInput(musica.capa) || 'img/Playlist.png'}" alt="Capa de ${sanitizeInput(musica.nome)}" class="music-cover" onerror="this.src='img/Playlist.png'">
        <div class="music-info">
            <h3>${sanitizeInput(musica.nome)}</h3>
            <p>Artista: ${sanitizeInput(musica.artista)}</p>
        </div>
    `;
    musicItem.addEventListener('click', () => {
        let songsToSend = [];
        if (playlistContext) {
            if (playlistContext.type === 'genre') {
                songsToSend = genreMap[playlistContext.genre] || [];
            } else if (playlistContext.type === 'playlist') {
                songsToSend = playlists[playlistContext.index].musicas
                    .map(arquivo => playlistMusicas.find(m => m.arquivo === arquivo))
                    .filter(m => m);
            }
        } else {
            songsToSend = [musica];
        }
        if (songsToSend.length === 0) {
            exibirMensagem('Nenhuma música disponível para reprodução.', 'error');
            return;
        }
        const encodedSongs = encodeURIComponent(JSON.stringify(songsToSend));
        window.location.href = `../Player/index.html?songs=${encodedSongs}&musica=${encodeURIComponent(sanitizeInput(musica.arquivo))}`;
    });
    return musicItem;
}

// Função para limpar a seleção de gênero
function clearGenreSelection() {
    playlistContainer.innerHTML = '';
    document.querySelectorAll('.genre-button').forEach(button => {
        button.classList.remove('selected');
    });
}

// Função para exibir músicas de um gênero específico
function displayGenreTracks(genre) {
    hideAllContent();
    playlistContainer.innerHTML = `
        <div class="playlist-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; width: 100%;">
            <h2>${sanitizeInput(genre)}</h2>
            <button type="button" onclick="voltarParaPaginaInicial()" aria-label="Voltar para a página inicial" style="padding: 0.5rem 1rem; background-color: #8e44ad; color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                <i class="bi bi-arrow-left-circle"></i>
                <span class="visually-hidden">Voltar para a página inicial</span>
            </button>
        </div>
    `;
    const musicas = genreMap[genre] || [];
    musicas.forEach(musica => {
        playlistContainer.appendChild(criarItemMusica(musica, { type: 'genre', genre }));
    });
    playlistContainer.style.display = 'block';
    document.querySelectorAll('.genre-button').forEach(button => {
        button.classList.toggle('selected', button.dataset.genre === genre);
    });
    console.log(`displayGenreTracks: Exibindo gênero ${genre}`);
}

// Função para exibir a playlist inicial
function displayPlaylist() {
    hideAllContent();
    clearGenreSelection();
    if (genresContainer) genresContainer.style.display = 'flex';
    if (document.getElementById('genres-heading')) document.getElementById('genres-heading').style.display = 'block';
    if (textContainer) textContainer.style.display = 'flex';
    if (backButtonContainer) backButtonContainer.style.display = 'block';
    if (createPlaylistContainer) createPlaylistContainer.style.display = 'block';
    if (mainContainer) mainContainer.style.display = 'grid';
    if (playlistsSection) playlistsSection.style.display = 'block';
    console.log('displayPlaylist: Página inicial exibida');
}

// Função para exibir as playlists criadas
function displayPlaylists() {
    playlistsContainer.innerHTML = '';
    playlists.forEach((playlist, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.setAttribute('role', 'listitem');
        playlistItem.setAttribute('aria-label', `Playlist ${sanitizeInput(playlist.nome)}`);
        let primeiraMusica = playlistMusicas.find(m => m.arquivo === playlist.musicas?.[0]);
        let capa = primeiraMusica?.capa || 'img/Playlist.png';
        const defaultImage = 'img/Playlist.png';
        const capaUrl = capa && capa.trim() !== '' ? sanitizeInput(capa) : defaultImage;
        playlistItem.innerHTML = `
            <img src="${capaUrl}" alt="Capa da Playlist ${sanitizeInput(playlist.nome)}" class="music-cover" onerror="this.src='${defaultImage}'">
            <div class="music-info">
                <h3>${sanitizeInput(playlist.nome)}</h3>
            </div>
            <button type="button" class="add-music-button" onclick="abrirModalAdicionarMusicas(${index})" aria-label="Adicionar músicas à playlist ${sanitizeInput(playlist.nome)}">Adicionar Músicas</button>
            <button type="button" class="delete-playlist-button" onclick="excluirPlaylist(${index})" aria-label="Excluir playlist ${sanitizeInput(playlist.nome)}">Excluir</button>
        `;
        playlistItem.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            if (REDIRECT_ON_PLAYLIST_CLICK) {
                const songsToSend = playlist.musicas
                    .map(arquivo => playlistMusicas.find(m => m.arquivo === arquivo))
                    .filter(m => m);
                if (songsToSend.length > 0) {
                    const encodedSongs = encodeURIComponent(JSON.stringify(songsToSend));
                    window.location.href = `../Player/index.html?songs=${encodedSongs}&musica=${encodeURIComponent(sanitizeInput(songsToSend[0].arquivo))}`;
                } else {
                    exibirMensagem("A playlist está vazia!", "error");
                }
            } else {
                exibirMusicasDaPlaylist(index);
            }
        });
        playlistsContainer.appendChild(playlistItem);
    });
}

// Função para exibir as músicas de uma playlist específica
function exibirMusicasDaPlaylist(index) {
    hideAllContent();
    const playlistSection = document.getElementById('playlist-musicas') || document.createElement('div');
    const playlistTitle = document.getElementById('playlist-title') || document.createElement('h2');
    const musicasContainer = document.getElementById('musicas-container') || document.createElement('div');
    
    playlistSection.style.display = 'block';
    playlistTitle.textContent = `Músicas da Playlist "${sanitizeInput(playlists[index].nome)}"`;
    playlistTitle.style.display = 'block';
    musicasContainer.innerHTML = `
        <div class="playlist-header" style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 1rem; width: 100%;">
            <button type="button" onclick="voltarParaPaginaInicial()" aria-label="Voltar para a página inicial da lista de playlists" style="padding: 0.5rem 1rem; background-color: #8e44ad; color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                <i class="bi bi-arrow-left-circle"></i>
                <span class="visually-hidden">Voltar para a página inicial da lista de playlists</span>
            </button>
        </div>
    `;
    const musicas = playlists[index].musicas || [];
    musicas.forEach(arquivoMusica => {
        const musica = playlistMusicas.find(m => m.arquivo === arquivoMusica);
        if (musica) {
            musicasContainer.appendChild(criarItemMusica(musica, { type: 'playlist', index }));
        }
    });
    musicasContainer.style.display = 'block';
    playlistSection.appendChild(playlistTitle);
    playlistSection.appendChild(musicasContainer);
    console.log(`exibirMusicasDaPlaylist: Exibindo músicas da playlist ${playlists[index].nome}`);
}

// Função para voltar para a visualização inicial
function voltarParaPaginaInicial() {
    displayPlaylist();
    displayPlaylists();
    console.log('voltarParaPaginaInicial: Página inicial restaurada');
}

// Função para exibir mensagem de confirmação
function exibirMensagem(msg, type = 'success') {
    mensagemConfirmacao.style.display = 'block';
    mensagemConfirmacao.innerHTML = `<p>${sanitizeInput(msg)}</p>`;
    mensagemConfirmacao.className = `mensagem-confirmacao ${type}`;
    setTimeout(() => {
        mensagemConfirmacao.style.display = 'none';
        mensagemConfirmacao.className = 'mensagem-confirmacao';
    }, 3000);
}

// Função para abrir o modal de criação de playlist
function abrirModal() {
    const modal = document.getElementById('modal') || document.createElement('div');
    modal.style.display = 'flex';
    const nomePlaylistInput = document.getElementById('nome-playlist');
    if (nomePlaylistInput) nomePlaylistInput.value = '';
    const musicSelection = document.getElementById('music-selection');
    if (musicSelection) {
        musicSelection.innerHTML = playlistMusicas.map(musica => `
            <label class="music-option">
                <input type="checkbox" class="music-checkbox" value="${sanitizeInput(musica.arquivo)}">
                ${sanitizeInput(musica.nome)} - ${sanitizeInput(musica.artista)} ${musica.isUserUploaded ? '(Carregada)' : ''}
            </label>
        `).join('');
    }
    if (nomePlaylistInput) nomePlaylistInput.focus();
}

// Função para fechar o modal de criação
function fecharModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
}

// Função para criar a playlist
function criarPlaylist() {
    const nomePlaylistInput = document.getElementById('nome-playlist');
    if (!nomePlaylistInput) {
        exibirMensagem('Erro: Campo de nome da playlist não encontrado.', 'error');
        return;
    }
    const nomePlaylist = nomePlaylistInput.value.trim();
    if (!nomePlaylist) {
        exibirMensagem('Por favor, insira um nome para a playlist!', 'error');
        return;
    }
    const musicasSelecionadas = Array.from(document.querySelectorAll('.music-checkbox:checked')).map(cb => cb.value);
    if (!musicasSelecionadas.length) {
        exibirMensagem('Selecione pelo menos uma música!', 'error');
        return;
    }
    const primeiraMusica = playlistMusicas.find(m => m.arquivo === musicasSelecionadas[0]);
    const imagemCapa = primeiraMusica?.capa || 'img/Playlist.png';
    playlists.push({ 
        nome: nomePlaylist, 
        musicas: musicasSelecionadas, 
        capa: imagemCapa 
    });
    savePlaylists();
    fecharModal();
    exibirMensagem(`Playlist "${sanitizeInput(nomePlaylist)}" criada com sucesso!`);
    displayPlaylists();
    voltarParaPaginaInicial();
}

// Função para abrir o modal de adicionar músicas
function abrirModalAdicionarMusicas(playlistIndex) {
    const modal = document.getElementById('modal-adicionar-musicas') || document.createElement('div');
    modal.style.display = 'flex';
    modal.dataset.playlistIndex = playlistIndex;
    const musicSelection = document.getElementById('music-selection-adicionar');
    if (musicSelection) {
        musicSelection.innerHTML = playlistMusicas.map(musica => `
            <label class="music-option">
                <input type="checkbox" class="music-checkbox-adicionar" value="${sanitizeInput(musica.arquivo)}">
                ${sanitizeInput(musica.nome)} - ${sanitizeInput(musica.artista)} ${musica.isUserUploaded ? '(Carregada)' : ''}
            </label>
        `).join('');
    }
    const firstCheckbox = modal.querySelector('input');
    if (firstCheckbox) firstCheckbox.focus();
}

// Função para fechar o modal de adicionar músicas
function fecharModalAdicionarMusicas() {
    const modal = document.getElementById('modal-adicionar-musicas');
    if (modal) modal.style.display = 'none';
}

// Função para adicionar músicas a uma playlist existente
function adicionarMusicas() {
    const modal = document.getElementById('modal-adicionar-musicas');
    if (!modal || !modal.dataset.playlistIndex) {
        exibirMensagem('Erro: Modal de adicionar músicas não encontrado.', 'error');
        return;
    }
    const playlistIndex = parseInt(modal.dataset.playlistIndex);
    const musicasSelecionadas = Array.from(document.querySelectorAll('.music-checkbox-adicionar:checked')).map(cb => cb.value);
    if (!musicasSelecionadas.length) {
        exibirMensagem('Selecione pelo menos uma música!', 'error');
        return;
    }
    const playlist = playlists[playlistIndex];
    playlist.musicas = [...new Set([...(playlist.musicas || []), ...musicasSelecionadas])];
    savePlaylists();
    fecharModalAdicionarMusicas();
    exibirMensagem(`Músicas adicionadas à playlist "${sanitizeInput(playlist.nome)}"!`);
    displayPlaylists();
    voltarParaPaginaInicial();
}

// Função para excluir uma playlist
function excluirPlaylist(playlistIndex) {
    const playlist = playlists[playlistIndex];
    if (confirm(`Tem certeza que deseja excluir a playlist "${sanitizeInput(playlist.nome)}"?`)) {
        playlists.splice(playlistIndex, 1);
        savePlaylists();
        exibirMensagem('Playlist excluída com sucesso!');
        displayPlaylists();
        voltarParaPaginaInicial();
    }
}

// Função para gerenciar foco em modais (acessibilidade)
function trapFocus(modal) {
    if (!modal) return;
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Inicialização da página
async function init() {
    // Carregar playlists do localStorage
    if (isLocalStorageAvailable()) {
        try {
            playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        } catch (e) {
            exibirMensagem('Erro ao carregar playlists. Dados corrompidos.', 'error');
            console.error('Erro ao carregar playlists:', e);
        }
    } else {
        exibirMensagem('Armazenamento local não disponível. Algumas funcionalidades podem não funcionar.', 'error');
    }

    // Carregar músicas do IndexedDB
    try {
        userUploadedSongs = await carregarMusicasDoIndexedDB();
        playlistMusicas = [
            ...musicasSertanejo,
            ...musicasRock,
            ...musicasPop,
            ...musicasHipHop,
            ...musicasFunk,
            ...musicasEletronica,
            ...userUploadedSongs
        ];
        window.playlistMusicas = playlistMusicas; // Tornar global
    } catch (e) {
        exibirMensagem('Erro ao carregar músicas do usuário.', 'error');
        console.error('Erro ao carregar músicas:', e);
    }

    // Exibir playlists e página inicial
    displayPlaylist();
    displayPlaylists();
}

// Eventos
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModal();
        fecharModalAdicionarMusicas();
    }
});

genresContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('genre-button')) {
        const genre = e.target.dataset.genre;
        displayGenreTracks(genre);
    }
});

document.querySelectorAll('.modal').forEach(modal => trapFocus(modal));

// Iniciar a aplicação
window.onload = init;
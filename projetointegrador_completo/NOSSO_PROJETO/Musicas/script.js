/**
 * Jukebox Music List with Delete Functionality
 * Displays a list of music grouped by genre with options to play or delete user-uploaded songs.
 */

const DB_NAME = 'JukeboxDB';
const DB_VERSION = 1;
const STORE_NAME = 'musicas';
let db;

// Adicionando um ID para as músicas padrão para evitar duplicação com músicas carregadas
// e para permitir a exclusão de IDs específicos se necessário no futuro
const musicasDefault = [
    { id: 'def-alo', nome: "Alo", artista: "Bruno e Barretto", genero: "Sertanejo", capa: "../musicas/img-audios/Music-alo.jpg", arquivo: "../musicas/audio/bruno e barreto-alo.mp3", liked: false, isUserUploaded: false },
    { id: 'def-amordecana', nome: "Amor de Cana", artista: "Bruno e Barretto", genero: "Sertanejo", capa: "../musicas/img-audios/Music-Amor de cana.jpg", arquivo: "../musicas/audio/brunoebarretto-amor-de-cana.mp3", liked: false, album: "Álbum 1", isUserUploaded: false },
    { id: 'def-arrumaumcantinho', nome: "Arruma um Cantinho", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "../musicas/img-audios/Music-Arruma um cantinho.jpg", arquivo: "../musicas/audio/henriqueejulianooficial-arruma-um-cantinho.mp3", liked: false, album: "Álbum 2", isUserUploaded: false },
    { id: 'def-desbeijar', nome: "Desbeijar Minha Boca", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "../musicas/img-audios/Music-deseijar.jpg", arquivo: "../musicas/audio/henriqueejulianooficial-desbeijar-minha-boca.mp3", liked: false, album: "Álbum 2", isUserUploaded: false },
    { id: 'def-amorefe', nome: "Amor e Fe", artista: "Hungria Hip Hop", genero: "Hip-Hop", capa: "../musicas/img-audios/Music-Amor e fe.jpg", arquivo: "../musicas/audio/hungriahiphop-amor-e-fe.mp3", liked: false, album: "Álbum 3", isUserUploaded: false },
    { id: 'def-beijocomtrap', nome: "Beijo com Trap", artista: "Hungria Hip Hop", genero: "Hip-Hop", capa: "../musicas/img-audios/Music-beijo com trap.jpg", arquivo: "../musicas/audio/hungriahiphop-beijo-com-trap.mp3", liked: false, album: "Álbum 3", isUserUploaded: false },
    { id: 'def-coracaodeaco', nome: "Coracao de Aco", artista: "Hungria Hip Hop", genero: "Hip-Hop", capa: "../musicas/img-audios/Music-coraçao de aco.jpg", arquivo: "../musicas/audio/hungriahiphop-coracao-de-aco.mp3", liked: false, album: "Álbum 3", isUserUploaded: false },
    { id: 'def-solinhodobraboj', nome: "Solinho do Brabo", artista: "Japaozin", genero: "Funk", capa: "../musicas/img-audios/Music-solinho brabo.jpg", arquivo: "../musicas/audio/japaozin-solinho-do-brabo.mp3", liked: false, album: "Álbum 4", isUserUploaded: false },
    { id: 'def-amaiorsaudade', nome: "A Maior Saudade", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "../musicas/img-audios/Music-a maior saudade.jpg", arquivo: "../musicas/audio/henrique e juliano-a-maior-saudade.mp3", liked: false, album: "Álbum 2", isUserUploaded: false },
    { id: 'def-euamovoce', nome: "Eu Amo Voce", artista: "Leo Magalhaes", genero: "Sertanejo", capa: "../musicas/img-audios/Music-eu amo voce.jpg", arquivo: "../musicas/audio/leomagalhaes-eu-amo-voce.mp3", liked: false, album: "Álbum 5", isUserUploaded: false },
    { id: 'def-penseemmim', nome: "Pense em Mim", artista: "Leo Magalhaes", genero: "Sertanejo", capa: "../musicas/img-audios/Music-pense em mim.jpg", arquivo: "../musicas/audio/leomagalhaes-pense-em-mim.mp3", liked: false, album: "Álbum 5", isUserUploaded: false },
    { id: 'def-dojobgrelos', nome: "Do Job Grelo da Seresta", artista: "MC Tuto", genero: "Funk", capa: "../musicas/img-audios/Music-Do job Grelo da Seresta.jpg", arquivo: "../musicas/audio/MCTuto2t-do-job-grelo-da-seresta-mc-tuto.mp3", liked: false, album: "Álbum 6", isUserUploaded: false },
    { id: 'def-naomeolhanacara', nome: "Nao Me Olha na Cara", artista: "MC Tuto e MC Joaozinho VT", genero: "Funk", capa: "../musicas/img-audios/Music-Nao Me Olha na Cara.jpg", arquivo: "../musicas/audio/MCTuto2t-nao-me-olha-na-cara-mc-tuto-mc-joaozinho-vt.mp3", liked: false, album: "Álbum 6", isUserUploaded: false },
    { id: 'def-vireicachorro', nome: "Virei Cachorro da Pior Qualidade Gato Preto", artista: "MC Tuto", genero: "Funk", capa: "../musicas/img-audios/music-Virei Cachorro da Pior Qualidade Gato Preto.jpg", arquivo: "../musicas/audio/MCTuto2t-virei-cachorro-da-pior-qualidade-gato-preto-mc-tuto.mp3", liked: false, album: "Álbum 6", isUserUploaded: false },
    { id: 'def-50porcento', nome: "50 Por Cento", artista: "Naiara Azevedo e Marilia Mendonca", genero: "Sertanejo", capa: "../musicas/img-audios/Music-50 Por Cento.jpg", arquivo: "../musicas/audio/naiaraazevedo-50-por-cento-naiara-azevedo-marilia-mendonca.mp3", liked: false, album: "Álbum 7", isUserUploaded: false },
    { id: 'def-tucheira', nome: "Tu cheira", artista: "Biu Do Piseiro", genero: "Piseiro", capa: "../musicas/img-audios/cd_cover.jpeg", arquivo: "../musicas/audio/RASPADINHA AO VIVO.mp3", liked: false, album: "Álbum 8", isUserUploaded: false },
    { id: 'def-evidencias', nome: "Evidências", artista: "Chitãozinho & Xororó", genero: "Sertanejo", capa: "img/sertanejo/evidencias.jpg", arquivo: "../musicas/audio/ep08-evidencias.mp3", liked: false, album: "Álbum 9", isUserUploaded: false },
    { id: 'def-fiodocabelo', nome: "Fio de Cabelo", artista: "Chitãozinho & Xororó", genero: "Sertanejo", capa: "img/sertanejo/fio_de_cabelo.jpg", arquivo: "../Playlist/audio/sertanejo/fio_de_cabelo.mp3", liked: false, album: "Álbum 9", isUserUploaded: false },
    { id: 'def-romaria', nome: "Romaria", artista: "Renato Teixeira", genero: "Sertanejo", capa: "img/sertanejo/romaria.jpg", arquivo: "../Playlistaudio/sertanejo/romaria.mp3", liked: false, album: "Álbum 10", isUserUploaded: false },
    { id: 'def-alo2', nome: "Alô", artista: "Bruno e Marrone", genero: "Sertanejo", capa: "img/sertanejo/alo.jpg", arquivo: "audio/sertanejo/alo.mp3", liked: false, album: "Álbum 11", isUserUploaded: false },
    { id: 'def-amordemadrugada', nome: "Amor de Madrugada", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/amor_de_madrugada.jpg", arquivo: "../Playlistaudio/sertanejo/amor_de_madrugada.mp3", liked: false, album: "Álbum 12", isUserUploaded: false },
    { id: 'def-telefonemudo', nome: "Telefone Mudo", artista: "Zezé Di Camargo & Luciano", genero: "Sertanejo", capa: "img/sertanejo/telefone_mudo.jpg", arquivo: "audio/sertanejo/telefone_mudo.mp3", liked: false, album: "Álbum 13", isUserUploaded: false },
    { id: 'def-amonoitedia', nome: "Amo Noite e Dia", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/amo_noite_e_dia.jpg", arquivo: "../Playlistaudio/sertanejo/amo_noite_e_dia.mp3", liked: false, album: "Álbum 12", isUserUploaded: false },
    { id: 'def-fuifiel', nome: "Fui Fiel", artista: "Jorge e Mateus", genero: "Sertanejo", capa: "img/sertanejo/fui_fiel.jpg", arquivo: "../Playlistaudio/sertanejo/fui_fiel.mp3", liked: false, album: "Álbum 12", isUserUploaded: false },
    { id: 'def-despedidadesolteiro', nome: "Despedida de Solteiro", artista: "Henrique e Juliano", genero: "Sertanejo", capa: "img/sertanejo/despedida_de_soltiero.jpg", arquivo: "../Playlistaudio/sertanejo/despedida_de_soltiero.mp3", liked: false, album: "Álbum 2", isUserUploaded: false }
];


let musicas = [...musicasDefault];

const musicListContainer = document.getElementById('music-list');
const loadedMusicListContainer = document.getElementById('loaded-music-list');
const loadedMusicCountSpan = document.getElementById('loaded-music-count');

if (!musicListContainer) {
    console.error("Elemento 'music-list' não encontrado na página.");
}
if (!loadedMusicListContainer) {
    console.error("Elemento 'loaded-music-list' não encontrado na página.");
}
if (!loadedMusicCountSpan) {
    console.error("Elemento 'loaded-music-count' não encontrado na página.");
}

function abrirBanco() {
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

function carregarMusicasSalvas() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (event) => {
            const musicasSalvas = event.target.result;
            musicasSalvas.forEach(musica => {
                if (musica.isUserUploaded && musica.blob) {
                    const blobUrl = URL.createObjectURL(musica.blob);
                    const songData = {
                        id: musica.id,
                        nome: musica.nome,
                        artista: musica.artista || "Desconhecido",
                        genero: musica.genero || "Desconhecido",
                        capa: musica.capa || "default-cover.jpg",
                        arquivo: blobUrl,
                        album: "Músicas Carregadas",
                        isUserUploaded: true
                    };
                    // Adicionar apenas se ainda não estiver na lista (evitar duplicatas após recarregar)
                    if (!musicas.some(s => s.id === musica.id)) {
                        musicas.push(songData);
                    }
                }
            });
            resolve();
        };

        request.onerror = (event) => reject(event.target.error);
    });
}


async function deleteSongFromDatabase(songId) {
    try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(songId);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log(`Música com ID ${songId} excluída do IndexedDB`);
                // Remove da lista de músicas
                const songIndex = musicas.findIndex(s => s.id === songId);
                if (songIndex !== -1) {
                    const song = musicas[songIndex];
                    if (song.isUserUploaded) {
                        URL.revokeObjectURL(song.arquivo); // Libera o URL do Blob
                    }
                    musicas.splice(songIndex, 1);
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

function groupByGenero(musicasArray) {
    return musicasArray.reduce((grouped, musica) => {
        const genre = musica.genero || "Desconhecido";
        if (!grouped[genre]) {
            grouped[genre] = [];
        }
        grouped[genre].push(musica);
        return grouped;
    }, {});
}

function displayMusicas() {
    if (!musicListContainer || !loadedMusicListContainer || !loadedMusicCountSpan) {
        console.error("Um ou mais elementos de container de música não foram encontrados. Verifique seu HTML.");
        return;
    }

    musicListContainer.innerHTML = '';
    loadedMusicListContainer.innerHTML = '';

    const musicasCarregadas = musicas.filter(m => m.isUserUploaded);
    const musicasPadrao = musicas.filter(m => !m.isUserUploaded);
    const agrupadasPorGenero = groupByGenero(musicasPadrao);

    // Atualizar o contador de músicas carregadas
    loadedMusicCountSpan.textContent = `(${musicasCarregadas.length})`;

    // Renderizar "Músicas Carregadas" no container específico
    if (musicasCarregadas.length > 0) {
        musicasCarregadas.forEach(musica => {
            loadedMusicListContainer.appendChild(renderMusicaItem(musica));
        });
    } else {
        loadedMusicListContainer.innerHTML = "<p class='no-music'>Nenhuma música carregada pelo usuário.</p>";
    }

    // Renderizar músicas por gênero no container principal
    if (musicasPadrao.length === 0 && musicasCarregadas.length === 0) {
        musicListContainer.innerHTML = "<p class='no-music'>Nenhuma música disponível.</p>";
        return;
    }

    for (const [genero, grupo] of Object.entries(agrupadasPorGenero)) {
        const genreSection = document.createElement('div');
        genreSection.classList.add('genre-section');
        genreSection.setAttribute('role', 'region');
        genreSection.setAttribute('aria-labelledby', `genre-${genero.replace(/\s+/g, '-')}-heading`);

        const genreTitle = document.createElement('h2');
        genreTitle.id = `genre-${genero.replace(/\s+/g, '-')}-heading`;
        genreTitle.textContent = genero;
        genreSection.appendChild(genreTitle);

        const musicItemsDiv = document.createElement('div');
        musicItemsDiv.classList.add('music-items-container'); // Um container para os itens dentro da seção de gênero

        grupo.forEach(musica => {
            musicItemsDiv.appendChild(renderMusicaItem(musica));
        });
        genreSection.appendChild(musicItemsDiv);
        musicListContainer.appendChild(genreSection);
    }
}

function renderMusicaItem(musica) {
    const item = document.createElement('div');
    item.classList.add('music-item');
    item.setAttribute('role', 'listitem');
    item.setAttribute('aria-label', `Música: ${musica.nome}, Artista: ${musica.artista}, Gênero: ${musica.genero}`);


    const img = document.createElement('img');
    img.src = musica.capa;
    img.alt = `Capa do álbum '${musica.nome}'`;
    img.classList.add('music-cover');

    const info = document.createElement('div');
    info.classList.add('music-info');

    const nome = document.createElement('h3');
    nome.textContent = musica.nome;

    const artista = document.createElement('p');
    artista.textContent = `Artista: ${musica.artista}`;

    const generoP = document.createElement('p');
    generoP.textContent = `Gênero: ${musica.genero}`;

    info.append(nome, artista, generoP);

    const actions = document.createElement('div');
    actions.classList.add('music-actions');

    const playLink = document.createElement('a');
    playLink.href = musica.isUserUploaded && musica.id
        ? `../Player/index.html?id=${musica.id}`
        : `../Player/index.html?musica=${encodeURIComponent(musica.arquivo)}`;
    playLink.textContent = 'Reproduzir';
    playLink.classList.add('play-button'); // Adicione uma classe para estilização
    playLink.setAttribute('aria-label', `Reproduzir ${musica.nome}`);


    actions.appendChild(playLink);

    if (musica.isUserUploaded && musica.id) {
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.title = `Excluir ${musica.nome}`;
        delBtn.classList.add('delete-button'); // Adicione uma classe para estilização
        delBtn.setAttribute('aria-label', `Excluir ${musica.nome}`);

        delBtn.onclick = async () => {
            if (confirm(`Deseja realmente excluir "${musica.nome}"?`)) {
                try {
                    await deleteSongFromDatabase(musica.id);
                    alert(`Música "${musica.nome}" excluída.`);
                    displayMusicas(); // Recarregar a lista após a exclusão
                } catch (error) {
                    alert('Erro ao excluir a música. Tente novamente.');
                    console.error('Erro ao excluir música:', error);
                }
            }
        };
        actions.appendChild(delBtn);
    }

    item.append(img, info, actions);
    return item;
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await abrirBanco();
        await carregarMusicasSalvas();
        displayMusicas();
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados ou carregar músicas:', error);
        // Se houver um erro, ainda tentamos exibir as músicas padrão
        displayMusicas();
    }
});

// Lógica para o colapsável de Músicas Carregadas no HTML
const loadedMusicDetails = document.querySelector('details.genre-collapsible');
if (loadedMusicDetails) {
    const summary = loadedMusicDetails.querySelector('summary');
    if (summary) {
        summary.addEventListener('click', (e) => {
            // Este evento já é tratado pelo comportamento padrão do <details>/<summary>
            // mas podemos adicionar lógica extra se precisar, como classes para CSS
            if (loadedMusicDetails.hasAttribute('open')) {
                // Se vai fechar
                loadedMusicDetails.setAttribute('aria-expanded', 'false');
            } else {
                // Se vai abrir
                loadedMusicDetails.setAttribute('aria-expanded', 'true');
            }
        });
    }
}
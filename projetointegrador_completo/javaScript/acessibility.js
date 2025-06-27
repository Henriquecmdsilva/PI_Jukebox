// javaScript/accessibility.js

document.addEventListener('DOMContentLoaded', () => {
    const synth = window.speechSynthesis;
    let currentUtterance = null; // Para armazenar a fala atual e poder cancelar

    // Função para ler um texto
    function speakText(text, element = null) {
        if (!synth) {
            console.warn("Web Speech API não suportada neste navegador.");
            return;
        }

        // Se houver uma fala em andamento, cancela
        if (currentUtterance && synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Configurações opcionais da fala (idioma, voz, velocidade, tom)
        utterance.lang = 'pt-BR'; // Define o idioma para Português do Brasil
        // Você pode listar vozes disponíveis e permitir que o usuário escolha
        // const voices = synth.getVoices();
        // utterance.voice = voices.find(voice => voice.lang === 'pt-BR' && voice.name.includes('Google português do Brasil'));
        utterance.rate = 1;   // Velocidade da fala (1 é normal)
        utterance.pitch = 1;  // Tom da fala (1 é normal)

        utterance.onend = () => {
            console.log('Leitura finalizada.');
            currentUtterance = null;
        };

        utterance.onerror = (event) => {
            console.error('Erro na síntese de fala:', event.error);
            currentUtterance = null;
        };

        synth.speak(utterance);
        currentUtterance = utterance; // Armazena a instância da fala
    }

    // Função para parar a leitura
    function stopSpeech() {
        if (synth && synth.speaking) {
            synth.cancel();
            currentUtterance = null;
            console.log('Leitura interrompida.');
        }
    }

    // --- Funcionalidades de Leitura de Tela ---

    // 1. Botão "Ler Introdução" na seção Hero
    // (Agora renomeado para "Ler Conteúdo do Hero" e integrado ao botão de leitura geral ou atalho)
    // O ideal é que o botão "Ouvir Página" já cubra o conteúdo do Hero.

    // 2. Botões "Ler Seção" para as seções de artigo
    const readSectionButtons = document.querySelectorAll('.read-section-button');
    readSectionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const sectionTextDiv = event.target.closest('.section').querySelector('.text');
            if (sectionTextDiv) {
                const title = sectionTextDiv.querySelector('h3')?.textContent || '';
                const paragraphs = Array.from(sectionTextDiv.querySelectorAll('p')).map(p => p.textContent).join(' ');
                const fullText = `${title}. ${paragraphs}`;
                speakText(fullText);
            }
        });
    });

    // 3. Botão global de "Parar Leitura" no header
    const stopReadingButton = document.getElementById('stopReadingButton');
    if (stopReadingButton) {
        stopReadingButton.addEventListener('click', stopSpeech);
    }

    // 4. Botão "Ouvir Página" para ler todo o conteúdo principal
    const readPageContentButton = document.getElementById('readPageContent');
    if (readPageContentButton) {
        readPageContentButton.addEventListener('click', () => {
            const mainContent = document.querySelector('main');
            if (mainContent) {
                // Seleciona apenas os elementos de texto relevantes para leitura linear
                const elementsToRead = mainContent.querySelectorAll(
                    'h1, h2, h3, p, li, a:not([aria-hidden="true"]), button:not([aria-hidden="true"])'
                );

                let fullText = '';
                elementsToRead.forEach(el => {
                    // Ignora conteúdo de elementos dentro de carrosséis, que seriam lidos separadamente
                    if (el.closest('.carousel-inner')) return;

                    let text = el.getAttribute('aria-label') || el.textContent;

                    // Adiciona pontuação para melhor fluidez entre os elementos
                    if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
                        fullText += `Seção: ${text}. `;
                    } else if (el.tagName === 'A' || el.tagName === 'BUTTON') {
                        fullText += `Botão ${text}. `;
                    } else {
                        fullText += `${text}. `;
                    }
                });

                // Limpa múltiplos espaços em branco e quebras de linha
                fullText = fullText.replace(/\s+/g, ' ').trim();
                speakText(fullText);
            }
        });
    }

    // 5. Leitura ao Focar (navegação via teclado - tecla Tab)
    // Isso é essencial para usuários de teclado e leitores de tela.
    document.querySelectorAll('a, button, h2, h3, p, img[alt]').forEach(element => {
        element.addEventListener('focus', () => {
            // Evita ler o botão de "voltar ao topo" se ele não estiver visível
            if (element.id === 'voltarTopo' && !element.classList.contains('mostrar')) {
                return;
            }

            // Para carrosséis, lês os controles de navegação
            if (element.classList.contains('carousel-control-prev') || element.classList.contains('carousel-control-next')) {
                speakText(element.getAttribute('aria-label') || element.textContent);
                return;
            }

            // Para imagens na galeria, lê o alt text
            if (element.tagName === 'IMG' && element.closest('.gallery')) {
                speakText(element.getAttribute('alt') || 'Imagem');
                return;
            }

            // Para links e botões, lê o texto ou aria-label
            if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                speakText(element.getAttribute('aria-label') || element.textContent);
                return;
            }

            // Para títulos e parágrafos, lê o conteúdo
            if (element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'P') {
                // Evita reler parágrafos se um título da mesma seção foi lido recentemente
                const parentSectionText = element.closest('.text');
                if (parentSectionText && parentSectionText.contains(document.activeElement.previousElementSibling)) {
                    // Se o foco veio de um elemento anterior na mesma área de texto, evita leitura excessiva.
                    // Isso é uma heurística e pode ser ajustada.
                    return;
                }
                speakText(element.textContent);
                return;
            }

            // Para o botão de modo escuro, lê o aria-label
            if (element.id === 'darkModeToggle') {
                speakText(element.getAttribute('aria-label') || 'Alternar modo escuro');
            }

             // Para o botão de leitura da página, lê o aria-label
             if (element.id === 'readPageContent') {
                speakText(element.getAttribute('aria-label') || 'Ouvir conteúdo da página');
            }
        });

        element.addEventListener('blur', () => {
            // Pequeno atraso para evitar que a leitura seja cancelada imediatamente
            // se o usuário estiver tabulando rapidamente.
            setTimeout(() => {
                if (!element.contains(document.activeElement)) { // Verifica se o foco saiu completamente
                    stopSpeech();
                }
            }, 100);
        });
    });


    // --- Integração com o Teclado do PC (Atalhos Globais) ---
    // Importante: Adicione event.preventDefault() para evitar que o navegador execute
    // a ação padrão da tecla, se aplicável.

    document.addEventListener('keydown', (event) => {
        // Ignora eventos de teclado quando o modal da galeria estiver aberto
        const modal = document.getElementById('myModal');
        if (modal && modal.style.display === 'flex') {
            return;
        }

        // Verifica se o foco está em um campo de entrada (input, textarea)
        // para não interceptar a digitação do usuário
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // Atalhos Globais:
        // 'P' ou 'p': Ir para o Jukebox Music Player
        if (event.key === 'p' || event.key === 'P') {
            event.preventDefault();
            const playerButton = document.querySelector('.hero .button');
            if (playerButton) {
                playerButton.click();
                speakText('Navegando para o Jukebox Music Player.');
            }
        }

        // 'S' ou 's': Ir para a seção "Sobre"
        if (event.key === 's' || event.key === 'S') {
            event.preventDefault();
            const sobreLink = document.querySelector('header .nav-links a[href="#sobre"]');
            if (sobreLink) {
                sobreLink.click();
                speakText('Navegando para a seção Sobre.');
            }
        }

        // 'D' ou 'd': Alternar Modo Escuro
        if (event.key === 'd' || event.key === 'D') {
            event.preventDefault();
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.click();
                const currentMode = document.body.classList.contains('dark-mode') ? 'escuro' : 'claro';
                speakText(`Modo ${currentMode} ativado.`);
            }
        }

        // 'V' ou 'v': Voltar ao Topo
        if (event.key === 'v' || event.key === 'V') {
            event.preventDefault();
            const backToTopButton = document.getElementById('voltarTopo');
            if (backToTopButton && backToTopButton.classList.contains('mostrar')) {
                backToTopButton.click();
                speakText('Voltando ao topo da página.');
            }
        }

        // 'L' ou 'l': Ativar/Parar Leitura da Página
        if (event.key === 'l' || event.key === 'L') {
            event.preventDefault();
            if (synth.speaking) {
                stopSpeech();
                speakText('Leitura da página interrompida.');
            } else {
                const readPageContentBtn = document.getElementById('readPageContent');
                if (readPageContentBtn) {
                    readPageContentBtn.click();
                    speakText('Iniciando leitura da página.');
                }
            }
        }

        // 'M' ou 'm': Abrir/Fechar Modal da Galeria (se aplicável, com foco na primeira imagem ou botão de fechar)
        if (event.key === 'm' || event.key === 'M') {
            event.preventDefault();
            const galleryImages = document.querySelectorAll('.gallery img');
            if (modal.style.display === 'flex') { // Se o modal está aberto, tenta fechar
                closeModal(); // Assumindo que closeModal() é uma função global ou acessível
                speakText('Galeria de fotos fechada.');
            } else if (galleryImages.length > 0) { // Se o modal está fechado, tenta abrir na primeira imagem
                openModal(0); // Assumindo que openModal(index) é uma função global ou acessível
                speakText('Abrindo galeria de fotos na primeira imagem.');
                // Opcional: focar no botão de fechar ou nos botões de navegação do modal
                setTimeout(() => {
                    const closeModalBtn = document.querySelector('#myModal .close');
                    if (closeModalBtn) closeModalBtn.focus();
                }, 300);
            }
        }

        // Teclas de Seta Esquerda/Direita para carrosséis
        // Estas geralmente são manipuladas pelo próprio Bootstrap quando o carrossel está focado.
        // No entanto, podemos adicionar um controle global para o carrossel visível.
        if (event.key === 'ArrowLeft') {
            const activeCarousel = document.querySelector('.carousel.slide.show, .carousel.slide.active'); // Ajustar seletor
            if (activeCarousel) {
                activeCarousel.querySelector('.carousel-control-prev')?.click();
                speakText('Item anterior do carrossel.');
            }
        }
        if (event.key === 'ArrowRight') {
            const activeCarousel = document.querySelector('.carousel.slide.show, .carousel.slide.active'); // Ajustar seletor
            if (activeCarousel) {
                activeCarousel.querySelector('.carousel-control-next')?.click();
                speakText('Próximo item do carrossel.');
            }
        }
    });

    // Event listener para detectar quando a síntese de fala está ativa
    synth.addEventListener('voiceschanged', () => {
        console.log('Vozes de síntese de fala carregadas.');
        // Aqui você pode habilitar botões de leitura se eles estiverem desabilitados por padrão
    });
});

// Nota: Certifique-se de que `openModal` e `closeModal` da sua galeria de fotos
// estejam definidos no escopo global ou sejam acessíveis de outra forma,
// pois estão sendo chamados no `keydown` listener.
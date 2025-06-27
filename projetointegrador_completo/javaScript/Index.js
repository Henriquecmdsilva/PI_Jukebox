 // Array com os URLs das imagens
 const images = [
    "../image/galeria/equipe.jpg",
    "../image/galeria/evento.jpg",
    "../image/galeria/IMG_20241127_210307.jpg",
    "../image/galeria/IMG_20241127_210319.jpg",
    "../image/galeria/interacao2.jpg",
    "../image/galeria/interacaoJukebox.jpg",
    "../image/galeria/mostrarJukebox.jpg"
];
let currentIndex = 0;

// Função para abrir o modal com a imagem do índice especificado
function openModal(index) {
    currentIndex = index;
    const modal = document.getElementById("myModal");
    const modalImage = document.getElementById("modalImage");
    modalImage.src = images[currentIndex];
    modal.style.display = "flex";
}

// Função para fechar o modal
function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

// Função para ir para a próxima imagem
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length; // Volta ao início se chegar ao fim
    document.getElementById("modalImage").src = images[currentIndex];
}

// Função para ir para a imagem anterior
function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Vai ao final se estiver no início
    document.getElementById("modalImage").src = images[currentIndex];
}

// Fechar o modal ao clicar fora da imagem
window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


const swiper = new Swiper('.swiper', {
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
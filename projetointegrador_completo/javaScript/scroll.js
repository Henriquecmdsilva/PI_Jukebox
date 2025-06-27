// Animação ao rolar a página
const sections = document.querySelectorAll('.section');
const checkVisibility = () => {
    const triggerBottom = window.innerHeight * 0.8;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom && !section.classList.contains('visible')) {
            section.classList.add('visible');
        }
    });
};

// Otimização com debounce para o evento de scroll
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

window.addEventListener('scroll', debounce(checkVisibility, 100));
checkVisibility();

// Botão voltar ao topo
const botaoTopo = document.getElementById('voltarTopo');

if (botaoTopo) {
    // Mostrar ou ocultar botão ao rolar
    const toggleButtonVisibility = () => {
        botaoTopo.classList.toggle('mostrar', window.scrollY > 300);
    };

    window.addEventListener('scroll', debounce(toggleButtonVisibility, 100));

    // Rolar suavemente ao topo
    botaoTopo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    

}




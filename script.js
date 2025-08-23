const sr = ScrollReveal({
        distance: '50px',
        duration: 1000,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        reset: true
        });
        sr.reveal('.timeline-container.left', { origin: 'left' });
        sr.reveal('.timeline-container.right', { origin: 'right' });
        sr.reveal('.year-label', { origin: 'bottom' });

        // Referências aos elementos do DOM
        const cardElements = document.querySelectorAll('.card-timeline');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContentContainer = document.getElementById('modal-content-container');
        const closeBtn = document.getElementById('modal-close-btn');
        const timelineVertical = document.querySelector('.timeline-vertical');

        // Array para armazenar as referências dos cards de detalhe abertos
        const openDetailCards = new Map();

        // Função para fechar um card de detalhe específico com animação
        function closeDetailCard(card) {
            const detailCard = openDetailCards.get(card);
            if (detailCard) {
                detailCard.classList.remove('active');
                setTimeout(() => detailCard.remove(), 500);
                openDetailCards.delete(card);
            }
        }

        // Lógica para cada card da linha do tempo
        cardElements.forEach(card => {
            card.addEventListener('click', () => {
                const contentId = card.getAttribute('data-content');
                const contentElement = document.getElementById(contentId);
                if (!contentElement) return;

                const contentHtml = contentElement.innerHTML;
                
                // Verifica o tamanho da tela para decidir entre modal ou card de detalhe
                if (window.innerWidth > 768) {
                    const parentContainer = card.closest('.timeline-container');
                    const isRight = parentContainer.classList.contains('right');

                    // Se o card de detalhe já está aberto para este card, feche-o
                    if (openDetailCards.has(card)) {
                        closeDetailCard(card);
                        return;
                    }

                    // Fecha qualquer outro card de detalhe que possa estar aberto
                    openDetailCards.forEach((value, key) => {
                        if (key !== card) {
                            closeDetailCard(key);
                        }
                    });

                    // Cria o novo card de detalhe
                    const detailCard = document.createElement('div');
                    detailCard.classList.add('card-detail');
                    detailCard.classList.add(isRight ? 'detail-right' : 'detail-left');
                    detailCard.innerHTML = contentHtml;
                    
                    // Adiciona o card de detalhe ao container principal da linha do tempo
                    timelineVertical.appendChild(detailCard);
                    openDetailCards.set(card, detailCard);

                    // Posiciona o card verticalmente em relação ao card pai
                    const cardRect = card.getBoundingClientRect();
                    const timelineRect = timelineVertical.getBoundingClientRect();
                    const relativeTop = cardRect.top - timelineRect.top + (cardRect.height / 2);
                    detailCard.style.top = `${relativeTop}px`;

                    // Ativa a animação após um pequeno atraso
                    setTimeout(() => {
                        detailCard.classList.add('active');
                    }, 10);

                } else {
                    // Lógica do modal para telas pequenas
                    modalContentContainer.innerHTML = contentHtml;
                    modalOverlay.classList.add('active');
                }
            });
        });

        // Event listener global para fechar cards de detalhe
        document.addEventListener('click', (e) => {
            // Apenas para telas maiores que 768px
            if (window.innerWidth <= 768) return;

            // Se o clique foi fora de qualquer card da timeline ou card de detalhe
            if (!e.target.closest('.card-timeline') && !e.target.closest('.card-detail')) {
                // Itera sobre todos os cards de detalhe abertos e os fecha
                for (const [card, detailCard] of openDetailCards) {
                    closeDetailCard(card);
                }
            }
        });

        // Event listener para fechar o modal ou todos os cards de detalhe com a tecla ESC
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                modalOverlay.classList.remove('active');
                
                if (openDetailCards.size > 0) {
                    for (const [card, detailCard] of openDetailCards) {
                        closeDetailCard(card);
                    }
                }
            }
        });

        // Lógica do modal para telas pequenas 
        closeBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });

        // Lógica de navegação suave 
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetElem = document.getElementById(targetId);
                if (!targetElem) return;

                const elementRect = targetElem.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middleOfScreen = window.innerHeight / 2;
                const scrollTo = absoluteElementTop - middleOfScreen + (elementRect.height / 2);

                window.scrollTo({
                    top: scrollTo,
                    behavior: 'smooth'
                });

                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // ==== MODO ESCURO ====
        const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
        const body = document.body;
        const logoNav = document.querySelector('.logo-nav'); // Adicione esta linha

        // Carregar preferência salva
        if (localStorage.getItem('darkMode') === 'true') {
            body.classList.add('dark-mode');
            logoNav.src = 'logo-white.png'; // Adicione esta linha
            toggleDarkModeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> ';
        }

        // Alternar tema
        toggleDarkModeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const darkModeAtivo = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', darkModeAtivo);

            // Adicione a lógica para trocar o logo aqui
            if (darkModeAtivo) {
                logoNav.src = 'logo-white.png'; // Troca para a logo branca
            } else {
                logoNav.src = 'logo.jpg'; // Volta para a logo original
            }

            toggleDarkModeBtn.innerHTML = darkModeAtivo 
                ? '<i class="fa-solid fa-sun"></i> '
                : '<i class="fa-solid fa-moon"></i> ';
        });

            // Referências para o novo botão e o menu
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');

    // Adiciona um evento de clique ao botão do hambúrguer
    menuToggle.addEventListener('click', () => {
        mainMenu.classList.toggle('active');
    });

    // Fecha o menu ao clicar em um link (opcional, mas melhora a usabilidade)
    mainMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mainMenu.classList.remove('active');
        });
    });

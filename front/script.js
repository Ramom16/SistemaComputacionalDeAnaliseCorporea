document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer para animações de revelação ao rolar a página (Scroll Reveal)
  const revealElements = document.querySelectorAll(".reveal");
  
  const observerOptions = {
    root: null, // usa a viewport do navegador
    threshold: 0.15, // elemento revela quando 15% dele estiver visível
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Deixa de observar após animar uma vez
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    // Adiciona estilos de transição iniciais antes do observer ativar
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    revealObserver.observe(el);
  });

  // Estilo CSS extra adicionado dinamicamente para controlar o estado revelado
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    .reveal.revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(styleSheet);

  // Micro-interação decorativa nos botões e links
  const buttons = document.querySelectorAll(".hero-btn, .saiba-mais-link, .delivery-card");
  
  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Efeito estético de clique simples
      console.log(`Botão ou Card "${btn.textContent.trim() || btn.querySelector('.card-title')?.textContent.trim()}" clicado (apenas decorativo)`);
      
      // Feedback sutil para simular funcionamento
      if (btn.classList.contains("hero-btn")) {
        const target = document.querySelector("#como-funciona");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
});

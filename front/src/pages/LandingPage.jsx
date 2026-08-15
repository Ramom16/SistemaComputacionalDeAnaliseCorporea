import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/intro.css';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';

export default function LandingPage() {
  useEffect(() => {
    // Observador de Interseção para animações de revelação por rolagem
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
      root: null,
      threshold: 0.15,// O threshold vai servir para determinaro o quanto vai ser preciso do elemento estar visivel na tela do cliente para que a animação apareca. No caso, 15% do elemento precisar estar visivel para a animação ser ativada
      rootMargin: '0px 0px -50px 0px',
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });

    // Observador de limpeza ao desmontar o componente
    return () => {
      revealObserver.disconnect();
    };
  }, []);

  // Manipuladores para estilos dinâmicos
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      .reveal.revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleToggleDescription = (e) => {
    const card = e.currentTarget;
    const item = card.closest('.delivery-item');
    const desc = item.querySelector('.delivery-description');
    
    if (desc) {
      desc.classList.toggle('active');
      
      const allItems = document.querySelectorAll('.delivery-item');
      allItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherDesc = otherItem.querySelector('.delivery-description');
          if (otherDesc) otherDesc.classList.remove('active');
        }
      });
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar>
        <li><a href="#como-funciona">O Sistema</a></li>
        <li><a href="#entregas">Benefícios</a></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/cadastro" style={{ color: 'var(--primary-yellow)' }}>Cadastrar</Link></li>
      </Navbar>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title title-slanted">TREINOS<br />PERSONALIZADOS<br />PARA VOCÊ</h1>
          <Link to="/cadastro">
            <button className="hero-btn">Começar agora</button>
          </Link>
        </div>
      </section>

      {/* Seção Como Funciona o Sistema */}
      <section id="como-funciona" className="how-it-works">
        <div className="how-content reveal">
          <h2 className="section-title-yellow title-slanted">COMO FUNCIONA<br />O SISTEMA</h2>
          <p className="how-description">
            O sistema realiza uma análise corporal completa e automatizada com base em dados essenciais como seu peso, altura, idade e nível de atividade física diária. A partir dessas informações, calculamos instantaneamente indicadores cruciais para sua evolução, como o <strong>IMC</strong> (Índice de Massa Corporal), <strong>TMB</strong> (Taxa Metabólica Basal) e o <strong>NDC</strong> (Necessidade Diária de Calorias).
          </p>
          <p className="how-description">
            Após escolher o seu objetivo específico — como emagrecimento saudável, ganho acelerado de massa muscular ou simplesmente manutenção do peso atual —, você recebe recomendações completas de treinos personalizados estruturados especialmente para o seu perfil, incluindo vídeos demonstrativos de cada exercício.
          </p>
          <span className="saiba-mais-link">Saiba mais</span>
        </div>
        
        <div className="how-images reveal">
          <div className="vertical-img-container">
            <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800" alt="Atleta fazendo exercício de musculação na academia" />
          </div>
          <div className="vertical-img-container">
            <img src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800" alt="Atleta feminina treinando com corda naval na academia" />
          </div>
        </div>
      </section>

      {/* Seção O Que o Sistema Entrega */}
      <section id="entregas" className="delivery">
        <div className="delivery-header reveal">
          <h2 className="title-slanted">O QUE O SISTEMA ENTREGA</h2>
          <p>Estamos empenhados em trazer a melhor experiência de treino e performance para você.</p>
        </div>
        
        <div className="delivery-grid reveal">
          {/* Card 1 */}
          <FeatureCard 
            title="TREINOS<br />PERSONALIZADOS"
            paragraphs={[
              "O sistema contará com um módulo de treinos personalizados, responsável por gerar recomendações iniciais de exercícios com base nas características físicas e metabólicas do usuário. A partir de informações como idade, peso, altura, IMC, TMB, NDC e nível de atividade física, a plataforma irá direcionar o praticante conforme seus objetivos, como emagrecimento, hipertrofia ou manutenção corporal.",
              "Essa funcionalidade permitirá maior individualização dos treinos, auxiliando usuários iniciantes e profissionais da área na organização de rotinas mais eficientes, seguras e alinhadas às necessidades de cada indivíduo."
            ]}
            onClick={handleToggleDescription}
          />
          
          {/* Card 2 */}
          <FeatureCard 
            title="ANÁLISE<br />METABÓLICA"
            paragraphs={[
              "O módulo de análise metabólica será responsável pelo processamento automatizado dos dados corporais do usuário, realizando cálculos de indicadores importantes, como Índice de Massa Corporal (IMC), Taxa Metabólica Basal (TMB) e Necessidade Diária de Calorias (NDC).",
              "Com base nesses resultados, o sistema fornecerá uma análise inicial do condicionamento físico e das necessidades energéticas do praticante, auxiliando na interpretação dos dados corporais e oferecendo suporte para a definição de estratégias relacionadas ao treino e à alimentação.",
              "Além disso, essa funcionalidade substituirá processos manuais por uma solução digital mais organizada, prática e eficiente."
            ]}
            onClick={handleToggleDescription}
          />
          
          {/* Card 3 */}
          <FeatureCard 
            title="ACOMPANHAMENTO<br />CORPORAL"
            paragraphs={[
              "O sistema também possuirá um módulo de acompanhamento corporal, desenvolvido para armazenar e organizar o histórico físico dos usuários ao longo do tempo.",
              "A plataforma registrará informações como peso, medidas corporais e indicadores metabólicos, permitindo que o usuário acompanhe sua evolução física de maneira prática e intuitiva. Dessa forma, será possível visualizar resultados, comparar desempenhos e manter um controle contínuo da evolução corporal.",
              "Esse acompanhamento contribuirá para maior motivação, organização e monitoramento do progresso dos praticantes dentro da academia."
            ]}
            onClick={handleToggleDescription}
          />
        </div>
      </section>

      {/* Seção Final / Contato */}
      <section className="contact">
        <div className="contact-content reveal">
          <h2 className="contact-title title-slanted">ENTRE EM CONTATO<br />AINDA HOJE</h2>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="site-footer">
        <div className="footer-content">
          <span className="footer-label">E-MAIL</span>
          <a href="mailto:alo@sitebacana.com.br" className="footer-email">alo@sitebacana.com.br</a>
        </div>
      </footer>
    </>
  );
}

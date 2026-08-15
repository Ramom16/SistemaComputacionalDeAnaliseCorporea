import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/intro.css';

export default function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <header className="navbar">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
            <span className="logo-bar"></span>
          </div>
          <span className="logo-text">IRONFIT</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li><a href="#como-funciona">O Sistema</a></li>
            <li><a href="#entregas">Benefícios</a></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/cadastro" style={{ color: 'var(--primary-yellow)' }}>Cadastrar</Link></li>
          </ul>
        </nav>
      </header>

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
            Após escolher o seu objetivo específico — como emagrecimento saudável, ganho acelerado de massa muscular ou simplesmente manutenção do peso atual —, você recebe recomendações completas de treinos personalizados estruturados especialmente para o seu perfil.
          </p>
          <Link to="/cadastro" className="saiba-mais-link">Saiba mais</Link>
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
          <div className="delivery-card">
            <div className="card-bg"></div>
            <div className="card-overlay"></div>
            <div className="card-content">
              <h3 className="card-title title-slanted">TREINOS<br />PERSONALIZADOS</h3>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="delivery-card">
            <div className="card-bg"></div>
            <div className="card-overlay"></div>
            <div className="card-content">
              <h3 className="card-title title-slanted">ANÁLISE<br />METABÓLICA</h3>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="delivery-card">
            <div className="card-bg"></div>
            <div className="card-overlay"></div>
            <div className="card-content">
              <h3 className="card-title title-slanted">ACOMPANHAMENTO<br />CORPORAL</h3>
            </div>
          </div>
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
          <a href="mailto:contato@ironfit.com.br" className="footer-email">contato@ironfit.com.br</a>
        </div>
      </footer>
    </>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import '../styles/intro.css';

const ENTREGAS = [
  {
    titulo: ['TREINOS', 'PERSONALIZADOS'],
    paragrafos: [
      'O sistema contará com um módulo de treinos personalizados, responsável por gerar recomendações iniciais de exercícios com base nas características físicas e metabólicas do usuário. A partir de informações como idade, peso, altura, IMC, TMB, NDC e nível de atividade física, a plataforma irá direcionar o praticante conforme seus objetivos, como emagrecimento, hipertrofia ou manutenção corporal.',
      'Essa funcionalidade permitirá maior individualização dos treinos, auxiliando usuários iniciantes e profissionais da área na organização de rotinas mais eficientes, seguras e alinhadas às necessidades de cada indivíduo.',
    ],
  },
  {
    titulo: ['ANÁLISE', 'METABÓLICA'],
    paragrafos: [
      'O módulo de análise metabólica será responsável pelo processamento automatizado dos dados corporais do usuário, realizando cálculos de indicadores importantes, como Índice de Massa Corporal (IMC), Taxa Metabólica Basal (TMB) e Necessidade Diária de Calorias (NDC).',
      'Com base nesses resultados, o sistema fornecerá uma análise inicial do condicionamento físico e das necessidades energéticas do praticante, auxiliando na interpretação dos dados corporais e oferecendo suporte para a definição de estratégias relacionadas ao treino e à alimentação.',
      'Além disso, essa funcionalidade substituirá processos manuais por uma solução digital mais organizada, prática e eficiente.',
    ],
  },
  {
    titulo: ['ACOMPANHAMENTO', 'CORPORAL'],
    paragrafos: [
      'O sistema também possuirá um módulo de acompanhamento corporal, desenvolvido para armazenar e organizar o histórico físico dos usuários ao longo do tempo.',
      'A plataforma registrará informações como peso, medidas corporais e indicadores metabólicos, permitindo que o usuário acompanhe sua evolução física de maneira prática e intuitiva. Dessa forma, será possível visualizar resultados, comparar desempenhos e manter um controle contínuo da evolução corporal.',
      'Esse acompanhamento contribuirá para maior motivação, organização e monitoramento do progresso dos praticantes dentro da academia.',
    ],
  },
];

export default function LandingPage() {
  // Um único observador revela os blocos .reveal conforme entram na viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Abre a descrição do card clicado e fecha a dos demais (comportamento exclusivo).
  const handleToggleDescription = (event) => {
    const item = event.currentTarget.closest('.delivery-item');
    const descricao = item?.querySelector('.delivery-description');
    if (!descricao) return;

    const abrir = !descricao.classList.contains('active');
    document.querySelectorAll('.delivery-item').forEach((outro) => {
      outro.querySelector('.delivery-description')
        ?.classList.toggle('active', abrir && outro === item);
    });
  };

  return (
    <>
      <Navbar>
        <li><a href="#como-funciona">O Sistema</a></li>
        <li><a href="#entregas">Benefícios</a></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/cadastro" style={{ color: 'var(--primary-yellow)' }}>Cadastrar</Link></li>
      </Navbar>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title title-slanted">
            TREINOS<br />PERSONALIZADOS<br />PARA VOCÊ
          </h1>
          <Link to="/cadastro" className="hero-btn">Começar agora</Link>
        </div>
      </section>

      <section id="como-funciona" className="how-it-works">
        <div className="how-content reveal">
          <h2 className="section-title-yellow title-slanted">COMO FUNCIONA<br />O SISTEMA</h2>
          <p className="how-description">
            O sistema realiza uma análise corporal completa e automatizada com base em dados
            essenciais como seu peso, altura, idade e nível de atividade física diária. A partir
            dessas informações, calculamos instantaneamente indicadores cruciais para sua evolução,
            como o <strong>IMC</strong> (Índice de Massa Corporal), <strong>TMB</strong> (Taxa
            Metabólica Basal) e o <strong>NDC</strong> (Necessidade Diária de Calorias).
          </p>
          <p className="how-description">
            Após escolher o seu objetivo específico - como emagrecimento saudável, ganho acelerado
            de massa muscular ou simplesmente manutenção do peso atual -, você recebe recomendações
            completas de treinos personalizados estruturados especialmente para o seu perfil,
            incluindo vídeos demonstrativos de cada exercício.
          </p>
          <span className="saiba-mais-link">Saiba mais</span>
        </div>

        <div className="how-images reveal">
          <div className="vertical-img-container">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800"
              alt="Atleta fazendo exercício de musculação na academia"
            />
          </div>
          <div className="vertical-img-container">
            <img
              src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800"
              alt="Atleta feminina treinando com corda naval na academia"
            />
          </div>
        </div>
      </section>

      <section id="entregas" className="delivery">
        <div className="delivery-header reveal">
          <h2 className="title-slanted">O QUE O SISTEMA ENTREGA</h2>
          <p>
            Estamos empenhados em trazer a melhor experiência de treino e performance para você.
          </p>
        </div>

        <div className="delivery-grid reveal">
          {ENTREGAS.map(({ titulo, paragrafos }) => (
            <FeatureCard
              key={titulo.join('-')}
              titulo={titulo}
              paragrafos={paragrafos}
              onClick={handleToggleDescription}
            />
          ))}
        </div>
      </section>

      <section className="contact">
        <div className="contact-content reveal">
          <h2 className="contact-title title-slanted">ENTRE EM CONTATO<br />AINDA HOJE</h2>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-content">
          <span className="footer-label">E-MAIL</span>
          <a href="mailto:alo@sitebacana.com.br" className="footer-email">alo@sitebacana.com.br</a>
        </div>
      </footer>
    </>
  );
}

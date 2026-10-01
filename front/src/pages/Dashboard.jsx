import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { unwrap, getApiError } from '../services/api';
import { getUsuario, limparSessao } from '../services/auth';
import { GENEROS, NIVEIS_ATIVIDADE } from '../constants/dominio';
import DashboardNavbar from '../components/DashboardNavbar';
import '../styles/dashboard.css';

const CAMPOS = [
  { id: 'peso', label: 'Peso (kg)', type: 'number', step: '0.1', placeholder: 'Ex: 75.5' },
  { id: 'altura', label: 'Altura (cm)', type: 'number', placeholder: 'Ex: 178' },
  { id: 'idade', label: 'Idade', type: 'number', placeholder: 'Ex: 25' },
];

const CARD_RESULTADO = [
  {
    chave: 'tmb',
    titulo: 'Taxa Metabólica Basal',
    sigla: 'TMB',
    formatar: (v) => Math.round(v),
    unidade: 'kcal',
    descricao: 'Quantidade mínima de energia que seu corpo precisa apenas para manter as funções vitais em repouso.',
  },
  {
    chave: 'imc',
    titulo: 'Índice de Massa Corporal',
    sigla: 'IMC',
    formatar: (v) => Math.round(v * 10) / 10,
    classificacao: true,
    descricao: 'Indicador de adequação do peso em relação à altura.',
  },
  {
    chave: 'ndc',
    titulo: 'Necessidade Diária de Calorias',
    sigla: 'NDC',
    formatar: (v) => Math.round(v),
    unidade: 'kcal',
    descricao: 'Total de calorias gastas no dia.',
  },
];

function obterClassificacaoIMC(imc) {
  const val = Number(imc);
  if (!val || Number.isNaN(val)) return '';
  if (val < 18.5) return 'Abaixo do peso';
  if (val < 25) return 'Peso normal';
  if (val < 30) return 'Sobrepeso';
  if (val < 35) return 'Obesidade Grau I';
  if (val < 40) return 'Obesidade Grau II';
  return 'Obesidade Grau III';
}

function CardResultado({ card, resultados }) {
  const valor = resultados ? card.formatar(resultados[card.chave]) : '---';
  const classificacao = card.classificacao && (resultados?.classificacao_imc || obterClassificacaoIMC(resultados?.imc));

  return (
    <div className="result-table-card">
      <div className="table-header">
        <h4>{card.titulo}</h4>
        <span className="table-badge">{card.sigla}</span>
      </div>
      <div className="table-content">
        <div>
          <span className="result-value">{valor}</span>
          {card.unidade && <span className="result-unit">{card.unidade}</span>}
        </div>
        <div className="result-desc">
          {classificacao ? <strong>{classificacao}</strong> : card.descricao}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = getUsuario();

  const [form, setForm] = useState({ peso: '', altura: '', idade: '', sexo: 'Masculino', nivelAtividade: 'Sedentario' });
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [sugestoes, setSugestoes] = useState([]);
  const [sugestoesCarregadas, setSugestoesCarregadas] = useState(false);

  useEffect(() => {
    if (!usuario.id) return;

    api.get(`/dadosCorporais/usuario/${usuario.id}`)
      .then((res) => {
        const [calculo] = res.data.calculos ?? [];
        if (calculo) setResultados(calculo);
      })
      .catch((err) => console.error('Erro ao buscar cálculos salvos:', getApiError(err)));
  }, [usuario.id]);

  // Separado do handleSubmit: antes ficava preso ao closure do render
  // anterior, onde `resultados` ainda era null e o guard abortava a busca.
  useEffect(() => {
    if (!resultados) return;

    let ativo = true;

    api.get('/treinos')
      .then((res) => { if (ativo) setSugestoes(unwrap(res).slice(0, 3)); })
      .catch((err) => console.error('Erro ao buscar treinos recomendados:', getApiError(err)))
      .finally(() => { if (ativo) setSugestoesCarregadas(true); });

    return () => { ativo = false; };
  }, [resultados]);

  const loadingSugestoes = Boolean(resultados) && !sugestoesCarregadas;

  const alterarCampo = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const salvarCalculos = async (payload) => {
    try {
      const { data } = await api.post('/dadosCorporais', payload);
      return data.dados.calculos;
    } catch (erro) {
      if (erro.response?.data?.erro !== 'Usuário já possui dados corporais') throw erro;
      const { data } = await api.put(`/dadosCorporais/${payload.idUsuario}`, payload);
      return data.dados.calculos;
    }
  };

  const handleCalcular = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const payload = {
      idUsuario: usuario.id,
      peso_kg: parseFloat(form.peso),
      altura_cm: parseFloat(form.altura),
      idade: parseInt(form.idade, 10),
      genero: form.sexo,
      nivel_atividade: form.nivelAtividade,
    };

    try {
      setResultados(await salvarCalculos(payload));
      setMsg({ texto: 'Cálculos realizados com sucesso!', tipo: 'sucesso' });
    } catch (erro) {
      if ([401, 403].includes(erro.response?.status)) {
        limparSessao();
        navigate('/login', { replace: true });
        return;
      }
      setMsg({ texto: getApiError(erro, 'Erro ao conectar com a API'), tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="dashboard-layout">
        <main className="dashboard-content">
          <section className="welcome-section">
            <h1 className="welcome-title">Olá, <span>{usuario.nome || 'Atleta'}</span></h1>
            <p className="welcome-desc">
              Bem-vindo ao sistema! Aqui você vai poder calcular seu TMB, IMC e NDC,
              trabalhar com seus exercícios e acompanhar sua evolução física de perto.
            </p>
          </section>

          <section className="calculator-section">
            <div className="calc-card">
              <h3>Calculadora Metabólica</h3>

              <form className="form-grid" onSubmit={handleCalcular}>
                {CAMPOS.map((campo) => (
                  <div className="input-group" key={campo.id}>
                    <label htmlFor={campo.id}>{campo.label}</label>
                    <input
                      id={campo.id}
                      name={campo.id}
                      type={campo.type}
                      step={campo.step}
                      placeholder={campo.placeholder}
                      value={form[campo.id]}
                      onChange={alterarCampo}
                      required
                    />
                  </div>
                ))}

                <div className="input-group">
                  <label htmlFor="sexo">Sexo Biológico</label>
                  <select id="sexo" name="sexo" value={form.sexo} onChange={alterarCampo} required>
                    {GENEROS.map((genero) => <option key={genero} value={genero}>{genero}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="atividade">Nível de Atividade Física</label>
                  <select
                    id="atividade"
                    name="nivelAtividade"
                    value={form.nivelAtividade}
                    onChange={alterarCampo}
                    required
                  >
                    {NIVEIS_ATIVIDADE.map(([valor, rotulo]) => (
                      <option key={valor} value={valor}>{rotulo}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-calc" disabled={loading}>
                  {loading ? 'Calculando...' : 'Calcular'}
                </button>
              </form>

              {msg && <p className={`calc-feedback ${msg.tipo}`}>{msg.texto}</p>}
            </div>

            <div className="results-section">
              {CARD_RESULTADO.map((card) => (
                <CardResultado key={card.chave} card={card} resultados={resultados} />
              ))}

              {resultados?.agua_diaria_litros != null && (
                <p className="sugestoes-vazio">
                  Recomendação de água: <strong>{resultados.agua_diaria_litros} litros</strong> por dia.
                </p>
              )}
            </div>
          </section>

          {resultados && (
            <section className="treinos-recomendados-section">
              <div className="sugestoes-header">
                <h2 className="sugestoes-titulo">💪 Treinos Recomendados para Você</h2>
                <Link to="/meus-treinos" className="dica-btn-ver-tudo">Ver todos →</Link>
              </div>

              {loadingSugestoes ? (
                <p className="sugestoes-vazio">Carregando treinos personalizados...</p>
              ) : sugestoes.length > 0 ? (
                <div className="sugestoes-grid">
                  {sugestoes.map((treino) => {
                    const id = treino.idTreino ?? treino.id;
                    return (
                      <article key={id} className="sugestao-card" onClick={() => navigate(`/treino/${id}`)}>
                        <div className="sugestao-topo">
                          <h3 className="sugestao-titulo">{treino.titulo || `Treino ${treino.objetivo}`}</h3>
                          <span className="sugestao-badge">{treino.objetivo || 'Geral'}</span>
                        </div>
                        <p className="sugestao-descricao">
                          {treino.descricao || 'Treino personalizado para seu perfil'}
                        </p>
                        <div className="sugestao-meta">
                          <span>🎯 {treino.nivel || 'Iniciante'}</span>
                          {treino.treinoExercicios && <span>💪 {treino.treinoExercicios.length} exercícios</span>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="sugestoes-vazio">
                  Nenhum treino disponível no momento.{' '}
                  <Link to="/meus-treinos" className="dica-btn-ver-tudo">Confira todos os treinos</Link>
                </p>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
}

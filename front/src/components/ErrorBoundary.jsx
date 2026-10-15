import { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/erro.css';

/**
 * Fronteira de erro global: impede o "ecrã branco" caso um componente
 * lance durante a renderização. Mostra um fallback no Dark Theme.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { temErro: false };
  }

  static getDerivedStateFromError() {
    return { temErro: true };
  }

  componentDidCatch(error, info) {
    console.error('Erro não tratado na interface:', error, info);
  }

  handleTentarNovamente = () => {
    this.setState({ temErro: false });
  };

  render() {
    if (!this.state.temErro) return this.props.children;

    return (
      <div className="erro-global">
        <div className="erro-global-card" role="alert">
          <h1>Algo correu mal</h1>
          <p>
            Ocorreu um erro inesperado ao apresentar esta página.
            Pode tentar novamente ou voltar ao início.
          </p>
          <div className="erro-global-acoes">
            <button
              type="button"
              className="btn-secundario"
              onClick={this.handleTentarNovamente}
            >
              Tentar novamente
            </button>
            <Link className="btn-primario" to="/" onClick={this.handleTentarNovamente}>
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const tokenInicial = searchParams.get("token") || "";
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(tokenInicial);
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [tipoMsg, setTipoMsg] = useState("");

  const solicitarRecuperacao = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const response = await api.post("/auth/solicitar-recuperacao", { email });
      setTipoMsg("sucesso");
      setMsg(response.data.msg || "Verifique seu e-mail para continuar.");
    } catch (error) {
      setTipoMsg("erro");
      setMsg(error.response?.data?.erro || "Não foi possível solicitar a recuperação.");
    } finally {
      setLoading(false);
    }
  };

  const redefinirSenha = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const response = await api.post("/auth/redefinir-senha", {
        token: token.trim(),
        novaSenha,
      });
      setTipoMsg("sucesso");
      setMsg(response.data.msg || "Senha alterada com sucesso.");
      setNovaSenha("");
    } catch (error) {
      setTipoMsg("erro");
      setMsg(error.response?.data?.erro || "Não foi possível redefinir sua senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>Recuperar senha</h1>
        <p>Solicite um link ou informe o token recebido para criar uma nova senha.</p>

        <form onSubmit={solicitarRecuperacao} style={styles.form}>
          <h2>Solicitar link</h2>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </button>
        </form>

        <form onSubmit={redefinirSenha} style={styles.form}>
          <h2>Definir nova senha</h2>
          <label htmlFor="token">Token</label>
          <input
            id="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
          <label htmlFor="novaSenha">Nova senha</label>
          <input
            id="novaSenha"
            type="password"
            minLength="6"
            value={novaSenha}
            onChange={(event) => setNovaSenha(event.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>

        {msg && <p style={{ color: tipoMsg === "erro" ? "#c62828" : "#237a3b" }}>{msg}</p>}
        <Link to="/login">Voltar para o login</Link>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "2rem",
    background: "#f4f4f4",
    color: "#222",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    padding: "2rem",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  },
  form: {
    display: "grid",
    gap: "0.65rem",
    marginTop: "1.5rem",
  },
};

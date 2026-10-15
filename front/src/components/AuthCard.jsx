/** Card centralizado das telas utilitárias (verificação de e-mail, recuperação). */
export default function AuthCard({ titulo, children }) {
  return (
    <main className="auth-card-page">
      <section className="auth-card">
        <h1>{titulo}</h1>
        {children}
      </section>
    </main>
  );
}

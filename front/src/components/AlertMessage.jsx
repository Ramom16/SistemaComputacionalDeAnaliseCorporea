export default function AlertMessage({ msg }) {
  if (!msg?.texto) return null;

  return <p id="msg" className={msg.tipo}>{msg.texto}</p>;
}

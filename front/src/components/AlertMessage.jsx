import React from 'react';

export default function AlertMessage({ msg }) {
  if (!msg || !msg.text) return null;
  
  return (
    <p id="msg" className={msg.type}>{msg.text}</p>
  );
}

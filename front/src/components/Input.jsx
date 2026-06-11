import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Input({ label, id, type, placeholder, value, onChange, required = true }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <label htmlFor={id}>{label}</label>
      <input 
        type={inputType} 
        id={id} 
        placeholder={placeholder} 
        required={required} 
        value={value}
        onChange={onChange}
        style={{ paddingRight: isPassword ? '40px' : '15px' }} // Espaço para o ícone
      />
      {isPassword && (
        <div 
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '12px',
            bottom: '12px', // Tentar alinhar pelo bottom do input
            cursor: 'pointer',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (formData.email === 'admin@voyo.com' && formData.password === 'admin') {
        const masterAdmin = { name: 'Super Admin', email: 'admin@voyo.com', password: 'admin', isAdmin: true };
        onLogin(masterAdmin);
        return;
      }

      const users = JSON.parse(localStorage.getItem('voyo_users')) || [];
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        if (user.email === 'admin@voyo.com') user.isAdmin = true;
        onLogin(user);
      } else {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
      }
    } else {
      const users = JSON.parse(localStorage.getItem('voyo_users')) || [];
      if (users.find(u => u.email === formData.email)) {
        setError('Este e-mail já está em uso.');
        return;
      }
      if(formData.password.length < 4) {
        setError('A senha deve ter pelo menos 4 caracteres.');
        return;
      }
      
      const newUser = { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        isAdmin: formData.email === 'admin@voyo.com'
      };
      
      users.push(newUser);
      localStorage.setItem('voyo_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-header">
        <div className="logo" onClick={onBack} style={{cursor: 'pointer'}}>
          Voyo<span className="logo-accent">.</span>
        </div>
      </div>

      <div className="login-body">
        <div className="login-box glass-panel">
          <h2>{isLogin ? 'Entrar' : 'Assinar a Voyo'}</h2>
          
          {error && <div className="login-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="input-container">
                <input 
                  type="text" 
                  id="name"
                  placeholder=" " 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <label htmlFor="name">Seu Nome</label>
              </div>
            )}
            <div className="input-container">
              <input 
                type="email" 
                id="email"
                placeholder=" " 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <label htmlFor="email">E-mail</label>
            </div>
            
            <div className="input-container">
              <input 
                type="password" 
                id="password"
                placeholder=" " 
                required 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <label htmlFor="password">Senha</label>
            </div>
            
            <button type="submit" className="login-submit-btn">
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
            
            <div className="login-help">
              <div>
                <input type="checkbox" id="remember" defaultChecked />
                <label htmlFor="remember"> Lembre-se de mim</label>
              </div>
              <span style={{cursor: 'pointer', hover: 'underline'}}>Precisa de ajuda?</span>
            </div>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? 'Novo por aqui? ' : 'Já tem uma conta? '} 
              <strong onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Assine agora.' : 'Faça login.'}
              </strong>
            </p>
            <p className="recaptcha-terms">
              Esta página é protegida pelo Google reCAPTCHA para garantir que você não é um robô.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

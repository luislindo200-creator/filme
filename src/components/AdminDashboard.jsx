import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard({ onBack }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const saved = JSON.parse(localStorage.getItem('voyo_users')) || [];
    setUsers(saved);
  };

  const handleDeleteUser = (email) => {
    if (email === 'admin@voyo.com') {
      alert("Operação Negada: O Super Admin não pode ser deletado.");
      return;
    }
    if(window.confirm(`ATENÇÃO: Deseja apagar permanentemente a conta [${email}] e todo o seu histórico do banco de dados?`)) {
      const updated = users.filter(u => u.email !== email);
      localStorage.setItem('voyo_users', JSON.stringify(updated));
      // Remove arquivos vinculados do storage
      localStorage.removeItem(`voyo_myList_${email}`);
      localStorage.removeItem(`voyo_history_${email}`);
      setUsers(updated);
    }
  };

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="admin-header glass-panel">
        <div className="container flex-between" style={{alignItems: 'center', padding: '1rem 0'}}>
          <h1>🛡️ Painel Super Admin</h1>
          <button className="back-btn" onClick={onBack}>← Fechar Painel</button>
        </div>
      </div>

      <div className="container admin-content">
        <div className="admin-stats">
          <div className="stat-card glass-panel">
            <h3>Total de Usuários Cadastrados</h3>
            <p className="highlight">{users.length}</p>
          </div>
          <div className="stat-card glass-panel">
            <h3>Modo Criança Ativo</h3>
            <p className="highlight">{users.filter(u => u.isKidMode).length}</p>
          </div>
        </div>

        <div className="admin-table-container glass-panel">
          <h2>Contas Registradas no Banco de Dados Local</h2>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome do Usuário</th>
                  <th>E-mail</th>
                  <th>Senha (Acesso Direto)</th>
                  <th>Privilégios / Tags</th>
                  <th>Ações de Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.email}>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} width="30" height="30" style={{borderRadius: '50%', border: '1px solid var(--accent)'}}/>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td style={{fontFamily: 'monospace', letterSpacing: '2px', color: '#ffb142'}}>{u.password}</td>
                    <td style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                      {u.isAdmin || u.email === 'admin@voyo.com' ? <span className="badge badge-admin">Master Admin</span> : <span className="badge badge-user">Standard</span>}
                      {u.isKidMode && <span className="badge badge-kid">Controle Parental</span>}
                    </td>
                    <td>
                      {!(u.isAdmin || u.email === 'admin@voyo.com') ? (
                        <button className="delete-user-btn" onClick={() => handleDeleteUser(u.email)}>
                          Deletar Conta
                        </button>
                      ) : (
                        <span style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Protegido</span>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Nenhum usuário encontrado no sistema.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

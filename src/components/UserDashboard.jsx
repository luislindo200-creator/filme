import React, { useState } from 'react';
import MediaGrid from './MediaGrid';
import './UserDashboard.css';

export default function UserDashboard({ myList, history, onSelectMedia, currentUser, onLogout, onClearList, onUpdateUser, onGoToAdmin }) {
  const [activeTab, setActiveTab] = useState('overview'); 
  
  // Settings Form State
  const [formData, setFormData] = useState({ 
    name: currentUser.name, 
    password: currentUser.password,
    isKidMode: currentUser.isKidMode || false
  });
  const [message, setMessage] = useState('');

  if (!currentUser) return null;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if(formData.password.length < 4) {
      setMessage("Senha muito curta."); return;
    }
    const success = onUpdateUser(formData);
    if(success) setMessage("Configurações salvas com sucesso!");
    setTimeout(() => setMessage(''), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content animate-fade-in">
            <h2 className="tab-title">Visão Geral da Conta</h2>
            <div className="info-cards">
              <div className="info-card glass-panel">
                <h3>Sua Assinatura</h3>
                <p className="highlight">Voyo Premium 4K</p>
                <p>R$ 39,90 / mês</p>
                <p className="small-text">Próxima cobrança em 30 dias</p>
              </div>
              <div className="info-card glass-panel">
                <h3>Suas Estatísticas</h3>
                <p><strong>{myList.length}</strong> filmes salvos</p>
                <p><strong>{history.length}</strong> títulos assistidos</p>
              </div>
            </div>
            
            <div className="danger-zone glass-panel">
              <h3>Gerenciar Lista</h3>
              <p>Deseja recomeçar? Você pode limpar todos os seus favoritos.</p>
              <button className="danger-btn" onClick={onClearList}>Esvaziar Minha Lista</button>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="tab-content animate-fade-in">
            {myList.length > 0 ? (
              <MediaGrid title="Minha Lista" items={myList} onSelect={onSelectMedia} wrap={true} />
            ) : (
              <div className="empty-state">
                <h2>Sua lista está vazia.</h2>
                <p>Navegue pelo catálogo e favorite o que quiser assistir depois.</p>
              </div>
            )}
          </div>
        );
      case 'history':
        return (
          <div className="tab-content animate-fade-in">
            {history.length > 0 ? (
              <MediaGrid title="Assistidos Recentemente" items={history} onSelect={onSelectMedia} wrap={true} />
            ) : (
              <div className="empty-state">
                <h2>Sem histórico.</h2>
                <p>Você ainda não deu play em nenhum título.</p>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="tab-content animate-fade-in settings-form-container">
            <h2 className="tab-title">Configurações do Perfil</h2>
            {message && <div className="settings-msg">{message}</div>}
            
            <form onSubmit={handleSaveSettings} className="settings-form">
              <div className="input-group">
                <label>Nome do Perfil</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
              </div>
              
              <div className="input-group">
                <label>Sua Senha</label>
                <input type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required/>
              </div>
              
              <div className="toggle-group glass-panel">
                <div className="toggle-info">
                  <h4>Modo Criança (Controle Parental)</h4>
                  <p>Oculta filmes de Ação Explícita e Terror da tela inicial.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={formData.isKidMode} 
                    onChange={e => {
                      const newValue = e.target.checked;
                      setFormData({...formData, isKidMode: newValue});
                      onUpdateUser({ ...formData, isKidMode: newValue });
                    }} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              
              <button type="submit" className="save-btn">Salvar Alterações</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-dashboard animate-fade-in" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div className="dashboard-container">
        
        {/* Sidebar */}
        <aside className="dashboard-sidebar glass-panel">
          <div className="sidebar-profile">
            <div className="avatar-wrapper">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} alt="Avatar" />
            </div>
            <h3>{currentUser.name}</h3>
            <p>{currentUser.email}</p>
          </div>
          
          <nav className="sidebar-nav">
            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>📊 Visão Geral</button>
            <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}>❤️ Minha Lista</button>
            <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>🕒 Histórico</button>
            <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>⚙️ Configurações</button>
            
            {(currentUser.isAdmin || currentUser.email === 'admin@voyo.com') && (
               <button 
                  onClick={onGoToAdmin} 
                  style={{marginTop: '1rem', border: '1px solid #e50914', color: '#e50914'}}
               >
                 🛡️ Painel Admin
               </button>
            )}
          </nav>
          
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={onLogout}>Sair da Conta</button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="dashboard-main">
          {renderContent()}
        </main>

      </div>
    </div>
  );
}

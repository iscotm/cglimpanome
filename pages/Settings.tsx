import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Lock, 
  Moon, 
  Database, 
  Save, 
  Download, 
  Trash2,
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  Bell,
  FileText,
  ShieldCheck,
  X,
  Calendar,
  Clock
} from 'lucide-react';

const Settings = () => {
  const { 
    userProfile, 
    updateProfile, 
    updatePassword, 
    darkMode, 
    toggleDarkMode,
    clients, contracts, payments, lists, expenses 
  } = useApp();
  
  // --- Estados Existentes ---
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // --- Estados do Novo Protocolo (Adicionado) ---
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [showProtocolSuccess, setShowProtocolSuccess] = useState(false);
  const [isProtocolLoading, setIsProtocolLoading] = useState(false);
  const [protocolFormData, setProtocolFormData] = useState({ nome: '', documento: '' });
  const [protocolInfo, setProtocolInfo] = useState({ date: '', id: '' });

  // Initialize form with context data
  useEffect(() => {
    setProfileForm({ name: userProfile.name, email: userProfile.email });
  }, [userProfile]);

  // --- Funções Existentes ---
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) return;
    
    updateProfile(profileForm.name, profileForm.email);
    showMessage('Perfil atualizado com sucesso!', 'success');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('As senhas não coincidem.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      showMessage('A senha deve ter pelo menos 4 caracteres.', 'error');
      return;
    }

    updatePassword(passwordForm.newPassword);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    showMessage('Senha alterada com sucesso!', 'success');
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      clients,
      contracts,
      payments,
      lists,
      expenses
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "crm_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleResetData = () => {
    if (window.confirm('ATENÇÃO: Isso apagará TODOS os dados locais. Essa ação não pode ser desfeita. Tem certeza?')) {
      if (window.confirm('Confirmação final: Deseja realmente limpar o sistema?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-transform ${checked ? 'left-6' : 'left-1'}`}></div>
    </button>
  );

  // --- Funções do Protocolo (Adicionado) ---
  const formatDocument = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 14);

    if (limited.length <= 11) {
      return limited
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return limited
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  const handleProtocolDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDocument(e.target.value);
    setProtocolFormData({ ...protocolFormData, documento: formattedValue });
  };

  const handleProtocolar = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProtocolLoading(true);
    
    setTimeout(() => {
      const agora = new Date();
      const dataFormatada = agora.toLocaleDateString('pt-BR');
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      setProtocolInfo({
        date: `${dataFormatada} às ${horaFormatada}`,
        id: Math.floor(Math.random() * 999999).toString().padStart(6, '0')
      });
      
      setIsProtocolLoading(false);
      setShowProtocolModal(false);
      setShowProtocolSuccess(true);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Configurações</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie seu perfil, segurança e aparência.</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid gap-8">
        
        {/* Perfil */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <User size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Perfil do Usuário</h2>
          </div>
          
          <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nome de Exibição</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-medium focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">E-mail de Acesso</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-medium focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                    />
                  </div>
               </div>
            </div>
            <div className="flex justify-end">
               <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 flex items-center gap-2">
                 <Save size={18} /> Salvar Perfil
               </button>
            </div>
          </form>
        </section>

        {/* Segurança */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-2xl">
              <Lock size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Segurança</h2>
          </div>
          
          <form onSubmit={handleSavePassword} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nova Senha</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="••••••"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-medium focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Confirmar Senha</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    placeholder="••••••"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-medium focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
                  />
               </div>
            </div>
            <div className="flex justify-end">
               <button type="submit" disabled={!passwordForm.newPassword} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-100 dark:shadow-none transition-all active:scale-95 flex items-center gap-2">
                 <Lock size={18} /> Alterar Senha
               </button>
            </div>
          </form>
        </section>

        {/* Notificações e Protocolos (Nova Seção) */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-2xl">
              <Bell size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Notificações</h2>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-700">
             <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                <FileText size={32} className="text-indigo-500" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Central de Protocolos</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6">
               Gere protocolos manuais de atendimento e confirmação de documentos para seus clientes de forma rápida.
             </p>
             <button 
                onClick={() => setShowProtocolModal(true)}
                className="group relative bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-3"
              >
                <FileText size={20} className="group-hover:rotate-12 transition-transform" />
                Gerar Novo Protocolo
              </button>
          </div>
        </section>

        {/* Aparência */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl">
              <Moon size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Aparência</h2>
          </div>
          
           <div className="max-w-2xl">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${darkMode ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                    <Moon size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-lg">Modo Escuro</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Alternar entre tema claro e escuro.</p>
                  </div>
                </div>
                <Toggle checked={darkMode} onChange={toggleDarkMode} />
              </div>
          </div>
        </section>

        {/* Gerenciamento de Dados (Utility) */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-indigo-400 to-rose-400"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl">
              <Database size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Gerenciamento de Dados</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
              <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <Download size={18} className="text-indigo-600 dark:text-indigo-400" /> Exportar Backup
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Baixe um arquivo JSON contendo todos os clientes, contratos e histórico financeiro.</p>
              <button 
                onClick={handleExportData}
                className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
              >
                Baixar Dados
              </button>
            </div>

            <div className="p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/10 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
              <h3 className="font-bold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-2">
                <Trash2 size={18} /> Resetar Sistema
              </h3>
              <p className="text-sm text-rose-600/70 dark:text-rose-400/70 mb-4">Ação irreversível. Apaga todo o banco de dados local do navegador para reiniciar o uso.</p>
              <button 
                onClick={handleResetData}
                className="w-full py-3 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-600 hover:text-white transition-all"
              >
                Limpar Tudo
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* MODAL DE PROTOCOLO */}
      {showProtocolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Protocolar</h3>
              </div>
              <button onClick={() => setShowProtocolModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleProtocolar} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 ml-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  placeholder="Nome do titular"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  value={protocolFormData.nome}
                  onChange={(e) => setProtocolFormData({...protocolFormData, nome: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 ml-1">CPF ou CNPJ (apenas números)</label>
                <input 
                  required
                  type="text" 
                  placeholder="000.000.000-00"
                  maxLength={18}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono"
                  value={protocolFormData.documento}
                  onChange={handleProtocolDocumentChange}
                />
              </div>
              
              <button 
                type="submit"
                disabled={isProtocolLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {isProtocolLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Confirmar Protocolo"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO DO PROTOCOLO */}
      {showProtocolSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-indigo-900/20 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-90 slide-in-from-bottom-10 duration-500">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600" />
            
            <div className="p-10 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full scale-150 animate-ping opacity-25" />
                <div className="relative w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200 dark:shadow-none border-4 border-white dark:border-slate-800">
                  <CheckCircle2 size={48} color="white" strokeWidth={3} />
                </div>
              </div>

              <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2 italic tracking-tight underline decoration-emerald-400 decoration-4 underline-offset-4">
                PROTOCOLADO! ✅
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 px-4 leading-relaxed text-sm">
                O registro para <span className="text-slate-800 dark:text-white font-bold underline decoration-indigo-200">{protocolFormData.nome}</span> ({protocolFormData.documento}) foi concluído com sucesso.
              </p>

              <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 space-y-4 mb-8 text-left">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Calendar size={16} />
                    <span>Data e Hora</span>
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{protocolInfo.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <FileText size={16} />
                    <span>Nº do Ticket</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                    #{protocolInfo.id}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Clock size={14} />
                    <span>Status Global</span>
                  </div>
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm shadow-emerald-100 dark:shadow-none">
                    Verificado
                  </span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowProtocolSuccess(false);
                  setProtocolFormData({ nome: '', documento: '' });
                }}
                className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 active:scale-95 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 dark:shadow-none"
              >
                Fechar Comprovante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
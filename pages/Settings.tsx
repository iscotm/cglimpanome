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
  Clock,
  Fingerprint,
  Copy,
  ArrowRight,
  Ticket
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
  const [isProtocolClosing, setIsProtocolClosing] = useState(false);

  const handleCloseProtocol = () => {
    setIsProtocolClosing(true);
    setTimeout(() => {
      setShowProtocolSuccess(false);
      setIsProtocolClosing(false);
      setProtocolFormData({ nome: '', documento: '' });
    }, 700);
  };

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
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
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
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
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
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
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
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
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
                  onChange={(e) => setProtocolFormData({ ...protocolFormData, nome: e.target.value })}
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans antialiased">
          {/* Overlay de Vidro (Backdrop) */}
          {!isProtocolClosing && (
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-[8px] animate-in fade-in duration-700" />
          )}

          {/* Estrutura do Modal */}
          <div
            className={`relative w-full max-w-[400px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-white dark:border-slate-700 overflow-hidden transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isProtocolClosing ? "translate-y-12 opacity-0 scale-95" : "translate-y-0 opacity-100 scale-100 animate-in zoom-in-90 slide-in-from-bottom-10"
              }`}
          >
            {/* Gradiente de topo ultra-fino */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-teal-400 to-sky-400" />

            <div className="px-10 pt-14 pb-12">

              {/* Ícone Minimalista de Confirmação */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={3} />
                  </div>
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                  Protocolado
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-1 text-center">
                  Registo efetuado com sucesso.
                </p>
              </div>

              {/* Card de Identificação - Revertido para Titular do Registo */}
              <div className="bg-slate-50/80 dark:bg-slate-900/80 rounded-[2rem] p-5 mb-8 border border-slate-100/50 dark:border-slate-700/50 flex items-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 group">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors duration-300">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Titular do Registo</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-none">{protocolFormData.nome}</span>
                </div>
              </div>

              {/* Tabela de Informações */}
              <div className="space-y-6 px-1 mb-10 text-left">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Data e Hora
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{protocolInfo.date}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Documento <Fingerprint className="w-3 h-3" />
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{protocolFormData.documento}</span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent opacity-50" />

                {/* Secção do Ticket */}
                <div className="relative">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block text-center">
                    Identificador Único (Ticket)
                  </span>
                  <button
                    onClick={() => {
                      const textField = document.createElement('textarea');
                      textField.innerText = protocolInfo.id;
                      document.body.appendChild(textField);
                      textField.select();
                      document.execCommand('copy');
                      textField.remove();
                      showMessage('ID copiado!', 'success');
                    }}
                    className="w-full bg-slate-900 dark:bg-slate-950 group relative flex items-center justify-center py-5 rounded-[1.5rem] transition-all duration-300 hover:bg-slate-800 dark:hover:bg-slate-900 active:scale-[0.98] shadow-lg shadow-slate-200 dark:shadow-none"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-white font-mono text-2xl font-black tracking-widest">
                        #{protocolInfo.id}
                      </span>
                    </div>

                    <div className="absolute right-4 p-2 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Copy className="w-5 h-5 text-white/50" />
                    </div>
                  </button>
                </div>
              </div>

              {/* CTA de Fechar */}
              <button
                onClick={handleCloseProtocol}
                className="group flex items-center justify-center gap-2 w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sair do Comprovante
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

            </div>

            {/* Botão de Saída Rápida */}
            <button
              onClick={handleCloseProtocol}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/50 dark:bg-slate-700/50 backdrop-blur-md p-2 rounded-full border border-white dark:border-slate-600"
            >
              <X size={5} className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
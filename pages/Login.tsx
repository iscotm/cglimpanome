import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('E-mail ou senha incorretos.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Erro ao realizar login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-bg flex items-center justify-center p-4 relative overflow-hidden">

      {/* Floating Orbs */}
      <div className="absolute top-20 left-[10%] w-64 h-64 bg-navy-400/20 rounded-full blur-3xl orb-1"></div>
      <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-navy-300/15 rounded-full blur-3xl orb-2"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-navy-500/10 rounded-full blur-3xl orb-3"></div>

      <div className="w-full max-w-md animate-float-slow relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-navy-900/30 overflow-hidden border border-white/20">

          {/* Header Visual */}
          <div className="bg-gradient-to-br from-navy-800 via-navy-700 to-navy-600 p-10 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            {/* Subtle radial glow behind logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-6 z-10 overflow-hidden border-4 border-white/20 animate-pulse-glow">
              <img src="/logo.png" alt="Logo GC" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white relative z-10">GC Limpa Nome</h1>
            <p className="text-navy-200 mt-2 text-sm font-medium relative z-10">CRM Operacional e Financeiro</p>
          </div>

          {/* Form */}
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center text-sm font-medium animate-in slide-in-from-top-2">
                  <AlertCircle size={18} className="mr-2 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-navy-700 transition-colors" />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-navy-500/30 focus:bg-white transition-all"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-navy-700 transition-colors" />
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="••••••"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-navy-500/30 focus:bg-white transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl bg-navy-700 text-white font-bold text-lg shadow-lg shadow-navy-900/30 hover:bg-navy-800 hover:shadow-navy-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={20} /> Entrar
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">© 2024 GC Limpa Nome. Acesso restrito.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
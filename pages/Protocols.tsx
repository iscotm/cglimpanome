import React, { useState } from 'react';
import {
  CheckCircle2,
  FileText,
  X,
  Clock,
  Calendar,
  ShieldCheck,
  Copy,
  Check,
  User,
  Fingerprint,
  ArrowRight,
  Ticket
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Protocols = () => {
  const { addClient } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: '', documento: '' });
  const [protocolInfo, setProtocolInfo] = useState({ date: '', id: '' });
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsClosing(false);
      setFormData({ nome: '', documento: '' });
    }, 700);
  };

  const handleCopy = () => {
    const textField = document.createElement('textarea');
    textField.innerText = protocolInfo.id;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Função para aplicar máscara de CPF/CNPJ
  const formatDocument = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');

    // Limita a 14 dígitos (tamanho máximo de CNPJ)
    const limited = digits.slice(0, 14);

    if (limited.length <= 11) {
      // Máscara CPF: 000.000.000-00
      return limited
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Máscara CNPJ: 00.000.000/0000-00
      return limited
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDocument(e.target.value);
    setFormData({ ...formData, documento: formattedValue });
  };

  const handleProtocolar = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const agora = new Date();
      const dataFormatada = agora.toLocaleDateString('pt-BR');
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      setProtocolInfo({
        date: `${dataFormatada} às ${horaFormatada}`,
        id: Math.floor(Math.random() * 999999).toString().padStart(6, '0')
      });

      // Cadastrar como novo cliente
      addClient({
        name: formData.nome,
        document: formData.documento,
        phone: '',
        email: '',
        notes: 'Cadastrado via Central de Protocolos'
      });

      setIsLoading(false);
      setShowModal(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Protocolado!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Gere comprovantes de atendimento e recebimento.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative bg-white/95 backdrop-blur-xl rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-white p-16 min-h-[450px] overflow-hidden">
        {/* Gradiente de topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-teal-400 to-sky-400" />

        <div className="absolute -top-24 -right-24 w-64 h-64 bg-navy-500/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />

        <div className="relative mb-8 p-8 bg-emerald-50 rounded-[2.5rem] shadow-inner">
          <ShieldCheck size={72} className="text-emerald-500 animate-in zoom-in duration-700" />
          <div className="absolute -inset-2 bg-emerald-400/10 rounded-[3rem] blur-xl animate-pulse" />
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Novo Protocolo</h2>
        <p className="text-slate-400 text-center max-w-md mb-10 text-lg font-medium leading-relaxed">
          Registre atendimentos e gere comprovantes digitais com verificação global instantânea.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="group relative bg-slate-900 hover:bg-slate-800 text-white px-12 py-5 rounded-[2rem] font-bold shadow-2xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-4 text-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-sky-400 opacity-0 group-hover:opacity-10 transition-opacity" />
          <FileText size={28} className="group-hover:rotate-12 transition-transform text-emerald-400" />
          Gerar Novo Protocolo
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform opacity-50" />
        </button>
      </div>

      {/* MODAL DE FORMULÁRIO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[8px] animate-in fade-in duration-500">
          <div className="relative w-full max-w-[420px] bg-white/95 backdrop-blur-xl rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-white overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Gradiente de topo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 via-teal-400 to-sky-400" />

            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-emerald-500" size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Protocolar</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-full border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleProtocolar} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <User size={12} /> Nome Completo
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nome do titular"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-300 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white outline-none transition-all font-medium"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Fingerprint size={12} /> Documento (CPF/CNPJ)
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={18}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder:text-slate-300 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white outline-none transition-all font-mono font-bold"
                    value={formData.documento}
                    onChange={handleDocumentChange}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Confirmar Protocolo
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO DO PROTOCOLO */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans antialiased">
          {/* Overlay de Vidro (Backdrop) */}
          {!isClosing && (
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-[8px] animate-in fade-in duration-700" />
          )}

          {/* Estrutura do Modal */}
          <div 
            className={`relative w-full max-w-[400px] bg-white/95 backdrop-blur-xl rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-white overflow-hidden transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
              isClosing ? "translate-y-12 opacity-0 scale-95" : "translate-y-0 opacity-100 scale-100 animate-in zoom-in-90 slide-in-from-bottom-10"
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
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </div>
                </div>
                
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
                  Protocolado
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-1 text-center">
                  Registo efetuado com sucesso.
                </p>
              </div>

              {/* Card de Identificação - Revertido para Titular do Registo */}
              <div className="bg-slate-50/80 rounded-[2rem] p-5 mb-8 border border-slate-100/50 flex items-center gap-4 transition-all hover:bg-slate-50 group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors duration-300">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Titular do Registo</span>
                  <span className="text-sm font-bold text-slate-700 leading-none">{formData.nome}</span>
                </div>
              </div>

              {/* Tabela de Informações */}
              <div className="space-y-6 px-1 mb-10 text-left">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Data e Hora
                    </span>
                    <span className="text-xs font-bold text-slate-600">{protocolInfo.date}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      Documento <Fingerprint className="w-3 h-3" />
                    </span>
                    <span className="text-xs font-bold text-slate-600">{formData.documento}</span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50" />

                {/* Secção do Ticket */}
                <div className="relative">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block text-center">
                    Identificador Único (Ticket)
                  </span>
                  <button 
                    onClick={handleCopy}
                    className="w-full bg-slate-900 group relative flex items-center justify-center py-5 rounded-[1.5rem] transition-all duration-300 hover:bg-slate-800 active:scale-[0.98] shadow-lg shadow-slate-200"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-white font-mono text-2xl font-black tracking-widest">
                        #{protocolInfo.id}
                      </span>
                    </div>
                    
                    <div className="absolute right-4 p-2 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-white/50" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* CTA de Fechar */}
              <button 
                onClick={handleClose}
                className="group flex items-center justify-center gap-2 w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Sair do Comprovante
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              
            </div>

            {/* Botão de Saída Rápida */}
            <button 
              onClick={handleClose}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur-md p-2 rounded-full border border-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notificação de Cópia Overlay */}
          {copied && (
            <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top-10 duration-500 font-bold text-sm flex items-center gap-3 z-[70]">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={4} />
              </div>
              Copiado para a área de transferência
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Protocols;
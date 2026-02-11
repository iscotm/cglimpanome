import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  X, 
  Clock, 
  Calendar, 
  ShieldCheck 
} from 'lucide-react';

const Protocols = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: '', documento: '' });
  const [protocolInfo, setProtocolInfo] = useState({ date: '', id: '' });

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

      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 p-10 min-h-[400px]">
        <div className="mb-6 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-full animate-in zoom-in duration-500">
           <ShieldCheck size={64} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Novo Protocolo</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 text-lg">
           Clique no botão abaixo para iniciar o registro de um novo protocolo de atendimento ou confirmação de documentos.
        </p>
        <button 
          onClick={() => setShowModal(true)}
          className="group relative bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-3 text-lg"
        >
          <FileText size={24} className="group-hover:rotate-12 transition-transform" />
          Gerar Novo Protocolo
        </button>
      </div>

      {/* MODAL DE FORMULÁRIO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Protocolar</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
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
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
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
                  value={formData.documento}
                  onChange={handleDocumentChange}
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
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
      {showSuccess && (
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
                O registro para <span className="text-slate-800 dark:text-white font-bold underline decoration-indigo-200">{formData.nome}</span> ({formData.documento}) foi concluído com sucesso.
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
                  setShowSuccess(false);
                  setFormData({ nome: '', documento: '' });
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

export default Protocols;
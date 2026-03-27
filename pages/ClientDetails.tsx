import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, STATUS_LABELS, STATUS_COLORS, formatDate } from '../constants';
import { Plus, ArrowLeft, Phone, Mail, FileText, Calendar, Edit2, ShieldCheck, CheckCircle2, X, Copy, Fingerprint, ArrowRight, User } from 'lucide-react';

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients, contracts, addContract, updateContract } = useApp();
  const [isContractModalOpen, setContractModalOpen] = useState(false);
  const [isEditValueModalOpen, setEditValueModalOpen] = useState(false);
  const [newContract, setNewContract] = useState({ totalValue: 0, downPayment: 0, installments: 1 });
  const [editingContract, setEditingContract] = useState<{ id: string, totalValue: number } | null>(null);
  const [editTotalValue, setEditTotalValue] = useState('');

  // Protocol state
  const [showProtocolSuccess, setShowProtocolSuccess] = useState(false);
  const [isProtocolLoading, setIsProtocolLoading] = useState(false);
  const [isProtocolClosing, setIsProtocolClosing] = useState(false);
  const [protocolInfo, setProtocolInfo] = useState({ date: '', id: '' });

  const client = clients.find(c => c.id === clientId);
  const clientContracts = contracts.filter(c => c.clientId === clientId);

  if (!client) return <div className="p-8 text-center">Cliente não encontrado</div>;

  const handleAddContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContract.totalValue <= 0) return;

    addContract({
      clientId: client.id,
      totalValue: Number(newContract.totalValue),
      downPayment: Number(newContract.downPayment),
      installments: Number(newContract.installments)
    });
    setContractModalOpen(false);
    setNewContract({ totalValue: 0, downPayment: 0, installments: 1 });
  };

  const handleUpdateValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContract || !editTotalValue || isNaN(Number(editTotalValue))) return;
    await updateContract(editingContract.id, { totalValue: Number(editTotalValue) });
    setEditValueModalOpen(false);
    setEditingContract(null);
  };

  const handleGenerateProtocol = () => {
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
      setShowProtocolSuccess(true);
    }, 1200);
  };

  const handleCloseProtocol = () => {
    setIsProtocolClosing(true);
    setTimeout(() => {
      setShowProtocolSuccess(false);
      setIsProtocolClosing(false);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-2">
        <Link to="/clients" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-sm font-medium text-slate-500">Voltar para Clientes</span>
      </div>

      {/* Header Card */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-navy-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-navy-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  {client.document}
                </span>
                <span className="flex items-center text-sm text-slate-600">
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> {client.phone}
                </span>
                <span className="flex items-center text-sm text-slate-600">
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> {client.email}
                </span>
              </div>
              {client.notes && (
                <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-2xl p-4 max-w-2xl">
                  <p className="text-sm text-yellow-800 italic">"{client.notes}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => setContractModalOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 bg-navy-700 hover:bg-navy-800 text-white text-sm font-bold rounded-2xl shadow-lg shadow-navy-200 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Contrato
            </button>
            <button
              onClick={handleGenerateProtocol}
              disabled={isProtocolLoading}
              className="inline-flex items-center justify-center px-6 py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm font-bold rounded-2xl border border-sky-200 transition-all hover:scale-105 active:scale-95"
            >
              {isProtocolLoading ? (
                <div className="w-5 h-5 border-2 border-sky-300 border-t-sky-700 rounded-full animate-spin mr-2" />
              ) : (
                <FileText className="h-5 w-5 mr-2" />
              )}
              Gerar Protocolo
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-navy-500" />
          Contratos ({clientContracts.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clientContracts.map(contract => (
            <div key={contract.id} className="relative group/card">
              <Link to={`/contracts/${contract.id}`} className="block h-full">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:border-navy-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center text-slate-500 text-xs font-medium">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {formatDate(contract.createdAt)}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${STATUS_COLORS[contract.status]}`}>
                      {STATUS_LABELS[contract.status]}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Valor Total</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(contract.totalValue)}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Entrada</span>
                        <span className="font-medium text-emerald-600">
                          {contract.downPayment > 0 ? formatCurrency(contract.downPayment) : '-'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block">Parcelamento</span>
                        <span className="font-medium text-slate-700">
                          {contract.installments}x {formatCurrency((contract.totalValue - contract.downPayment) / contract.installments)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setEditingContract({ id: contract.id, totalValue: contract.totalValue });
                  setEditTotalValue(contract.totalValue.toString());
                  setEditValueModalOpen(true);
                }}
                className="absolute top-4 right-20 p-2 bg-white border border-slate-200 text-slate-400 hover:text-navy-700 hover:border-navy-300 rounded-xl shadow-sm opacity-0 group-hover/card:opacity-100 transition-all z-10"
                title="Editar Valor"
              >
                <Edit2 size={14} />
              </button>
            </div>
          ))}

          {clientContracts.length === 0 && (
            <div className="col-span-full bg-slate-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-500">
              <FileText className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">Nenhum contrato cadastrado.</p>
              <button onClick={() => setContractModalOpen(true)} className="mt-2 text-sm text-navy-700 hover:underline">
                Clique para criar o primeiro
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Contract Modal */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setContractModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative z-10 transform transition-all">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Novo Contrato</h2>
            <form onSubmit={handleAddContract} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Total</label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-lg font-bold">R$</span>
                  </div>
                  <input type="number" step="0.01" required className="pl-12 block w-full border-slate-300 rounded-2xl focus:ring-navy-500 focus:border-navy-500 py-4 text-lg font-bold text-slate-900 bg-slate-50"
                    value={newContract.totalValue} onChange={e => setNewContract({ ...newContract, totalValue: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Entrada</label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm">R$</span>
                    </div>
                    <input type="number" step="0.01" className="pl-10 block w-full border-slate-300 rounded-2xl focus:ring-navy-500 focus:border-navy-500 py-3 text-slate-900 bg-slate-50"
                      value={newContract.downPayment} onChange={e => setNewContract({ ...newContract, downPayment: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Parcelas</label>
                  <input type="number" min="1" max="24" className="block w-full border-slate-300 rounded-2xl focus:ring-navy-500 focus:border-navy-500 py-3 shadow-sm text-slate-900 bg-slate-50"
                    value={newContract.installments} onChange={e => setNewContract({ ...newContract, installments: Number(e.target.value) })} />
                </div>
              </div>

              <div className="bg-navy-50 rounded-2xl p-4 text-sm text-navy-900 border border-navy-100">
                <p className="flex justify-between"><span>Valor Parcelado:</span> <span>{formatCurrency(newContract.totalValue - newContract.downPayment)}</span></p>
                <p className="flex justify-between font-bold mt-1"><span>Valor da Parcela:</span> <span>{formatCurrency((newContract.totalValue - newContract.downPayment) / (newContract.installments || 1))}</span></p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setContractModalOpen(false)} className="px-6 py-3 border border-slate-300 rounded-2xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-navy-700 hover:bg-navy-800 text-white rounded-2xl text-sm font-bold shadow-md shadow-navy-200 transition-colors">Criar Contrato</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Value Modal */}
      {isEditValueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setEditValueModalOpen(false); setEditingContract(null); }}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10 border-t-4 border-navy-500">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Editar Valor Total</h3>
            <p className="text-sm text-slate-500 mb-6">Altere o valor principal do contrato.</p>
            <form onSubmit={handleUpdateValue} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Novo Valor Total</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 text-sm font-bold">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="pl-11 block w-full border-slate-300 rounded-2xl focus:ring-navy-500 focus:border-navy-500 py-3 shadow-sm text-slate-900 font-bold text-lg bg-slate-50"
                    value={editTotalValue}
                    onChange={e => setEditTotalValue(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setEditValueModalOpen(false); setEditingContract(null); }} className="px-6 py-3 border border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-navy-700 hover:bg-navy-800 text-white rounded-2xl font-bold shadow-md shadow-navy-200">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Protocol Success Modal (New Premium Design) */}
      {showProtocolSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans antialiased text-slate-900">
          {!isProtocolClosing && (
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-[8px] animate-in fade-in duration-700" onClick={handleCloseProtocol} />
          )}
          
          <div
            className={`relative w-full max-w-[440px] bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden border border-white transform transition-all duration-700 ${
              isProtocolClosing
                ? 'translate-y-12 opacity-0 scale-95'
                : 'translate-y-0 opacity-100 scale-100 animate-in zoom-in-95 slide-in-from-bottom-10'
            }`}
          >
            {/* Minimalist Close Button */}
            <button 
              onClick={handleCloseProtocol}
              className="absolute top-8 right-8 p-2.5 bg-slate-50 rounded-full text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all z-20"
            >
              <X size={18} />
            </button>

            {/* Vibrant Status Bar */}
            <div className="h-2 w-full bg-blue-600" />

            <div className="p-10 flex flex-col items-center">
              
              {/* Success Icon with Aura */}
              <div className="mb-10 mt-4 relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_15px_40px_-10px_rgba(37,99,235,0.4)] relative z-10">
                  <CheckCircle2 size={40} className="text-white" strokeWidth={3} />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Sistema Verificado</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
                  Protocolado
                </h1>
                <p className="text-slate-400 font-medium text-sm">
                  Seu registro foi autenticado com sucesso.
                </p>
              </div>

              {/* Client Box */}
              <div className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 mb-10 flex flex-col items-center gap-4 group hover:bg-white hover:border-blue-100 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                  <User size={24} />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Titular do Registro</span>
                  <p className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    {client.name}
                  </p>
                </div>
              </div>

              {/* Detail Data */}
              <div className="w-full grid grid-cols-2 gap-8 mb-16 px-2">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400">
                    <Calendar size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Data de Emissão</span>
                  </div>
                  <p className="text-[13px] font-bold text-slate-700">{protocolInfo.date}</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400">
                    <Fingerprint size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Identificação</span>
                  </div>
                  <p className="text-[13px] font-bold text-slate-700">{client.document}</p>
                </div>
              </div>

              {/* Ticket ID Box (Integrated from old design but styled like new) */}
              <div className="w-full mb-10 relative">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block text-center">
                  Identificador Único (Ticket)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(protocolInfo.id);
                    alert('ID copiado!');
                  }}
                  className="w-full bg-slate-900 group/ticket relative flex items-center justify-center py-5 rounded-[1.5rem] transition-all duration-300 hover:bg-blue-600 active:scale-[0.98] shadow-lg shadow-slate-200"
                >
                  <span className="text-white font-mono text-2xl font-black tracking-widest">#{protocolInfo.id}</span>
                  <div className="absolute right-4 p-2 bg-white/10 rounded-xl opacity-0 group-hover/ticket:opacity-100 transition-opacity">
                    <Copy className="w-5 h-5 text-white/50" />
                  </div>
                </button>
              </div>

              {/* Exit Button */}
              <button 
                onClick={handleCloseProtocol}
                className="w-full py-5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group"
              >
                Sair do Comprovante
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Digital Signature */}
            <div className="mb-8 text-center flex flex-col items-center gap-2 opacity-30">
              <div className="h-px w-12 bg-slate-400 mb-2" />
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Autenticação Digital Ativa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
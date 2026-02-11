import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDateTime, STATUS_LABELS, STATUS_COLORS } from '../constants';
import { ArrowLeft, DollarSign, History, AlertTriangle, CheckCircle, Wallet, Calendar, Edit2 } from 'lucide-react';

const ContractDetails = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const { contracts, clients, payments, events, addPayment, getContractBalance, returnContract, updateContract } = useApp();

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);
  const [isEditValueModalOpen, setEditValueModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ amount: '', method: 'PIX', notes: '' });
  const [returnReason, setReturnReason] = useState('');
  const [newTotalValue, setNewTotalValue] = useState('');

  const contract = contracts.find(c => c.id === contractId);
  const client = contract ? clients.find(c => c.id === contract.clientId) : null;

  // Sort descending
  const contractPayments = payments.filter(p => p.contractId === contractId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const contractEvents = events.filter(e => e.contractId === contractId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!contract || !client) return <div>Contrato não encontrado</div>;

  const balance = getContractBalance(contract.id);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.amount) return;
    addPayment({
      contractId: contract.id,
      amount: Number(newPayment.amount),
      date: new Date().toISOString(),
      method: newPayment.method,
      notes: newPayment.notes
    });
    setPaymentModalOpen(false);
    setNewPayment({ amount: '', method: 'PIX', notes: '' });
  };

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason) return;
    returnContract(contract.id, returnReason);
    setReturnModalOpen(false);
    setReturnReason('');
  };

  const handleUpdateValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTotalValue || isNaN(Number(newTotalValue))) return;
    await updateContract(contract.id, { totalValue: Number(newTotalValue) });
    setEditValueModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <Link to={`/clients/${client.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {contract.status === 'completed' && (
          <button onClick={() => setReturnModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors border border-red-200">
            <AlertTriangle className="h-4 w-4 mr-1.5" /> Registrar Retorno
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Payments */}
        <div className="lg:col-span-2 space-y-6">

          {/* Status Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Contrato <span className="text-slate-400 font-normal text-base">#{contract.id.slice(0, 8)}</span>
                  </h2>
                  <p className="text-slate-500 mt-1">Cliente: <span className="font-semibold text-slate-700">{client.name}</span></p>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold shadow-sm border ${STATUS_COLORS[contract.status]}`}>
                  {STATUS_LABELS[contract.status]}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative group/value">
                  <p className="text-xs font-medium text-slate-500 uppercase">Valor Total</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">{formatCurrency(contract.totalValue)}</p>
                    <button
                      onClick={() => { setNewTotalValue(contract.totalValue.toString()); setEditValueModalOpen(true); }}
                      className="mt-1 p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover/value:opacity-100"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-xs font-medium text-emerald-600 uppercase">Pago</p>
                  <p className="text-lg sm:text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(balance.paid)}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase">Restante</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-700 mt-1">{formatCurrency(balance.remaining)}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                  <span>Progresso do Pagamento</span>
                  <span>{balance.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className={`bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out relative`} style={{ width: `${Math.min(balance.percentage, 100)}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>

                {balance.percentage < 50 && contract.status === 'in_progress' && (
                  <div className="flex items-center mt-3 text-sm text-amber-600 bg-amber-50 p-2 rounded-xl border border-amber-100">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>Faltam <strong>{formatCurrency((contract.totalValue * 0.5) - balance.paid)}</strong> para atingir 50% (Elegibilidade)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payments List */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col h-[500px] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-indigo-500" /> Financeiro
              </h3>
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="text-sm bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 hover:text-indigo-700 font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
              >
                + Registrar Pagamento
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">
              {contractPayments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <DollarSign className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm">Nenhum pagamento registrado.</p>
                </div>
              ) : (
                contractPayments.map(p => (
                  <div key={p.id} className="p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-slate-200 transition-all flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                        $
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(p.amount)}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDateTime(p.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg mb-1">{p.method}</span>
                      {p.notes && <p className="text-xs text-slate-400 italic max-w-[150px] truncate">{p.notes}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 h-full max-h-[800px] flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <History className="h-5 w-5 mr-2 text-indigo-500" /> Linha do Tempo
              </h3>
            </div>
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                {contractEvents.map((event, eventIdx) => (
                  <div key={event.id} className="relative pl-8">
                    {/* Dot */}
                    <span className={`absolute -left-[9px] top-1 h-5 w-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center
                      ${event.type === 'payment' ? 'bg-emerald-500' :
                        event.type === 'status_change' ? 'bg-blue-500' :
                          event.type === 'returned' ? 'bg-red-500' :
                            event.type === 'list_completed' ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                    </span>

                    {/* Content */}
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-mono mb-1">{new Date(event.date).toLocaleDateString()}</span>
                      <p className="text-sm font-medium text-slate-800 leading-snug">{event.description}</p>
                      {event.type === 'created' && <span className="text-xs text-slate-500 mt-1">Início do processo</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPaymentModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Registrar Pagamento</h3>
            <form onSubmit={handleAddPayment} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 text-sm font-bold">R$</span>
                  <input type="number" step="0.01" required className="pl-11 block w-full border-slate-300 rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 py-3 shadow-sm text-slate-900 font-bold text-lg bg-slate-50"
                    value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Forma de Pagamento</label>
                <select className="block w-full border-slate-300 rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 py-3 px-4 shadow-sm bg-slate-50 text-slate-900"
                  value={newPayment.method} onChange={e => setNewPayment({ ...newPayment, method: e.target.value })}>
                  <option>PIX</option>
                  <option>Cartão Crédito</option>
                  <option>Boleto</option>
                  <option>Transferência</option>
                  <option>Dinheiro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observação (Opcional)</label>
                <input type="text" className="block w-full border-slate-300 rounded-2xl focus:ring-emerald-500 focus:border-emerald-500 py-3 px-4 shadow-sm text-slate-900 bg-slate-50"
                  value={newPayment.notes} onChange={e => setNewPayment({ ...newPayment, notes: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setPaymentModalOpen(false)} className="px-6 py-3 border border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md shadow-emerald-200">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setReturnModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative z-10 border-t-4 border-red-500">
            <h3 className="text-2xl font-bold text-red-600 mb-2">Registrar Retorno</h3>
            <p className="text-sm text-slate-500 mb-6">O contrato será reaberto para revisão. O histórico financeiro e de eventos será preservado.</p>
            <form onSubmit={handleReturn} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Motivo do Retorno</label>
                <textarea required rows={3} className="block w-full border-slate-300 rounded-2xl focus:ring-red-500 focus:border-red-500 py-3 px-4 shadow-sm text-slate-900 bg-slate-50"
                  value={returnReason} onChange={e => setReturnReason(e.target.value)} placeholder="Ex: Documentação pendente, negociação refeita..." />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setReturnModalOpen(false)} className="px-6 py-3 border border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-md shadow-red-200">Confirmar Retorno</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Value Modal */}
      {isEditValueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditValueModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10 border-t-4 border-indigo-500">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Editar Valor Total</h3>
            <p className="text-sm text-slate-500 mb-6">Altere o valor principal do contrato. O progresso de pagamento será recalculado.</p>
            <form onSubmit={handleUpdateValue} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Novo Valor Total</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 text-sm font-bold">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="pl-11 block w-full border-slate-300 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 py-3 shadow-sm text-slate-900 font-bold text-lg bg-slate-50"
                    value={newTotalValue}
                    onChange={e => setNewTotalValue(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditValueModalOpen(false)} className="px-6 py-3 border border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-md shadow-indigo-200">Salvar Alteração</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetails;
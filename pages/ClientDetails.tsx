import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, STATUS_LABELS, STATUS_COLORS, formatDate } from '../constants';
import { Plus, ArrowLeft, Phone, Mail, FileText, Calendar, Edit2 } from 'lucide-react';

const ClientDetails = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients, contracts, addContract, updateContract } = useApp();
  const [isContractModalOpen, setContractModalOpen] = useState(false);
  const [isEditValueModalOpen, setEditValueModalOpen] = useState(false);
  const [newContract, setNewContract] = useState({ totalValue: 0, downPayment: 0, installments: 1 });
  const [editingContract, setEditingContract] = useState<{ id: string, totalValue: number } | null>(null);
  const [editTotalValue, setEditTotalValue] = useState('');

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
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
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

          <button
            onClick={() => setContractModalOpen(true)}
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Contrato
          </button>
        </div>
      </div>

      {/* Contracts Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-indigo-500" />
          Contratos ({clientContracts.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clientContracts.map(contract => (
            <div key={contract.id} className="relative group/card">
              <Link to={`/contracts/${contract.id}`} className="block h-full">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
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
                className="absolute top-4 right-20 p-2 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 rounded-xl shadow-sm opacity-0 group-hover/card:opacity-100 transition-all z-10"
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
              <button onClick={() => setContractModalOpen(true)} className="mt-2 text-sm text-indigo-600 hover:underline">
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
                  <input type="number" step="0.01" required className="pl-12 block w-full border-slate-300 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 py-4 text-lg font-bold text-slate-900 bg-slate-50"
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
                    <input type="number" step="0.01" className="pl-10 block w-full border-slate-300 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 py-3 text-slate-900 bg-slate-50"
                      value={newContract.downPayment} onChange={e => setNewContract({ ...newContract, downPayment: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Parcelas</label>
                  <input type="number" min="1" max="24" className="block w-full border-slate-300 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 py-3 shadow-sm text-slate-900 bg-slate-50"
                    value={newContract.installments} onChange={e => setNewContract({ ...newContract, installments: Number(e.target.value) })} />
                </div>
              </div>

              <div className="bg-indigo-50 rounded-2xl p-4 text-sm text-indigo-800 border border-indigo-100">
                <p className="flex justify-between"><span>Valor Parcelado:</span> <span>{formatCurrency(newContract.totalValue - newContract.downPayment)}</span></p>
                <p className="flex justify-between font-bold mt-1"><span>Valor da Parcela:</span> <span>{formatCurrency((newContract.totalValue - newContract.downPayment) / (newContract.installments || 1))}</span></p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setContractModalOpen(false)} className="px-6 py-3 border border-slate-300 rounded-2xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-md shadow-indigo-200 transition-colors">Criar Contrato</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Value Modal */}
      {isEditValueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setEditValueModalOpen(false); setEditingContract(null); }}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10 border-t-4 border-indigo-500">
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
                    className="pl-11 block w-full border-slate-300 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 py-3 shadow-sm text-slate-900 font-bold text-lg bg-slate-50"
                    value={editTotalValue}
                    onChange={e => setEditTotalValue(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setEditValueModalOpen(false); setEditingContract(null); }} className="px-6 py-3 border border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-md shadow-indigo-200">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
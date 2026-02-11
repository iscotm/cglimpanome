import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LIST_STATUS_LABELS, formatDate } from '../constants';
import {
  Plus,
  CheckCircle2,
  ChevronRight,
  Download,
  ArrowLeft,
  ListTodo,
  Pencil,
  Trash2,
  X,
  MoreVertical,
  Search,
  Calendar,
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Lists = () => {
  const { lists, contracts, clients, createList, updateList, deleteList, addContractToList, removeContractFromList, completeList } = useApp();
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDate, setNewListDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingListName, setEditingListName] = useState('');

  // Derived state for the active list view
  const activeList = lists.find(l => l.id === activeListId);
  const contractsInList = activeListId ? contracts.filter(c => c.listId === activeListId) : [];

  // Contracts eligible to be added
  const eligibleContracts = contracts.filter(c => c.status === 'eligible');

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName) return;
    createList(newListName, newListDate);
    setNewListName('');
    setNewListDate(new Date().toISOString().split('T')[0]);
    setCreateModalOpen(false);
  };

  const handleEditList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeListId || !editingListName) return;
    updateList(activeListId, editingListName);
    setEditModalOpen(false);
  };

  const handleDeleteList = () => {
    if (activeListId && window.confirm('Tem certeza? Isso excluirá a lista e devolverá os contratos para o status "Elegível".')) {
      deleteList(activeListId);
      setActiveListId(null);
    }
  };

  const openEditModal = () => {
    if (activeList) {
      setEditingListName(activeList.name);
      setEditModalOpen(true);
    }
  };

  const handleAddToList = (contractId: string) => {
    if (activeListId) {
      addContractToList(activeListId, contractId);
    }
  };

  const handleRemoveFromList = (contractId: string) => {
    if (activeListId && window.confirm('Remover este item da lista? Ele voltará para "Elegível".')) {
      removeContractFromList(activeListId, contractId);
    }
  };

  const handleCompleteList = () => {
    if (activeListId && window.confirm('Tem certeza? Isso irá marcar todos os contratos da lista como Concluídos.')) {
      completeList(activeListId);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-8 font-sans text-slate-700 relative">

      {/* Left Column: All Lists */}
      <section className={`w-full md:w-80 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden shrink-0 transition-all duration-300 absolute md:relative inset-0 z-10 ${activeListId ? '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'translate-x-0 opacity-100'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="font-bold text-slate-800">Listas de Envio</h2>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {lists.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <ListTodo className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">Nenhuma lista.</p>
            </div>
          ) : (
            lists.map(list => (
              <div
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all group ${activeListId === list.id
                  ? 'border-2 border-indigo-100 bg-indigo-50/30'
                  : 'border border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 opacity-90 hover:opacity-100'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-sm ${activeListId === list.id ? 'text-indigo-900' : 'text-slate-600'}`}>
                    {list.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-tight ${list.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                    {LIST_STATUS_LABELS[list.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{formatDate(list.createdAt)}</span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <span>{list.itemsCount} {list.itemsCount === 1 ? 'item' : 'itens'}</span>
                    <ChevronRight size={14} className={`transition-transform ${activeListId === list.id ? 'text-indigo-400' : 'text-slate-300 group-hover:translate-x-1'}`} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Right Column: List Details */}
      <section className={`flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden absolute md:relative inset-0 transition-all duration-300 ${activeListId ? 'translate-x-0 opacity-100' : 'translate-x-full md:translate-x-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}`}>
        {activeList ? (
          <>
            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button onClick={() => setActiveListId(null)} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800">{activeList.name}</h2>
                    <button onClick={openEditModal} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Pencil size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Criado em <span className="text-slate-600">{formatDate(activeList.createdAt)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const lines = [`( ${activeList.name.toUpperCase()} )`, ''];
                    contractsInList.forEach(c => {
                      const client = clients.find(cl => cl.id === c.clientId);
                      lines.push('-------------------');
                      lines.push(`NOME: ${client?.name || 'N/A'}`);
                      lines.push(`CPF: ${client?.document || 'N/A'}`);
                    });

                    const text = lines.join('\n');
                    navigator.clipboard.writeText(text);
                    alert('Lista copiada com sucesso!');
                  }}
                  className="p-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors"
                  title="Copiar lista"
                >
                  <Copy size={20} />
                </button>

                {activeList.status === 'open' && (
                  <>
                    <button
                      onClick={handleDeleteList}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                      title="Excluir lista"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={handleCompleteList}
                      disabled={contractsInList.length === 0}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 size={18} />
                      Concluir Lista
                    </button>
                  </>
                )}
                {activeList.status === 'completed' && (
                  <>
                    <button
                      onClick={handleDeleteList}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                      title="Excluir lista"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-colors">
                      <Download size={18} /> CSV
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

              {/* Itens na Lista */}
              <div>
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2 uppercase tracking-widest text-[11px] font-bold text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                    Itens na Lista
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                    {contractsInList.length} {contractsInList.length === 1 ? 'Item' : 'Itens'}
                  </span>
                </div>

                <div className="space-y-3">
                  {contractsInList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 flex flex-col items-center border border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                      <ListTodo className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-sm">Nenhum contrato nesta lista.</p>
                    </div>
                  ) : (
                    contractsInList.map(c => {
                      const client = clients.find(cl => cl.id === c.clientId);
                      return (
                        <div key={c.id} className="bg-white border border-slate-100 rounded-[2rem] p-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md hover:border-indigo-100 transition-all gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-indigo-600 font-bold text-lg shrink-0">
                              {client?.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 leading-tight truncate">{client?.name}</h4>
                              <p className="text-xs font-mono text-slate-500 mt-0.5">{client?.document}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Código</p>
                              <p className="text-sm font-semibold text-slate-600">#{c.id.slice(0, 6)}</p>
                            </div>

                            {activeList.status === 'open' && (
                              <div className="relative group">
                                <button
                                  onClick={() => handleRemoveFromList(c.id)}
                                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                  title="Remover da lista"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Disponíveis para Adicionar */}
              {activeList.status === 'open' && (
                <div>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2 uppercase tracking-widest text-[11px] font-bold text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      Disponíveis para Adicionar
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                      {eligibleContracts.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {eligibleContracts.length === 0 ? (
                      <div className="border-2 border-dashed border-slate-100 rounded-[2rem] py-16 flex flex-col items-center justify-center bg-slate-50/50">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm mb-4 border border-slate-100">
                          <ListTodo size={32} />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Nenhum contrato elegível no momento.</p>
                        <Link to="/clients" className="mt-4 text-xs font-bold text-indigo-500 hover:text-indigo-700 underline-offset-4 hover:underline transition-all">
                          Ver todos os clientes
                        </Link>
                      </div>
                    ) : (
                      eligibleContracts.map(c => {
                        const client = clients.find(cl => cl.id === c.clientId);
                        return (
                          <div key={c.id} className="bg-white border border-slate-100 rounded-[2rem] p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md hover:border-emerald-200 transition-all gap-4">
                            <div className="flex-1">
                              <p className="font-bold text-slate-800 text-sm">{client?.name}</p>
                              <p className="text-xs text-slate-500">CPF: {client?.document}</p>
                            </div>
                            <button
                              onClick={() => handleAddToList(c.id)}
                              className="w-full sm:w-auto ml-0 sm:ml-4 p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
            <ListTodo className="h-16 w-16 mb-4 text-slate-200" />
            <p className="text-lg font-medium text-slate-500">Selecione uma lista</p>
            <p className="text-sm">Ou crie uma nova para começar.</p>
          </div>
        )}
      </section>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setCreateModalOpen(false)}></div>

          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Nova Lista de Envio</h2>
                <p className="text-slate-500 text-sm mt-1">Crie um novo lote para agrupar contratos.</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome do Lote</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    placeholder="Ex: Lote Fevereiro 2024"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-medium text-slate-900 focus:border-indigo-500/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    value={newListName}
                    onChange={e => setNewListName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Data de Criação</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="date"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:border-indigo-500/30 focus:bg-white outline-none transition-all"
                      value={newListDate}
                      onChange={e => setNewListDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 flex gap-3 shrink-0 border-t border-slate-100">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-500 hover:bg-white transition-all border border-transparent hover:border-slate-200">Cancelar</button>
                <button type="submit" className="flex-[1.5] py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">Criar Lista</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Editar Lista</h3>
            <form onSubmit={handleEditList}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Lote</label>
                <input
                  autoFocus
                  type="text"
                  className="w-full border border-slate-300 rounded-2xl p-4 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-slate-900"
                  value={editingListName}
                  onChange={e => setEditingListName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-6 py-3 border border-slate-300 rounded-2xl text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-md shadow-indigo-200">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lists;
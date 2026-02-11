import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../constants';
import {
  Plus,
  Trash2,
  TrendingDown,
  Megaphone,
  Handshake,
  ListTodo,
  X,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  FileText,
  Calendar,
  Layers,
  Edit,
  Wallet,
  User
} from 'lucide-react';
import { ExpenseCategory, Expense } from '../types';

const CATEGORY_LABELS: Record<string, string> = {
  traffic: 'Tráfego',
  partnership: 'Parceria',
  list: 'Lista de Envio',
  withdrawal: 'Retirada',
  other: 'Outros'
};

const CATEGORY_STYLES: Record<string, { bg: string, text: string, border: string }> = {
  traffic: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
  partnership: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  list: { bg: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-200' },
  withdrawal: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
  other: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' }
};

const Financial = () => {
  const { expenses, lists, addExpense, updateExpense, deleteExpense } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDeleteId, setExpenseToDeleteId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [newExpense, setNewExpense] = useState<{
    amount: string;
    category: ExpenseCategory;
    date: string;
    description: string;
    linkedListId: string;
    withdrawalPerson: string;
  }>({
    amount: '',
    category: 'traffic',
    date: new Date().toISOString().split('T')[0],
    description: '',
    linkedListId: '',
    withdrawalPerson: ''
  });

  // Calculate Totals
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const trafficTotal = expenses.filter(e => e.category === 'traffic').reduce((acc, curr) => acc + curr.amount, 0);
  const partnershipTotal = expenses.filter(e => e.category === 'partnership').reduce((acc, curr) => acc + curr.amount, 0);
  const listTotal = expenses.filter(e => e.category === 'list').reduce((acc, curr) => acc + curr.amount, 0);
  const withdrawalTotal = expenses.filter(e => e.category === 'withdrawal').reduce((acc, curr) => acc + curr.amount, 0);

  const filteredExpenses = expenses.filter(e =>
    (e.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    CATEGORY_LABELS[e.category].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingId(expense.id);
      setNewExpense({
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date.split('T')[0],
        description: expense.description || '',
        linkedListId: expense.linkedListId || '',
        withdrawalPerson: expense.withdrawalPerson || ''
      });
    } else {
      setEditingId(null);
      setNewExpense({
        amount: '',
        category: 'traffic',
        date: new Date().toISOString().split('T')[0],
        description: '',
        linkedListId: '',
        withdrawalPerson: ''
      });
    }
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount) return;

    const expenseData = {
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: new Date(newExpense.date).toISOString(),
      description: newExpense.description,
      linkedListId: newExpense.category === 'list' ? newExpense.linkedListId : undefined,
      withdrawalPerson: newExpense.category === 'withdrawal' ? newExpense.withdrawalPerson : undefined
    };

    if (editingId) {
      updateExpense(editingId, expenseData);
    } else {
      addExpense(expenseData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setActiveMenuId(null);
    setExpenseToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (expenseToDeleteId) {
      deleteExpense(expenseToDeleteId);
      setIsDeleteModalOpen(false);
      setExpenseToDeleteId(null);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const getLinkedListName = (listId?: string) => {
    if (!listId) return null;
    const list = lists.find(l => l.id === listId);
    return list ? list.name : 'Lista Removida';
  };

  const summaryData = [
    {
      title: 'Total de Custos',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'bg-rose-50',
      iconColor: 'text-rose-500',
      trend: true
    },
    {
      title: 'Tráfego',
      value: trafficTotal,
      icon: Megaphone,
      color: 'bg-orange-50',
      iconColor: 'text-orange-500',
      progress: totalExpenses > 0 ? (trafficTotal / totalExpenses) * 100 : 0,
      barColor: 'bg-orange-500'
    },
    {
      title: 'Parcerias',
      value: partnershipTotal,
      icon: Handshake,
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
      progress: totalExpenses > 0 ? (partnershipTotal / totalExpenses) * 100 : 0,
      barColor: 'bg-blue-500'
    },
    {
      title: 'Listas de Envio',
      value: listTotal,
      icon: ListTodo,
      color: 'bg-slate-100',
      iconColor: 'text-slate-900',
      progress: totalExpenses > 0 ? (listTotal / totalExpenses) * 100 : 0,
      barColor: 'bg-slate-900'
    },
    {
      title: 'Retiradas',
      value: withdrawalTotal,
      icon: Wallet,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      progress: totalExpenses > 0 ? (withdrawalTotal / totalExpenses) * 100 : 0,
      barColor: 'bg-emerald-500'
    },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Financeiro</h1>
          <p className="text-slate-500 mt-1">Gerencie os custos operacionais de tráfego, parcerias e listas.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={20} strokeWidth={3} />
          Registrar Custo
        </button>
      </div>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {summaryData.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${card.color} transition-transform group-hover:scale-110 duration-300`}>
                <card.icon className={card.iconColor} size={24} />
              </div>
              {card.trend && <span className="text-rose-500 bg-rose-50 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><TrendingDown size={12} /> Saída</span>}
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{card.title}</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{formatCurrency(card.value)}</h3>
            </div>
            {card.progress !== undefined && (
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${card.barColor} transition-all duration-1000`}
                  style={{ width: `${card.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabela de Histórico */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-visible">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-slate-800">Histórico de Custos</h2>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-sm font-medium transition-colors">
              <Filter size={16} /> <span className="hidden sm:inline">Filtrar</span>
            </button>
            <div className="relative group flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Buscar nos custos..."
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-visible min-h-[300px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Data</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Categoria</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Descrição / Lista</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Valor</th>
                <th className="px-8 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-10 w-10 mb-3 opacity-20" />
                      <p className="font-medium">Nenhum custo encontrado.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => {
                  const linkedListName = getLinkedListName(expense.linkedListId);
                  const styles = CATEGORY_STYLES[expense.category];

                  return (
                    <tr key={expense.id} className="hover:bg-indigo-50/30 transition-colors group relative">
                      <td className="px-8 py-5 text-sm font-medium text-slate-600 italic whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${styles.bg} ${styles.text}`}>
                          {CATEGORY_LABELS[expense.category]}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-700">
                          {expense.description || (expense.category === 'withdrawal' && expense.withdrawalPerson ? `Retirada ${expense.withdrawalPerson}` : '-')}
                        </p>
                        {linkedListName && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-600">
                            <ListTodo size={12} />
                            <span>{linkedListName}</span>
                          </div>
                        )}
                        {expense.withdrawalPerson && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-emerald-600">
                            <User size={12} />
                            <span>{expense.withdrawalPerson}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right whitespace-nowrap">
                        <span className="text-sm font-black text-slate-900">
                          - {formatCurrency(expense.amount)}
                        </span>
                      </td>
                      <td className="px-8 py-5 relative">
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => toggleMenu(e, expense.id)}
                            className={`p-2 rounded-lg transition-all shadow-sm ${activeMenuId === expense.id ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-white'}`}
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        {/* Dropdown Menu */}
                        {activeMenuId === expense.id && (
                          <div className="absolute right-8 bottom-full mb-1 z-50 w-32 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
                            <div className="p-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenModal(expense); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                              >
                                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                                  <div className="w-1 h-1 bg-indigo-600 rounded-full mb-0.5 mx-auto"></div>
                                  <div className="w-1 h-1 bg-indigo-600 rounded-full mx-auto"></div>
                                </div>
                                Editar
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(expense.id); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                              >
                                <div className="p-1.5 bg-slate-50 text-slate-400 rounded-md group-hover:bg-rose-100 group-hover:text-rose-500">
                                  <Trash2 size={12} />
                                </div>
                                Excluir
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredExpenses.length > 5 && (
          <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex justify-center">
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all hover:gap-2">
              Ver todo o histórico <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Novo/Editar Custo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* Header Fixo */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{editingId ? 'Editar Custo' : 'Novo Custo'}</h2>
                <p className="text-slate-500 text-sm mt-1">{editingId ? 'Atualize as informações do registro.' : 'Registre uma nova despesa operacional.'}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveExpense} className="flex flex-col flex-1 overflow-hidden">
              {/* Corpo com Scroll */}
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                {/* Valor */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Valor do Custo</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      autoFocus
                      placeholder="0,00"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-bold text-slate-900 focus:border-indigo-500/30 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Categoria */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Categoria</label>
                  <div className="grid grid-cols-4 gap-3">
                    <CategoryButton
                      label="Tráfego"
                      icon={<Megaphone size={18} />}
                      active={newExpense.category === 'traffic'}
                      onClick={() => setNewExpense({ ...newExpense, category: 'traffic' })}
                      activeColor="border-orange-500 bg-orange-50 text-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.15)]"
                    />
                    <CategoryButton
                      label="Parceria"
                      icon={<Handshake size={18} />}
                      active={newExpense.category === 'partnership'}
                      onClick={() => setNewExpense({ ...newExpense, category: 'partnership' })}
                      activeColor="border-blue-500 bg-blue-50 text-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                    />
                    <CategoryButton
                      label="Envio"
                      icon={<ListTodo size={18} />}
                      active={newExpense.category === 'list'}
                      onClick={() => setNewExpense({ ...newExpense, category: 'list' })}
                      activeColor="border-slate-900 bg-slate-50 text-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.15)]"
                    />
                    <CategoryButton
                      label="Retirada"
                      icon={<Wallet size={18} />}
                      active={newExpense.category === 'withdrawal'}
                      onClick={() => setNewExpense({ ...newExpense, category: 'withdrawal' })}
                      activeColor="border-emerald-500 bg-emerald-50 text-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                    />
                  </div>
                </div>

                {/* Seleção de Lista */}
                {newExpense.category === 'list' && (
                  <div className="p-5 bg-slate-50/50 rounded-[1.5rem] border-2 border-slate-200 space-y-3 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Selecione a Lista</label>
                      <Layers size={14} className="text-slate-400" />
                    </div>
                    <select
                      required={newExpense.category === 'list'}
                      className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:border-slate-400 outline-none transition-all appearance-none cursor-pointer"
                      value={newExpense.linkedListId}
                      onChange={e => setNewExpense({ ...newExpense, linkedListId: e.target.value })}
                    >
                      <option value="">Selecione uma lista...</option>
                      {lists.map(list => (
                        <option key={list.id} value={list.id}>{list.name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                      Vincular este custo a uma lista específica ajuda no cálculo automático de ROI.
                    </p>
                  </div>
                )}

                {/* Seleção de Pessoa para Retirada */}
                {newExpense.category === 'withdrawal' && (
                  <div className="p-5 bg-emerald-50/50 rounded-[1.5rem] border-2 border-emerald-200 space-y-3 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Retirada para</label>
                      <User size={14} className="text-emerald-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewExpense({ ...newExpense, withdrawalPerson: 'Francisco' })}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${newExpense.withdrawalPerson === 'Francisco'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600'
                          }`}
                      >
                        <User size={16} />
                        <span className="text-sm font-bold">Francisco</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewExpense({ ...newExpense, withdrawalPerson: 'Felipe' })}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${newExpense.withdrawalPerson === 'Felipe'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600'
                          }`}
                      >
                        <User size={16} />
                        <span className="text-sm font-bold">Felipe</span>
                      </button>
                    </div>
                    <p className="text-[10px] leading-relaxed text-emerald-600 font-medium">
                      Selecione para qual pessoa esta retirada será registrada.
                    </p>
                  </div>
                )}

                {/* Descrição */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
                  <input
                    type="text"
                    placeholder="Ex: Descrição do custo"
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:border-indigo-500/30 focus:bg-white outline-none transition-all"
                    value={newExpense.description}
                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>

                {/* Data */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Data</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="date"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:border-indigo-500/30 focus:bg-white outline-none transition-all"
                      value={newExpense.date}
                      onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Fixo */}
              <div className="p-8 bg-slate-50/50 flex gap-3 shrink-0 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-500 hover:bg-white transition-all border border-transparent hover:border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[1.5] py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                  {editingId ? 'Atualizar' : 'Salvar Custo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 relative z-10 border-t-8 border-rose-500 animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 text-rose-500">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Excluir Registro?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Esta ação é <span className="text-rose-600 font-bold uppercase tracking-wider text-xs">irreversível</span>. O custo será removido permanentemente dos registros financeiros.
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={confirmDelete}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirmar Exclusão
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Auxiliar para Botões de Categoria
const CategoryButton = ({ label, icon, active, onClick, activeColor }: { label: string, icon: React.ReactNode, active: boolean, onClick: () => void, activeColor: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${active
      ? activeColor
      : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-600'
      }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
  </button>
);

export default Financial;
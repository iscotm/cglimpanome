import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../constants';
import {
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  Plus,
  X,
  User,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- COMPONENTES AUXILIARES ---

const KPICard = ({ title, value, subtext, icon: Icon, colorClass, trend, onClick }: any) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100' : ''}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          +12% <TrendingUp size={12} />
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
    </div>
  </div>
);

const HTMLBarChart = ({ stats }: { stats: any }) => {
  const data = [
    { label: 'Ativos', value: stats.activeContracts, color: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600', shadow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]' },
    { label: 'Elegíveis', value: stats.eligibleContracts, color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600', shadow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
    { label: 'Em Lista', value: stats.inListContracts, color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', shadow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
    { label: 'Concluídos', value: stats.completedContracts, color: 'bg-slate-700', hoverColor: 'hover:bg-slate-800', shadow: 'group-hover:shadow-[0_0_20px_rgba(51,65,85,0.3)]' },
  ];

  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

  return (
    <div className="flex items-end justify-between h-48 gap-4 px-2">
      {data.map((item, idx) => {
        const heightPercent = (item.value / maxValue) * 100;
        return (
          <div key={idx} className="flex flex-col items-center gap-2 w-full group h-full justify-end">
            <div className="w-full bg-slate-50 rounded-t-lg h-full relative flex items-end overflow-hidden">
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full ${item.color} ${item.hoverColor} transition-all duration-500 rounded-t-lg relative ${item.shadow}`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  {item.value}
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const ModalNovoCliente = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addClient } = useApp();
  const [formData, setFormData] = useState({ name: '', document: '', phone: '', email: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.document) {
      addClient(formData);
      setFormData({ name: '', document: '', phone: '', email: '' });
      onClose();
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 14) value = value.slice(0, 14);

    if (value.length > 11) {
      // Máscara CNPJ: 00.000.000/0000-00
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Máscara CPF: 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    setFormData({ ...formData, document: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-white to-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Novo Cliente</h2>
            <p className="text-slate-500 text-sm mt-1">Preencha as dados para cadastrar.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo / Razão Social</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  required
                  type="text"
                  placeholder="Ex: João Silva"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">CPF / CNPJ</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  required
                  type="text"
                  maxLength={18}
                  placeholder="000.000.000-00"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                  value={formData.document}
                  onChange={handleDocumentChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Telefone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl text-slate-600 font-medium hover:bg-slate-200 transition-all">Cancelar</button>
            <button type="submit" className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all">Salvar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RevenueExtractModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { payments, contracts, clients, stats } = useApp();

  if (!isOpen) return null;

  const getClientName = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return "N/A";
    const client = clients.find(c => c.id === contract.clientId);
    return client ? client.name : "N/A";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-white">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Extrato de Receita</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-slate-500 text-sm font-medium">Resumo detalhado de todas as entradas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-white p-2.5 rounded-full shadow-sm border border-slate-100 transition-all hover:rotate-90">
            <X size={22} />
          </button>
        </div>

        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Consolidado</p>
              <h3 className="text-4xl font-black text-emerald-600">{formatCurrency(stats.totalRevenue)}</h3>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                  <User size={18} className="text-slate-400" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                +{payments.length}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                <th className="pb-2 font-black pl-4">Pagador / Cliente</th>
                <th className="pb-2 font-black">Data</th>
                <th className="pb-2 font-black text-right pr-4">Valor</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map(p => (
                  <tr key={p.id} className="group transition-all">
                    <td className="py-4 px-4 bg-white rounded-l-[1.5rem] border-y border-l border-slate-100 group-hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                          <DollarSign size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{getClientName(p.contractId)}</p>
                          <p className="text-slate-400 text-xs font-medium italic">{p.method}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 bg-white border-y border-slate-100 group-hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                        <Calendar size={14} className="opacity-50" />
                        {new Date(p.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4 bg-white rounded-r-[1.5rem] border-y border-r border-slate-100 text-right group-hover:bg-slate-50 transition-colors">
                      <span className="font-black text-slate-900 text-sm">
                        {formatCurrency(p.amount)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 italic">
                    Nenhum pagamento registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-white border-t border-slate-50 flex justify-center shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={14} className="text-indigo-400" />
            Extrato gerado em tempo real pelo sistema
          </p>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

const Dashboard = () => {
  const { stats, lists } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [isOutstandingModalOpen, setIsOutstandingModalOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500 mt-1">Acompanhe o desempenho e métricas em tempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            Atualizado hoje
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            Adicionar Cliente
          </button>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Receita Total"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          colorClass="bg-emerald-500 text-emerald-500"
          trend
          onClick={() => setIsExtractModalOpen(true)}
        />
        <KPICard
          title="Saldo a Receber"
          value={formatCurrency(stats.outstandingBalance)}
          icon={TrendingUp}
          colorClass="bg-blue-500 text-blue-500"
          trend
          onClick={() => setIsOutstandingModalOpen(true)}
        />
        <KPICard
          title="Contratos Ativos"
          value={stats.activeContracts}
          subtext="Em progresso + Elegíveis"
          icon={FileText}
          colorClass="bg-violet-500 text-violet-500"
        />
        <KPICard
          title="Casos Retornados"
          value={stats.returnedContracts}
          icon={AlertCircle}
          colorClass="bg-rose-500 text-rose-500"
        />
      </div>

      {/* Grid de Gráficos e Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Gráfico de Barras */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Volume de Contratos</h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <HTMLBarChart stats={stats} />
        </div>

        {/* Lista Recente */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Listas Recentes</h3>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
            {lists.length > 0 ? (
              lists.slice(0, 5).map(list => (
                <div key={list.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all group cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-800 group-hover:text-amber-700">{list.name}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${list.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {list.status === 'completed' ? 'Concluída' : 'Aberta'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-500">
                    <span>{new Date(list.createdAt).toLocaleDateString()}</span>
                    <span>{list.itemsCount} itens</span>
                  </div>
                </div>
              ))
            ) : (
              /* Placeholder para itens vazios */
              <div className="border-2 border-dashed border-slate-100 rounded-2xl p-4 flex items-center justify-center text-slate-400 text-sm h-24">
                Nenhuma lista criada
              </div>
            )}
          </div>

          <Link to="/lists" className="w-full mt-6 py-2.5 text-indigo-600 font-medium hover:bg-indigo-50 rounded-2xl transition-colors flex items-center justify-center gap-2 group">
            Ver todas
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Renderização Condicional do Modal */}
      <ModalNovoCliente isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <RevenueExtractModal isOpen={isExtractModalOpen} onClose={() => setIsExtractModalOpen(false)} />
      <OutstandingBalanceModal isOpen={isOutstandingModalOpen} onClose={() => setIsOutstandingModalOpen(false)} />
    </div>
  );
};

const OutstandingBalanceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { contracts, clients, getContractBalance } = useApp();

  if (!isOpen) return null;

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "N/A";
  };

  const outstandingContracts = contracts
    .map(c => ({
      ...c,
      balance: getContractBalance(c.id)
    }))
    .filter(c => c.balance.remaining > 0)
    .sort((a, b) => b.balance.remaining - a.balance.remaining);

  const totalOutstanding = outstandingContracts.reduce((acc, c) => acc + c.balance.remaining, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-white">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Saldo a Receber</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-slate-500 text-sm font-medium">Clientes com pagamentos pendentes</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-white p-2.5 rounded-full shadow-sm border border-slate-100 transition-all hover:rotate-90">
            <X size={22} />
          </button>
        </div>

        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Pendente</p>
              <h3 className="text-4xl font-black text-blue-600">{formatCurrency(totalOutstanding)}</h3>
            </div>
            <div className="flex -space-x-3">
              {Array.from({ length: Math.min(outstandingContracts.length, 5) }).map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                  <User size={18} className="text-slate-400" />
                </div>
              ))}
              {outstandingContracts.length > 5 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                  +{outstandingContracts.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                <th className="pb-2 font-black pl-4">Cliente</th>
                <th className="pb-2 font-black">Status</th>
                <th className="pb-2 font-black text-right pr-4">Pendente</th>
              </tr>
            </thead>
            <tbody>
              {outstandingContracts.length > 0 ? (
                outstandingContracts.map(c => (
                  <tr key={c.id} className="group transition-all">
                    <td className="py-4 px-4 bg-white rounded-l-[1.5rem] border-y border-l border-slate-100 group-hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{getClientName(c.clientId)}</p>
                          <p className="text-slate-400 text-xs font-medium italic">Total: {formatCurrency(c.totalValue)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 bg-white border-y border-slate-100 group-hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col gap-1">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-500" 
                            style={{ width: `${c.balance.percentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {c.balance.percentage.toFixed(0)}% Pago
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 bg-white rounded-r-[1.5rem] border-y border-r border-slate-100 text-right group-hover:bg-slate-50 transition-colors">
                      <span className="font-black text-slate-900 text-sm">
                        {formatCurrency(c.balance.remaining)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400 italic">
                    Nenhum saldo pendente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-white border-t border-slate-50 flex justify-center shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={14} className="text-blue-400" />
            Valores calculados com base em contratos e pagamentos atuais
          </p>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STATUS_LABELS, STATUS_COLORS } from '../constants';
import { Plus, Search, ChevronRight, User, Phone, Mail, X, FileText, MessageSquare, Pencil } from 'lucide-react';

const Clients = () => {
  const { clients, addClient, updateClient, contracts } = useApp();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [filter, setFilter] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({ name: '', document: '', phone: '', email: '', notes: '' });

  useEffect(() => {
    setFilter(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.document.includes(filter)
  );

  // Função para determinar o status principal do cliente baseado em seus contratos
  const getClientStatus = (clientId: string) => {
    const clientContracts = contracts.filter(c => c.clientId === clientId);
    
    if (clientContracts.length === 0) return null;

    // Ordem de prioridade para exibição
    const priorities = ['returned', 'in_list', 'eligible', 'in_progress', 'draft', 'completed'];
    
    for (const status of priorities) {
      if (clientContracts.some(c => c.status === status)) {
        return status;
      }
    }
    
    return 'completed';
  };

  const handleEdit = (client: any) => {
    setNewClient({
      name: client.name,
      document: client.document,
      phone: client.phone,
      email: client.email,
      notes: client.notes || ''
    });
    setEditingId(client.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.document) return;
    
    if (editingId) {
      updateClient(editingId, newClient);
    } else {
      addClient(newClient);
    }
    
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClient({ name: '', document: '', phone: '', email: '', notes: '' });
    setEditingId(null);
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
    
    setNewClient({...newClient, document: value});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
           <p className="text-slate-500 text-sm mt-1">Gerencie sua base de clientes e verifique os status.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou CNPJ..."
              className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-900 transition-all shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Atual</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const statusKey = getClientStatus(client.id);
                  return (
                    <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">{client.name}</div>
                            {client.notes && <div className="text-xs text-slate-500 truncate max-w-xs">{client.notes}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                          {client.document}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusKey ? (
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[statusKey]}`}>
                            {STATUS_LABELS[statusKey]}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-slate-100 text-slate-400">
                            Sem contrato
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 space-y-1">
                        <div className="flex items-center"><Phone className="h-3 w-3 mr-1.5 opacity-70"/>{client.phone}</div>
                        <div className="flex items-center"><Mail className="h-3 w-3 mr-1.5 opacity-70"/>{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => handleEdit(client)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            title="Editar Cliente"
                          >
                            <Pencil size={18} />
                          </button>
                          <Link to={`/clients/${client.id}`} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors">
                            Ver <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <User className="h-12 w-12 text-slate-300 mb-3" />
                      <p>Nenhum cliente encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
           {filteredClients.length > 0 ? (
              filteredClients.map((client) => {
                const statusKey = getClientStatus(client.id);
                return (
                  <div key={client.id} className="p-4 bg-white hover:bg-slate-50 transition-colors active:bg-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <Link to={`/clients/${client.id}`} className="flex items-center flex-1">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3 shadow-sm">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{client.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 inline-block">
                              {client.document}
                            </span>
                            {statusKey && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${STATUS_COLORS[statusKey]}`}>
                                {STATUS_LABELS[statusKey]}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                      <button 
                        onClick={() => handleEdit(client)}
                        className="p-2 -mt-1 -mr-2 text-slate-300 hover:text-indigo-600"
                        title="Editar"
                      >
                         <Pencil size={18} />
                      </button>
                    </div>
                    <Link to={`/clients/${client.id}`} className="block ml-12 space-y-1">
                      <div className="text-sm text-slate-500 flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" /> {client.phone}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-2 text-slate-400" /> {client.email}
                      </div>
                    </Link>
                  </div>
                );
              })
           ) : (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
               <Search className="h-10 w-10 text-slate-300 mb-3" />
               <p>Nenhum cliente encontrado.</p>
            </div>
           )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal Panel */}
            <div className="inline-block w-full max-w-lg overflow-hidden text-left align-bottom transition-all transform bg-white shadow-2xl rounded-[2.5rem] sm:my-8 sm:align-middle animate-in fade-in zoom-in-95 duration-300">
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-white to-slate-50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {editingId ? 'Editar Cliente' : 'Novo Cliente'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {editingId ? 'Atualize os dados do cliente abaixo.' : 'Preencha as informações abaixo para criar o cadastro.'}
                  </p>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Form Body */}
                <div className="p-8 space-y-6 bg-white">
                  
                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo / Razão Social</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        required
                        type="text"
                        placeholder="Ex: João Silva ou Empresa LTDA"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                        value={newClient.name} 
                        onChange={e => setNewClient({...newClient, name: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* CPF/CNPJ */}
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
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                        value={newClient.document} 
                        onChange={handleDocumentChange}
                      />
                    </div>
                  </div>

                  {/* Grid: Telefone e Email */}
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
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                          value={newClient.phone} 
                          onChange={e => setNewClient({...newClient, phone: e.target.value})}
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
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200"
                          value={newClient.email} 
                          onChange={e => setNewClient({...newClient, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Observações</label>
                    <div className="relative group">
                      <textarea
                        rows={3}
                        placeholder="Informações adicionais sobre o cliente..."
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 transition-all duration-200 resize-none"
                        value={newClient.notes} 
                        onChange={e => setNewClient({...newClient, notes: e.target.value})}
                      ></textarea>
                      <div className="absolute bottom-3 right-3 pointer-events-none">
                         <MessageSquare className="h-4 w-4 text-slate-300 group-focus-within:text-indigo-300 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 rounded-2xl text-slate-600 font-medium hover:bg-slate-200 hover:text-slate-800 transition-all focus:ring-2 focus:ring-slate-300"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-indigo-500 hover:to-violet-500 transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {editingId ? 'Salvar Alterações' : 'Salvar Cliente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
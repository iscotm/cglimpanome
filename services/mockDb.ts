import { Client, Contract, Payment, ShipmentList, ContractEvent, Expense } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const seedData = () => {
  const clients: Client[] = [
    { id: 'c1', name: 'João Silva', document: '123.456.789-00', phone: '11999999999', email: 'joao@email.com', createdAt: new Date().toISOString() },
    { id: 'c2', name: 'Empresa ABC Ltda', document: '12.345.678/0001-99', phone: '1133334444', email: 'contato@abc.com', createdAt: new Date().toISOString() },
  ];

  const contracts: Contract[] = [
    { id: 'k1', clientId: 'c1', totalValue: 1000, downPayment: 200, installments: 4, status: 'in_progress', createdAt: new Date().toISOString() },
    { id: 'k2', clientId: 'c2', totalValue: 2000, downPayment: 1000, installments: 2, status: 'eligible', createdAt: new Date().toISOString() },
  ];

  const payments: Payment[] = [
    { id: 'p1', contractId: 'k1', amount: 200, date: new Date().toISOString(), method: 'PIX', notes: 'Entrada' },
    { id: 'p2', contractId: 'k2', amount: 1000, date: new Date().toISOString(), method: 'Transferência', notes: 'Entrada' },
  ];

  const lists: ShipmentList[] = [
    { id: 'l1', name: 'Lote Janeiro/24', status: 'open', createdAt: new Date().toISOString(), itemsCount: 0 }
  ];

  const events: ContractEvent[] = [
    { id: 'e1', contractId: 'k1', type: 'created', description: 'Contrato criado', date: new Date().toISOString() },
    { id: 'e2', contractId: 'k1', type: 'payment', description: 'Pagamento de R$ 200,00 recebido', date: new Date().toISOString() },
    { id: 'e3', contractId: 'k2', type: 'created', description: 'Contrato criado', date: new Date().toISOString() },
    { id: 'e4', contractId: 'k2', type: 'payment', description: 'Pagamento de R$ 1.000,00 recebido', date: new Date().toISOString() },
    { id: 'e5', contractId: 'k2', type: 'status_change', description: 'Status alterado para Elegível (50% pago)', date: new Date().toISOString() },
  ];

  const expenses: Expense[] = [
    { id: 'x1', category: 'traffic', amount: 500, date: new Date().toISOString(), description: 'Google Ads - Campanha Limpa Nome' },
    { id: 'x2', category: 'partnership', amount: 300, date: new Date().toISOString(), description: 'Comissão Parceiro X' },
  ];

  return { clients, contracts, payments, lists, events, expenses };
};

export type ContractStatus =
  | 'draft'
  | 'in_progress'
  | 'eligible'
  | 'in_list'
  | 'completed'
  | 'returned';

export type ListStatus = 'open' | 'sent' | 'completed';

export type ExpenseCategory = 'traffic' | 'partnership' | 'list' | 'withdrawal' | 'other';

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description?: string;
  linkedListId?: string; // Optional link to a ShipmentList
  withdrawalPerson?: string; // For withdrawal category: 'Francisco' or 'Felipe'
}

export interface ContractEvent {
  id: string;
  contractId: string;
  type: 'created' | 'payment' | 'status_change' | 'added_to_list' | 'removed_from_list' | 'list_completed' | 'returned';
  description: string;
  date: string;
  metadata?: any;
}

export interface Contract {
  id: string;
  clientId: string;
  totalValue: number;
  downPayment: number;
  installments: number;
  status: ContractStatus;
  createdAt: string;
  listId?: string; // If attached to a list
}

export interface Client {
  id: string;
  name: string;
  document: string; // CPF or CNPJ
  phone: string;
  email: string;
  notes?: string;
  createdAt: string;
}

export interface ShipmentList {
  id: string;
  name: string;
  status: ListStatus;
  createdAt: string;
  itemsCount: number; // Derived for display
}

// Stats for dashboard
export interface DashboardStats {
  activeContracts: number;
  eligibleContracts: number;
  inListContracts: number;
  completedContracts: number;
  returnedContracts: number;
  totalRevenue: number;
  outstandingBalance: number;
}

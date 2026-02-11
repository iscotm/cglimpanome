export const STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  in_progress: 'Em Andamento',
  eligible: 'Elegível p/ Envio',
  in_list: 'Em Lista',
  completed: 'Concluído',
  returned: 'Retorno / Reaberto',
};

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  eligible: 'bg-green-100 text-green-800 border-green-200',
  in_list: 'bg-purple-100 text-purple-800',
  completed: 'bg-slate-800 text-white',
  returned: 'bg-red-100 text-red-800',
};

export const LIST_STATUS_LABELS: Record<string, string> = {
  open: 'Aberta',
  sent: 'Enviada',
  completed: 'Concluída',
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('pt-BR');
};
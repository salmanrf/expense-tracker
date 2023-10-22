export type MutationPeriodType = 'day' | 'week' | 'month' | 'year';

export type MutationReport = {
  type: 'IN' | 'OUT';
  category: string;
  amount: number;
};

export type MutationReportResults = {
  items: MutationReport[];
  period_type: MutationPeriodType;
  trx_date_start: string;
  trx_date_end: string;
};

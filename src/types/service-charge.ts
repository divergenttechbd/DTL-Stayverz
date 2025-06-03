export type IServiceChargeFilterValue = string | string[] | Date | null;

export type IServiceChargeFilter = {
  start_date: Date | null;
  end_date: Date | null;
};

// ----------------------------------------------------------------------

export type IServiceChargeItem = {
  id: number;
  start_date: string;
  end_date: string;
  value?: string;
};

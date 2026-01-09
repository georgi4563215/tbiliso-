
export interface MenuItem {
  id: number;
  category: string;
  name: string;
  oldPrice: number;
  newPrice: number;
}

export interface Stats {
  avgGrowthRub: number;
  avgGrowthPercent: string;
  totalItems: number;
  totalRevenueImpact: number;
}

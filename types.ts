
export interface Purchase {
  id: string;
  itemName: string;
  modelName: string;
  partNumber: string;
  quantity: number;
  purchasePrice: number;
  date: string;
}

export interface Sale {
  id: string;
  itemName: string;
  modelName: string;
  partNumber: string;
  quantity: number;
  salePrice: number;
  date: string;
}

export interface StockItem {
  itemName: string;
  modelName: string;
  partNumber: string;
  quantity: number;
  avgPurchasePrice: number;
}
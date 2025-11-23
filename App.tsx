import React, { useState, useMemo, useCallback } from 'react';
import { Purchase, Sale, StockItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import StockList from './components/StockList';
import PurchaseList from './components/PurchaseList';
import SellList from './components/SellList';
import PurchaseForm from './components/PurchaseForm';
import SellForm from './components/SellForm';
import { PlusIcon, BoxIcon, CurrencyRupeeIcon, TrendingUpIcon, ReceiptIcon } from './components/icons';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import LowStockWarning from './components/LowStockWarning';

type View = 'dashboard' | 'stock' | 'purchases' | 'sales';

const App: React.FC = () => {
  const [purchases, setPurchases] = useLocalStorage<Purchase[]>('purchases', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const [purchaseToEdit, setPurchaseToEdit] = useState<Purchase | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useLocalStorage<string>('deletePassword', '');

  const stock = useMemo((): StockItem[] => {
    const stockMap = new Map<string, { 
      quantity: number; 
      totalCost: number; 
      purchaseCount: number; 
      itemName: string;
      modelName: string;
      partNumber: string;
    }>();
    
    purchases.forEach(p => {
      const key = `${p.itemName}|${p.modelName}|${p.partNumber}`;
      const item = stockMap.get(key) || { 
        quantity: 0, 
        totalCost: 0, 
        purchaseCount: 0,
        itemName: p.itemName,
        modelName: p.modelName,
        partNumber: p.partNumber,
      };
      item.quantity += p.quantity;
      item.totalCost += p.purchasePrice * p.quantity;
      item.purchaseCount += p.quantity;
      stockMap.set(key, item);
    });

    sales.forEach(s => {
      const key = `${s.itemName}|${s.modelName}|${s.partNumber}`;
      const item = stockMap.get(key);
      if (item) {
        item.quantity -= s.quantity;
      }
    });
    
    return Array.from(stockMap.values()).map(data => ({
      itemName: data.itemName,
      modelName: data.modelName,
      partNumber: data.partNumber,
      quantity: data.quantity,
      avgPurchasePrice: data.purchaseCount > 0 ? data.totalCost / data.purchaseCount : 0,
    }));
  }, [purchases, sales]);

  const handleSavePurchase = useCallback((purchase: Purchase) => {
    setPurchases(prev => {
      const existingIndex = prev.findIndex(p => p.id === purchase.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = purchase;
        return updated;
      }
      return [...prev, purchase];
    });
    setPurchaseToEdit(null);
  }, [setPurchases]);

  const handleEditPurchase = useCallback((purchase: Purchase) => {
    setPurchaseToEdit(purchase);
    setPurchaseModalOpen(true);
  }, []);

  // Called when user requests to delete (opens confirm modal)
  const handleRequestDelete = useCallback((id: string) => {
    setPurchaseToDelete(id);
    setConfirmOpen(true);
  }, []);

  // Actual delete after confirmation
  const handleDeletePurchase = useCallback((id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  }, [setPurchases]);

  const handleOpenPurchaseModal = useCallback(() => {
    setPurchaseToEdit(null);
    setPurchaseModalOpen(true);
  }, []);

  const handleClosePurchaseModal = useCallback(() => {
    setPurchaseModalOpen(false);
    setPurchaseToEdit(null);
  }, []);

  const handleSaveSale = useCallback((sale: Sale) => {
    setSales(prev => [...prev, sale]);
  }, [setSales]);

  const getNavButtonClass = (view: View) => {
    const baseClasses = 'px-4 py-3 text-sm font-medium transition-colors duration-200 ease-in-out';
    if (currentView === view) {
      return `${baseClasses} text-red-600 border-b-2 border-red-600`;
    }
    return `${baseClasses} text-gray-500 hover:text-gray-800 hover:border-b-2 hover:border-gray-300`;
  };

  const totalStockValue = useMemo(() => {
    return stock.reduce((total, item) => total + (item.quantity * item.avgPurchasePrice), 0);
  }, [stock]);

  const totalItemsInStock = useMemo(() => {
    return stock.reduce((total, item) => total + item.quantity, 0);
  }, [stock]);
  
  const totalProfit = useMemo(() => {
    return sales.reduce((total, sale) => {
      const stockItem = stock.find(item => 
        item.itemName === sale.itemName && 
        item.modelName === sale.modelName && 
        item.partNumber === sale.partNumber
      );
      
      if (stockItem) {
        const costOfGoods = stockItem.avgPurchasePrice * sale.quantity;
        const revenue = sale.salePrice * sale.quantity;
        return total + (revenue - costOfGoods);
      }
      return total;
    }, 0);
  }, [sales, stock]);

  const totalSalesValue = useMemo(() => {
    return sales.reduce((total, sale) => total + (sale.quantity * sale.salePrice), 0);
  }, [sales]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
                <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        <span className="text-red-600">Honda</span> Parts Manager
                    </h1>
                </div>
            </div>
          <nav className="flex justify-center border-t border-gray-200" aria-label="Tabs">
              <button onClick={() => setCurrentView('dashboard')} className={getNavButtonClass('dashboard')}>
                Dashboard
              </button>
              <button onClick={() => setCurrentView('stock')} className={getNavButtonClass('stock')}>
                Stock
              </button>
              <button onClick={() => setCurrentView('purchases')} className={getNavButtonClass('purchases')}>
                Purchases
              </button>
              <button onClick={() => setCurrentView('sales')} className={getNavButtonClass('sales')}>
                Sales
              </button>
          </nav>
            <div className="py-4 flex justify-center items-center space-x-2 sm:space-x-4">
                <button onClick={handleOpenPurchaseModal} className="flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors sm:w-40">
                  <PlusIcon />
                  <span className="hidden sm:inline ml-2">Add Purchase</span>
                </button>
                <button onClick={() => setSellModalOpen(true)} className="flex items-center justify-center bg-green-600 text-white px-3 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-green-700 transition-colors sm:w-40">
                  <PlusIcon />
                  <span className="hidden sm:inline ml-2">Add Sale</span>
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
           <div className="space-y-8">
              <LowStockWarning stock={stock} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transition hover:shadow-xl">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <BoxIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Items in Stock</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{totalItemsInStock}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transition hover:shadow-xl">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <CurrencyRupeeIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Stock Value</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">₹{totalStockValue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transition hover:shadow-xl">
                    <div className="bg-green-100 p-3 rounded-full">
                      <ReceiptIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">₹{totalSalesValue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transition hover:shadow-xl">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <TrendingUpIcon className={`h-8 w-8 ${totalProfit >= 0 ? 'text-purple-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
                      <p className={`mt-1 text-2xl font-semibold ${totalProfit >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        ₹{totalProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
              </div>
            </div>
        )}
       
        {currentView === 'stock' && <StockList stock={stock} />}
        {currentView === 'purchases' && <PurchaseList purchases={purchases} onEdit={handleEditPurchase} onDelete={handleRequestDelete} />}
        {currentView === 'sales' && <SellList sales={sales} />}
      </main>

      <PurchaseForm 
        isOpen={isPurchaseModalOpen} 
        onClose={handleClosePurchaseModal} 
        onSave={handleSavePurchase} 
        purchaseToEdit={purchaseToEdit} 
      />
      <SellForm 
        isOpen={isSellModalOpen} 
        onClose={() => setSellModalOpen(false)} 
        onSave={handleSaveSale} 
        stock={stock}
        sales={sales}
      />

      {/* Confirm delete modal */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => { setConfirmOpen(false); setPurchaseToDelete(null); }}
        onConfirm={(id) => { if (id) handleDeletePurchase(id); }}
        purchaseId={purchaseToDelete || undefined}
        storedPassword={deletePassword}
        savePassword={(pw) => setDeletePassword(pw)}
      />
    </div>
  );
};

export default App;
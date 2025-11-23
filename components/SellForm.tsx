import React, { useState, useEffect, useMemo } from 'react';
import { Sale, StockItem } from '../types';
import { CloseIcon } from './icons';

interface SellFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  stock: StockItem[];
  sales: Sale[];
}

const SellForm: React.FC<SellFormProps> = ({ isOpen, onClose, onSave, stock, sales }) => {
  const [selectedStockItemKey, setSelectedStockItemKey] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const availableStock = useMemo(() => stock.filter(item => item.quantity > 0), [stock]);
  
  const selectedStockItem = useMemo(() => {
    return availableStock.find(item => `${item.itemName}|${item.modelName}|${item.partNumber}` === selectedStockItemKey);
  }, [selectedStockItemKey, availableStock]);

  const lastSalePrice = useMemo(() => {
    if (!selectedStockItem) return null;
    
    const salesForItem = sales
      .filter(s => 
        s.itemName === selectedStockItem.itemName &&
        s.modelName === selectedStockItem.modelName &&
        s.partNumber === selectedStockItem.partNumber
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
    if (salesForItem.length > 0) {
      return salesForItem[0].salePrice;
    }
    return null;
  }, [selectedStockItem, sales]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedStockItemKey('');
      setQuantity(1);
      setSalePrice(0);
      setDate(new Date().toISOString().split('T')[0]);
      setError('');
    } else {
      if(availableStock.length > 0 && !selectedStockItemKey) {
          const firstItem = availableStock[0];
          setSelectedStockItemKey(`${firstItem.itemName}|${firstItem.modelName}|${firstItem.partNumber}`);
      }
    }
  }, [isOpen, availableStock, selectedStockItemKey]);

  useEffect(() => {
    if (selectedStockItem && quantity > selectedStockItem.quantity) {
      setError(`Only ${selectedStockItem.quantity} items in stock.`);
    } else {
      setError('');
    }
  }, [quantity, selectedStockItem]);
  
  useEffect(() => {
    if (selectedStockItem) {
      setSalePrice(selectedStockItem.avgPurchasePrice);
    }
  }, [selectedStockItem]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem) {
      setError('Please select an item.');
      return;
    }
    if (quantity > selectedStockItem.quantity) {
      setError(`Cannot sell ${quantity}, only ${selectedStockItem.quantity} in stock.`);
      return;
    }

    onSave({
      id: new Date().toISOString(),
      itemName: selectedStockItem.itemName,
      modelName: selectedStockItem.modelName,
      partNumber: selectedStockItem.partNumber,
      quantity,
      salePrice,
      date,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Add Sale</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="stockItem" className="block text-sm font-medium text-gray-700">Item</label>
            <select
              id="stockItem"
              value={selectedStockItemKey}
              onChange={e => setSelectedStockItemKey(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>Select an item</option>
              {availableStock.map((item, i) => (
                <option key={i} value={`${item.itemName}|${item.modelName}|${item.partNumber}`}>
                  {item.itemName} ({item.modelName}) - In Stock: {item.quantity}
                </option>
              ))}
            </select>
             {availableStock.length === 0 && (
                 <p className="text-sm text-gray-500 mt-2">No items in stock to sell.</p>
             )}
          </div>
          
          {selectedStockItem && (
            <div className="text-sm text-gray-600 space-y-1 mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p><strong>Part Number:</strong> {selectedStockItem.partNumber}</p>
                <p><strong>Avg. Purchase Price:</strong> ₹{selectedStockItem.avgPurchasePrice.toFixed(2)}</p>
                {lastSalePrice !== null ? (
                    <p><strong>Last Sale Price:</strong> ₹{lastSalePrice.toFixed(2)}</p>
                ) : (
                    <p>No previous sale record.</p>
                )}
            </div>
          )}

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" max={selectedStockItem?.quantity} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">Sale Price (per item)</label>
            <input type="number" id="salePrice" value={salePrice} onChange={e => setSalePrice(Number(e.target.value))} min="0" step="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end pt-2">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={!!error || !selectedStockItem} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellForm;
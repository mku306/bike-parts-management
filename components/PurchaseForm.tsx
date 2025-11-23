import React, { useState, useEffect } from 'react';
import { Purchase } from '../types';
import { CloseIcon } from './icons';

interface PurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchase: Purchase) => void;
  purchaseToEdit: Purchase | null;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ isOpen, onClose, onSave, purchaseToEdit }) => {
  const [itemName, setItemName] = useState('');
  const [modelName, setModelName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (purchaseToEdit) {
      setItemName(purchaseToEdit.itemName);
      setModelName(purchaseToEdit.modelName);
      setPartNumber(purchaseToEdit.partNumber);
      setQuantity(purchaseToEdit.quantity);
      setPurchasePrice(purchaseToEdit.purchasePrice);
      setDate(purchaseToEdit.date);
    } else {
      // Reset form
      setItemName('');
      setModelName('');
      setPartNumber('');
      setQuantity(1);
      setPurchasePrice(0);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [purchaseToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: purchaseToEdit ? purchaseToEdit.id : new Date().toISOString(),
      itemName,
      modelName,
      partNumber,
      quantity,
      purchasePrice,
      date,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{purchaseToEdit ? 'Edit Purchase' : 'Add Purchase'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item Name</label>
            <input type="text" id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">Model Name</label>
            <input type="text" id="modelName" value={modelName} onChange={e => setModelName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="partNumber" className="block text-sm font-medium text-gray-700">Part Number</label>
            <input type="text" id="partNumber" value={partNumber} onChange={e => setPartNumber(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="1" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">Purchase Price (per item)</label>
            <input type="number" id="purchasePrice" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))} min="0" step="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="flex justify-end pt-2">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;

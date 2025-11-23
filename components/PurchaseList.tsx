import React from 'react';
import { Purchase } from '../types';
import { PencilIcon, TrashIcon } from './icons';

interface PurchaseListProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
}

const PurchaseList: React.FC<PurchaseListProps> = ({ purchases, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Purchases</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.modelName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.partNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{p.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{p.purchasePrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{(p.quantity * p.purchasePrice).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEdit(p)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <PencilIcon />
                  </button>
                  <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">No purchases recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseList;

import React from 'react';
import { StockItem } from '../types';

interface LowStockWarningProps {
  stock: StockItem[];
}

const LowStockWarning: React.FC<LowStockWarningProps> = ({ stock }) => {
  const lowStockItems = stock.filter(item => item.quantity < 5);

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-red-50 border border-red-200 p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-semibold text-red-800">Low Stock Alert</h2>
      </div>
      <p className="text-red-700 mt-2 mb-4">The following items are running low on stock. Consider reordering soon.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Item Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Model Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">Part Number</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-red-600 uppercase tracking-wider">Quantity Left</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lowStockItems.map((item, index) => (
              <tr key={index} className="hover:bg-red-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.modelName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.partNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold text-right">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockWarning;

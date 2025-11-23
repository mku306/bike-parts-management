import React from 'react';
import { Sale } from '../types';

interface SellListProps {
  sales: Sale[];
}

const SellList: React.FC<SellListProps> = ({ sales }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(s.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.modelName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.partNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{s.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{s.salePrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{(s.quantity * s.salePrice).toFixed(2)}</td>
              </tr>
            ))}
             {sales.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">No sales recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellList;

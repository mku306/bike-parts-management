import React from 'react';
import { StockItem } from '../types';

interface StockListProps {
  stock: StockItem[];
}

const StockList: React.FC<StockListProps> = ({ stock }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Stock</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Purchase Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stock.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.modelName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.partNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{item.avgPurchasePrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{(item.quantity * item.avgPurchasePrice).toFixed(2)}</td>
              </tr>
            ))}
             {stock.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">No items in stock.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockList;
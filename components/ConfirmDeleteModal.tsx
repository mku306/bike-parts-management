import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id?: string) => void;
  purchaseId?: string;
  storedPassword?: string;
  savePassword: (password: string) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  purchaseId,
  storedPassword,
  savePassword,
}) => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  
  const isSettingPassword = !storedPassword;

  useEffect(() => {
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setError('');
  }, [isOpen])

  const handleConfirm = () => {
    if (isSettingPassword) {
        if (newPassword.length < 4) {
            setError('Password must be at least 4 characters long.');
            return;
        }
        if(newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }
        savePassword(newPassword);
        onConfirm(purchaseId);
        onClose();
    } else {
        if (password === storedPassword) {
            onConfirm(purchaseId);
            onClose();
        } else {
            setError('Incorrect password.');
        }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             <CloseIcon />
          </button>
        </div>
        
        {isSettingPassword ? (
             <div className="space-y-4">
                <p className="text-sm text-gray-600">This is a sensitive action. Please set a password to protect against accidental deletions.</p>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                </div>
             </div>
        ) : (
            <div className="space-y-4">
                <p className="text-sm text-gray-600">Are you sure you want to delete this purchase record? This action cannot be undone.</p>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Enter password to confirm:</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                </div>
            </div>
        )}
       
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            {isSettingPassword ? 'Set Password & Delete' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

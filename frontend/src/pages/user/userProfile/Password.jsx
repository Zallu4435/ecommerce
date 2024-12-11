import React, { useState } from 'react';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [storedPassword, setStoredPassword] = useState('1234');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (currentPassword !== storedPassword) {
      setMessage({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setStoredPassword(newPassword);
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleForgotPassword = () => {
    alert('Redirecting to Forgot Password page...');
  };

  const inputFields = [
    { id: 'currentPassword', label: 'Current Password', type: 'password' },
    { id: 'newPassword', label: 'New Password', type: 'password' },
    { id: 'confirmPassword', label: 'Confirm New Password', type: 'password' }
  ];

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Change Password</h2>
      {message.text && (
        <p className={`text-sm font-bold mb-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {message.text}
        </p>
      )}
      <form onSubmit={handlePasswordChange}>
        {inputFields.map(({ id, label, type }) => (
          <div key={id} className="mb-4">
            <label htmlFor={id} className="block text-gray-700 dark:text-gray-300 mb-2">
              {label}
            </label>
            <input
              type={type}
              id={id}
              name={id}
              value={formData[id]}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300"
        >
          Change Password
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={handleForgotPassword}
          className="text-sm text-indigo-500 hover:underline dark:text-indigo-400"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;

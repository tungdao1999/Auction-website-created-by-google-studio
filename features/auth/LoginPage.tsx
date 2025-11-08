import React from 'react';
import { User } from '../../types';
import { USERS } from '../../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Select a User to Login</h1>
        <div className="space-y-4">
          {USERS.map(user => (
            <button
              key={user.id}
              onClick={() => onLogin(user)}
              className="w-full px-4 py-3 text-lg font-semibold text-white bg-primary hover:bg-primary-hover rounded-md transition-colors"
            >
              Login as {user.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

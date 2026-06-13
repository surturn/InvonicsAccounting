import React, { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-surface rounded-2xl p-8 border border-bg-border shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent tracking-tight">Invonics</h1>
          <p className="text-sm text-text-muted uppercase tracking-wider mt-1 font-medium">
            Accounting System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@invonics.com"
            required
            disabled={isPending}
          />
          
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-text-muted hover:text-text-primary focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            loading={isPending}
          >
            Sign In
          </Button>

          {error && (
            <div className="p-3 mt-4 rounded-lg bg-danger-subtle border border-danger/20 text-danger text-sm text-center">
              {(error as any)?.response?.data?.error || 'Authentication failed'}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useRegister } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ name, email, password });
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-bg-surface rounded-none p-8 border border-bg-border shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent tracking-tight">Invonics</h1>
          <p className="text-sm text-text-muted uppercase tracking-wider mt-1 font-medium">
            Create Account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={isPending}
          />

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
            className="w-full mt-6 rounded-none font-bold"
            loading={isPending}
          >
            Sign Up
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
                Sign In
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-3 mt-4 bg-danger/10 border border-danger/20 text-danger text-sm text-center">
              {(error as any)?.response?.data?.error || 'Registration failed'}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

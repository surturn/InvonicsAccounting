import React, { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 lg:p-0">
      <div className="w-full max-w-5xl bg-bg-surface rounded-4xl lg:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-bg-surface">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Sign in to your Invonics account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto w-full">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={isPending}
            />
            
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[14px] text-text-muted hover:text-text-primary focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-8 shadow-lg shadow-accent/20"
              loading={isPending}
              size="lg"
            >
              Sign In
            </Button>

            <div className="mt-8 text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link to="/signup" className="text-accent hover:text-accent-hover font-bold">
                  Sign Up
                </Link>
              </p>
            </div>

            {error && (
              <div className="p-4 mt-6 rounded-2xl bg-danger-subtle text-danger text-sm text-center font-medium">
                {(error as any)?.response?.data?.error || 'Authentication failed'}
              </div>
            )}
          </form>
        </div>

        {/* Brand/African Aesthetic Section */}
        <div className="hidden lg:flex w-1/2 bg-bg-inverse relative items-center justify-center p-16 rounded-l-[4rem] -ml-8 overflow-hidden">
          {/* Subtle pattern / glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(194,89,52,0.15),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <div className="relative z-10 text-center text-text-inverse max-w-md">
            <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              New Here?
            </h2>
            <p className="text-lg text-text-inverse/80 leading-relaxed mb-10">
              Sign up and discover how our modern financial tools can accelerate your business growth.
            </p>
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center px-10 py-3 rounded-full border-2 border-text-inverse/30 hover:border-text-inverse hover:bg-text-inverse hover:text-bg-inverse transition-all font-bold text-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

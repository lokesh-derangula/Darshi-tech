import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../utils/api';
import { KeyRound, Mail, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      onLogin(data.user, data.token);

      if (data.user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      console.error(err);
      
      if (err.data && err.data.unverified) {
        setError(err.message);
        setTimeout(() => {
          navigate('/verify-email', { state: { email } });
        }, 1500);
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md glass-panel p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 border border-theme-title/25 bg-theme-title/10 flex items-center justify-center rounded-full">
            <ShieldCheck className="h-5 w-5 text-theme-title" />
          </div>
          <h2 className="font-serif text-2xl font-light tracking-tight text-theme-card-title">Sign In To Darshi Tech</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Access secure educational portals</p>
        </div>

        {location.state?.message && (
          <p className="text-base text-emerald-400 bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl">
            ✔ {location.state.message}
          </p>
        )}

        {error && (
          <div className="flex gap-2 items-start text-base text-rose-400 bg-rose-950/20 border border-rose-800/40 p-3 rounded-xl">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-base">
          <div className="space-y-1.5">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Password</label>
              <Link to="/forgot-password" className="text-base text-theme-title font-semibold hover:text-theme-title/80">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--btn-text)] border-t-transparent"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-base text-theme-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-theme-title font-bold hover:underline">
              Create student account
            </Link>
          </p>
        </div>

        {/* Sandbox accounts helper */}
        <div className="bg-theme-card border border-theme-border p-4 rounded-xl space-y-2 text-base">
          <span className="text-base text-theme-title font-bold uppercase tracking-wider block">Sandbox Testing Credentials</span>
          <div className="space-y-1 text-base text-theme-muted">
            <p>🔑 <strong className="text-theme-body font-semibold">Admin Account:</strong> admin@darshitech.com / AdminPassword123</p>
            <p>🎓 <strong className="text-theme-body font-semibold">Student Account:</strong> Register a new account to test OTP verifying, checkout flows, and credentials download.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

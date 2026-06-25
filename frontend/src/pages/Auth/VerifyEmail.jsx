import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../utils/api';
import { ShieldAlert, Check, AlertTriangle, Info } from 'lucide-react';

export default function VerifyEmail() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/login');
    }


  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.verifyEmail(email, code);
      setSuccess('Email successfully verified! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Verification successful! You can now log in.' } });
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md glass-panel p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 border border-theme-title/25 bg-theme-title/10 flex items-center justify-center rounded-full">
            <ShieldAlert className="h-5 w-5 text-theme-title" />
          </div>
          <h2 className="font-serif text-2xl font-light tracking-tight text-theme-card-title">Email Verification</h2>
          <p className="text-theme-muted text-base">Enter the 6-digit OTP code sent to <strong className="text-theme-title">{email}</strong>.</p>
        </div>

        {error && (
          <div className="flex gap-2 items-start text-base text-rose-400 bg-rose-950/20 border border-rose-800/40 p-3 rounded-xl">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex gap-2 items-start text-base text-emerald-400 bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl">
            <Check className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {location.state?.devOtp && (
          <div className="flex gap-2 items-start text-base text-amber-400 bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>[Dev Mode]</strong> SMTP not configured. Use OTP code:{' '}
              <strong className="text-theme-title select-all">{location.state.devOtp}</strong>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-base">
          <div className="space-y-1.5">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Verification OTP Code</label>
            <input
              type="text"
              required
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3.5 text-center text-lg tracking-widest font-bold text-theme-card-title focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--btn-text)] border-t-transparent"></div>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>


      </div>
    </div>
  );
}

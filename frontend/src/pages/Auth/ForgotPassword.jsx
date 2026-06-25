import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { KeyRound, Mail, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [devOtp, setDevOtp] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setLoading(true);

    try {
      const data = await api.forgotPassword(email);
      setSuccess('Reset code generated successfully!');
      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }

      setTimeout(() => {
        setStep(2);
        setSuccess('');
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to request reset code. Verify your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !code || !newPassword) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.resetPassword(email, code, newPassword);
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md glass-panel p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-light tracking-tight text-theme-card-title">Reset Password</h2>
          <p className="text-theme-muted text-base">
            {step === 1 ? 'Enter your registered email to request a reset code.' : 'Enter the code and specify your new password.'}
          </p>
        </div>

        {error && (
          <div className="flex gap-2 items-start text-base text-rose-400 bg-rose-950/20 border border-rose-800/40 p-3 rounded-xl">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex gap-2 items-start text-base text-emerald-400 bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl">
            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-4 text-base">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--btn-text)] border-t-transparent"></div>
              ) : (
                'Generate Reset Code'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-base">
            {devOtp && (
              <div className="flex gap-2 items-start text-base text-amber-400 bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl mb-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>[Dev Mode]</strong> SMTP not configured. Use OTP code:{' '}
                  <strong className="text-theme-title select-all">{devOtp}</strong>
                </span>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">6-Digit Reset Code</label>
              <input
                type="text"
                required
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-center text-md tracking-wider font-bold text-theme-card-title focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="000000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                'Update Password'
              )}
            </button>
          </form>
        )}



        <div className="text-center pt-2">
          <Link to="/login" className="text-base text-theme-title font-bold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

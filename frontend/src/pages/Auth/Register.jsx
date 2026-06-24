import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { User, Mail, Phone, KeyRound, School, Briefcase, Calendar, AlertTriangle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    college: '',
    branch: '',
    year: '1st Year'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.register(formData);
      navigate('/verify-email', {
        state: {
          email: formData.email,
          message: data.message
        }
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-full max-w-lg glass-panel p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl font-light tracking-tight text-theme-card-title">Create Student Account</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Fill out the academic details below</p>
        </div>

        {error && (
          <div className="flex gap-2 items-start text-base text-rose-400 bg-rose-950/20 border border-rose-800/40 p-3 rounded-xl">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 text-base">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">College / University</label>
            <div className="relative">
              <School className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="IIT Hyderabad"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Branch / Specialization</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <input
                type="text"
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Academic Year</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors appearance-none"
              >
                <option value="1st Year" className="bg-theme-card text-theme-body">1st Year</option>
                <option value="2nd Year" className="bg-theme-card text-theme-body">2nd Year</option>
                <option value="3rd Year" className="bg-theme-card text-theme-body">3rd Year</option>
                <option value="4th Year" className="bg-theme-card text-theme-body">4th Year</option>
                <option value="Graduated" className="bg-theme-card text-theme-body">Graduated</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-base font-bold text-theme-muted uppercase tracking-wider block">Create Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-theme-muted" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl pl-10 pr-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--btn-text)] border-t-transparent"></div>
              ) : (
                'Create Account & Send OTP'
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-theme-border">
          <p className="text-base text-theme-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-theme-title font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

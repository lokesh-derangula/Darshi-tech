import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Calendar, User, Award, CreditCard, Sparkles, Plus } from 'lucide-react';

export default function WorkshopsConferences() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentStep, setPaymentStep] = useState('idle');
  const [paymentId, setPaymentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', duration: '', price: '0', thumbnail: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const userJson = localStorage.getItem('darshi_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setIsAdmin(user.role === 'ADMIN');
      } catch (e) {
        console.error('Error parsing user info', e);
      }
    }

    api.getCourses('Workshops')
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCreateWorkshop = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      await api.createCourse({
        title: form.title,
        description: form.description,
        duration: form.duration,
        price: Number(form.price) || 0,
        thumbnail: form.thumbnail || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
        category: 'Workshops',
        status: 'ACTIVE'
      });
      setIsModalOpen(false);
      setForm({ title: '', description: '', duration: '', price: '0', thumbnail: '' });
      
      // Refresh list
      setLoading(true);
      const data = await api.getCourses('Workshops');
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to create workshop/seminar.');
    }
  };

  const handleEnrollClick = (course) => {
    const userJson = localStorage.getItem('darshi_user');
    if (!userJson) {
      navigate('/login');
      return;
    }
    setSelectedCourse(course);
    setPaymentStep('checkout');
    setErrorMessage('');
  };

  const handleMockPayment = async () => {
    try {
      setPaymentStep('processing');
      const order = await api.createOrder(selectedCourse.id);
      const mockPayId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      const mockSig = `sig_${Math.random().toString(36).substring(2, 12)}`;

      await api.verifyPayment({
        courseId: selectedCourse.id,
        paymentId: mockPayId,
        orderId: order.id,
        signature: mockSig,
      });

      setPaymentId(mockPayId);
      setPaymentStep('success');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Payment simulation failed.');
      setPaymentStep('checkout');
    }
  };

  return (
    <div className="space-y-12 py-4">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Workshops & Conferences</h1>
        <p className="text-theme-muted text-base uppercase tracking-wider">Attend our live panels and hackathons</p>
      </div>

      {/* Database workshops list */}
      <section className="space-y-6 pt-6">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="font-serif text-2xl font-light text-theme-title">Join Active Live Workshops</h2>
            <p className="text-theme-muted text-base uppercase tracking-wider">Directly register in our active training panels</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-gold px-4 py-2 flex items-center gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Workshop / Seminar
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-theme-title border-t-transparent"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 text-theme-muted text-base font-semibold">No workshops currently scheduled.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="glass-panel p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl border border-theme-border mb-2" />
                  <h3 className="font-serif text-lg font-bold text-theme-card-title">{course.title}</h3>
                  <p className="text-theme-desc text-base leading-relaxed line-clamp-3">{course.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-theme-border pt-4">
                  <div>
                    <p className="text-theme-muted text-base font-bold uppercase tracking-wider">Duration: {course.duration}</p>
                  </div>
                  <button onClick={() => handleEnrollClick(course)} className="btn-gold px-4 py-2">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Simulated Payment Modal */}
      {paymentStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-theme-border bg-theme-card p-6 shadow-2xl relative rounded-2xl">
            
            {paymentStep === 'checkout' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-theme-border">
                  <div className="h-7 w-7 rounded-xl bg-theme-title/10 text-theme-title flex items-center justify-center font-bold text-base">₹</div>
                  <h3 className="font-serif text-md font-bold text-theme-card-title uppercase tracking-wider">Razorpay Secure Checkout</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-base text-theme-muted uppercase font-semibold">Course Selected</p>
                  <h4 className="font-serif text-md font-bold text-theme-title">{selectedCourse?.title}</h4>
                  <p className="text-base text-theme-desc">Duration: {selectedCourse?.duration}</p>
                </div>

                <div className="bg-theme-card p-4 rounded-xl flex justify-between items-center border border-theme-border">
                  <span className="text-base text-theme-desc uppercase font-bold">Total Price</span>
                  <span className="font-serif text-lg font-light text-theme-card-title">₹{selectedCourse?.price.toLocaleString('en-IN')}</span>
                </div>

                <div className="text-base text-theme-desc leading-relaxed bg-theme-card p-3 rounded-xl border border-theme-border">
                  <span className="font-bold text-theme-title">Auditing Policy:</span> Payments route securely through startup escrow settlements directly into settlement streams.
                </div>

                {errorMessage && <p className="text-base text-red-600">{errorMessage}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setPaymentStep('idle')}
                    className="flex-1 btn-outline-gold py-2.5 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMockPayment}
                    className="flex-1 btn-gold py-2.5 px-4 flex items-center justify-center gap-2"
                  >
                    Complete Mock Payment
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-theme-title border-t-transparent"></div>
                <p className="text-base font-semibold text-theme-muted uppercase tracking-wider">Verifying transaction signature...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-6 space-y-6">
                <div className="mx-auto h-12 w-12 border border-theme-title/20 bg-theme-title/10 flex items-center justify-center rounded-full">
                  <Sparkles className="h-5 w-5 text-theme-title" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-theme-title">Enrollment Confirmed</h3>
                  <p className="text-base text-theme-desc">Your mock transaction has been fully verified and logged.</p>
                  <div className="bg-theme-card border border-theme-border p-3 rounded-xl inline-block font-mono text-base text-theme-muted mt-2 select-all">
                    TxID: {paymentId}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPaymentStep('idle');
                    navigate('/student-dashboard');
                  }}
                  className="w-full btn-gold py-3"
                >
                  Go to Student Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Workshop Modal for Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-theme-border bg-theme-card p-6 shadow-2xl space-y-4 rounded-2xl relative">
            <h3 className="font-serif text-lg font-bold text-theme-title border-b border-theme-border pb-3 uppercase tracking-wider">Add New Workshop / Seminar</h3>
            
            <form onSubmit={handleCreateWorkshop} className="space-y-4 text-base">
              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  placeholder="e.g. Generative AI Hands-on Workshop"
                />
              </div>

              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title resize-none"
                  placeholder="Workshop agenda, learning objectives..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase block mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                    placeholder="e.g. 3 Hours"
                  />
                </div>
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase block mb-1">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                    placeholder="0 for Free"
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              {errorMessage && <p className="text-sm text-red-500 font-semibold">{errorMessage}</p>}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setErrorMessage('');
                  }}
                  className="flex-1 btn-outline-gold py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold py-2.5 px-4"
                >
                  Create Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Calendar, User, Award, CreditCard, Sparkles } from 'lucide-react';

export default function WorkshopsConferences() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentStep, setPaymentStep] = useState('idle');
  const [paymentId, setPaymentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const events = [
    {
      title: 'Generative AI & LLM Conference',
      date: 'July 15, 2026',
      fee: '₹999',
      speakers: ['Dr. A. Srinivas (AI Research Lead)', 'Ms. Neha Rao (LLM Developer)'],
      certInfo: 'Industry-recognized digital certificate with scanned QR verification.',
      image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=500&q=80'
    },
    {
      title: 'Secure Full-Stack Architectures Seminar',
      date: 'August 02, 2026',
      fee: 'Free (Registration required)',
      speakers: ['Mr. David K. (Principal Architect, Darshi Tech)'],
      certInfo: 'Participation badges issued to active attendees.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80'
    }
  ];

  useEffect(() => {
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

      {/* Events Board */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-light text-theme-title">Upcoming Global Seminars</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, i) => (
            <div key={i} className="glass-panel overflow-hidden flex flex-col justify-between">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover border-b border-theme-border" />
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-base text-theme-muted font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-theme-title" />
                      {event.date}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-theme-card-title">{event.title}</h3>
                </div>

                <div className="space-y-1 pt-2 border-t border-theme-border text-base text-theme-desc flex items-start gap-1.5">
                  <Award className="h-4 w-4 text-theme-title" shrink-0 />
                  <span>{event.certInfo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Database workshops list */}
      <section className="space-y-6 pt-6 border-t border-theme-border">
        <div>
          <h2 className="font-serif text-2xl font-light text-theme-title">Join Active Live Workshops</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Directly register in our active training panels</p>
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
    </div>
  );
}

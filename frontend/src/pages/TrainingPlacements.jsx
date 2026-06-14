import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Award, CheckCircle, Users, GraduationCap, ArrowRight, CreditCard, Sparkles } from 'lucide-react';

export default function TrainingPlacements() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentStep, setPaymentStep] = useState('idle');
  const [paymentId, setPaymentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const programs = [
    { title: 'Aptitude Training', desc: 'Quantitative math formulas, logical puzzles, diagrammatic thinking, and quick-solve tricks.' },
    { title: 'Soft Skills Training', desc: 'Professional email writing, conversational English, body language cues, and workplace ethics.' },
    { title: 'Interview Preparation', desc: 'Resume audits, behavioral interview strategies, group discussions simulation, and HR feedback.' },
    { title: 'Competitive Exams', desc: 'Time management strategies, exam-scoring tricks, syllabus guidelines, and previous paper revisions.' },
    { title: 'Problem Solving', desc: 'Detailed complexity analysis, data structure trade-offs, optimization patterns, and debugging guidelines.' },
    { title: 'Core Programming', desc: 'Foundations of Java, Python, C++, and Javascript. OOP design paradigms and multi-threading models.' }
  ];

  useEffect(() => {
    api.getCourses('Training')
      .then((data) => {
        const filtered = data.filter(c => !c.title.includes('JEE') && !c.title.includes('EAPCET'));
        setCourses(filtered);
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
        <h1 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Training & Campus Placements</h1>
        <p className="text-theme-muted text-base uppercase tracking-wider">Acquire technical and analytical readiness parameters</p>
      </div>

      {/* Program Pillars */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((item, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col justify-between transition-all duration-300">
            <h3 className="font-serif text-lg font-bold text-theme-card-title flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-[var(--text-serif)]/20 bg-[var(--text-serif)]/10 text-[var(--text-serif)] text-base rounded-full transition-colors duration-300">✔</span>
              {item.title}
            </h3>
            <p className="text-theme-desc text-base leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Database courses list */}
      <section className="space-y-6 pt-6 border-t border-theme-divider">
        <div>
          <h2 className="font-serif text-2xl font-light text-theme-title">Placement Courses Catalog</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Enroll in structured preparatory bootcamps</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--text-serif)] border-t-transparent"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 text-theme-muted text-base font-semibold">No placement prep courses currently available.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="glass-panel p-6 flex flex-col justify-between transition-all duration-300">
                <div className="space-y-3">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl border border-theme-border mb-2" />
                  <h3 className="font-serif text-lg font-bold text-theme-card-title">{course.title}</h3>
                  <p className="text-theme-desc text-base leading-relaxed line-clamp-3">{course.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-theme-divider pt-4">
                  <div>
                    <p className="text-theme-muted text-base font-bold uppercase tracking-wider">Duration: {course.duration}</p>
                    <p className="text-theme-card-title font-serif text-xl font-light mt-1">₹{course.price.toLocaleString('en-IN')}</p>
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
          <div className="w-full max-w-md border border-theme-border bg-theme-card p-6 shadow-2xl relative rounded-2xl transition-colors duration-300">
            
            {paymentStep === 'checkout' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-theme-divider">
                  <div className="h-7 w-7 rounded-xl bg-[var(--text-serif)]/15 text-[var(--text-serif)] flex items-center justify-center font-bold text-base transition-colors duration-300">₹</div>
                  <h3 className="font-serif text-md font-bold text-theme-card-title uppercase tracking-wider">Razorpay Secure Checkout</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-base text-theme-muted uppercase font-semibold">Course Selected</p>
                  <h4 className="font-serif text-md font-bold text-theme-card-title">{selectedCourse?.title}</h4>
                  <p className="text-base text-theme-desc">Duration: {selectedCourse?.duration}</p>
                </div>

                <div className="p-4 rounded-xl flex justify-between items-center border border-theme-border transition-colors duration-300" style={{ backgroundColor: 'var(--scrollbar-track)' }}>
                  <span className="text-base text-theme-desc uppercase font-bold">Total Price</span>
                  <span className="font-serif text-lg font-light text-theme-card-title">₹{selectedCourse?.price.toLocaleString('en-IN')}</span>
                </div>

                <div className="text-base text-theme-desc leading-relaxed p-3 rounded-xl border border-theme-border transition-colors duration-300" style={{ backgroundColor: 'var(--scrollbar-track)' }}>
                  <span className="font-bold text-[var(--text-serif)]">Auditing Policy:</span> Payments route securely through startup escrow settlements directly into settlement streams.
                </div>

                {errorMessage && <p className="text-base text-red-600">{errorMessage}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setPaymentStep('idle')}
                    className="flex-1 border border-theme-border bg-transparent hover:bg-theme-card text-theme-desc font-bold py-2.5 px-4 rounded-full text-base transition-all duration-300"
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
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--text-serif)] border-t-transparent"></div>
                <p className="text-base font-semibold text-theme-muted uppercase tracking-wider">Verifying transaction signature...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-6 space-y-6">
                <div className="mx-auto h-12 w-12 border border-[var(--text-serif)]/30 bg-[var(--text-serif)]/5 flex items-center justify-center rounded-full transition-colors duration-300">
                  <Sparkles className="h-5 w-5 text-[var(--text-serif)]" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-theme-card-title">Enrollment Confirmed</h3>
                  <p className="text-base text-theme-desc">Your mock transaction has been fully verified and logged.</p>
                  <div className="p-3 rounded-xl inline-block font-mono text-base text-theme-muted mt-2 select-all transition-colors duration-300" style={{ backgroundColor: 'var(--scrollbar-track)' }}>
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

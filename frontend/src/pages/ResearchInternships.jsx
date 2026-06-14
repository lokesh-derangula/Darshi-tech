import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Compass, ShieldAlert, CreditCard, Sparkles } from 'lucide-react';

export default function ResearchInternships() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentStep, setPaymentStep] = useState('idle');
  const [paymentId, setPaymentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const categories = [
    { title: 'NLP', duration: '8 Weeks', prerequisites: 'Python, Basic Machine Learning', fee: 8500, dbMatchTitle: 'NLP & Transformer Architectures' },
    { title: 'LLM', duration: '10 Weeks', prerequisites: 'Python, NLP Basics, PyTorch', fee: 9500, dbMatchTitle: 'LLM Fine-Tuning & AI Applications' },
    { title: 'AI Applications', duration: '10 Weeks', prerequisites: 'Python, REST APIs, LangChain', fee: 9000 },
    { title: 'Quantum Technology', duration: '8 Weeks', prerequisites: 'Linear Algebra, Python, Qiskit', fee: 10000, dbMatchTitle: 'Quantum Technology & Computing' },
    { title: 'Image Processing', duration: '8 Weeks', prerequisites: 'Python, OpenCV, NumPy', fee: 7000 },
    { title: 'ML/DL', duration: '12 Weeks', prerequisites: 'Python, Linear Algebra, Statistics', fee: 8000 },
    { title: 'Transformers', duration: '6 Weeks', prerequisites: 'Deep Learning Basics, PyTorch', fee: 7500 },
    { title: 'Cyber Security', duration: '8 Weeks', prerequisites: 'Linux Basics, Networking Fundamentals', fee: 8500 },
    { title: 'Data Management', duration: '6 Weeks', prerequisites: 'SQL, Relational Databases, Python', fee: 6000 },
    { title: 'Robotics', duration: '10 Weeks', prerequisites: 'C++, Python, Basic Microcontrollers', fee: 11000 },
  ];

  useEffect(() => {
    api.getCourses('Research')
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleEnrollClick = (item) => {
    const userJson = localStorage.getItem('darshi_user');
    if (!userJson) {
      navigate('/login');
      return;
    }

    const matched = courses.find(c => c.title.toLowerCase().includes(item.title.toLowerCase()) || (item.dbMatchTitle && c.title === item.dbMatchTitle));

    if (matched) {
      setSelectedCourse(matched);
    } else {
      setSelectedCourse({
        id: `mock-research-${item.title.toLowerCase()}`,
        title: `${item.title} Research Program`,
        price: item.fee,
        duration: item.duration,
        category: 'Research'
      });
    }

    setPaymentStep('checkout');
    setErrorMessage('');
  };

  const handleMockPayment = async () => {
    try {
      setPaymentStep('processing');
      let finalCourseId = selectedCourse.id;
      
      if (finalCourseId.startsWith('mock-research-')) {
        const backupCourse = courses[0] || await api.getCourses().then(r => r[0]);
        if (backupCourse) {
          finalCourseId = backupCourse.id;
        }
      }

      const order = await api.createOrder(finalCourseId);
      const mockPayId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      const mockSig = `sig_${Math.random().toString(36).substring(2, 12)}`;

      await api.verifyPayment({
        courseId: finalCourseId,
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
        <h1 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Research Projects & Labs</h1>
        <p className="text-theme-muted text-base uppercase tracking-wider">Natural language processing, deep neural networks, and quantum network simulations</p>
      </div>

      {/* Category Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((item, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-base font-bold bg-[var(--text-serif)]/10 border border-[var(--text-serif)]/20 px-2.5 py-0.5 rounded-full text-theme-title transition-colors duration-300">
                  Research Lab
                </span>
                <span className="text-base font-bold text-theme-muted uppercase tracking-wider">{item.duration}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-theme-card-title mb-2">{item.title}</h3>
              <div className="space-y-1 pt-3 border-t border-theme-divider">
                <span className="text-base text-theme-muted font-bold uppercase tracking-wider block">Prerequisites</span>
                <p className="text-theme-desc text-base">{item.prerequisites}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-theme-divider mt-6">
              <div>
                <span className="text-base text-theme-muted block font-bold uppercase">Enrollment Fee</span>
                <span className="text-theme-card-title font-serif text-md font-semibold">₹{item.fee.toLocaleString('en-IN')}</span>
              </div>
              <button onClick={() => handleEnrollClick(item)} className="btn-gold px-3.5 py-1.5 text-base">
                Enroll Program
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Live catalog list */}
      <section className="space-y-6 pt-6 border-t border-theme-divider">
        <div>
          <h2 className="font-serif text-2xl font-light text-theme-title">Featured Research Catalog</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Directly enroll in our fully cataloged laboratory projects</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--text-serif)] border-t-transparent"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 text-theme-muted text-base font-semibold">No courses currently available in this category.</div>
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
                  <button onClick={() => handleEnrollClick({ title: course.title, fee: course.price, duration: course.duration })} className="btn-gold px-4 py-2">
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import { Code, Database, Layout, ShieldAlert, Cpu, Laptop, Layers, Activity, CreditCard, Sparkles } from 'lucide-react';

export default function ProductDevelopment() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentStep, setPaymentStep] = useState('idle'); // idle -> checkout -> success
  const [paymentId, setPaymentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const showcase = [
    {
      title: 'ERP Systems',
      desc: 'Multi-tenant, enterprise-grade planning resources for manufacturing and retail chains. Integrates tracking, invoices, and accounting.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      projects: ['NexusERP v2', 'Apex Retail Hub'],
      icon: Layers,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300',
    },
    {
      title: 'AI Products',
      desc: 'Predictive analytics, custom recommendation modules, and intelligent LLM automation tools tailored for customer success agents.',
      tech: ['FastAPI', 'PyTorch', 'LangChain', 'SQLite'],
      projects: ['ScribeAI Agent', 'Prophet Predictive'],
      icon: Cpu,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300',
    },
    {
      title: 'Custom Software & APIs',
      desc: 'Bespoke web platforms, microservice orchestrations, and secure integration APIs built with rate-limiting and authorization models.',
      tech: ['Express.js', 'Redis', 'JWT', 'Helmet'],
      projects: ['GateKeeper Auth', 'Lumen API Portal'],
      icon: Laptop,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300',
    },
    {
      title: 'Client Projects Portfolio',
      desc: 'Collaborative development with active startups. Students build client products under expert supervision, launching products to production.',
      tech: ['Next.js', 'MongoDB', 'CORS Guard', 'Vercel'],
      projects: ['Clinica Patient Portal', 'FitLog Dashboard'],
      icon: Activity,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300',
    },
  ];

  const gallery = [
    { title: 'ERP Dashboard Interface', category: 'Enterprise', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80' },
    { title: 'NLP Chat Simulation Panel', category: 'Artificial Intelligence', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80' },
    { title: 'Server Infrastructure Logging', category: 'System Architecture', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80' },
  ];

  useEffect(() => {
    api.getCourses('Product Development')
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Product Development & Showcases</h1>
        <p className="text-theme-muted text-base uppercase tracking-wider">Enterprise planning resources, custom software, and AI engines</p>
      </motion.div>

      {/* Showcase Cards Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {showcase.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="glass-panel p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-2.5 border rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-theme-card-title">{item.title}</h3>
                </div>
                <p className="text-theme-desc text-base leading-relaxed mb-6">{item.desc}</p>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-theme-divider">
                <div>
                  <span className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-2">Technologies Stack</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tech.map((t, idx) => (
                      <span key={idx} className="text-base font-semibold badge-theme px-2.5 py-0.5 rounded-full border transition-all duration-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-2">Sample Projects</span>
                  <div className="flex flex-wrap gap-2">
                    {item.projects.map((p, idx) => (
                      <span key={idx} className="text-base font-semibold badge-theme-sec px-3 py-1 rounded-full border transition-all duration-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Portfolio Gallery */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-light text-theme-title">Project Portfolio Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative border border-theme-border overflow-hidden glass-panel h-[220px] rounded-2xl cursor-pointer"
            >
              <img
                src={g.img}
                alt={g.title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent flex flex-col justify-end p-4">
                <span className="text-base uppercase font-bold text-theme-title tracking-wider">{g.category}</span>
                <h4 className="font-bold text-white text-base mt-1">{g.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Course Enrollments */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-light text-theme-title">Product Development Internship Tracks</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Acquire portfolio-level product development experience</p>
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
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-6 flex flex-col justify-between"
              >
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
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Simulated Payment Modal */}
      <AnimatePresence>
        {paymentStep !== 'idle' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-md border border-theme-border bg-theme-card p-6 shadow-2xl relative rounded-2xl transition-colors duration-300"
            >
              
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

                  {errorMessage && <p className="text-base text-red-400">{errorMessage}</p>}

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
                      <CreditCard className="h-4 w-4" />
                      Mock Checkout
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

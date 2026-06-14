import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { 
  Code2, Server, Database, Layers, CreditCard, Sparkles,
  Globe, Paintbrush, Zap, Atom, Shield, Cpu, Coffee, Terminal, 
  Settings, Layout, Table, HardDrive 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FullStackInternships() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentStep, setPaymentStep] = useState('idle');
  const [paymentId, setPaymentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('frontend');
  const navigate = useNavigate();

  const techStack = [
    {
      id: 'frontend',
      title: 'Frontend',
      desc: 'Create highly responsive and stateful interfaces. Build complex page loaders, routing systems, and reusable frameworks.',
      icon: Code2,
      technologies: [
        { name: 'HTML5', desc: 'Semantic layout tags, SEO optimization, and browser compatibility controls.', icon: Globe },
        { name: 'CSS3 / Tailwind', desc: 'Utility-first styling, grid/flexbox responsive designs, and custom transition classes.', icon: Paintbrush },
        { name: 'JavaScript ES6+', desc: 'Asynchronous event loops, promises, functional modules, and object destructuring.', icon: Zap },
        { name: 'React.js', desc: 'Component lifecycle management, dynamic hooks, context API, and virtual DOM diffing.', icon: Atom },
        { name: 'Angular', desc: 'Strict TypeScript typing, modular injectors, routing pipelines, and RxJS streams.', icon: Shield }
      ]
    },
    {
      id: 'backend',
      title: 'Backend',
      desc: 'Build secure, scalable backends with robust data schemas. Understand API routing, secure headers, and transaction handlers.',
      icon: Server,
      technologies: [
        { name: 'Node.js / Express', desc: 'Middleware pipelines, asynchronous non-blocking routing, and authentication controls.', icon: Cpu },
        { name: 'Spring Boot', desc: 'Enterprise Java frameworks, dependency injection, and JPA database mapping.', icon: Coffee },
        { name: 'Django', desc: 'Rapid python templates, built-in MVC admin panel, and custom ORM filters.', icon: Terminal },
        { name: 'PHP', desc: 'Server-side scripting engines, flexible web execution contexts, and standard request dispatchers.', icon: Settings },
        { name: 'JSP', desc: 'Servlet compilation environments, dynamic JSP directives, and traditional MVC flows.', icon: Layout }
      ]
    },
    {
      id: 'database',
      title: 'Database',
      desc: 'Configure data redundancy models, transactional isolation locks, caching systems, and indexed schemas.',
      icon: Database,
      technologies: [
        { name: 'PostgreSQL', desc: 'Acid-compliant transaction locks, advanced indexing, and multi-relational queries.', icon: Table },
        { name: 'MySQL', desc: 'Primary-replica cluster topologies, transaction tracking, and schema definitions.', icon: Server },
        { name: 'MongoDB', desc: 'Document databases, high-availability replication sets, and pipeline aggregates.', icon: Layers },
        { name: 'SQLite', desc: 'Transactional embedded engines, single-file configurations, and microservice stores.', icon: HardDrive }
      ]
    }
  ];

  useEffect(() => {
    api.getCourses('Full Stack')
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

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="space-y-12 py-4">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Full Stack Internships & Architectures</h1>
        <p className="text-theme-muted text-base uppercase tracking-wider">Client-server interfaces, microservices scheduling, and multi-relational database design</p>
      </div>

      {/* Redesigned Technology Ecosystem Section */}
      <section className="space-y-8 pt-6 border-t border-theme-divider">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-serif text-2xl md:text-3xl font-light tracking-widest text-theme-title uppercase">
            TECHNOLOGY ECOSYSTEM
          </h2>
          <p className="text-theme-desc text-base">
            Explore the technologies used throughout our internship programs and industry projects.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {techStack.map((tier) => {
            const Icon = tier.icon;
            const isActive = activeTab === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setActiveTab(tier.id)}
                className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-[var(--text-serif)] bg-[var(--text-serif)] text-[var(--btn-text)] shadow-[0_0_20px_var(--glow-color)]'
                    : 'border-theme-border bg-theme-card text-theme-muted hover:border-theme-border/80 hover:bg-theme-card/50 hover:text-theme-title'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110 text-[var(--btn-text)]' : 'text-theme-muted group-hover:text-theme-title'}`} />
                <span className="font-serif text-md font-bold uppercase tracking-wider">{tier.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Staggered Tree Structure */}
        <div className="max-w-4xl mx-auto mt-8">
          <AnimatePresence mode="wait">
            {techStack.map((tier) => {
              if (tier.id !== activeTab) return null;
              const ParentIcon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-4"
                >
                  {/* Parent Node Card */}
                  <motion.div 
                    variants={childVariants} 
                    className="relative z-10 glass-panel p-5 border border-theme-border border-l-4 border-l-[var(--tree-accent)] shadow-[0_4px_20px_var(--glow-color)] backdrop-blur-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[var(--tree-accent)]/15 text-[var(--tree-accent)] rounded-xl border border-[var(--tree-accent)]/35 shadow-[0_0_15px_var(--glow-color)]">
                        <ParentIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-theme-card-title uppercase tracking-wide">{tier.title} Tier Architecture</h3>
                        <p className="text-theme-desc text-sm mt-1">{tier.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Vertical Connector Line from Parent */}
                  <motion.div 
                    variants={childVariants}
                    className="w-0.5 h-6 bg-[var(--tree-line)] ml-10" 
                  />
                  
                  {/* Children Container */}
                  <div className="relative ml-10 pl-8 border-l-2 border-[var(--tree-line)] space-y-5 pb-4">
                    {tier.technologies.map((tech, idx) => {
                      const TechIcon = tech.icon;
                      return (
                        <motion.div
                          key={idx}
                          variants={childVariants}
                          className="relative group"
                        >
                          {/* Horizontal connecting line */}
                          <div className="absolute top-1/2 -left-8 w-8 h-[2px] bg-[var(--tree-line)] group-hover:bg-[var(--tree-accent)] transition-colors duration-300" />
                          
                          {/* Tech Node Card */}
                          <div className="glass-panel ml-4 p-4 flex items-center justify-between hover:border-[var(--tree-accent)] hover:shadow-[0_0_15px_var(--glow-color)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-[var(--tree-accent)]/10 text-[var(--tree-accent)] rounded-lg border border-[var(--tree-accent)]/25 group-hover:bg-[var(--tree-accent)]/20 group-hover:text-[var(--tree-accent)] transition-colors duration-300">
                                <TechIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-serif text-md font-bold text-theme-card-title">{tech.name}</h4>
                                <p className="text-theme-desc text-xs mt-0.5">{tech.desc}</p>
                              </div>
                            </div>
                            
                            {/* Small bullet on right to make it feel explorer-like */}
                            <div className="h-2 w-2 rounded-full bg-[var(--tree-bullet)] group-hover:bg-[var(--tree-accent)] transition-colors duration-300 shadow-[0_0_8px_var(--glow-color)]" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Database courses catalog list */}
      <section className="space-y-6 pt-6 border-t border-theme-divider">
        <div>
          <h2 className="font-serif text-2xl font-light text-theme-title">Full Stack Internship Tracks</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Access professional web development internships</p>
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

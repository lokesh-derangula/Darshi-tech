import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Gamepad, Sprout, HeartPulse, Trophy, Smartphone, BookOpen, Truck, Home, CreditCard, Sparkles } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card';

export default function WebAppDevelopment() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentStep, setPaymentStep] = useState('idle');
  const [paymentId, setPaymentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Gaming Apps',
      desc: 'Real-time Canvas action, browser game rooms, state management, and multiplayer synchronization engines.',
      tech: ['Socket.io', 'HTML5 Canvas', 'Redux Toolkit'],
      projects: ['RetroArcade Portal', 'ChessDuel Live'],
      icon: Gamepad,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300'
    },
    {
      title: 'Agriculture Apps',
      desc: 'Smart crop analytics databases, weather monitoring integrations, and regional marketplace logistics portals.',
      tech: ['React.js', 'OpenWeather API', 'PostgreSQL'],
      projects: ['SproutTrace Map', 'AgriBid Hub'],
      icon: Sprout,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300'
    },
    {
      title: 'Medical Apps',
      desc: 'HIPAA-compliant scheduler trackers, patient file logs, doctor consult grids, and e-prescription handlers.',
      tech: ['React.js', 'Node.js', 'JWT', 'Helmet Security'],
      projects: ['Clinica Care', 'PrescribeFast Core'],
      icon: HeartPulse,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300'
    },
    {
      title: 'Sports & Fitness',
      desc: 'Calorie analytics dashboards, workout trackers, live telemetry displays, and community achievements.',
      tech: ['React Native', 'SQLite', 'Tailwind CSS'],
      projects: ['FitPulse tracker', 'Apex Athlete portal'],
      icon: Trophy,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300'
    },
    {
      title: 'Android Apps',
      desc: 'Native build configurations, local storage controllers, hardware APIs integration (GPS, camera), and notifications.',
      tech: ['React Native', 'Android Studio', 'Expo Go'],
      projects: ['GeoNav Tracker', 'CamGuard App'],
      icon: Smartphone,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300'
    },
    {
      title: 'Education Portals',
      desc: 'Interactive video embeds, custom class schedules, quiz makers, progress trackers, and certificate download hubs.',
      tech: ['Next.js', 'Prisma ORM', 'PDFKit'],
      projects: ['Darshi Acad v1', 'CodeQuest Lab'],
      icon: BookOpen,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300'
    },
    {
      title: 'Transportation',
      desc: 'Fleet telemetry maps, real-time vehicle dispatchers, passenger route planners, and billing generators.',
      tech: ['React.js', 'Google Maps API', 'Express.js'],
      projects: ['TransitFlow Web', 'SwiftDispatch App'],
      icon: Truck,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300'
    },
    {
      title: 'Home Services',
      desc: 'Geolocalised provider search directories, booking schedules, status logs, and secure payment integrations.',
      tech: ['React.js', 'Razorpay', 'MongoDB'],
      projects: ['HelperPool Direct', 'FixIt Hub'],
      icon: Home,
      color: 'text-[var(--text-serif)] border-[var(--glass-border)] bg-[var(--pill-bg)] transition-colors duration-300'
    }
  ];

  useEffect(() => {
    api.getCourses('Web Development')
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
        <h1 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Web App Development Ecosystem</h1>
        <p className="text-theme-muted text-base uppercase tracking-wider">Mobile Android applications, modular portals, and dispatcher dashboards</p>
      </div>

      {/* App Categories Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <CardContainer key={i} containerClassName="py-0 flex justify-stretch items-stretch w-full" className="w-full h-full">
              <CardBody className="glass-panel p-5 flex flex-col justify-between h-full w-full">
                <div>
                  <CardItem translateZ="50" className={`inline-flex p-2.5 border mb-4 rounded-xl ${card.color}`}>
                    <Icon className="h-4 w-4" />
                  </CardItem>
                  <CardItem translateZ="60" className="font-serif text-lg font-bold text-theme-card-title mb-2">
                    {card.title}
                  </CardItem>
                  <CardItem translateZ="40" as="p" className="text-theme-desc text-base leading-relaxed mb-4">
                    {card.desc}
                  </CardItem>
                </div>

                <CardItem translateZ="50" className="space-y-3 pt-3 border-t border-theme-divider w-full">
                  <div>
                    <span className="text-base text-theme-muted font-bold uppercase tracking-wider block mb-1">Stack</span>
                    <div className="flex flex-wrap gap-1">
                      {card.tech.map((t, idx) => (
                        <span key={idx} className="text-base font-semibold badge-theme px-2.5 py-0.5 rounded-full border transition-all duration-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-base text-theme-muted font-bold uppercase tracking-wider block mb-1">Projects</span>
                    <div className="flex flex-wrap gap-1">
                      {card.projects.map((p, idx) => (
                        <span key={idx} className="text-base font-semibold badge-theme-sec px-2.5 py-0.5 rounded-full border transition-all duration-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          );
        })}
      </section>

      {/* Database Courses list */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-light text-theme-title">Join Web App Development Internships</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Access professional training tracks with active schedules</p>
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
              <CardContainer key={course.id} containerClassName="py-0 flex justify-stretch items-stretch w-full" className="w-full h-full">
                <CardBody className="glass-panel p-6 flex flex-col justify-between h-full w-full">
                  <div className="space-y-3">
                    <CardItem translateZ="50" className="w-full">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl border border-theme-border mb-2" />
                    </CardItem>
                    <CardItem translateZ="60" className="font-serif text-lg font-bold text-theme-card-title">
                      {course.title}
                    </CardItem>
                    <CardItem translateZ="40" as="p" className="text-theme-desc text-base leading-relaxed line-clamp-3">
                      {course.description}
                    </CardItem>
                  </div>
                  <CardItem translateZ="50" className="mt-6 flex items-center justify-between border-t border-theme-divider pt-4 w-full">
                    <div>
                      <p className="text-theme-muted text-base font-bold uppercase tracking-wider">Duration: {course.duration}</p>
                      <p className="text-theme-card-title font-serif text-xl font-light mt-1">₹{course.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => handleEnrollClick(course)} className="btn-gold px-4 py-2">
                      Enroll Now
                    </button>
                  </CardItem>
                </CardBody>
              </CardContainer>
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

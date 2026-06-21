import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Award, Code, CheckCircle, Users, MapPin, ArrowRight, Quote } from 'lucide-react';
import { Globe3D } from '../components/ui/3d-globe';

const sampleMarkers = [
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    src: "https://assets.aceternity.com/avatars/3.webp",
    label: "Tokyo",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Sydney",
  },
  {
    lat: 48.8566,
    lng: 2.3522,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Paris",
  },
  {
    lat: 28.6139,
    lng: 77.209,
    src: "https://assets.aceternity.com/avatars/6.webp",
    label: "New Delhi",
  },
  {
    lat: 55.7558,
    lng: 37.6173,
    src: "https://assets.aceternity.com/avatars/7.webp",
    label: "Moscow",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Rio de Janeiro",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Shanghai",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dubai",
  },
  {
    lat: -34.6037,
    lng: -58.3816,
    src: "https://assets.aceternity.com/avatars/11.webp",
    label: "Buenos Aires",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
  {
    lat: 37.5665,
    lng: 126.978,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Seoul",
  },
];

function CountUp({ value }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const num = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = value.replace(/[0-9]/g, '');

    if (num === 0) {
      setCount(value);
      return;
    }

    let start = 0;
    const duration = 1200; // ms
    const stepTime = Math.max(Math.floor(duration / num), 15);
    const stepValue = Math.max(Math.ceil(num / (duration / stepTime)), 1);

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= num) {
        clearInterval(timer);
        setCount(value);
      } else {
        setCount(`${start}${suffix}`);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return <span ref={ref}>{count}</span>;
}

export default function Home() {
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);

  const stats = [
    { label: 'STUDENTS TRAINED', value: '500+', icon: Users },
    { label: 'PROJECTS DELIVERED', value: '50+', icon: Code },
    { label: 'EXPERT TRAINERS', value: '20+', icon: Award },
  ];

  const showcaseCategories = [
    { title: 'Research Projects and Internships for all graduates and students', path: '/research-projects', desc: '', color: 'border-theme-border text-theme-title hover:bg-[var(--text-serif)]/5 bg-theme-card/55' },
    { title: 'Full Stack Projects and Internships for all graduates and students', path: '/full-stack-projects', desc: '', color: 'border-theme-border text-theme-title hover:bg-[var(--text-serif)]/5 bg-theme-card/55' },
    { title: 'Product Development', path: '/product-development', desc: '', color: 'border-theme-border text-theme-title hover:bg-[var(--text-serif)]/5 bg-theme-card/55' },
  ];

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="space-y-16 py-4 animate-fade-in">
      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden border border-theme-border bg-theme-card p-5 sm:p-8 md:p-16 text-center md:text-left rounded-2xl shadow-sm z-10 transition-colors duration-300"
      >
        {/* Animated local blobs for depth */}
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[var(--text-serif)]/5 blur-3xl pointer-events-none animate-float-slow -translate-y-1/2 transition-colors duration-300"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--text-serif)_1px,transparent_1px),linear-gradient(to_bottom,var(--text-serif)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none"></div>

        <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 bg-[var(--text-serif)]/10 px-3.5 py-1 text-base font-bold uppercase tracking-widest text-theme-title border border-[var(--text-serif)]/20 rounded-full transition-colors duration-300"
            >
              🔒 Secure & Institutional Training
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-theme-card-title leading-tight"
            >
              Invest In Your <br />
              <span className="italic font-normal text-theme-title">Technical Prowess</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-theme-desc text-base leading-relaxed max-w-lg"
            >
              Equipping freshers, students, and engineers with high-security, industry-grade internships, research projects, live mentorship, and verified credentials.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2"
            >
              <Link to="/research-projects" className="btn-gold">
                Explore Catalog
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/contact-us" className="btn-outline-gold">
                Contact Admissions
              </Link>
            </motion.div>
          </div>

          <motion.div variants={imageVariants} className="relative flex items-center justify-center">
            <div className="absolute -inset-1 bg-[var(--text-serif)]/5 blur-xl rounded-2xl transition-colors duration-300"></div>
            <div className="relative w-full h-[240px] sm:h-[300px] md:h-[380px] flex items-center justify-center overflow-hidden">
              <Globe3D
                markers={sampleMarkers}
                config={{
                  atmosphereColor: "#4da6ff",
                  atmosphereIntensity: 20,
                  bumpScale: 5,
                  autoRotateSpeed: 0.3,
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-3 border border-theme-border bg-theme-card divide-y md:divide-y-0 md:divide-x divide-theme-divider rounded-2xl shadow-sm overflow-hidden z-10 relative transition-colors duration-300"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-8 flex items-center gap-6 justify-center md:justify-start hover:bg-[var(--sidebar-hover-bg)]/40 transition-colors duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--text-serif)]/20 bg-[var(--text-serif)]/5 text-[var(--text-serif)] transition-colors duration-300">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-3xl font-light tracking-tight text-theme-card-title">
                  <CountUp value={stat.value} />
                </p>
                <p className="text-theme-muted text-base font-bold tracking-wider mt-0.5 uppercase">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </motion.section>

      {/* Introduction, Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-8 items-stretch relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass-panel p-8 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-light text-theme-title">Institutional Mandate</h2>
            <p className="text-theme-desc leading-relaxed text-base">
              Darshi Tech is a premier developer ecosystem and training institute focused on bridging the gaps between standard college curriculum and high-performance industry expectations.
              We offer structured projects, research labs, and live bootcamps with professional certificates validated on digital registries.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            {showcaseCategories.map((cat, i) => (
              <Link
                key={i}
                to={cat.path}
                className={`flex-grow rounded-xl border p-4 transition-all duration-200 ${cat.color} hover:border-[var(--text-serif)] shadow-sm`}
              >
                <h3 className="font-serif text-md font-semibold tracking-wide text-theme-title flex items-center justify-between">
                  {cat.title}
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--text-serif)]/60" />
                </h3>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6 flex flex-col justify-between"
        >
          <div className="glass-panel p-8 flex-grow flex flex-col justify-center">
            <h3 className="text-base font-bold text-theme-title uppercase tracking-wider flex items-center gap-2 mb-3">
              🎯 Our Mission
            </h3>
            <p className="text-theme-desc text-base leading-relaxed">
              To democratize access to advanced computer science research, full-stack architectures, and product development skillsets. We strive to mold industry-ready developers who write clean, performant, and secure code.
            </p>
          </div>
          <div className="glass-panel p-8 flex-grow flex flex-col justify-center">
            <h3 className="text-base font-bold text-theme-title uppercase tracking-wider flex items-center gap-2 mb-3">
              👁 Our Vision
            </h3>
            <p className="text-theme-desc text-base leading-relaxed">
              To establish an elite digital academy where students code on production scale systems, collaborate on custom ERP/software products, and leave with verifiable proof-of-work.
            </p>
          </div>
        </motion.div>
      </section>



      {/* Workspace Gallery */}
      <section className="space-y-6 pt-6 relative z-10">
        <div className="text-center md:text-left space-y-2">
          <h2 className="font-serif text-3xl font-light text-theme-title">Workspace Gallery</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">A glimpse inside our corporate training labs and innovation environment</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { src: '/images/entrance.png', title: 'Corporate Entrance', desc: 'Secure institutional access and corporate branding' },
            { src: '/images/office_training.png', title: 'High-Tech Classroom', desc: 'Structured systems for live classes and training' },
            { src: '/images/office_desks.png', title: 'Developer Laboratories', desc: 'Collaborative development desks and sandbox networks' },
            { src: '/images/students_group_1.png', title: 'Interactive Development Cohort', desc: 'Students collaborating on milestone projects inside our training labs' },
            { src: '/images/students_group_2.png', title: 'Developer Milestone Celebrations', desc: 'Interns celebrating successful production releases and program completions' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setSelectedGalleryImg(item)}
              className="glass-panel p-3 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[3/2] border border-theme-border">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="badge-theme border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-theme-title">View Photo</span>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="font-serif text-md font-semibold text-theme-card-title">{item.title}</h3>
                <p className="text-theme-desc text-base leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedGalleryImg && (
          <div
            onClick={() => setSelectedGalleryImg(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-theme-border bg-theme-card p-2 shadow-2xl">
              <img src={selectedGalleryImg.src} alt={selectedGalleryImg.title} className="max-w-full max-h-[75vh] object-contain rounded-xl" />
              <div className="p-4 text-center space-y-1 bg-theme-card">
                <h3 className="font-serif text-lg font-bold text-theme-title">{selectedGalleryImg.title}</h3>
                <p className="text-theme-desc text-base">{selectedGalleryImg.desc}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Contact & Map */}
      <section className="grid md:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="font-serif text-3xl font-light text-theme-title">Campus Footprint</h2>
          <p className="text-theme-desc text-base leading-relaxed">
            Headquartered in technology-driven hubs, our training labs are open for in-person workshops and advanced conferences. Scan our details or reach out via the Contact Us portal to schedule a laboratory visit.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-theme-body text-base">
              <MapPin className="h-4.5 w-4.5 text-[var(--text-serif)] shrink-0 transition-colors duration-300" />
              <span>Darshi Software Solutions, Kurnool, Andhra Pradesh, India </span>
            </div>
            <div className="flex items-center gap-3 text-theme-body text-base">
              <CheckCircle className="h-4.5 w-4.5 text-[var(--text-serif)] shrink-0 transition-colors duration-300" />
              <span>Interactive classrooms, computer science laboratories, and high-speed Wi-Fi</span>
            </div>
          </div>
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 text-[var(--text-serif)] hover:text-[var(--btn-hover)] font-bold text-base uppercase tracking-wider group transition-colors duration-300"
          >
            Get Directions & Social Handles
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Highlighted Director Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-3 h-[260px] sm:h-[320px] relative overflow-hidden group border border-theme-border"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden border border-theme-border shadow-inner">
            <img src="/images/director.jpg" alt="Director, Darshi Software Solutions" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end text-left z-10">
              <span className="badge-theme border border-gold px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-theme-title w-fit mb-1 bg-black/30">Visionary Director</span>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">Visionary Leadership</h3>
              <p className="text-gray-300 text-xs mt-0.5 leading-relaxed">Driving innovation, industry competence, and excellence in training.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

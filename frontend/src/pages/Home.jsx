import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Award, Code, CheckCircle, Users, MapPin, ArrowRight, Quote } from 'lucide-react';
import { Globe3D } from '../components/ui/3d-globe';
import { AnimatedTestimonials } from '../components/ui/animated-testimonials';

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
  const stats = [
    { label: 'STUDENTS TRAINED', value: '500+', icon: Users },
    { label: 'PROJECTS DELIVERED', value: '50+', icon: Code },
    { label: 'EXPERT TRAINERS', value: '20+', icon: Award },
  ];

  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'NLP Research Intern',
      review: 'Darshi Tech provided exceptional research mentorship. Building LLM-based solutions was incredibly rewarding and helped me secure my masters position.',
      src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop'
    },
    {
      name: 'Priya Patel',
      role: 'Full Stack Developer',
      review: 'The structured curricula and hand-on projects were amazing. I gained experience in React, Node.js, and DB design that standard courses lack.',
      src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop'
    },
    {
      name: 'Abhishek Kumar',
      role: 'Android Dev Graduate',
      review: 'Loved the live doubt sessions and the final certification. The QR code verification let me showcase my work to recruiters with ease.',
      src: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=250&auto=format&fit=crop'
    },
  ];

  const showcaseCategories = [
    { title: 'Research Internships', path: '/research-projects', desc: 'NLP, Large Language Models, AI, and Quantum Computing.', color: 'border-theme-border text-theme-title hover:bg-[var(--text-serif)]/5 bg-theme-card/55' },
    { title: 'Full Stack Projects', path: '/full-stack-projects', desc: 'React, Node.js, Django, databases, and enterprise structures.', color: 'border-theme-border text-theme-title hover:bg-[var(--text-serif)]/5 bg-theme-card/55' },
    { title: 'Product Development', path: '/product-development', desc: 'Custom enterprise software, ERP applications, and AI products.', color: 'border-theme-border text-theme-title hover:bg-[var(--text-serif)]/5 bg-theme-card/55' },
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
        className="relative overflow-hidden border border-theme-border bg-theme-card p-8 md:p-16 text-center md:text-left rounded-2xl shadow-sm z-10 transition-colors duration-300"
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
              className="font-serif text-5xl md:text-6xl font-light tracking-tight text-theme-card-title leading-tight"
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
            <div className="relative w-full h-[380px] flex items-center justify-center overflow-hidden">
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
                <p className="text-theme-muted text-base mt-1">{cat.desc}</p>
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

      {/* Testimonials */}
      <section className="bg-theme-card border border-theme-border text-theme-body p-8 md:p-12 rounded-2xl shadow-md space-y-8 relative overflow-hidden z-10 transition-colors duration-300">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="relative z-10 text-center space-y-2">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Investor & Graduate Reviews</h2>
          <p className="text-theme-muted text-base uppercase tracking-wider">Verified testimonials from our active community</p>
        </div>

        <div className="relative z-10">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
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

        {/* Mock Map View */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-3 h-[280px] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-black/45 z-10 flex items-center justify-center flex-col p-4 text-center">
            <span className="bg-theme-card border border-[var(--text-serif)]/30 text-theme-card-title rounded-full px-4 py-2 flex items-center gap-2 text-base font-bold uppercase tracking-wider shadow-md transition-colors duration-300">
              <MapPin className="h-4 w-4 animate-bounce text-[var(--text-serif)]" />
              DARSHI TECH CAMPUS
            </span>
          </div>
          <div className="w-full h-full rounded-xl relative border border-theme-border transition-colors duration-300" style={{ backgroundColor: 'var(--scrollbar-track)' }}>
            <div className="absolute top-1/4 left-1/3 w-32 h-[1px] bg-theme-border transform rotate-12 transition-colors duration-300"></div>
            <div className="absolute top-1/2 left-1/4 w-40 h-[1px] bg-theme-border transform -rotate-12 transition-colors duration-300"></div>
            <div className="absolute top-2/3 left-1/2 w-24 h-[1px] bg-theme-border transform rotate-45 transition-colors duration-300"></div>
            <div className="absolute top-1/3 left-2/3 w-[1px] bg-theme-border h-28 transition-colors duration-300"></div>
            <div className="absolute w-6 h-6 rounded-full bg-[var(--text-serif)]/15 animate-ping top-1/2 left-1/2 -mt-3 -ml-3 transition-colors duration-300"></div>
            <div className="absolute w-3 h-3 rounded-full bg-[var(--text-serif)] top-1/2 left-1/2 -mt-1.5 -ml-1.5 shadow-lg transition-colors duration-300"></div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

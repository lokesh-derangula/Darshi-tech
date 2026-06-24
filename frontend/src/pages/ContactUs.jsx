import React, { useState } from 'react';
import { Send, Phone, Mail, MessageSquare, SendToBack, Facebook, MapPin, ExternalLink } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSuccess(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSuccess(false);
    }, 4000);
  };

  const contacts = [
    { label: 'WhatsApp', detail: '+91 91212 37729', href: 'https://wa.me/919121237729?text=Hi%20Darshi%20Tech%20Admissions', icon: MessageSquare, color: 'text-theme-title bg-theme-card border-theme-border' },
    { label: 'Phone Line 1', detail: '9121237729', href: 'tel:+919121237729', icon: Phone, color: 'text-theme-title bg-theme-card border-theme-border' },
    { label: 'Phone Line 2', detail: '8179075149', href: 'tel:+918179075149', icon: Phone, color: 'text-theme-title bg-theme-card border-theme-border' },
    { label: 'Email Support', detail: 'admissions@darshitech.com', href: 'mailto:admissions@darshitech.com', icon: Mail, color: 'text-theme-title bg-theme-card border-theme-border' },
    { label: 'Facebook Page', detail: '/darshitech.edu', href: 'https://facebook.com/darshitech', icon: Facebook, color: 'text-theme-title bg-theme-card border-theme-border' }
  ];

  return (
    <div className="space-y-12 py-4">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Contact Our Admissions Team</h1>
        <p className="text-theme-muted text-base uppercase tracking-wider">Inquiries regarding research, placements, schedules, and billing</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Contact Links & Map */}
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {contacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col justify-between rounded-2xl border p-4 shadow-sm hover:scale-[1.01] hover:border-theme-title/30 transition-all duration-200 ${c.color}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Icon className="h-4 w-4 text-theme-title" />
                    <ExternalLink className="h-3 w-3 opacity-40 text-theme-muted" />
                  </div>
                  <div>
                    <span className="text-base text-theme-muted font-bold uppercase tracking-wider block">{c.label}</span>
                    <span className="text-theme-card-title font-semibold text-base mt-0.5 break-all">{c.detail}</span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Location details + Embedded Map */}
          <div className="glass-panel overflow-hidden">
            {/* Map iframe */}
            <div className="w-full h-[220px] relative">
              <iframe
                src="https://maps.google.com/maps?q=15.8032435,78.0644253&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                className="map-iframe"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Darshi Software Solutions Private Limited Location"
              />
            </div>
            {/* Address block below map */}
            <div className="p-5 space-y-3">
              <h3 className="font-serif text-lg font-bold text-theme-card-title flex items-center gap-2">
                <MapPin className="h-4 w-4 text-theme-title" />
                Registered Office
              </h3>
              <p className="text-theme-desc text-base leading-relaxed">
                # 87/1368-HIG-II-40, Road No 1, AP Housing Board Colony,<br />
                Joharapuram, Kurnool, Andhra Pradesh, India — Pin 518002
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="tel:+919121237729"
                  className="inline-flex items-center gap-1.5 text-base font-bold text-theme-title hover:text-theme-title/80 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  9121237729
                </a>
                <span className="text-theme-muted">·</span>
                <a
                  href="tel:+918179075149"
                  className="inline-flex items-center gap-1.5 text-base font-bold text-theme-title hover:text-theme-title/80 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  8179075149
                </a>
              </div>
              <a
                href="https://www.google.com/maps/place/15%C2%B048'11.7%22N+78%C2%B003'51.9%22E/@15.8032435,78.0618504,798m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d15.8032435!4d78.0644253?hl=en&entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-base font-bold text-theme-title hover:text-theme-title/80 uppercase tracking-wider transition-colors"
              >
                Open in Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Messaging Form */}
        <div className="glass-panel p-6">
          <h2 className="font-serif text-xl font-bold text-theme-card-title mb-6">Send Us A Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-base">
            <div>
              <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1.5">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors placeholder-theme-muted/60"
                placeholder="Admissions query, billing assistance etc."
              />
            </div>

            <div>
              <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1.5">Message Body *</label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-theme-body focus:outline-none focus:border-theme-title transition-colors resize-none placeholder-theme-muted/60"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            {success && (
              <p className="text-base font-bold text-theme-title bg-theme-title/10 border border-theme-title/20 p-3 rounded-xl">
                ✔ Message sent successfully! Our counselors will email you shortly.
              </p>
            )}

            <button type="submit" className="w-full btn-gold py-3.5">
              <Send className="h-3.5 w-3.5" />
              Submit Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

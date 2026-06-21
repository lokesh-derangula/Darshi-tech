import React from 'react';

export default function WorkshopsConferences() {
  return (
    <div className="space-y-12 py-4">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-theme-title">Workshops & Conferences</h1>
        <p className="text-theme-muted text-base uppercase tracking-wider">Attend our live panels and hackathons</p>
      </div>

      <div className="glass-panel p-8 text-center py-20">
        <p className="text-theme-muted text-lg font-medium">No workshops or conferences are currently scheduled.</p>
        <p className="text-theme-desc text-base mt-2">Please check back later for updates on upcoming events and panels.</p>
      </div>
    </div>
  );
}

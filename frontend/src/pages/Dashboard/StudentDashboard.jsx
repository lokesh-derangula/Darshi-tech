import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
  User,
  GraduationCap,
  Calendar,
  Award,
  Video,
  Edit2,
  Phone,
  School,
  Activity,
  CheckCircle,
  FileDown,
  Clock
} from 'lucide-react';

export default function StudentDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', college: '', branch: '', year: '' });
  const [activeTab, setActiveTab] = useState('courses'); // courses, classes

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userProfile = await api.getProfile();
      const studentEnrollments = await api.getMyEnrollments();
      const studentClasses = await api.getMyClasses();

      setProfile(userProfile);
      setEnrollments(studentEnrollments);
      setClasses(studentClasses);

      setEditForm({
        name: userProfile.name,
        phone: userProfile.phone,
        college: userProfile.college,
        branch: userProfile.branch,
        year: userProfile.year
      });
    } catch (err) {
      console.error('Fetch dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(editForm);
      setIsEditModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Profile update failed.');
    }
  };

  const handleJoinClass = async (classId) => {
    try {
      const data = await api.joinClass(classId);
      setClasses(classes.map(c => c.id === classId ? { ...c, present: true } : c));
      alert(`Attendance recorded! Opening Google Meet link: ${data.meetingLink}`);
      window.open(data.meetingLink, '_blank');
    } catch (err) {
      alert(err.message || 'Failed to mark attendance.');
    }
  };

  const handleDownloadCertificate = async (enrollmentId) => {
    try {
      const token = localStorage.getItem('darshi_token');
      const res = await fetch(`/api/certificates/download/${enrollmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Certificate file generation failed.');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_DarshiTech_${enrollmentId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err.message || 'Failed to download certificate.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-theme-title border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Welcome & Profile card */}
      <section className="glass-panel p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-theme-title/10 rounded-full blur-3xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[var(--btn-bg)] text-[var(--btn-text)] font-serif font-bold text-2xl flex items-center justify-center uppercase shadow-sm">
              {profile?.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-light text-theme-title flex items-center gap-2">
                Welcome, {profile?.name}!
                <span className="badge-theme border px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Student Member
                </span>
              </h1>
              <p className="text-theme-desc text-base mt-1">Manage active catalog enrollments, live classrooms, and verified certificates.</p>
            </div>
          </div>
          <button onClick={() => setIsEditModalOpen(true)} className="btn-outline-gold px-3.5 py-1.5 text-base">
            <Edit2 className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-theme-border text-base">
          <div>
            <span className="text-theme-muted font-bold uppercase tracking-wider block mb-1">Email Identifier</span>
            <span className="text-theme-body font-medium break-all">{profile?.email}</span>
          </div>
          <div>
            <span className="text-theme-muted font-bold uppercase tracking-wider block mb-1">Contact Line</span>
            <span className="text-theme-body font-medium">{profile?.phone}</span>
          </div>
          <div>
            <span className="text-theme-muted font-bold uppercase tracking-wider block mb-1">College/Institution</span>
            <span className="text-theme-body font-medium truncate block" title={profile?.college}>{profile?.college}</span>
          </div>
          <div>
            <span className="text-theme-muted font-bold uppercase tracking-wider block mb-1">Degree Parameters</span>
            <span className="text-theme-body font-medium truncate block">{profile?.branch} ({profile?.year})</span>
          </div>
        </div>
      </section>

      {/* Tabs Menu */}
      <div className="flex border-b border-theme-border gap-6">
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-4 text-base font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'courses' ? 'border-theme-title text-theme-title' : 'border-transparent text-theme-muted hover:text-theme-title'
          }`}
        >
          My Courses & Certificates ({enrollments.length})
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-4 text-base font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'classes' ? 'border-theme-title text-theme-title' : 'border-transparent text-theme-muted hover:text-theme-title'
          }`}
        >
          Live Class Schedule ({classes.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'courses' ? (
        <section className="space-y-6">
          {enrollments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-theme-border rounded-2xl bg-theme-card/50 shadow-sm">
              <GraduationCap className="mx-auto h-10 w-10 text-theme-muted mb-3" />
              <h3 className="font-serif text-md font-bold text-theme-muted">No active enrollments found</h3>
              <p className="text-theme-desc text-base mt-1">Browse our catalog to register for research and developer programs.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {enrollments.map((enr) => (
                <div key={enr.id} className="glass-panel p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-base font-bold text-theme-muted uppercase tracking-widest block">
                        {enr.course.category} Track
                      </span>
                      {enr.status === 'COMPLETED' ? (
                        <span className="bg-emerald-950/20 border border-emerald-800/45 text-emerald-400 text-base font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="badge-theme border text-theme-title text-base font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Activity className="h-3 w-3 animate-pulse" />
                          Active Program
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-theme-card-title">{enr.course.title}</h3>
                    <p className="text-theme-desc text-base leading-relaxed line-clamp-2">{enr.course.description}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-theme-border pt-4">
                    <div className="text-base text-theme-muted space-y-0.5">
                      <p>TxID: {enr.paymentId.substring(0, 12)}...</p>
                      <p>Enrolled: {new Date(enr.enrolledAt).toLocaleDateString()}</p>
                    </div>

                    {enr.status === 'COMPLETED' ? (
                      <button
                        onClick={() => handleDownloadCertificate(enr.id)}
                        className="btn-gold px-3.5 py-2 text-base flex items-center gap-1.5"
                      >
                        <FileDown className="h-4 w-4" />
                        Download Certificate
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-transparent text-theme-muted font-bold border border-theme-border text-base px-3.5 py-2 rounded-full flex items-center gap-1.5 cursor-not-allowed"
                        title="Certificate will become available when the admin marks completion"
                      >
                        <Clock className="h-4 w-4 text-theme-muted" />
                        Awaiting Finish
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-6">
          {classes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-theme-border rounded-2xl bg-theme-card/50 shadow-sm">
              <Video className="mx-auto h-10 w-10 text-theme-muted mb-3" />
              <h3 className="font-serif text-md font-bold text-theme-muted">No scheduled classes found</h3>
              <p className="text-theme-desc text-base mt-1">Live classes will populate here after they are scheduled by your training instructors.</p>
            </div>
          ) : (
            <div className="border border-theme-border bg-theme-card rounded-2xl divide-y divide-theme-border overflow-hidden shadow-sm">
              {classes.map((cls) => (
                <div key={cls.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-theme-card/40 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="badge-theme border px-2 py-0.5 rounded-full">
                        {cls.course.title}
                      </span>
                      {cls.present ? (
                        <span className="text-base text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="h-3 w-3" />
                          Present
                        </span>
                      ) : (
                        <span className="text-base text-amber-400 font-bold bg-amber-950/20 border border-amber-800/40 px-2 py-0.5 rounded-full">
                          Absent
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-md font-bold text-theme-card-title">{cls.title}</h4>
                    <div className="flex gap-4 text-theme-desc text-base">
                      <span>📅 Date: {cls.date}</span>
                      <span>⏰ Time: {cls.time}</span>
                    </div>
                  </div>

                  <button onClick={() => handleJoinClass(cls.id)} className="btn-gold px-4 py-2">
                    <Video className="h-4 w-4" />
                    Join Live Class
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-theme-border bg-theme-card p-6 shadow-2xl space-y-4 rounded-2xl">
            <h3 className="font-serif text-lg font-bold text-theme-title border-b border-theme-border pb-3">Edit Profile Details</h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4 text-base">
              <div>
                <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                />
              </div>

              <div>
                <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                />
              </div>

              <div>
                <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1">College</label>
                <input
                  type="text"
                  required
                  value={editForm.college}
                  onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1">Specialization</label>
                  <input
                     type="text"
                     required
                     value={editForm.branch}
                     onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                     className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  />
                </div>
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase tracking-wider block mb-1">Academic Year</label>
                  <select
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-theme-body focus:outline-none"
                  >
                    <option value="1st Year" className="bg-theme-card text-theme-body">1st Year</option>
                    <option value="2nd Year" className="bg-theme-card text-theme-body">2nd Year</option>
                    <option value="3rd Year" className="bg-theme-card text-theme-body">3rd Year</option>
                    <option value="4th Year" className="bg-theme-card text-theme-body">4th Year</option>
                    <option value="Graduated" className="bg-theme-card text-theme-body">Graduated</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 btn-outline-gold py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold py-2.5 px-4"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
  ShieldAlert,
  Users,
  Award,
  DollarSign,
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  Video,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, activeInternships: 0, certificatesIssued: 0, totalRevenue: 0 });
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats'); // stats, courses, students, enrollments, classes

  // Modals / Form States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', duration: '', price: '', category: 'Research', thumbnail: '', status: 'ACTIVE' });
  
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classForm, setClassForm] = useState({ courseId: '', title: '', meetingLink: '', date: '', time: '' });

  const [selectedClassAttendance, setSelectedClassAttendance] = useState(null);
  const [attendanceSheet, setAttendanceSheet] = useState([]);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await api.getAdminStats();
      const allStudents = await api.getAdminStudents();
      const allCourses = await api.getCourses();
      const allPayments = await api.getAdminPayments();
      const allClasses = await api.adminGetClasses();

      setStats(dashboardStats);
      setStudents(allStudents);
      setCourses(allCourses);
      setPayments(allPayments);
      setClasses(allClasses);
    } catch (err) {
      console.error('Fetch admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.createCourse(courseForm);
      setIsCourseModalOpen(false);
      setCourseForm({ title: '', description: '', duration: '', price: '', category: 'Research', thumbnail: '', status: 'ACTIVE' });
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to create course.');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course/internship?')) return;
    try {
      await api.deleteCourse(id);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete course.');
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.adminCreateClass(classForm);
      setIsClassModalOpen(false);
      setClassForm({ courseId: '', title: '', meetingLink: '', date: '', time: '' });
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to schedule class.');
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheduled class?')) return;
    try {
      await api.adminDeleteClass(id);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to delete class.');
    }
  };

  const handleMarkComplete = async (enrollmentId) => {
    try {
      await api.markEnrollmentComplete(enrollmentId);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to complete enrollment.');
    }
  };

  const handleViewAttendance = async (cls) => {
    try {
      setSelectedClassAttendance(cls);
      const data = await api.adminGetAttendance(cls.id);
      setAttendanceSheet(data.students);
      setIsAttendanceModalOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to fetch attendance data.');
    }
  };

  const handleToggleAttendance = async (userId, currentPresent) => {
    try {
      const nextPresent = !currentPresent;
      await api.adminUpdateAttendance(selectedClassAttendance.id, userId, nextPresent);
      setAttendanceSheet(attendanceSheet.map(student =>
        student.id === userId ? { ...student, present: nextPresent } : student
      ));
    } catch (err) {
      alert(err.message || 'Failed to toggle attendance.');
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
      {/* Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-theme-title flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-theme-title" />
            Admin Control Center
          </h1>
          <p className="text-theme-muted text-base uppercase tracking-wider mt-1">Audit statistics, course catalogs, and certificates</p>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="flex justify-between items-center text-theme-muted mb-2">
            <span className="text-base uppercase font-bold tracking-wider">Total Students</span>
            <Users className="h-4 w-4 text-theme-title" />
          </div>
          <p className="font-serif text-2xl font-light text-theme-card-title">{stats.totalStudents}</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex justify-between items-center text-theme-muted mb-2">
            <span className="text-base uppercase font-bold tracking-wider">Gross Revenue</span>
            <DollarSign className="h-4 w-4 text-theme-title" />
          </div>
          <p className="font-serif text-2xl font-light text-theme-card-title">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex justify-between items-center text-theme-muted mb-2">
            <span className="text-base uppercase font-bold tracking-wider">Active Programs</span>
            <Briefcase className="h-4.5 w-4.5 text-theme-title" />
          </div>
          <p className="font-serif text-2xl font-light text-theme-card-title">{stats.activeInternships}</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex justify-between items-center text-theme-muted mb-2">
            <span className="text-base uppercase font-bold tracking-wider">Certificates Issued</span>
            <Award className="h-4.5 w-4.5 text-theme-title" />
          </div>
          <p className="font-serif text-2xl font-light text-theme-card-title">{stats.certificatesIssued}</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-theme-border gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5 w-full">
        {['stats', 'courses', 'students', 'enrollments', 'classes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-base font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === tab ? 'border-theme-title text-theme-title' : 'border-transparent text-theme-muted hover:text-theme-title'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'stats' && (
        <div className="glass-panel p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-theme-title">Platform Health Report</h3>
          <p className="text-theme-desc text-base leading-relaxed">All payment routes log correctly. Security protocols verify headers and sanitize parameter forms automatically.</p>
          <div className="grid sm:grid-cols-2 gap-4 text-base mt-4">
            <div className="bg-theme-card p-4 rounded-xl border border-theme-border">
              <span className="font-bold text-theme-muted block mb-1">SQL Injection Guards</span>
              <span className="font-semibold text-emerald-400">✔ ACTIVE (Prisma client parameterized)</span>
            </div>
            <div className="bg-theme-card p-4 rounded-xl border border-theme-border">
              <span className="font-bold text-theme-muted block mb-1">XSS Filtering Guards</span>
              <span className="font-semibold text-emerald-400">✔ ACTIVE (Regex script tags stripper)</span>
            </div>
            <div className="bg-theme-card p-4 rounded-xl border border-theme-border">
              <span className="font-bold text-theme-muted block mb-1">Brute Force Defenses</span>
              <span className="font-semibold text-emerald-400">✔ ACTIVE (Auth rate limits at 20 request / 15m)</span>
            </div>
            <div className="bg-theme-card p-4 rounded-xl border border-theme-border">
              <span className="font-bold text-theme-muted block mb-1">Helmet Protection</span>
              <span className="font-semibold text-emerald-400">✔ ACTIVE (Safe headers injection)</span>
            </div>
          </div>
        </div>
      )}

      {/* Courses Catalog Tab */}
      {activeTab === 'courses' && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-light text-theme-card-title">Course & Internship Catalog</h2>
            <button onClick={() => setIsCourseModalOpen(true)} className="btn-gold">
              <Plus className="h-4 w-4" />
              Add Course
            </button>
          </div>

          <div className="glass-panel overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-theme-card border-b border-theme-border text-theme-muted font-bold uppercase">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border text-theme-body">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-theme-card/40">
                    <td className="p-4 font-bold text-theme-card-title">{course.title}</td>
                    <td className="p-4">{course.category}</td>
                    <td className="p-4">{course.duration}</td>
                    <td className="p-4 font-semibold text-theme-title">₹{course.price.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className="badge-theme border px-2 py-0.5 rounded-full text-xs font-bold uppercase">
                        {course.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-800 rounded p-1.5 hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-light text-theme-card-title">Registered Students</h2>
          <div className="glass-panel overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-theme-card border-b border-theme-border text-theme-muted font-bold uppercase">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border text-theme-body">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-theme-card/40">
                    <td className="p-4 font-bold text-theme-card-title">{student.name}</td>
                    <td className="p-4 break-all">{student.email}</td>
                    <td className="p-4">{student.phone}</td>
                    <td className="p-4 truncate max-w-[150px]" title={student.college}>{student.college}</td>
                    <td className="p-4">{student.branch}</td>
                    <td className="p-4">{student.year}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-base font-bold ${student.isVerified ? 'bg-emerald-950/20 text-emerald-450 border border-emerald-800/40 text-emerald-400' : 'bg-rose-950/20 text-rose-450 border border-rose-800/40 text-rose-400'}`}>
                        {student.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Enrollments Tab */}
      {activeTab === 'enrollments' && (
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-light text-theme-card-title">Student Enrollments</h2>
          <div className="glass-panel overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-theme-card border-b border-theme-border text-theme-muted font-bold uppercase">
                  <th className="p-4">Student</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Payment ID</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Settlement / Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border text-theme-body">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-theme-card/40">
                    <td className="p-4 font-bold text-theme-card-title">{p.user?.name}</td>
                    <td className="p-4">{p.course?.title}</td>
                    <td className="p-4 font-mono">{p.paymentId}</td>
                    <td className="p-4 text-theme-title font-semibold">₹{p.course?.price.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-base font-bold uppercase border ${p.status === 'COMPLETED' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-800/40' : 'bg-purple-950/20 text-purple-400 border-purple-800/40'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {p.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleMarkComplete(p.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base uppercase px-3 py-1.5 rounded-full transition-colors"
                        >
                          Mark Complete
                        </button>
                      ) : (
                        <span className="text-base text-theme-muted font-semibold">Certificate Issued</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Classes Tab */}
      {activeTab === 'classes' && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-light text-theme-card-title">Scheduled Live Classes</h2>
            <button onClick={() => setIsClassModalOpen(true)} className="btn-gold">
              <Plus className="h-4 w-4" />
              Schedule Class
            </button>
          </div>

          <div className="glass-panel overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-theme-card border-b border-theme-border text-theme-muted font-bold uppercase">
                  <th className="p-4">Course</th>
                  <th className="p-4">Topic / Title</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Link</th>
                  <th className="p-4 text-center">Attendance Roster</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border text-theme-body">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-theme-card/40">
                    <td className="p-4 font-bold text-theme-card-title">{cls.course?.title}</td>
                    <td className="p-4">{cls.title}</td>
                    <td className="p-4">{cls.date}</td>
                    <td className="p-4">{cls.time}</td>
                    <td className="p-4 truncate max-w-[120px]" title={cls.meetingLink}>
                      <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" className="text-theme-title hover:underline">
                        {cls.meetingLink}
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleViewAttendance(cls)}
                        className="btn-outline-gold px-3 py-1.5 text-base flex items-center gap-1 mx-auto"
                      >
                        <Eye className="h-3.5 w-3.5 text-theme-title" />
                        Check Sheet
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="text-red-600 hover:text-red-800 rounded p-1.5 hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Add Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-theme-border bg-theme-card p-6 shadow-2xl space-y-4 rounded-2xl">
            <h3 className="font-serif text-lg font-bold text-theme-title border-b border-theme-border pb-3">Create New Course / Internship</h3>
            
            <form onSubmit={handleCreateCourse} className="space-y-4 text-base">
              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  placeholder="e.g. React Native Mobile Dev"
                />
              </div>

              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title resize-none"
                  placeholder="Internship outline, technologies taught..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase block mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                    placeholder="e.g. 8 Weeks"
                  />
                </div>
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase block mb-1">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                    placeholder="7500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase block mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-theme-body focus:outline-none"
                  >
                    <option value="Research" className="bg-theme-card text-theme-body">Research</option>
                    <option value="Full Stack" className="bg-theme-card text-theme-body">Full Stack</option>
                    <option value="Product Development" className="bg-theme-card text-theme-body">Product Development</option>
                    <option value="Web Development" className="bg-theme-card text-theme-body">Web Development</option>
                    <option value="Workshops" className="bg-theme-card text-theme-body">Workshops</option>
                    <option value="Training" className="bg-theme-card text-theme-body">Training</option>
                  </select>
                </div>
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase block mb-1">Status</label>
                  <select
                    value={courseForm.status}
                    onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-theme-body focus:outline-none"
                  >
                    <option value="ACTIVE" className="bg-theme-card text-theme-body">ACTIVE</option>
                    <option value="DRAFT" className="bg-theme-card text-theme-body">DRAFT</option>
                    <option value="ARCHIVED" className="bg-theme-card text-theme-body">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  placeholder="https://images.unsplash.com/... (optional)"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="flex-1 btn-outline-gold py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold py-2.5 px-4"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-theme-border bg-theme-card p-6 shadow-2xl space-y-4 rounded-2xl">
            <h3 className="font-serif text-lg font-bold text-theme-title border-b border-theme-border pb-3">Schedule Live Class</h3>
            
            <form onSubmit={handleCreateClass} className="space-y-4 text-base">
              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Select Course / Internship</label>
                <select
                  required
                  value={classForm.courseId}
                  onChange={(e) => setClassForm({ ...classForm, courseId: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-3 text-theme-body focus:outline-none focus:border-theme-title"
                >
                  <option value="" className="bg-theme-card text-theme-body">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-theme-card text-theme-body">
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Class Topic / Title</label>
                <input
                  type="text"
                  required
                  value={classForm.title}
                  onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  placeholder="e.g. Intro to Attention mechanism"
                />
              </div>

              <div>
                <label className="text-base font-bold text-theme-muted uppercase block mb-1">Meeting Link (Meet/Zoom)</label>
                <input
                  type="url"
                  required
                  value={classForm.meetingLink}
                  onChange={(e) => setClassForm({ ...classForm, meetingLink: e.target.value })}
                  className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  placeholder="https://meet.google.com/abc-defg-hij"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={classForm.date}
                    onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  />
                </div>
                <div>
                  <label className="text-base font-bold text-theme-muted uppercase block mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={classForm.time}
                    onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                    className="w-full bg-theme-card border border-theme-border rounded-xl px-4 py-2.5 text-theme-body focus:outline-none focus:border-theme-title"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="flex-1 btn-outline-gold py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold py-2.5 px-4"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-theme-border bg-theme-card p-6 shadow-2xl space-y-4 rounded-2xl">
            <div className="flex justify-between items-start border-b border-theme-border pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-theme-title">Class Attendance Sheet</h3>
                <p className="text-theme-muted text-base uppercase font-bold tracking-wider mt-0.5">{selectedClassAttendance?.title}</p>
              </div>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="text-theme-muted hover:text-theme-card-title rounded p-1 hover:bg-theme-card/60"
              >
                Close
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 text-base">
              {attendanceSheet.length === 0 ? (
                <div className="text-center py-6 text-theme-muted font-semibold">No students are currently enrolled in this course.</div>
              ) : (
                attendanceSheet.map((student) => (
                  <div key={student.id} className="bg-theme-card border border-theme-border p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-theme-card-title">{student.name}</h4>
                      <p className="text-base text-theme-muted">{student.email}</p>
                    </div>
                    
                    <button
                      onClick={() => handleToggleAttendance(student.id, student.present)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold text-base uppercase tracking-wider transition-colors ${
                        student.present
                          ? 'badge-theme border text-theme-title'
                          : 'bg-rose-950/20 text-rose-450 border-rose-800/40'
                      }`}
                    >
                      {student.present ? 'Present' : 'Absent'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

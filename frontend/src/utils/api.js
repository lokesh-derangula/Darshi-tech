const API_BASE = '/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('darshi_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    // Check if unauthorized, clean token if yes
    if (res.status === 401 || res.status === 403) {
      // Don't auto-clear on unverified status (which returns 403 but is handled by flow)
      if (data && !data.unverified) {
        localStorage.removeItem('darshi_token');
        localStorage.removeItem('darshi_user');
      }
    }
    const errorMsg = data?.message || 'Something went wrong';
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // AUTHENTICATION
  login: (email, password) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  register: (userData) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    }).then(handleResponse),

  verifyEmail: (email, code) =>
    fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, code }),
    }).then(handleResponse),

  forgotPassword: (email) =>
    fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    }).then(handleResponse),

  resetPassword: (email, code, newPassword) =>
    fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, code, newPassword }),
    }).then(handleResponse),

  getProfile: () =>
    fetch(`${API_BASE}/auth/profile`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  updateProfile: (profileData) =>
    fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    }).then(handleResponse),

  // COURSES
  getCourses: (category) => {
    const url = category ? `${API_BASE}/courses?category=${encodeURIComponent(category)}` : `${API_BASE}/courses`;
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse);
  },

  getCourseDetails: (id) =>
    fetch(`${API_BASE}/courses/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  createCourse: (courseData) =>
    fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(courseData),
    }).then(handleResponse),

  updateCourse: (id, courseData) =>
    fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(courseData),
    }).then(handleResponse),

  deleteCourse: (id) =>
    fetch(`${API_BASE}/courses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // ENROLLMENTS / PAYMENTS
  getMyEnrollments: () =>
    fetch(`${API_BASE}/enrollments/my-enrollments`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  createOrder: (courseId) =>
    fetch(`${API_BASE}/enrollments/create-order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ courseId }),
    }).then(handleResponse),

  verifyPayment: (paymentDetails) =>
    fetch(`${API_BASE}/enrollments/verify-payment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentDetails),
    }).then(handleResponse),

  markEnrollmentComplete: (enrollmentId) =>
    fetch(`${API_BASE}/certificates/complete/${enrollmentId}`, {
      method: 'POST',
      headers: getHeaders(),
    }).then(handleResponse),

  // CERTIFICATES VERIFICATION
  verifyCertificate: (certificateId) =>
    fetch(`${API_BASE}/certificates/verify/${certificateId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse),

  getDownloadUrl: (enrollmentId) => {
    const token = localStorage.getItem('darshi_token');
    return `${API_BASE}/certificates/download/${enrollmentId}?token=${token}`;
  },

  // CLASSES / ATTENDANCE
  getMyClasses: () =>
    fetch(`${API_BASE}/classes/my-classes`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  joinClass: (classId) =>
    fetch(`${API_BASE}/classes/${classId}/join`, {
      method: 'POST',
      headers: getHeaders(),
    }).then(handleResponse),

  adminGetClasses: () =>
    fetch(`${API_BASE}/classes/admin/all`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  adminCreateClass: (classData) =>
    fetch(`${API_BASE}/classes/admin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(classData),
    }).then(handleResponse),

  adminDeleteClass: (classId) =>
    fetch(`${API_BASE}/classes/admin/${classId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  adminGetAttendance: (classId) =>
    fetch(`${API_BASE}/classes/admin/${classId}/attendance`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  adminUpdateAttendance: (classId, userId, present) =>
    fetch(`${API_BASE}/classes/admin/${classId}/attendance/${userId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ present }),
    }).then(handleResponse),

  // ADMIN ANALYTICS
  getAdminStats: () =>
    fetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  getAdminStudents: () =>
    fetch(`${API_BASE}/admin/students`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),

  getAdminPayments: () =>
    fetch(`${API_BASE}/admin/payments`, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse),
};

// Mock API Service for demo purposes - No real API calls
import axios from 'axios';

// Mock data store
const mockData = {
  user: {
    id: 'STU001',
    email: 'john.doe@university.edu',
    fullName: 'John Doe',
    role: 'Student',
    studentId: 'A00123456',
    contactNumber: '+1-234-567-8900',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+1-234-567-8901',
    program: 'Bachelor of Science in Computer Science',
    year: 2,
    gpa: 3.85,
    enrolledCourses: 5,
    pendingBalance: 2500.00,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  courses: [
    {
      id: 1,
      code: 'CS101',
      title: 'Introduction to Computer Science',
      instructor: 'Dr. Smith',
      credits: 3,
      timeslot: 'Mon/Wed 10:00 AM',
      room: 'Engineering 201',
      semester: 'Spring 2024',
      status: 'active',
      enrolled: true,
      description: 'An introductory course covering fundamental concepts of computer science, including algorithms, data structures, and basic programming principles.',
      capacity: 30,
      enrolled_count: 28,
      prerequisites: [],
      grading: 'A-F',
      startDate: '2024-01-15',
      endDate: '2024-05-10',
    },
    {
      id: 2,
      code: 'CS201',
      title: 'Data Structures',
      instructor: 'Prof. Johnson',
      credits: 4,
      timeslot: 'Tue/Thu 2:00 PM',
      room: 'Engineering 303',
      semester: 'Spring 2024',
      status: 'active',
      enrolled: true,
      description: 'Comprehensive study of data structures including linked lists, stacks, queues, trees, and graphs. Emphasis on efficiency and implementation.',
      capacity: 25,
      enrolled_count: 24,
      prerequisites: ['CS101'],
      grading: 'A-F',
      startDate: '2024-01-15',
      endDate: '2024-05-10',
    },
    {
      id: 3,
      code: 'MATH301',
      title: 'Discrete Mathematics',
      instructor: 'Dr. Williams',
      credits: 3,
      timeslot: 'Mon/Wed/Fri 1:00 PM',
      room: 'Science 105',
      semester: 'Spring 2024',
      status: 'active',
      enrolled: true,
      description: 'Logic, set theory, combinatorics, graph theory, and proofs. Essential mathematics for computer science.',
      capacity: 35,
      enrolled_count: 32,
      prerequisites: [],
      grading: 'A-F',
      startDate: '2024-01-15',
      endDate: '2024-05-10',
    },
    {
      id: 4,
      code: 'CS102',
      title: 'Web Development',
      instructor: 'Prof. Brown',
      credits: 3,
      timeslot: 'Tue/Thu 3:30 PM',
      room: 'Engineering 202',
      semester: 'Spring 2024',
      status: 'available',
      enrolled: false,
      description: 'Modern web development with HTML5, CSS3, and JavaScript. Create responsive, interactive web applications.',
      capacity: 30,
      enrolled_count: 18,
      prerequisites: ['CS101'],
      grading: 'A-F',
      startDate: '2024-01-15',
      endDate: '2024-05-10',
    },
    {
      id: 5,
      code: 'CS301',
      title: 'Algorithms',
      instructor: 'Dr. Davis',
      credits: 4,
      timeslot: 'Fri 9:00 AM - 12:00 PM',
      room: 'Engineering 304',
      semester: 'Fall 2024',
      status: 'available',
      enrolled: false,
      description: 'Advanced algorithm design and analysis. Topics include sorting, searching, graph algorithms, dynamic programming, and NP-completeness.',
      capacity: 20,
      enrolled_count: 12,
      prerequisites: ['CS201', 'MATH301'],
      grading: 'A-F',
      startDate: '2024-09-01',
      endDate: '2024-12-15',
    },
    {
      id: 6,
      code: 'PHYS201',
      title: 'Physics II',
      instructor: 'Prof. Miller',
      credits: 4,
      timeslot: 'Mon/Wed 11:00 AM',
      room: 'Science 201',
      semester: 'Fall 2024',
      status: 'available',
      enrolled: false,
      description: 'Electricity, magnetism, and modern physics. Continuation of Physics I with applications to engineering.',
      capacity: 25,
      enrolled_count: 20,
      prerequisites: ['PHYS101'],
      grading: 'A-F',
      startDate: '2024-09-01',
      endDate: '2024-12-15',
    },
  ],
  grades: {
    gpa: 3.85,
    grades: [
      {
        course: { id: 1, code: 'CS101', title: 'Introduction to Computer Science' },
        grade: 'A',
        score: 95,
        status: 'completed',
      },
      {
        course: { id: 2, code: 'CS201', title: 'Data Structures' },
        grade: 'A-',
        score: 90,
        status: 'completed',
      },
      {
        course: { id: 3, code: 'MATH301', title: 'Discrete Mathematics' },
        grade: 'B+',
        score: 88,
        status: 'completed',
      },
      {
        course: { id: 5, code: 'CS301', title: 'Algorithms' },
        grade: 'In Progress',
        score: null,
        status: 'pending',
      },
    ],
  },
  finance: {
    balance: 2500.00,
    transactions: [
      {
        id: 1,
        description: 'Spring 2024 Tuition',
        amount: 8000.00,
        type: 'charge',
        date: '2024-01-15',
        status: 'paid',
      },
      {
        id: 2,
        description: 'Housing - Spring 2024',
        amount: 2500.00,
        type: 'charge',
        date: '2024-01-15',
        status: 'pending',
      },
      {
        id: 3,
        description: 'Scholarship Credit',
        amount: 3500.00,
        type: 'credit',
        date: '2024-01-10',
        status: 'credited',
      },
      {
        id: 4,
        description: 'Late Fee Waived',
        amount: 150.00,
        type: 'adjustment',
        date: '2024-01-05',
        status: 'credited',
      },
    ],
  },
  notifications: [
    {
      id: 1,
      title: 'Grade Posted',
      message: 'Your grade for CS201 has been posted: A-',
      type: 'academic',
      read: false,
      date: '2024-02-01',
    },
    {
      id: 2,
      title: 'Payment Reminder',
      message: 'You have a pending balance of $2500.00 due by Feb 28',
      type: 'financial',
      read: false,
      date: '2024-01-30',
    },
    {
      id: 3,
      title: 'Course Registration Open',
      message: 'Early registration for Fall 2024 is now open',
      type: 'academic',
      read: true,
      date: '2024-01-25',
    },
    {
      id: 4,
      title: 'System Maintenance',
      message: 'System will be down for maintenance on Feb 5 from 2-4 AM',
      type: 'system',
      read: true,
      date: '2024-01-20',
    },
  ],
  documents: [
    {
      id: 1,
      name: 'Transcript Request',
      type: 'transcript',
      status: 'pending',
      requestDate: '2024-02-01',
      dueDate: '2024-02-08',
    },
    {
      id: 2,
      name: 'Degree Audit',
      type: 'audit',
      status: 'ready',
      requestDate: '2024-01-15',
      dueDate: '2024-02-15',
    },
    {
      id: 3,
      name: 'Enrollment Verification Letter',
      type: 'verification',
      status: 'processing',
      requestDate: '2024-01-28',
      dueDate: '2024-02-04',
    },
  ],
  timetable: [
    {
      day: 'Monday',
      events: [
        { course: 'CS101', time: '10:00 AM - 11:30 AM', room: 'Science 101', instructor: 'Dr. Smith' },
        { course: 'MATH301', time: '1:00 PM - 2:30 PM', room: 'Math 201', instructor: 'Dr. Williams' },
      ],
    },
    {
      day: 'Tuesday',
      events: [
        { course: 'CS201', time: '2:00 PM - 3:30 PM', room: 'Computer Lab 2', instructor: 'Prof. Johnson' },
      ],
    },
    {
      day: 'Wednesday',
      events: [
        { course: 'CS101', time: '10:00 AM - 11:30 AM', room: 'Science 101', instructor: 'Dr. Smith' },
        { course: 'MATH301', time: '1:00 PM - 2:30 PM', room: 'Math 201', instructor: 'Dr. Williams' },
      ],
    },
    {
      day: 'Thursday',
      events: [
        { course: 'CS201', time: '2:00 PM - 3:30 PM', room: 'Computer Lab 2', instructor: 'Prof. Johnson' },
      ],
    },
    {
      day: 'Friday',
      events: [
        { course: 'MATH301', time: '1:00 PM - 2:30 PM', room: 'Math 201', instructor: 'Dr. Williams' },
      ],
    },
  ],
};

// Create mock API instance
const mockApi = axios.create({
  baseURL: '/api',
});

// Simulate API delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Interceptors for auth token
mockApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Request interceptor to handle mock responses
mockApi.interceptors.response.use((config) => {
  return config;
});

// Override request method
const originalRequest = mockApi.request.bind(mockApi);
mockApi.request = async function (config) {
  const { method, url } = config;
  await delay();

  // Auth endpoints
  if (method === 'post' && url === '/auth/login') {
    const userData = { ...mockData.user };
    // Store user info in localStorage for Layout component
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return {
      data: {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        user: userData,
      },
      status: 200,
      statusText: 'OK',
    };
  }

  if (method === 'post' && url === '/auth/register') {
    const userData = { ...mockData.user };
    // Store user info in localStorage for Layout component
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return {
      data: {
        message: 'Registration successful',
        user: userData,
      },
      status: 201,
      statusText: 'Created',
    };
  }

  // Student profile
  if (method === 'get' && url === '/students/profile') {
    return {
      data: mockData.user,
      status: 200,
      statusText: 'OK',
    };
  }

  if (method === 'put' && url === '/students/profile') {
    mockData.user = { ...mockData.user, ...config.data };
    return {
      data: mockData.user,
      status: 200,
      statusText: 'OK',
    };
  }

  // Courses
  if (method === 'get' && url === '/courses') {
    return {
      data: mockData.courses,
      status: 200,
      statusText: 'OK',
    };
  }

  if (method === 'post' && url.includes('/courses/') && url.includes('/add')) {
    const courseId = parseInt(url.split('/')[2]);
    const course = mockData.courses.find((c) => c.id === courseId);
    if (course) {
      course.enrolled = true;
      mockData.user.enrolledCourses = mockData.courses.filter((c) => c.enrolled).length;
    }
    return {
      data: { message: 'Course added successfully' },
      status: 200,
      statusText: 'OK',
    };
  }

  if (method === 'post' && url.includes('/courses/') && url.includes('/drop')) {
    const courseId = parseInt(url.split('/')[2]);
    const course = mockData.courses.find((c) => c.id === courseId);
    if (course) {
      course.enrolled = false;
      mockData.user.enrolledCourses = mockData.courses.filter((c) => c.enrolled).length;
    }
    return {
      data: { message: 'Course dropped successfully' },
      status: 200,
      statusText: 'OK',
    };
  }

  // Grades
  if (method === 'get' && url === '/grades') {
    return {
      data: mockData.grades,
      status: 200,
      statusText: 'OK',
    };
  }

  // Notifications
  if (method === 'get' && url === '/notifications') {
    return {
      data: mockData.notifications,
      status: 200,
      statusText: 'OK',
    };
  }

  // Finance
  if (method === 'get' && url === '/finance') {
    return {
      data: mockData.finance,
      status: 200,
      statusText: 'OK',
    };
  }

  // Documents
  if (method === 'get' && url === '/documents') {
    return {
      data: mockData.documents,
      status: 200,
      statusText: 'OK',
    };
  }

  // Timetable
  if (method === 'get' && url === '/timetable') {
    return {
      data: mockData.timetable,
      status: 200,
      statusText: 'OK',
    };
  }

  // Fallback to original request
  return originalRequest(config);
};

export default mockApi;

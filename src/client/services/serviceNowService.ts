
import { Course, Assessment, Nudge, StudentProfileFull, CalendarEvent } from '../types';
import { mockCourses, mockAssessments, mockNudges, mockEvents, mockStudentsList } from '../store/mockStore';

/**
 * ServiceNow Table API Service
 * Handles CRUD operations for Student Management
 * Optimized for ServiceNow Portal iFrame Integration
 */

// --- HARDCODED CONFIGURATION (DEMO ONLY) ---
const CONFIG = {
  instance: 'kpmgfeb18',
  username: 'team07_captain',
  token: 'Servicenow@12'
};

// We keep this function to avoid breaking imports, but it effectively does nothing now
export const saveConfig = (config: any) => {
  console.log("Config is hardcoded, ignoring save:", config);
  window.dispatchEvent(new Event('sn_config_updated'));
};

const snFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Direct Basic Auth using hardcoded credentials
  const auth = btoa(`${CONFIG.username}:${CONFIG.token}`);
  
  // Construct URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `https://${CONFIG.instance}.service-now.com/api/now/table/${endpoint}`;
  
  console.log(`[ServiceNow] Calling: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[ServiceNow] API Error ${response.status}:`, errorText);
      throw new Error(`ServiceNow Error: ${response.statusText} (${response.status})`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn("SN Fetch Connection Issue (CORS or Network):", error);
    throw error;
  }
};

export const serviceNow = {
  // Always true since we hardcoded credentials
  isConnected: () => true,

  // --- Courses ---
  getCourses: async (): Promise<Course[]> => {
    try {
      const data = await snFetch('u_edu_course?sysparm_limit=20');
      return data.result.map((r: any) => ({
        id: r.sys_id,
        sys_id: r.sys_id,
        title: r.u_title,
        instructor: r.u_instructor,
        progress: 0, 
        totalModules: parseInt(r.u_total_modules) || 10,
        completedModules: 0,
        thumbnail: r.u_thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
        category: r.u_category,
        enrolled: false,
        description: r.u_description,
        recommended: r.u_recommended === 'true',
        skills: r.u_skills ? r.u_skills.split(',') : [],
        rating: parseFloat(r.u_rating) || 4.8,
        studentsEnrolled: 0
      }));
    } catch (e) {
      console.warn("Using Mock Courses due to API error.");
      return mockCourses;
    }
  },

  // --- Enrollments ---
  getMyEnrollments: async (email: string) => {
    try {
      const data = await snFetch(`u_edu_enrollment?sysparm_query=u_student_email=${email}`);
      return data.result;
    } catch (e) {
      console.warn("Using Empty Enrollments due to API error.");
      return []; // Return empty array so local mock defaults take over
    }
  },

  enrollStudent: async (email: string, courseSysId: string) => {
    try {
      return await snFetch('u_edu_enrollment', {
        method: 'POST',
        body: JSON.stringify({
          u_student_email: email,
          u_course: courseSysId,
          u_progress: 0,
          u_completed_modules: 0,
          u_active: true
        })
      });
    } catch (e) {
      return { result: { sys_id: 'mock-enrollment-id' } };
    }
  },

  updateProgress: async (enrollmentSysId: string, progress: number, modules: number) => {
    try {
      return await snFetch(`u_edu_enrollment/${enrollmentSysId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          u_progress: progress,
          u_completed_modules: modules
        })
      });
    } catch (e) {
      return { result: { status: 'mock-updated' } };
    }
  },
  
  // --- Events ---
  getEvents: async (email: string): Promise<CalendarEvent[]> => {
    try {
      // Fetch events for specific student
      const data = await snFetch(`u_edu_event?sysparm_query=u_student_email=${email}^ORDERBYu_date`);
      return data.result.map((r: any) => ({
        id: r.sys_id,
        title: r.u_title,
        date: new Date(r.u_date),
        type: r.u_type || 'study',
        courseId: r.u_course?.value || '',
        description: r.u_description || 'Synced from ServiceNow',
        duration: '1h'
      }));
    } catch (e) {
      console.warn("Using Mock Events due to API error.");
      return mockEvents;
    }
  },

  createEvent: async (event: Partial<CalendarEvent>, email: string) => {
    try {
      return await snFetch('u_edu_event', {
         method: 'POST',
         body: JSON.stringify({
           u_title: event.title,
           u_date: event.date?.toISOString().split('T')[0], // Simple date
           u_type: event.type,
           u_student_email: email,
           u_description: event.description
         })
      });
    } catch (e) {
      return { result: { sys_id: 'mock-event-id' } };
    }
  },

  // --- Students (For Teacher) ---
  getStudents: async (): Promise<StudentProfileFull[]> => {
    try {
      const data = await snFetch('u_edu_student_profile?sysparm_limit=50');
      return data.result.map((r: any) => ({
        id: r.sys_id,
        name: r.u_student_email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase()),
        email: r.u_student_email,
        avatar: r.u_student_email.substring(0,2).toUpperCase(),
        gpa: parseFloat(r.u_gpa) || 0.0,
        attendance: parseInt(r.u_attendance_score) || 0,
        missedDeadlines: 0, // Mock for now
        strongestSkill: r.u_strongest_skill || 'General',
        weakestSkill: r.u_weakest_skill || 'None',
        recentGrades: []
      }));
    } catch (e) {
      console.warn("Using Mock Students due to API error.");
      return mockStudentsList;
    }
  },

  // --- Assessments ---
  getAssessments: async (): Promise<Assessment[]> => {
    try {
      const data = await snFetch('u_edu_assessment?sysparm_limit=50^ORDERBYu_due_date');
      return data.result.map((r: any) => ({
        id: r.sys_id,
        courseId: r.u_course?.value || 'Unknown',
        title: r.u_title,
        dueDate: r.u_due_date,
        totalPoints: parseInt(r.u_total_points),
        avgScore: parseInt(r.u_avg_score) || 0,
        status: r.u_status,
        questions: 10
      }));
    } catch (e) {
      console.warn("Using Mock Assessments due to API error.");
      return mockAssessments;
    }
  },

  createAssessment: async (assessment: Partial<Assessment>) => {
    try {
      return await snFetch('u_edu_assessment', {
        method: 'POST',
        body: JSON.stringify({
          u_title: assessment.title,
          u_total_points: assessment.totalPoints,
          u_due_date: assessment.dueDate,
          u_status: assessment.status || 'Draft'
        })
      });
    } catch (e) {
      return { result: { sys_id: 'mock-assessment-id' } };
    }
  },

  // --- Nudges ---
  getNudges: async (email: string): Promise<Nudge[]> => {
     try {
       const data = await snFetch(`u_edu_nudge?sysparm_query=u_student_email=${email}^u_active=true`);
       return data.result.map((r: any) => ({
         id: r.sys_id,
         type: r.u_type,
         severity: r.u_severity,
         message: r.u_message,
         actionLabel: r.u_action_label,
         timestamp: 'Today',
         actionLink: '#'
       }));
     } catch (e) {
       console.warn("Using Mock Nudges due to API error.");
       return mockNudges;
     }
  },

  // --- Compliance & Grading ---
  saveComplianceRecord: async (data: any) => {
    try {
      return await snFetch('u_edu_compliance', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (e) {
      return { result: { status: 'mock-saved' } };
    }
  },
  
  saveGradingRecord: async (data: any) => {
    try {
      return await snFetch('u_edu_exam_review', { 
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (e) {
      return { result: { status: 'mock-saved' } };
    }
  }
};

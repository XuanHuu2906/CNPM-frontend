import apiClient from './apiClient';
import type { AssignmentType } from '../types';

export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isLocked: boolean;
  classes?: any[];
}

export interface Subject {
  id: string;
  subjectCode: string;
  name: string;
}

export interface Class {
  id: string;
  classCode: string;
  subjectId: string;
  termId: string;
  assignmentType: AssignmentType;
  subject: Subject;
  term: AcademicTerm;
  assignments?: any[];
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface SystemLog {
  id: string;
  userId: string | null;
  action: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
  user?: {
    email: string;
    fullName: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export const academicService = {
  // ==========================================
  // HỌC KỲ (ACADEMIC TERMS - UC-19)
  // ==========================================
  getAllTerms: async (): Promise<AcademicTerm[]> => {
    const response = await apiClient.get('/academic/terms');
    return response.data.data;
  },

  createTerm: async (data: { name: string; startDate: string; endDate: string }): Promise<AcademicTerm> => {
    const response = await apiClient.post('/academic/terms', data);
    return response.data.data;
  },

  updateTerm: async (id: string, data: Partial<{ name: string; startDate: string; endDate: string; isLocked: boolean }>): Promise<AcademicTerm> => {
    const response = await apiClient.put(`/academic/terms/${id}`, data);
    return response.data.data;
  },

  // ==========================================
  // MÔN HỌC (SUBJECTS - UC-13)
  // ==========================================
  getAllSubjects: async (): Promise<Subject[]> => {
    const response = await apiClient.get('/academic/subjects');
    return response.data.data;
  },

  createSubject: async (data: { subjectCode: string; name: string }): Promise<Subject> => {
    const response = await apiClient.post('/academic/subjects', data);
    return response.data.data;
  },

  // ==========================================
  // LỚP HỌC PHẦN (CLASSES - UC-13)
  // ==========================================
  getAllClasses: async (): Promise<Class[]> => {
    const response = await apiClient.get('/academic/classes');
    return response.data.data;
  },

  getClassById: async (id: string): Promise<Class> => {
    const response = await apiClient.get(`/academic/classes/${id}`);
    return response.data.data;
  },

  setClassAssignmentType: async (classId: string, value: AssignmentType): Promise<Class> => {
    const response = await apiClient.patch(`/academic/classes/${classId}/assignment-type`, { value });
    return response.data.data;
  },

  bulkImportStudents: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post('/academic/students/bulk-import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data as {
      totalRows: number;
      createdCount: number;
      skippedCount: number;
      failedCount: number;
      emailSentCount: number;
      results: Array<
        | { mssv: string; fullName: string; email: string; status: 'CREATED' }
        | { mssv: string; fullName: string; email: string; status: 'SKIPPED'; reason: string }
        | { mssv: string; fullName: string; email: string; status: 'FAILED'; reason: string }
      >;
    };
  },

  importClassFromExcel: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const response = await apiClient.post('/academic/classes/import-excel', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data as {
      class: {
        id: string;
        classCode: string;
        subject: { code: string; name: string };
        term: { id: string; name: string };
      };
      teacher: {
        id: string;
        teacherCode: string;
        fullName: string;
        email: string;
      };
      studentCount: number;
      createdUsersCount: number;
      enrolledCount: number;
    };
  },

  /**
   * Tạo báo cáo sinh viên
   */
  getStudentReport: async (filters?: { classId?: string }): Promise<any> => {
    const params = new URLSearchParams();
    if (filters?.classId) params.append('classId', filters.classId);
    
    const response = await apiClient.get(`/academic/reports/students?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Quản lý Yêu cầu mở lại chấm điểm
   */
  getGradingReopenRequests: async (filters?: any): Promise<any> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.semesterId) params.append('semesterId', filters.semesterId);

    const response = await apiClient.get(`/academic/grading-reopen-requests?${params.toString()}`);
    return response.data.data;
  },

  approveGradingReopenRequest: async (id: string, reviewNote?: string): Promise<any> => {
    const response = await apiClient.patch(`/academic/grading-reopen-requests/${id}/approve`, { reviewNote });
    return response.data;
  },

  rejectGradingReopenRequest: async (id: string, reviewNote: string): Promise<any> => {
    const response = await apiClient.patch(`/academic/grading-reopen-requests/${id}/reject`, { reviewNote });
    return response.data;
  },

  // ==========================================
  // PHÂN CÔNG GIẢNG VIÊN (TEACHER ASSIGNMENTS - UC-13)
  // ==========================================
  assignTeacher: async (data: { classId: string; teacherId: string }): Promise<any> => {
    const response = await apiClient.post('/academic/assignments', data);
    return response.data.data;
  },

  unassignTeacher: async (classId: string, teacherId: string): Promise<any> => {
    const response = await apiClient.delete(`/academic/assignments/${classId}/${teacherId}`);
    return response.data.data;
  },

  // UC-17: Đổi GV phụ trách giữa kỳ (1 thao tác, kèm lý do bắt buộc — giữ điểm nháp của GV cũ).
  changeClassTeacher: async (
    classId: string,
    data: { newTeacherId: string; reason: string },
  ): Promise<{
    classId: string;
    classCode: string;
    oldTeacherId: string;
    newTeacherId: string;
    newTeacher: { id: string; teacherCode: string; fullName: string; email: string };
    inProgressCount: number;
    historyId: string;
    assignmentId: string;
  }> => {
    const response = await apiClient.put(`/academic/classes/${classId}/teacher`, data);
    return response.data.data;
  },

  getClassAssignmentHistory: async (classId: string): Promise<Array<{
    id: string;
    classId: string;
    assignmentId: string | null;
    oldTeacherId: string;
    newTeacherId: string;
    reason: string;
    changedById: string;
    createdAt: string;
    oldTeacher: { id: string; teacherCode: string; user: { fullName: string; email: string } };
    newTeacher: { id: string; teacherCode: string; user: { fullName: string; email: string } };
    changedBy: { id: string; fullName: string; email: string; role: string };
  }>> => {
    const response = await apiClient.get(`/academic/classes/${classId}/assignment-history`);
    return response.data.data;
  },

  // ==========================================
  // PHÊ DUYỆT ĐIỂM SỐ (GRADE APPROVALS - UC-16)
  // ==========================================
  approveGrade: async (submissionId: string, data: { isApproved: boolean; version: number; reason?: string }): Promise<any> => {
    const response = await apiClient.put(`/system/grades/${submissionId}/approve`, data);
    return response.data.data;
  },

  // UC-16 (BATCH): phê duyệt / trả về theo lô — flip cả Grade.isApproved và submission.status (HOAN_THANH / DANG_CHAM).
  batchApproveGrades: async (data: {
    submissionIds: string[];
    action: 'APPROVE' | 'RETURN';
    reason?: string;
  }): Promise<{
    action: 'APPROVE' | 'RETURN';
    totalRequested: number;
    successCount: number;
    failedCount: number;
    results: Array<
      | { submissionId: string; status: 'SUCCESS' }
      | { submissionId: string; status: 'FAILED'; reason: string }
    >;
  }> => {
    const response = await apiClient.post('/system/grades/batch-approve', data);
    return response.data.data;
  },

  // ==========================================
  // TÌM KIẾM TOÀN CỤC (GLOBAL SEARCH)
  // ==========================================
  globalSearch: async (q: string): Promise<{ groups: any[]; submissions: any[]; teachers: any[] }> => {
    const response = await apiClient.get(`/system/search?q=${encodeURIComponent(q)}`);
    return response.data.data;
  },

  // ==========================================
  // XEM BÀI NỘP THEO LỚP
  // ==========================================
  getSubmissionsByClassId: async (classId: string): Promise<any[]> => {
    const response = await apiClient.get(`/submissions/class/${classId}`);
    return response.data.data;
  },

  // ==========================================
  // XEM TOÀN BỘ BÀI NỘP HỆ THỐNG
  // ==========================================
  getAllSubmissions: async (): Promise<any[]> => {
    const response = await apiClient.get('/submissions');
    return response.data.data;
  },
};

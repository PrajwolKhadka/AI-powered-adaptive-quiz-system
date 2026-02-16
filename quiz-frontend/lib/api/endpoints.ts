export const API = {
  AUTH: {
    REGISTER_SCHOOL: "/api/school/auth/register-school",
    LOGIN: "/api/school/auth/login",
    FORGOT_PASSWORD: "/api/school/auth/forgot-password",
    RESET_PASSWORD: "/api/school/auth/reset-password",
    STUD_LOGIN: "/api/school/auth/student-login",
  },
  CRUD: {
    CREATE_STUDENT: "/api/school/create-student",
    UPDATE_STUDENT: "/api/school/students/:id",
    DELETE_STUDENT: "/api/school/students/:id",
    DELETE_BATCH_STUDENTS: "/api/school/students/delete-batch",
    FETCH_STUDENTS: "/api/school/students",
  },
  QUIZ: {
    UPLOAD_CSV: "/api/school/upload-csv",
    GET_QUESTIONS: "/api/school/questions",
    UPDATE_QUESTION: "/api/school/questions",
    DELETE_QUESTION: "/api/school/questions",
    DELETE_BATCH_QUESTIONS: "/api/school/questions/delete-batch",
    TOGGLE: "/api/school/quiz/toggle",
  },
  PROFILE:{
    GET_PROFILE: "/api/student/profile",
  }
};

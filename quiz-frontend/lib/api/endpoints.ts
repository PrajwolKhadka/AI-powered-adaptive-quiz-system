export const API = {
  AUTH: {
    REGISTER_SCHOOL: "/api/school/auth/register-school",
    LOGIN: "/api/school/auth/login",
    FORGOT_PASSWORD: "/api/school/auth/forgot-password",
    RESET_PASSWORD: "/api/school/auth/reset-password",
  },
  CRUD: {
    CREATE_STUDENT: "/api/school/create-student",
    UPDATE_STUDENT: "/api/school/students/:id",
    DELETE_STUDENT: "/api/school/students/:id",
    DELETE_BATCH_STUDENTS: "/api/school/students/delete-batch",
    FETCH_STUDENTS: "/api/school/students",
  },
};

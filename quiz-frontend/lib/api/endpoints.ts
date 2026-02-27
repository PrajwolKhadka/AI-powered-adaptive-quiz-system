export const API = {
  AUTH: {
    REGISTER_SCHOOL: "/api/school/auth/register-school",
    LOGIN: "/api/school/auth/login",
    FORGOT_PASSWORD: "/api/school/auth/forgot-password",
    RESET_PASSWORD: "/api/school/auth/reset-password",
    STUD_LOGIN: "/api/school/auth/student-login",
    FIRST_LOGIN: "/api/school/auth/change-password",
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
    NEXT_QUESTION: "/api/student/next-question",
    SUBMIT_ANSWER: "/api/student/submit-answer",
    ACTIVE_QUIZ: "/api/student/active-quiz",
  },
  PROFILE:{
    GET_PROFILE: "/api/student/profile",
    VERIFY_PASSWORD: "/api/student/verify-password",
    UPDATE_PROFILE_PICTURE: "/api/student/profile-picture",
  },
  RESOURCES:{
    UPLOAD: "/api/resources/upload-resources",
    GET_SCHOOL_RESOURCES: "/api/resources/get-resources",
    UPDATE: "/api/resources/:id",
    DELETE: "/api/resources/:id",
    GET_STUDENT_RESOURCES: "/api/resources/student-resources",
  },
  RESULTS:{
    GET_STUDENT_RESULTS: "/api/results/student/results",
    GET_STUDENT_INDV_RESULTS: "/api/results/student/results/:quizId",
    GET_SCHOOL_QUIZZES: "/api/results/school/quizzes",
    GET_SCHOOL_RESULTS: "/api/results/school/results",
    GET_QUIZ_RESULTS: "/api/results/school/quizzes/:quizId/results",
    GET_STUDENT_RESULT_DETAIL: "/api/results/school/quizzes/:quizId/results/:studentId",
  }
};

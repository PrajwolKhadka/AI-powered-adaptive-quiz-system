import { toggleQuizDto, getQuizDto } from "../../dtos/quiz.dto";
import { CreateStudentDTO } from "../../dtos/student.dto";
import { registerSchoolDto } from "../../dtos/school.dto";
import { questionCsvRowDto } from "../../dtos/question.dto";
import { loginDto } from "../../dtos/auth.dto";


describe("toggleQuizDto", () => {
  const valid = {
    classLevel: 10,
    subject: "Maths",
    durationMinutes: 30,
    isActive: true,
  };

  test("accepts valid input without quizId", () => {
    expect(() => toggleQuizDto.parse(valid)).not.toThrow();
  });

  test("accepts valid input with optional quizId", () => {
    expect(() =>
      toggleQuizDto.parse({ ...valid, quizId: "abc123" })
    ).not.toThrow();
  });

  test("rejects classLevel below 6", () => {
    expect(() =>
      toggleQuizDto.parse({ ...valid, classLevel: 5 })
    ).toThrow();
  });

  test("rejects classLevel above 12", () => {
    expect(() =>
      toggleQuizDto.parse({ ...valid, classLevel: 13 })
    ).toThrow();
  });

  test("rejects durationMinutes below 1", () => {
    expect(() =>
      toggleQuizDto.parse({ ...valid, durationMinutes: 0 })
    ).toThrow();
  });

  test("rejects durationMinutes above 60", () => {
    expect(() =>
      toggleQuizDto.parse({ ...valid, durationMinutes: 61 })
    ).toThrow();
  });

  test("rejects invalid subject", () => {
    expect(() =>
      toggleQuizDto.parse({ ...valid, subject: "Physics" })
    ).toThrow();
  });

  test("rejects missing isActive", () => {
    const { isActive, ...rest } = valid;
    expect(() => toggleQuizDto.parse(rest)).toThrow();
  });

  test("accepts all valid subjects", () => {
    const subjects = ["Computer Sc.", "Science", "Maths", "Nepali", "English", "Social", "EPH"];
    subjects.forEach((subject) => {
      expect(() => toggleQuizDto.parse({ ...valid, subject })).not.toThrow();
    });
  });
});


describe("getQuizDto", () => {
  test("accepts valid quizId string", () => {
    expect(() => getQuizDto.parse({ quizId: "abc123" })).not.toThrow();
  });

  test("rejects missing quizId", () => {
    expect(() => getQuizDto.parse({})).toThrow();
  });

  test("rejects non-string quizId", () => {
    expect(() => getQuizDto.parse({ quizId: 123 })).toThrow();
  });
});


describe("CreateStudentDTO", () => {
  const valid = {
    fullName: "John Doe",
    email: "john@example.com",
    password: "Pass1234!",
    className: 10,
  };

  test("accepts valid student data", () => {
    expect(() => CreateStudentDTO.parse(valid)).not.toThrow();
  });

  test("rejects fullName shorter than 3 characters", () => {
    expect(() =>
      CreateStudentDTO.parse({ ...valid, fullName: "Jo" })
    ).toThrow();
  });

  test("rejects invalid email", () => {
    expect(() =>
      CreateStudentDTO.parse({ ...valid, email: "not-an-email" })
    ).toThrow();
  });

  test("rejects password shorter than 8 characters", () => {
    expect(() =>
      CreateStudentDTO.parse({ ...valid, password: "short" })
    ).toThrow();
  });

  test("rejects className above 12", () => {
    expect(() =>
      CreateStudentDTO.parse({ ...valid, className: 13 })
    ).toThrow();
  });

  test("rejects className below 1", () => {
    expect(() =>
      CreateStudentDTO.parse({ ...valid, className: 0 })
    ).toThrow();
  });

  test("coerces className from string to number", () => {
    const result = CreateStudentDTO.parse({ ...valid, className: "10" });
    expect(result.className).toBe(10);
  });

  test("accepts optional imageUrl", () => {
    expect(() =>
      CreateStudentDTO.parse({ ...valid, imageUrl: "/uploads/photo.jpg" })
    ).not.toThrow();
  });

  test("accepts missing imageUrl", () => {
    const result = CreateStudentDTO.parse(valid);
    expect(result.imageUrl).toBeUndefined();
  });
});


describe("registerSchoolDto", () => {
  const valid = {
    name: "Test School",
    email: "school@example.com",
    password: "SecurePass1",
    location: { city: "Kathmandu", district: "Bagmati" },
    pan: "123456789",
    contactNumber: "9876543210",
    instituteType: "PRIVATE",
  };

  test("accepts valid school registration data", () => {
    expect(() => registerSchoolDto.parse(valid)).not.toThrow();
  });

  test("rejects name shorter than 3 characters", () => {
    expect(() =>
      registerSchoolDto.parse({ ...valid, name: "AB" })
    ).toThrow();
  });

  test("rejects invalid email", () => {
    expect(() =>
      registerSchoolDto.parse({ ...valid, email: "bad-email" })
    ).toThrow();
  });

  test("rejects password shorter than 8 characters", () => {
    expect(() =>
      registerSchoolDto.parse({ ...valid, password: "short" })
    ).toThrow();
  });

  test("rejects missing location", () => {
    const { location, ...rest } = valid;
    expect(() => registerSchoolDto.parse(rest)).toThrow();
  });

  test("rejects invalid instituteType", () => {
    expect(() =>
      registerSchoolDto.parse({ ...valid, instituteType: "UNKNOWN" })
    ).toThrow();
  });
});


// questionCsvRowDto
describe("questionCsvRowDto", () => {
  const valid = {
    questionNumber: 1,
    question: "What is 2+2?",
    optionA: "1",
    optionB: "2",
    optionC: "4",
    optionD: "5",
    rightAnswer: "c",
    subject: "Maths",
    difficulty: "EASY",
  };

  test("accepts valid CSV row", () => {
    expect(() => questionCsvRowDto.parse(valid)).not.toThrow();
  });

  test("coerces questionNumber from string", () => {
    const result = questionCsvRowDto.parse({ ...valid, questionNumber: "5" });
    expect(result.questionNumber).toBe(5);
  });

  test("rejects question shorter than 5 characters", () => {
    expect(() =>
      questionCsvRowDto.parse({ ...valid, question: "Hey" })
    ).toThrow();
  });

  test("rejects invalid rightAnswer", () => {
    expect(() =>
      questionCsvRowDto.parse({ ...valid, rightAnswer: "e" })
    ).toThrow();
  });

  test("rejects invalid difficulty", () => {
    expect(() =>
      questionCsvRowDto.parse({ ...valid, difficulty: "ULTRA HARD" })
    ).toThrow();
  });

  test("accepts all valid difficulties", () => {
    const difficulties = ["VERY EASY", "EASY", "MEDIUM", "HARD", "VERY HARD"];
    difficulties.forEach((difficulty) => {
      expect(() =>
        questionCsvRowDto.parse({ ...valid, difficulty })
      ).not.toThrow();
    });
  });

  test("accepts all valid rightAnswer options", () => {
    ["a", "b", "c", "d"].forEach((rightAnswer) => {
      expect(() =>
        questionCsvRowDto.parse({ ...valid, rightAnswer })
      ).not.toThrow();
    });
  });
});


describe("loginDto", () => {
  test("accepts valid email and password", () => {
    expect(() =>
      loginDto.parse({ email: "user@example.com", password: "Pass1234!" })
    ).not.toThrow();
  });

  test("rejects invalid email", () => {
    expect(() =>
      loginDto.parse({ email: "not-an-email", password: "Pass1234!" })
    ).toThrow();
  });

  test("rejects password shorter than 8 characters", () => {
    expect(() =>
      loginDto.parse({ email: "user@example.com", password: "short" })
    ).toThrow();
  });

  test("rejects missing email", () => {
    expect(() => loginDto.parse({ password: "Pass1234!" })).toThrow();
  });

  test("rejects missing password", () => {
    expect(() => loginDto.parse({ email: "user@example.com" })).toThrow();
  });
});
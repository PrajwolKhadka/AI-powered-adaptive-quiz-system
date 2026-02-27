import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentHomepage from "@/app/student/StudentDashboard/homepage/page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

const mockToastError = jest.fn();
const mockToastSuccess = jest.fn();
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: (...args: any[]) => mockToastError(...args),
    success: (...args: any[]) => mockToastSuccess(...args),
  },
}));

const mockGetActiveQuiz = jest.fn();
jest.mock("@/lib/api/quiz-api", () => ({
  QuizAPI: { getActiveQuiz: (...args: any[]) => mockGetActiveQuiz(...args) },
}));

const mockGetStudentResources = jest.fn();
jest.mock("@/lib/api/resources-api", () => ({
  ResourcesAPI: { getStudentResources: (...args: any[]) => mockGetStudentResources(...args) },
}));


const user = userEvent.setup();

const makeResource = (overrides = {}): any => ({
  _id: "r1",
  title: "Test Resource",
  description: "A test resource",
  type: "RESOURCE",
  format: "LINK",
  linkUrl: "https://example.com",
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockGetStudentResources.mockResolvedValue([]);
});


describe("StudentHomepage", () => {
  test("renders Start Quiz button and section heading", async () => {
    render(<StudentHomepage />);
    expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/quiz preparation/i)).toBeInTheDocument();
    });
  });

  test("shows 'No resources available' when list is empty", async () => {
    render(<StudentHomepage />);
    await waitFor(() => {
      expect(screen.getByText(/no resources available/i)).toBeInTheDocument();
    });
  });

  test("renders resource cards when resources are available", async () => {
    mockGetStudentResources.mockResolvedValue([
      makeResource({ title: "Maths Notes" }),
    ]);
    render(<StudentHomepage />);
    await waitFor(() => {
      expect(screen.getByText("Maths Notes")).toBeInTheDocument();
    });
  });

  test("filters out BOOK type — only shows RESOURCE type", async () => {
    mockGetStudentResources.mockResolvedValue([
      makeResource({ _id: "r1", title: "Good Resource", type: "RESOURCE" }),
      makeResource({ _id: "r2", title: "A Book", type: "BOOK" }),
    ]);
    render(<StudentHomepage />);
    await waitFor(() => {
      expect(screen.getByText("Good Resource")).toBeInTheDocument();
      expect(screen.queryByText("A Book")).not.toBeInTheDocument();
    });
  });

  test("handles failed resource fetch gracefully", async () => {
    mockGetStudentResources.mockRejectedValue(new Error("Network error"));
    render(<StudentHomepage />);
    await waitFor(() => {
      expect(screen.getByText(/no resources available/i)).toBeInTheDocument();
    });
  });

  test("opens link resource in new tab when View Resource is clicked", async () => {
    const windowOpenSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    mockGetStudentResources.mockResolvedValue([
      makeResource({ format: "LINK", linkUrl: "https://example.com" }),
    ]);
    render(<StudentHomepage />);
    await waitFor(() => screen.getByText(/view resource/i));
    await user.click(screen.getByText(/view resource/i));
    expect(windowOpenSpy).toHaveBeenCalledWith("https://example.com", "_blank");
    windowOpenSpy.mockRestore();
  });

  test("opens PDF modal when PDF resource is clicked", async () => {
    mockGetStudentResources.mockResolvedValue([
      makeResource({ format: "PDF", fileUrl: "/uploads/notes.pdf" }),
    ]);
    render(<StudentHomepage />);
    await waitFor(() => screen.getByText(/view resource/i));
    await user.click(screen.getByText(/view resource/i));
    await waitFor(() => {
      expect(screen.getByText(/resource preview/i)).toBeInTheDocument();
    });
  });

  test("closes PDF modal when Close button is clicked", async () => {
    mockGetStudentResources.mockResolvedValue([
      makeResource({ format: "PDF", fileUrl: "/uploads/notes.pdf" }),
    ]);
    render(<StudentHomepage />);
    await waitFor(() => screen.getByText(/view resource/i));
    await user.click(screen.getByText(/view resource/i));
    await waitFor(() => screen.getByText(/resource preview/i));
    await user.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText(/resource preview/i)).not.toBeInTheDocument();
    });
  });

  test("navigates to quiz page when active quiz is available", async () => {
    mockGetActiveQuiz.mockResolvedValue({ available: true, quizId: "quiz123", subject: "Maths" });
    render(<StudentHomepage />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/quiz?quizId=quiz123");
    });
  });

  test("shows error toast when no quiz is available", async () => {
    mockGetActiveQuiz.mockResolvedValue({ available: false });
    render(<StudentHomepage />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("No Quiz Available at the moment");
    });
  });

  test("shows error toast when quiz API throws", async () => {
    mockGetActiveQuiz.mockRejectedValue(new Error("Server error"));
    render(<StudentHomepage />);
    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Failed to fetch quiz");
    });
  });

  test("shows pagination buttons when more than 3 resources exist", async () => {
    const many = Array.from({ length: 5 }, (_, i) =>
      makeResource({ _id: `r${i}`, title: `Resource ${i + 1}` })
    );
    mockGetStudentResources.mockResolvedValue(many);
    render(<StudentHomepage />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    });
  });
});
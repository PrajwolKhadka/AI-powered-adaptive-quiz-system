import axiosInstance from "@/lib/api/axios";
import { API as endpoints } from "@/lib/api/endpoints";
import QuizClient from "./QuizClient";

export default async function QuizPage() {
  try {
    const res = await axiosInstance.get(endpoints.QUIZ.ACTIVE_QUIZ);

    const data = res.data;

    if (!data.available) {
      return (
        <div className="p-10 text-center text-xl font-semibold">
          No Quiz Available at the moment
        </div>
      );
    }

    return (
      <QuizClient
        quizId={data.quizId}
        subject={data.subject}
        endTime={data.endTime}
      />
    );
  } catch (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load quiz
      </div>
    );
  }
}

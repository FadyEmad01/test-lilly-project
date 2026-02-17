import { CareerQuiz } from "@/components/quiz/CareerQuiz";
import { Quiz } from "@/components/quiz/Quiz";
import { careerQuestions } from "@/constants/career-questions";
import { sampleQuestions } from "@/constants/QUESTIONS";

export default function page() {
  return (
    <main>
      <CareerQuiz 
        questions={careerQuestions} 
        timeLimit={600} // 10 minutes
        title="Career Discovery Quiz"
      />
    </main>
  )
}

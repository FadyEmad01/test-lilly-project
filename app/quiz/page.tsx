import { Quiz } from "@/components/quiz/Quiz";
import { sampleQuestions } from "@/constants/QUESTIONS";

export default function page() {
  return (
    <main>
      <Quiz 
        questions={sampleQuestions} 
        timeLimit={300}
        title="Knowledge Challenge"
      />
    </main>
  )
}

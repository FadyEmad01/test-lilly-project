import { Question } from '@/types/quiz';

export const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    explanation: "Paris is the capital and largest city of France, situated on the Seine River. It has been the country's capital since the 10th century.",
    category: "Geography"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation: "Mars is called the Red Planet because of iron oxide (rust) on its surface, which gives it a reddish appearance when viewed from Earth.",
    category: "Science"
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    explanation: "The Blue Whale is the largest animal ever known to exist, reaching lengths of up to 100 feet and weighing as much as 200 tons.",
    category: "Nature"
  },
  {
    id: 4,
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in September after the atomic bombings of Hiroshima and Nagasaki.",
    category: "History"
  },
  {
    id: 5,
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    explanation: "Au comes from the Latin word 'Aurum', meaning 'shining dawn'. Gold has been valued throughout human history for its rarity and beauty.",
    category: "Chemistry"
  },
  {
    id: 6,
    question: "Which programming language was created by Brendan Eich?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: 2,
    explanation: "JavaScript was created by Brendan Eich in just 10 days in 1995 while working at Netscape. It has since become one of the most popular programming languages.",
    category: "Technology"
  }
];
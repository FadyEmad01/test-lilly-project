// src/data/career-profiles.ts
import { CareerProfile } from '@/types/quiz';

export const careerProfiles: Record<string, CareerProfile> = {
  healthcare: {
    id: 'healthcare',
    name: 'The Caregiver',
    description: 'You are empathetic, patient, and driven by helping others. You thrive in environments where you can make a direct positive impact on people\'s lives.',
    icon: '🏥',
    color: '#F57799', // Pink
    careers: ['Doctor', 'Nurse', 'Psychologist', 'Therapist', 'Social Worker', 'Teacher', 'Counselor'],
    majors: ['Medicine', 'Nursing', 'Psychology', 'Social Work', 'Education', 'Public Health'],
    traits: ['Empathetic', 'Patient', 'Caring', 'Good Listener', 'Supportive'],
  },
  technical: {
    id: 'technical',
    name: 'The Problem Solver',
    description: 'You are analytical, logical, and love tackling complex challenges. You excel at finding innovative solutions and working with technology.',
    icon: '💻',
    color: '#60A5FA', // Blue
    careers: ['Software Developer', 'Engineer', 'Data Scientist', 'Architect', 'Researcher', 'Analyst'],
    majors: ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Data Science', 'Information Technology'],
    traits: ['Analytical', 'Logical', 'Detail-oriented', 'Innovative', 'Technical'],
  },
  creative: {
    id: 'creative',
    name: 'The Creator',
    description: 'You are imaginative, artistic, and express yourself through creative work. You see the world differently and bring unique perspectives to everything you do.',
    icon: '🎨',
    color: '#A5C89E', // Green
    careers: ['Graphic Designer', 'Artist', 'Writer', 'Filmmaker', 'Musician', 'Architect', 'UX Designer'],
    majors: ['Fine Arts', 'Graphic Design', 'Film Studies', 'Creative Writing', 'Architecture', 'Media Studies'],
    traits: ['Creative', 'Imaginative', 'Artistic', 'Expressive', 'Innovative'],
  },
  business: {
    id: 'business',
    name: 'The Leader',
    description: 'You are ambitious, strategic, and natural at leading others. You thrive in competitive environments and are driven to achieve success.',
    icon: '💼',
    color: '#FBBF24', // Yellow
    careers: ['Entrepreneur', 'Manager', 'Consultant', 'Financial Analyst', 'Marketing Director', 'Lawyer', 'CEO'],
    majors: ['Business Administration', 'Economics', 'Finance', 'Marketing', 'Law', 'Management'],
    traits: ['Leadership', 'Strategic', 'Ambitious', 'Decisive', 'Persuasive'],
  },
};

// Map option index to career profile
export const optionToProfile: Record<number, string> = {
  0: 'healthcare',
  1: 'technical',
  2: 'creative',
  3: 'business',
};

export function calculateCareerProfile(answers: Map<number, { selectedAnswer: number | null }>): {
  profile: CareerProfile;
  scores: Record<string, number>;
  percentages: Record<string, number>;
} {
  const scores: Record<string, number> = {
    healthcare: 0,
    technical: 0,
    creative: 0,
    business: 0,
  };

  // Count selections for each profile
  answers.forEach((answer) => {
    if (answer.selectedAnswer !== null) {
      const profileId = optionToProfile[answer.selectedAnswer];
      if (profileId) {
        scores[profileId]++;
      }
    }
  });

  // Calculate percentages
  const totalAnswers = answers.size;
  const percentages: Record<string, number> = {};
  Object.keys(scores).forEach((key) => {
    percentages[key] = totalAnswers > 0 ? Math.round((scores[key] / totalAnswers) * 100) : 0;
  });

  // Find dominant profile
  const dominantProfileId = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];

  return {
    profile: careerProfiles[dominantProfileId],
    scores,
    percentages,
  };
}
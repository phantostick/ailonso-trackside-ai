export interface TriviaQuestion {
  id: string;
  category: string;
  title: string;
  options: { [key: string]: string };
  correct: string;
  explanation?: string;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: "q1",
    category: "Car Setup",
    title: "What is the purpose of brake bias adjustment?",
    options: {
      a: "Change brake power",
      b: "Balance front/rear braking",
      c: "Reduce brake wear",
      d: "Increase top speed"
    },
    correct: "b",
    explanation: "Brake bias controls the distribution of braking force between front and rear wheels, crucial for optimal braking performance and car balance."
  },
  {
    id: "q2",
    category: "Tire Strategy",
    title: "Which tire compound typically offers the most grip for a single lap?",
    options: {
      a: "Hard",
      b: "Medium",
      c: "Soft",
      d: "Wet"
    },
    correct: "c",
    explanation: "Soft compounds provide maximum grip but wear faster. They're perfect for qualifying laps but require more pit stops in races."
  },
  {
    id: "q3",
    category: "Aerodynamics",
    title: "What effect does increased downforce have?",
    options: {
      a: "Higher top speed",
      b: "More cornering grip",
      c: "Less tire temperature",
      d: "Reduced braking"
    },
    correct: "b",
    explanation: "Downforce creates downward pressure on the car, increasing tire grip in corners. However, it also increases drag, reducing top speed on straights."
  },
  {
    id: "q4",
    category: "Racecraft",
    title: "What is the racing line primarily used for?",
    options: {
      a: "Maximizing cornering speed",
      b: "Making room for overtakes",
      c: "Saving fuel",
      d: "Avoiding penalties"
    },
    correct: "a",
    explanation: "The racing line is the fastest path through a corner, maximizing speed by using the full width of the track and maintaining optimal entry and exit points."
  },
  {
    id: "q5",
    category: "Strategy",
    title: "When is undercut strategy most effective?",
    options: {
      a: "Pitting earlier to gain time on fresher tires",
      b: "Delaying pitstop to save fuel",
      c: "To increase engine power",
      d: "To change brake bias"
    },
    correct: "a",
    explanation: "Undercut works by pitting before your rival. Fresh tires allow faster lap times, potentially gaining track position when they pit later."
  },
  {
    id: "q6",
    category: "Fernando Alonso",
    title: "How many Formula 1 World Championships has Fernando Alonso won?",
    options: {
      a: "1",
      b: "2",
      c: "3",
      d: "4"
    },
    correct: "b",
    explanation: "Fernando won back-to-back championships in 2005 and 2006 with Renault, becoming the youngest champion at the time!"
  },
  {
    id: "q7",
    category: "Technology",
    title: "What does ERS stand for in modern F1?",
    options: {
      a: "Electronic Racing System",
      b: "Energy Recovery System",
      c: "Engine Regulation Standard",
      d: "Emergency Response System"
    },
    correct: "b",
    explanation: "ERS harvests energy from braking and exhaust heat, providing extra power for overtaking and improved efficiency."
  },
  {
    id: "q8",
    category: "Rules & Regulations",
    title: "What is the penalty for exceeding track limits repeatedly?",
    options: {
      a: "Time penalty",
      b: "Grid penalty for next race",
      c: "Black flag",
      d: "Lap time deletion"
    },
    correct: "a",
    explanation: "Persistent track limits violations result in a 5-second time penalty. Individual lap times may also be deleted for advantage gained."
  },
  {
    id: "q9",
    category: "Circuits",
    title: "Which circuit is known as 'The Temple of Speed'?",
    options: {
      a: "Silverstone",
      b: "Monza",
      c: "Spa-Francorchamps",
      d: "Suzuka"
    },
    correct: "b",
    explanation: "Monza in Italy is famous for its high speeds and passionate tifosi. It's one of the fastest circuits on the calendar!"
  },
  {
    id: "q10",
    category: "Safety",
    title: "What revolutionary safety device was introduced in 2018?",
    options: {
      a: "HANS device",
      b: "Halo system",
      c: "Carbon fiber monocoque",
      d: "Fire suppression system"
    },
    correct: "b",
    explanation: "The Halo protects drivers' heads from debris and impacts. Initially controversial, it has already saved multiple lives in F1 and other series."
  }
];

export const getRandomQuestions = (count: number = 5): TriviaQuestion[] => {
  const shuffled = [...TRIVIA_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
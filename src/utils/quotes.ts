import { MotivationalQuote } from '../types';

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    tag: "Momentum",
  },
  {
    quote: "Focus is a muscle. The more you protect it, the sharper you execute.",
    author: "Deep Work Principle",
    tag: "Focus",
  },
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    tag: "Habits",
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    tag: "Initiative",
  },
  {
    quote: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    author: "John C. Maxwell",
    tag: "Consistency",
  },
  {
    quote: "Do the hard jobs first. The easy jobs will take care of themselves.",
    author: "Dale Carnegie",
    tag: "Priorities",
  },
  {
    quote: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.",
    author: "Leo Babauta",
    tag: "Clarity",
  },
  {
    quote: "It's not about having time. It's about making time.",
    author: "Productivity Creed",
    tag: "Mindset",
  },
  {
    quote: "Energy flows where attention goes. Choose your primary task deliberately.",
    author: "Michael Beckwith",
    tag: "Intent",
  },
  {
    quote: "Great acts are made up of small deeds.",
    author: "Lao Tzu",
    tag: "Progress",
  },
];

/**
 * Returns today's quote deterministically based on day of year,
 * so every user gets a fresh inspirational quote every calendar day!
 */
export function getDailyQuote(offset = 0): MotivationalQuote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = (dayOfYear + offset) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index < 0 ? index + MOTIVATIONAL_QUOTES.length : index];
}

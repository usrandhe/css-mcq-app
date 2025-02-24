import Link from "next/link";

/**
 * Home component renders a welcome page for the CSS MCQ Quiz.
 * 
 * Features:
 * - Displays a title welcoming users to the quiz.
 * - Includes a button that navigates to the quiz page.
 * 
 * Returns:
 * - JSX structure for rendering the welcome interface with navigation.
 */

export default function Home() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">Welcome to the CSS MCQ Quiz</h1>
      <Link href="/quiz">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Start Quiz
        </button>
      </Link>
    </div>
  );
}

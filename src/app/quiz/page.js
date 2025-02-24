"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import questionsData from "@/app/quiz/questions.json";
import "@/app/quiz/range.css";
/**
 * Quiz component renders a CSS multiple-choice quiz and allows users to select answers.
 * It also provides functionality to export questions and answers to an Excel file.
 *
 * Features:
 * - Displays a list of multiple-choice questions with corresponding options.
 * - Allows users to select answers for each question.
 * - Provides a button to export the questions and correct answers to an Excel file.
 *
 * State:
 * - `answers`: An object mapping question indices to the selected answer.
 *
 * Functions:
 * - `handleAnswer(index, answer)`: Updates the selected answer for a given question index.
 * - `exportToExcel()`: Exports the questions and correct answers to an Excel file.
 *
 * Returns:
 * - JSX structure for rendering the quiz interface and the export button.
 */

export default function Quiz() {
  const [numQuestions, setNumQuestions] = useState(10);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);

  // Filter questions based on selected number
  //const questions = questionsData.slice(0, numQuestions);
  //const questions = questionsData.questions.slice(0, numQuestions); // Access the "questions" array
  console.log(questions);
  const handleAnswer = (index, answer) => {
    setAnswers({ ...answers, [index]: answer });
  };
  useEffect(() => {
    const randomQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      const randomIndex = Math.floor(
        Math.random() * questionsData.questions.length
      );
      randomQuestions.push(questionsData.questions[randomIndex]);
    }
    setQuestions(randomQuestions);
  }, [numQuestions]);
  const exportToExcel = () => {
    const worksheetData = [
      [
        "Skill Name",
        "Difficulty Level",
        "Question",
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
        "Correct Answer",
      ],
      ...questions.map((q) => [
        q.skill,
        q.difficulty,
        q.question,
        ...q.options,
        q.correct,
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MCQs");
    XLSX.writeFile(wb, `CSS_MCQ_${numQuestions}.xlsx`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">CSS MCQ Quiz</h1>

      {/* Range Slider */}
      <div className="range-slider">
        <label className="block font-semibold mb-2">
          Select Number of Questions: {numQuestions}
        </label>
        <input
          type="range"
          min="10"
          max="40"
          step="10"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          className="w-full cursor-pointer"
        />

        <span className="range-label">10</span>
        <span className="range-label">20</span>
        <span className="range-label">30</span>
        <span className="range-label">40</span>
      </div>
      {/* Questions List */}
      <div className="questions-list mt-4 p-4 border rounded">
        <div className="overflow-y-auto h-96">
          {questions.map((q, index) => (
            <div key={index} className="mb-4 p-2 border rounded">
              <p className="font-semibold">{q.question}</p>
              {q.options.map((option, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleAnswer(index, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}{" "}
        </div>
      </div>
      {/* Download Button */}
      <button
        onClick={exportToExcel}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Download {numQuestions} Questions as Excel
      </button>
    </div>
  );
}

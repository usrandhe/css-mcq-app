"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import questionsData from "@/app/quiz/questions.json";
import "@/app/quiz/range.css";
import Image from "next/image";
/**
 * Quiz component renders a CSS,UI multiple-choice quiz and allows users to select answers.
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
  const [showFeedback, setShowFeedback] = useState({});
  const [selectedSkill,setSelectedSkill] = useState("All");
  const [selectedDifficulty,setSelectedDifficulty] = useState("Beginner");

  const skills = [
    "All",
    ...Array.from(new Set(questionsData.questions.map((q)=>
     
      q.skill
    ))),
  ];

  const difficulty = [
    ...Array.from(new Set(questionsData.questions.map((q)=>
      q.difficulty
    ))),
  ];


  const handleAnswer = (index, answer, event) => {
    //console.log(event.target.value);
    setAnswers({
      ...answers,
      [index]: { answer: answer, status: event === answer },
    });

    //console.log(answers);
    setShowFeedback({ ...showFeedback, [index]: true });

    //console.log("Feedback:", Object.keys({ ...answers, status: true }).length);
  };

  useEffect(() => {
    // Filter questions by selected skill
    let filteredQuestions = selectedSkill === 'All' ? questionsData.questions
    : questionsData.questions.filter((q) => q.skill === selectedSkill && q.difficulty === selectedDifficulty);

    const randomQuestions = [];
    const usedIndices = new Set();

    const maxQuestions = Math.min(numQuestions, filteredQuestions.length);

    while (randomQuestions.length < maxQuestions) {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        randomQuestions.push(filteredQuestions[randomIndex]);
      }
    }

    setQuestions(randomQuestions);
    setAnswers({});
    setShowFeedback({});
  }, [numQuestions,selectedSkill,selectedDifficulty]);

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
    XLSX.writeFile(wb, `${selectedSkill}_MCQ_${numQuestions}.xlsx`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">MCQ Quiz</h1>

{/* Skill Selection Dropdown */}
<div className="mb-4">
        <label className="block font-semibold mb-2">Select Skill:</label>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="border rounded px-2 py-1 w-full cursor-pointer"
        >
          {skills.map((skill, idx) => (
            <option key={idx} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>


{/* Difficulty Selection Dropdown */}
<div className="mb-4">
        <label className="block font-semibold mb-2">Select Difficulty:</label>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="border rounded px-2 py-1 w-full cursor-pointer"
        >
          {difficulty.map((skill, idx) => (
            <option key={idx} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>


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
          onChange={(e) => {
            setQuestions([]);
            setNumQuestions(parseInt(e.target.value));
            setAnswers({});

            setShowFeedback({});
          }}
          className="w-full cursor-pointer"
        />

        <span className="range-label">10</span>
        <span className="range-label">20</span>
        <span className="range-label">30</span>
        <span className="range-label">40</span>
      </div>

      <label className="block font-semibold mb-2 font-semibold mt-4">
        Correct Answers:{" "}
        {Object.values(answers).filter((item) => item.status === true).length}
      </label>
      {/* Questions List */}
      <div className="questions-list mt-4 p-4 border rounded">
        <div className="overflow-y-auto h-96">
          {questions.map((q, index) => (
            <div key={index} className="mb-4 p-2 border rounded">
              <p className="font-semibold">{`${index + 1}. ${q.question}`}</p>

              {q.options.map((option, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleAnswer(index, option, q.correct)}
                    checked={answers[index]?.answer === option}
                    className="mr-2"
                  />

                  <span className="option-container">
                    {option}
                    {showFeedback[index] &&
                      answers[index]?.answer === option && (
                        <span className="ml-2">
                          {option === q.correct ? (
                            <Image
                              src="/tick.svg"
                              alt="Correct"
                              width={20}
                              height={20}
                            />
                          ) : (
                            <Image
                              src="/cross.svg"
                              alt="Wrong"
                              width={20}
                              height={20}
                            />
                          )}
                        </span>
                      )}
                  </span>
                </label>
              ))}
            </div>
          ))}
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

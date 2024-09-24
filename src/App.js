import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file

const questionPool = [
  {
    question: "Berapa Jumlah dari 88+22? ",
    options: ["100", "90", "120", "110"],
    correctAnswer: 3,
  },
  {
    question: "Kapan Hari Kemerdekaan Indonesia?",
    options: ["7 Agustus", "18 Agustus", "17 Agustus", "27 Agustus"],
    correctAnswer: 2,
  },
  {
    question: "Ibukota USA",
    options: ["Washington", "New York", "Canada", "Washington DC"],
    correctAnswer: 3,
  },
  {
    question: "Siapa yang membuat Monalisa?",
    options: ["Leonardo da Vinci", "Leonardo Joseph", "Leonardo Dicprio", "Leonardo Edwin"],
    correctAnswer: 0,
  },
  {
    question: "Planet yang dijuluki Planet Merah",
    options: ["Bumi", "Mars", "Jupiter", "Saturnus"],
    correctAnswer: 1,
  },
  {
    question: "Kota Pelajar",
    options: ["Semarang", "Jakarta", "Surabaya", "Yogyakarta"],
    correctAnswer: 3,
  },
  {
    question: "Presiden Pertama Indonesia",
    options: ["Soeharto", "Soekarno","Soekarni", "Moh. Hatta"],
    correctAnswer: 1,
  },
  {
    question: "Negara terbesar di dunia",
    options: ["USA", "Indonesia", "Rusia", "Brazil"],
    correctAnswer: 2,
  },
  {
    question: "Warna Bendera Indonesia",
    options: ["Putih Biru", "Putih Merah", "Merah Putih Biru", "Merah Putih"],
    correctAnswer: 3,
  },
  {
    question: "Makna Bhineka Tunggal Ika",
    options: ["one for all", "all for one", "Berbeda-beda tetapi tetap satu", "Bersatu kita teguh bercerai kita runtuh"],
    correctAnswer: 2,
  },
  {
    question: "Organ tubuh untuk memompa darah",
    options: ["Jantung", "paru-paru", "tenggorokan", "Sel darah"],
    correctAnswer: 0,
  },
  {
    question: "100-7+30",
    options: ["133", "123", "113", "73"],
    correctAnswer: 1,
  },
];

// Function to shuffle and select random questions
function getRandomQuestions(pool, num) {
  const shuffled = pool.sort(() => 0.5 - Math.random()); // Shuffle the pool randomly
  return shuffled.slice(0, num); // Return the first 'num' questions
}

function Home({ startQuiz, highScores }) {
  return (
    <div className="home-page">
      <h1 className="title">QUIZZZ</h1>
      <button className="start-button" onClick={startQuiz}>
        START
      </button>

      {highScores.length > 0 && (
        <div className="high-scores">
          <h2>Highest Scores</h2>
          <ul>
            {highScores.map((score, index) => (
              <li key={index}>{score}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showHome, setShowHome] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds for each question

  // Get high scores from local storage
  const getHighScores = () => JSON.parse(localStorage.getItem('highScores')) || [];

  // Get 10 random questions from the question pool on component mount
  useEffect(() => {
    setQuizQuestions(getRandomQuestions(questionPool, 10)); // Select 10 random questions
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      handleAnswerOptionClick(-1); // If time runs out, auto move to next question
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Clear timer on cleanup
  }, [timeLeft]);

  // Reset the timer every time the current question changes
  useEffect(() => {
    setTimeLeft(10); // Reset to 30 seconds for each new question
  }, [currentQuestion]);

  const handleAnswerOptionClick = (index) => {
    if (index === quizQuestions[currentQuestion]?.correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  // Function to reset the quiz and start again
  const startQuiz = () => {
    setShowHome(false); // Hide the home page
    setQuizQuestions(getRandomQuestions(questionPool, 10)); // Get new random questions
    setCurrentQuestion(0); // Reset current question to the first one
    setScore(0); // Reset score
    setShowScore(false); // Ensure score section isn't shown
  };

  // Function to return to home and reset quiz
  const resetQuiz = () => {
    setShowHome(true);
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setQuizQuestions(getRandomQuestions(questionPool, 10));
  };

  // Save score to local storage if it's a high score
  useEffect(() => {
    if (showScore) {
      const savedHighScores = getHighScores();
      const newHighScores = [...savedHighScores, score].sort((a, b) => b - a).slice(0, 5); // Keep top 5 scores
      localStorage.setItem('highScores', JSON.stringify(newHighScores));
    }
  }, [showScore, score]);

  return (
    <div className="quiz-app">
      {showHome ? (
        <Home startQuiz={startQuiz} highScores={getHighScores()} />
      ) : showScore ? (
        <div className="score-section">
          {score === 10 ? (
            <p>Congratulations, you scored a perfect 10 out of 10!</p>
          ) : (
            <p>Your score is {score} out of 10.</p>
          )}
          <button onClick={resetQuiz} className="start-again-button">Play Again?</button>
        </div>
      ) : quizQuestions.length > 0 ? (
        <>
          <div className="question-section">
            <button className="reset-button" onClick={resetQuiz}>
              Reset Quiz
            </button>
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{quizQuestions.length}
            </div>
            <div className="question-text">
              {quizQuestions[currentQuestion].question}
            </div>
            <div className="timer">Time left: {timeLeft} seconds</div>
          </div>
          <div className="answer-section">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerOptionClick(index)}>
                {String.fromCharCode(97 + index)}. {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>Loading...</div> // Show loading message while questions are being prepared
      )}
    </div>
  );
}

export default App;



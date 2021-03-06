import React, { useState, useEffect } from 'react';
import Result from './Result';
import Question from './Question';
import { useParams } from 'react-router';
import { retrieveQuizData } from './retrieveQuizData';
import { Button, Form, Container } from 'react-bootstrap';

const Quiz = () => {
  const { quizName } = useParams();
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [shouldDisplayScore, setShouldDisplayScore] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const quizData = retrieveQuizData(quizName);
    setQuestions(quizData);
  }, [quizName]);

  const handleAnswerSelect = e => {
    const selectedAnswer = { [e.target.name]: Number(e.target.value) };
    setUserAnswers({ ...userAnswers, ...selectedAnswer });
  };

  const checkUserAnswers = e => {
    e.preventDefault();
    const totalScore = questions.reduce((point, question) => {
      const selectedAnswerId = userAnswers[question.id];
      const selectedAnswerObj = question.answers.find(
        answer => answer.id === selectedAnswerId,
      );
      return selectedAnswerObj.isCorrect ? point + 1 : point;
    }, 0);
    setScore(totalScore);
    setShouldDisplayScore(true);
  };

  const quizDisplayText = {
    html: 'HTML',
    css: 'CSS',
    js: 'JavaScript',
  };

  const question = questions[currentQuestionIndex];

  return questions.length === 0 ? (
    <p className="text-center my-5">
      Sorry, there are no questions to display.
    </p>
  ) : (
    <Container>
      <h1>{quizDisplayText[quizName]} quiz</h1>
      {shouldDisplayScore ? (
        <Result
          score={score}
          quizName={quizName}
          questions={questions}
          userAnswers={userAnswers}
          numOfQuestions={questions.length}
        />
      ) : (
        <Form onSubmit={checkUserAnswers}>
          <Question
            key={question.id}
            question={question}
            handleAnswerSelect={handleAnswerSelect}
            selectedAnswer={userAnswers[question.id]}
          />
          <Button
            className="mr-2 mb-4"
            variant="secondary"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >
            Previous
          </Button>
          <Button
            className="mr-2 mb-4"
            variant="primary"
            disabled={currentQuestionIndex === questions.length - 1}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          >
            Next
          </Button>
          {Object.keys(userAnswers).length === questions.length && (
            <Button className="mb-4" variant="primary" type="submit">
              Submit
            </Button>
          )}
        </Form>
      )}
    </Container>
  );
};

export default Quiz;

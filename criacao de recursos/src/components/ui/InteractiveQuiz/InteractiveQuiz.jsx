import React, { useState, useMemo } from 'react';

/**
 * ProgressBar: Componente visual para a barra de progresso do quiz.
 */
const ProgressBar = ({ current, total, progressColor }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: progressColor }}
      ></div>
    </div>
  );
};

/**
 * Question: Renderiza a pergunta atual e as opções de múltipla escolha.
 */
const Question = ({ question, onAnswer, selectedAnswer, correctAnswer, disabled }) => {
  const getOptionClass = (option) => {
    if (!selectedAnswer) {
      return 'hover:bg-gray-100'; // Padrão
    }
    if (option === correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-800'; // Correta
    }
    if (option === selectedAnswer && option !== correctAnswer) {
      return 'bg-red-100 border-red-500 text-red-800'; // Incorreta
    }
    return 'text-gray-500'; // Opção não selecionada após a resposta
  };

  return (
    <div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 text-center">{question.text}</h3>
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            className={`w-full text-left p-4 border-2 rounded-lg transition-colors duration-300 ${getOptionClass(option)} ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * ResultsScreen: Tela final que exibe o resultado do quiz.
 */
const ResultsScreen = ({ score, total, onRestart, buttonBgColor, buttonTextColor }) => {
  const percentage = total > 0 ? ((score / total) * 100).toFixed(0) : 0;
  const message = percentage >= 70 ? 'Excelente trabalho!' : 'Continue estudando e tente novamente!';

  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Quiz Finalizado!</h2>
      <p className="text-lg text-gray-600 mb-4">{message}</p>
      <div className="my-6">
        <p className="text-4xl font-bold" style={{ color: buttonBgColor }}>
          {score} / {total}
        </p>
        <p className="text-gray-500">acertos</p>
      </div>
      <button
        onClick={onRestart}
        style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
        className="w-full md:w-auto px-8 py-3 font-bold rounded-lg transition-transform transform hover:scale-105"
      >
        TENTAR NOVAMENTE
      </button>
    </div>
  );
};

/**
 * InteractiveQuiz: Componente principal que gerencia o estado e a lógica do quiz.
 *
 * @param {object[]} questions - Array de objetos de perguntas.
 * @param {string} [progressColor='#2563EB'] - Cor da barra de progresso.
 * @param {string} [buttonBgColor='#EFF6FF'] - Cor de fundo dos botões de navegação.
 * @param {string} [buttonTextColor='#0C1E33'] - Cor do texto dos botões de navegação.
 */
const InteractiveQuiz = ({
  questions = [],
  progressColor = '#2563EB', // Azul, inspirado no tema padrão
  buttonBgColor = '#EFF6FF',
  buttonTextColor = '#0C1E33',
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: 'selectedOption' }
  const [showResults, setShowResults] = useState(false);

  const score = useMemo(() => {
    return questions.reduce((acc, question, index) => {
      if (answers[index] === question.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [answers, questions]);

  const handleAnswer = (option) => {
    if (answers[currentQuestionIndex] !== undefined) return; // Já respondeu

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  if (questions.length === 0) {
    return <p>Nenhuma pergunta disponível para este quiz.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const isAnswered = selectedAnswer !== undefined;

  if (showResults) {
    return (
      <ResultsScreen
        score={score}
        total={questions.length}
        onRestart={handleRestart}
        buttonBgColor={progressColor} // Reutiliza a cor de progresso para destaque
        buttonTextColor="#FFFFFF"
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-md">
      {/* Cabeçalho com Progresso e Pontuação */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium text-gray-600">
          Questão {currentQuestionIndex + 1} de {questions.length}
        </p>
        <p className="text-sm font-bold" style={{ color: progressColor }}>
          Pontuação: {score}
        </p>
      </div>

      {/* Barra de Progresso */}
      <ProgressBar
        current={currentQuestionIndex + (isAnswered ? 1 : 0)}
        total={questions.length}
        progressColor={progressColor}
      />

      {/* Conteúdo da Pergunta */}
      <div className="my-8">
        <Question
          question={currentQuestion}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
          correctAnswer={currentQuestion.correctAnswer}
          disabled={isAnswered}
        />
      </div>

      {/* Feedback e Navegação */}
      <div className="mt-6 text-center">
        {isAnswered && (
          <div className="mb-4 h-16 flex flex-col justify-center items-center">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <p className="font-bold text-green-600">Resposta Correta!</p>
            ) : (
              <>
                <p className="font-bold text-red-600">Resposta Incorreta.</p>
                <p className="text-sm text-gray-600">
                  A resposta certa é: "{currentQuestion.correctAnswer}"
                </p>
              </>
            )}
          </div>
        )}

        {isAnswered && (
          <button
            onClick={handleNext}
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            className="w-full md:w-auto px-10 py-3 font-bold rounded-lg transition-transform transform hover:scale-105"
          >
            {currentQuestionIndex < questions.length - 1 ? 'PRÓXIMA PERGUNTA' : 'VER RESULTADO'}
          </button>
        )}

        {/* Espaçador para manter a altura do layout consistente antes da resposta */}
        {!isAnswered && <div className="h-16 mb-4"></div>}
        {!isAnswered && <div className="h-[52px]"></div>}
      </div>
    </div>
  );
};

export default InteractiveQuiz;
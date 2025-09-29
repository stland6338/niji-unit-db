'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { UnitData, QuizQuestion } from '@/types/unit';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUnits } from '@/lib/data';

function generateQuizQuestions(units: UnitData[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  for (const unit of units) {
    // Name to members question
    if (unit.members.length >= 2) {
      const wrongUnits = units.filter(u => u.id !== unit.id && u.memberCount === unit.memberCount);
      if (wrongUnits.length >= 3) {
        const wrongOptions = wrongUnits.slice(0, 3).map(u => 
          u.members.map(m => m.name).join('、')
        );
        const correctAnswer = unit.members.map(m => m.name).join('、');
        
        questions.push({
          id: `${unit.id}-name-to-members`,
          type: 'name-to-members',
          question: `「${unit.name}」のメンバーは誰ですか？`,
          options: [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5),
          correctAnswer,
          explanation: unit.description,
          unit,
        });
      }
    }

    // Members to name question
    const otherUnits = units.filter(u => u.id !== unit.id);
    if (otherUnits.length >= 3) {
      const wrongOptions = otherUnits.slice(0, 3).map(u => u.name);
      const memberNames = unit.members.map(m => m.name).join('、');
      
      questions.push({
        id: `${unit.id}-members-to-name`,
        type: 'members-to-name',
        question: `${memberNames}で構成されるユニットの名前は？`,
        options: [unit.name, ...wrongOptions].sort(() => Math.random() - 0.5),
        correctAnswer: unit.name,
        explanation: unit.description,
        unit,
      });
    }

    // Member count question
    const differentCountUnits = units.filter(u => u.memberCount !== unit.memberCount);
    if (differentCountUnits.length >= 3) {
      const wrongCounts = differentCountUnits.slice(0, 3).map(u => `${u.memberCount}人`);
      const correctAnswer = `${unit.memberCount}人`;
      
      questions.push({
        id: `${unit.id}-member-count`,
        type: 'member-count',
        question: `「${unit.name}」のメンバー数は？`,
        options: [correctAnswer, ...wrongCounts].sort(() => Math.random() - 0.5),
        correctAnswer,
        explanation: unit.description,
        unit,
      });
    }
  }

  return questions.sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);

  const allUnits = useMemo(() => getUnits(), []);

  useEffect(() => {
    const generatedQuestions = generateQuizQuestions(allUnits);
    setQuestions(generatedQuestions.slice(0, 10)); // 10問に制限
  }, [allUnits]);

  const currentQuestion = questions[currentQuestionIndex];

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions([]);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // Quiz completed
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            にじさんじユニットクイズ
          </h1>
          <p className="text-gray-600 mb-8">
            にじさんじのコラボユニットに関するクイズです。<br />
            全{questions.length}問の問題にチャレンジしてみましょう！
          </p>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>クイズの種類</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">ユニット名 → メンバー</Badge>
                <span className="text-sm text-gray-600">ユニット名からメンバーを当てる</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">メンバー → ユニット名</Badge>
                <span className="text-sm text-gray-600">メンバーからユニット名を当てる</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">メンバー数</Badge>
                <span className="text-sm text-gray-600">ユニットのメンバー数を当てる</span>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Button size="lg" onClick={startQuiz} disabled={questions.length === 0}>
              クイズを開始する
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const getGrade = (percentage: number) => {
      if (percentage >= 90) return { text: 'S', color: 'bg-yellow-500' };
      if (percentage >= 80) return { text: 'A', color: 'bg-green-500' };
      if (percentage >= 70) return { text: 'B', color: 'bg-blue-500' };
      if (percentage >= 60) return { text: 'C', color: 'bg-orange-500' };
      return { text: 'D', color: 'bg-red-500' };
    };

    const grade = getGrade(percentage);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            クイズ結果
          </h1>

          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`w-20 h-20 ${grade.color} text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4`}>
                  {grade.text}
                </div>
                <p className="text-2xl font-bold mb-2">
                  {score} / {questions.length}問正解
                </p>
                <p className="text-lg text-gray-600">
                  正答率: {percentage}%
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button onClick={resetQuiz} size="lg">
              もう一度挑戦する
            </Button>
            <div>
              <Link href="/">
                <Button variant="outline">
                  ユニット一覧に戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            クイズ {currentQuestionIndex + 1} / {questions.length}
          </h1>
          <Badge variant="secondary">
            正解数: {score}
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== ''}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedAnswer === ''
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    : selectedAnswer === option
                    ? option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : option === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${
                selectedAnswer === currentQuestion.correctAnswer
                  ? 'bg-green-100 border border-green-200'
                  : 'bg-red-100 border border-red-200'
              }`}>
                <p className={`font-medium ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? '正解！' : '不正解'}
                </p>
                {currentQuestion.explanation && (
                  <p className="text-gray-700 mt-2">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>

              <div className="mt-4 text-center">
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < questions.length - 1 ? '次の問題' : '結果を見る'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
'use strict'

const API_URL = 'https://opentdb.com/api.php?amount=10';

class Quiz {
  constructor(data) {
    this.quizData = data.results;
    this.quizCount = 0;
  }
  //各々データを取得
  getQuizCategory(quizNum) {
    return this.quizData[quizNum - 1].category;
  }

  getQuizDiffculty(quizNum) {
    return this.quizData[quizNum - 1].diffculty;
  }

  getQuizQuestion(quizNum) {
    return this.quizData[quizNum - 1].question;
  }

  getCorrectAnswer(quizNum) {
    return this.quizData[quizNum - 1].correct_answer;
  }

  getInCorrectAnswers(quizNum) {
    return this.quizData[quizNum - 1].incorrect_answers;
  }
  //クイズ数を取得
  getQuizLength() {
    return this.quizData.length;
  }
  //answerと一致したものみカウント
  getCountAnswer(quizNum, answer) {
    const corrctAnswer = this.quizData[quizNum - 1].correct_answer;
    if (answer === corrctAnswer) {
      return this.quizCount++;
    }
  }
  //カウント数を取得
  getCountNumber() {
    return this.quizCount;
  }
}

//表示場所を取得
const titleElement = document.getElementById('title');
const genreElement = document.getElementById('genre');
const difficultyElement = document.getElementById('difficulty');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const startButton = document.getElementById('start');

startButton.addEventListener('click', () => {
  startButton.hidden = true;
  getQuizData(1);
})

//APIを取得しインスタンスを作成する
const getQuizData = async (quizNum) => {
  titleElement.innerHTML = '取得中';
  questionElement.innerHTML = '少々お待ち下さい';

  const res = await fetch(API_URL);
  const api_Data = await res.json();
  const quizInstance = new Quiz(api_Data);

  nextQuiz(quizInstance, quizNum);
};

//次の問題か終了かを判定
const nextQuiz = (quizInstance, quizNum) => {
  while (answerElement.firstChild) {
    answerElement.removeChild(answerElement.firstChild);
  }
  if (quizNum <= quizInstance.getQuizLength()) {
    makeQuiz(quizInstance, quizNum);
  } else {
    endQuiz(quizInstance);
  };
};

//問題を作成
const makeQuiz = (quizInstance, quizNum) => {
  //問題を表示
  titleElement.innerHTML = `問題${quizNum}`;
  genreElement.innerHTML = `[ジャンル] ${quizInstance.getQuizCategory(quizNum)}`;
  difficultyElement.innerHTML = `[難易度] ${quizInstance.getQuizDiffculty(quizNum)}`;
  questionElement.innerHTML = quizInstance.getQuizQuestion(quizNum);
  //answerボタンを作成
  const answers = quizAnswer(quizInstance, quizNum);

  answers.forEach((answer) => {
    const answerList = document.createElement('li');
    answerElement.appendChild(answerList);

    const answerButton = document.createElement('button');
    answerButton.innerHTML = answer;
    answerList.appendChild(answerButton);

    answerButton.addEventListener('click', () => {
      quizInstance.getCountAnswer(quizNum, answer);
      quizNum++;
      nextQuiz(quizInstance, quizNum);
    });
  });
};
//クイズ終了
const endQuiz = (quizInstance) => {
  titleElement.innerHTML = `あなたの正答数は${quizInstance.getCountNumber()}です`;
  genreElement.innerHTML = '';
  difficultyElement.innerHTML = '';
  questionElement.innerHTML = '再度チャレンジしたい場合を下をクリック!!';

  const restartButton = document.createElement('button');
  restartButton.innerHTML = 'ホームに戻る'
  answerElement.appendChild(restartButton);
  restartButton.addEventListener('click', () => {
    location.reload();
  });
};

//answer配列を作成
const quizAnswer = (quizInstance, quizNum) => {
  const answers = [
    quizInstance.getCorrectAnswer(quizNum),
    ...quizInstance.getInCorrectAnswers(quizNum),
  ];
  return quizShuffle(answers);
};

//配列をシャッフル
const quizShuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
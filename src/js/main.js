import '/src/css/style.css'

const board = document.querySelector('.board');
const digits = document.querySelector('.digits');
const mistakesCounter = document.querySelector('.mistakes');

// переменная выбранного числа
let val = 0;

let mistakes = 0;

async function getData() {
  const id = Math.floor(Math.random() * 3);

  await fetch('./src/sudokus.json')
    .then(response => response.json())
    .then(json => {
      localStorage.setItem('question', JSON.stringify(json[id].question));
    });

  await fetch('./src/sudokus.json')
    .then(response => response.json())
    .then(json => {
      localStorage.setItem('answer', JSON.stringify(json[id].answer));
    });
}

function drawTheDigits() {
  // отрисовка цифр для выбора
  for (let i = 0; i < 9; i++) {
    const digit = document.createElement('div');
    digit.classList.add('digit');
    digit.innerText = i + 1;
    digit.addEventListener('click', handleDigit);
    digits.append(digit);
  }
}

async function drawTheBoard() {
  await getData();

  const question = JSON.parse(localStorage.getItem('question'));

  // отрисовка поля с условием
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      const span = document.createElement('span');

      if (question[i][j] === '-') {
        cell.id = `${i}${j}`;
        cell.append(span);
      } else {
        span.innerText = question[i][j];
        span.classList.add('question');
        cell.id = `${i}${j}`;
        cell.append(span);
      }

      switch (true) {
        case +cell.id < 30:
          cell.classList.add('block-1');
          break;
        case +cell.id > 28 && +cell.id < 60:
          cell.classList.add('block-2');
          break;
        case +cell.id > 58:
          cell.classList.add('block-3');
          break;
      }

      cell.addEventListener('click', handleCell);
      board.append(cell);
    }
  }
}

drawTheDigits();
drawTheBoard();

function handleDigit(e) {
  val = e.currentTarget.innerText;
}

function handleCell(e) {
  if (val === 0 || e.target.firstChild.className === 'question' || e.target.firstChild.className === 'true') {
    return;
  }

  const span = e.target.firstChild;

  if (validation(e)) {
    console.log('validated true');
    span.classList.remove('false');
    span.classList.add('true');
    span.innerText = val;
  } else {
    console.log('validated false');
    span.classList.add('false');
    span.innerText = val;
    mistakes++;
    mistakesCounter.innerText = mistakes;
  }

  val = 0;
}

function validation(e) {
  const cellQuestion = e.target.id;

  const answer = JSON.parse(localStorage.getItem('answer'));

  console.log(cellQuestion);

  const trueAnswer = answer[cellQuestion[0]][cellQuestion[1]];

  console.log(trueAnswer);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (val === trueAnswer) {
        console.log(true);
        return true;
      } else {
        console.log(false);
        return false;
      }
    }
  }
}
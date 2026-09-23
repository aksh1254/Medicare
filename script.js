const display = document.querySelector('#display');
const keys = document.querySelector('.keys');
let expression = '';
let justCalculated = false;

function updateDisplay(value = expression || '0') {
  display.value = value;
}

function appendValue(value) {
  if (justCalculated && /[0-9.]/.test(value)) {
    expression = '';
    justCalculated = false;
  }

  if (value === '.') {
    const currentNumber = expression.split(/[+−×÷%]/).pop();
    if (currentNumber.includes('.')) return;
    if (!currentNumber || /[+−×÷]$/.test(expression)) expression += '0';
  }

  if (/\d/.test(value) && expression.endsWith('%')) return;
  expression += value;
  updateDisplay();
}

function clearCalculator() {
  expression = '';
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression || /[+−×÷.]$/.test(expression)) return;

  try {
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    if (!/^[0-9+*/%.()\-\s]+$/.test(sanitized)) throw new Error('Invalid expression');
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (!Number.isFinite(result)) throw new Error('Invalid result');

    expression = String(Number(result.toFixed(10)));
    justCalculated = true;
    updateDisplay();
  } catch {
    expression = '';
    display.value = 'Error';
  }
}

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.action === 'clear') clearCalculator();
  else if (button.dataset.action === 'delete') deleteLast();
  else if (button.dataset.action === 'calculate') calculate();
  else appendValue(button.dataset.value);
});

document.addEventListener('keydown', (event) => {
  const keyMap = { '*': '×', '/': '÷', '-': '−' };
  if (/\d|[.+%]/.test(event.key) || keyMap[event.key]) {
    event.preventDefault();
    appendValue(keyMap[event.key] || event.key);
  } else if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculate();
  } else if (event.key === 'Backspace') {
    deleteLast();
  } else if (event.key === 'Escape') {
    clearCalculator();
  }
});

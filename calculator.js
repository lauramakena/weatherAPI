let currentInput = '';
let history = [];
const resultDisplay = document.getElementById('result');
const historyList = document.getElementById('historyList');
const historyPanel = document.getElementById('historyPanel');
const themeToggle = document.getElementById('themeToggle');
const historyToggle = document.getElementById('historyToggle');

// Append digits/operators
function append(value) {
  if (value === '.' && currentInput.includes('.')) return;
  currentInput += value;
  resultDisplay.value = currentInput;
}

// Clear display
function clearDisplay() {
  currentInput = '';
  resultDisplay.value = '';
}

// Backspace
function backspace() {
  currentInput = currentInput.slice(0, -1);
  resultDisplay.value = currentInput;
}

// Calculate result
function calculate() {
  try {
    let expression = currentInput.replace(/÷/g, '/').replace(/×/g, '*');
    let result = Function('return ' + expression)();
    if (!isFinite(result)) throw 'Error';
    addToHistory(`${currentInput} = ${result}`);
    resultDisplay.value = Number(result).toLocaleString();
    currentInput = result.toString();
  } catch {
    resultDisplay.value = 'Error';
  }
}

// Scientific functions
function sqrt() {
  if (currentInput === '') return;
  let num = parseFloat(currentInput);
  if (num < 0) {
    resultDisplay.value = 'Error';
    return;
  }
  resultDisplay.value = Math.sqrt(num);
  currentInput = resultDisplay.value;
}

function square() { mathFunc(x => x * x); }
function sin() { mathFunc(x => Math.sin(x * Math.PI / 180)); }
function cos() { mathFunc(x => Math.cos(x * Math.PI / 180)); }
function tan() { mathFunc(x => Math.tan(x * Math.PI / 180)); }


function mathFunc(fn) {
  try {
    let num = parseFloat(currentInput);
    let result = fn(num);
    addToHistory(`${fn.name}(${num}) = ${result}`);
    resultDisplay.value = result;
    currentInput = result.toString();
  } catch {
    resultDisplay.value = 'Error';
  }
}

// Add to history
function addToHistory(entry) {
  history.push(entry);
  let li = document.createElement('li');
  li.textContent = entry;
  historyList.prepend(li);
}

// Toggle dark/light mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Toggle history panel
historyToggle.addEventListener('click', () => {
  historyPanel.classList.toggle('show');
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!isNaN(e.key) || ['+', '-', '*', '/', '.'].includes(e.key)) append(e.key);
  if (e.key === 'Enter') calculate();
  if (e.key === 'Backspace') backspace();
  if (e.key === 'Escape') clearDisplay();
});

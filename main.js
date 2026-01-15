// Theme Management
let isDarkMode = true;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('calculator-theme');
    if (savedTheme === 'light') {
        setLightTheme();
    } else {
        setDarkTheme();
    }
}

function setLightTheme() {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeIcon.className = 'fas fa-sun';
    isDarkMode = false;
    localStorage.setItem('calculator-theme', 'light');
}

function setDarkTheme() {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeIcon.className = 'fas fa-moon';
    isDarkMode = true;
    localStorage.setItem('calculator-theme', 'dark');
}

function toggleTheme() {
    if (isDarkMode) {
        setLightTheme();
    } else {
        setDarkTheme();
    }
}

// Calculator State
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

// DOM Elements
const currentOperandElement = document.getElementById('current-operand');
const previousOperandElement = document.getElementById('previous-operand');

// Operation symbols mapping
const operationSymbols = {
    'add': '+',
    'subtract': '−',
    'multiply': '×',
    'divide': '÷'
};

// Update the display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    
    if (operation !== null) {
        previousOperandElement.textContent = `${previousOperand} ${operationSymbols[operation]}`;
    } else {
        previousOperandElement.textContent = previousOperand;
    }
}

// Clear the calculator
function clearCalculator() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
    updateDisplay();
}

// Delete the last character
function deleteLastCharacter() {
    if (currentOperand.length > 1) {
        currentOperand = currentOperand.slice(0, -1);
    } else {
        currentOperand = '0';
    }
    updateDisplay();
}

// Append a number to the current operand
function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    
    if (currentOperand === '0') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

// Append a decimal point
function appendDecimal() {
    if (shouldResetScreen) {
        currentOperand = '0';
        shouldResetScreen = false;
    }
    
    if (!currentOperand.includes('.')) {
        currentOperand += '.';
    }
    updateDisplay();
}

// Choose an operation
function chooseOperation(op) {
    if (currentOperand === '0' && previousOperand === '') return;
    
    // If there's already an operation pending, calculate it first
    if (operation !== null && !shouldResetScreen) {
        compute();
    }
    
    if (op === 'equals') {
        if (operation !== null) {
            compute();
        }
        return;
    }
    
    // Set the operation
    operation = op;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

// Perform calculation
function compute() {
    let prev = parseFloat(previousOperand);
    let current = parseFloat(currentOperand);
    let computation;
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch(operation) {
        case 'add':
            computation = prev + current;
            break;
        case 'subtract':
            computation = prev - current;
            break;
        case 'multiply':
            computation = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                computation = 'Error';
            } else {
                computation = prev / current;
            }
            break;
        default:
            return;
    }
    
    // Handle special cases
    if (computation === 'Error') {
        currentOperand = 'Error';
        previousOperand = '';
        operation = null;
    } else {
        // Round to avoid floating point precision issues
        computation = Math.round(computation * 100000000) / 100000000;
        currentOperand = computation.toString();
        previousOperand = '';
        operation = null;
    }
    
    shouldResetScreen = true;
    updateDisplay();
}

// Event Listeners

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Handle button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        // Number buttons
        if (button.hasAttribute('data-number')) {
            const number = button.getAttribute('data-number');
            if (number === '.') {
                appendDecimal();
            } else {
                appendNumber(number);
            }
        }
        
        // Action buttons
        if (button.hasAttribute('data-action')) {
            const action = button.getAttribute('data-action');
            
            // Handle different actions
            switch(action) {
                case 'clear':
                    clearCalculator();
                    break;
                case 'delete':
                    deleteLastCharacter();
                    break;
                case 'equals':
                    if (operation !== null) {
                        compute();
                    }
                    break;
                default:
                    chooseOperation(action);
            }
        }
    });
});

// Keyboard support
document.addEventListener('keydown', event => {
    // Prevent default for keys we handle
    if (event.key.match(/[0-9\.\+\-\*\/=]|Enter|Escape|Backspace/)) {
        event.preventDefault();
    }
    
    // Number keys
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    }
    
    // Decimal point
    if (event.key === '.') {
        appendDecimal();
    }
    
    // Operations
    if (event.key === '+') {
        chooseOperation('add');
    }
    
    if (event.key === '-') {
        chooseOperation('subtract');
    }
    
    if (event.key === '*') {
        chooseOperation('multiply');
    }
    
    if (event.key === '/') {
        chooseOperation('divide');
    }
    
    // Enter or = for equals
    if (event.key === 'Enter' || event.key === '=') {
        if (operation !== null) {
            compute();
        }
    }
    
    // Escape for clear
    if (event.key === 'Escape') {
        clearCalculator();
    }
    
    // Backspace for delete
    if (event.key === 'Backspace') {
        deleteLastCharacter();
    }
});

// Initialize
function init() {
    initTheme();
    updateDisplay();
}

// Start the calculator
init();
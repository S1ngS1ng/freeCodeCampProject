var $ = {
    // TODO: remove?
    all: function (selector) {
        return document.querySelectorAll(selector);
    },
    one: function (selector) {
        return document.querySelector(selector);
    }
};

// Use object instead of variable
// When passing primitive value to function, won't change it outside
var _ref = {
    operators: {
        '=': 1,
        '*': 2,
        '/': 2,
        '+': 3,
        '-': 3
    },
    numStack: [],
    operatorStack: [],
    temp: '',
    expression: ''
};

// Define all operators, precedence indicated by index
$.one('#wrapper').addEventListener('click', function (event) {
    var e = event || window.event;
    if (e.target.className === 'button') {
        handleClick(e.target.innerHTML, _ref);
        // TODO: Update template here
    }
});

// Global listener for keyboard input
window.addEventListener('keydown', function (event) {
    var e = event || window.event;
    if (e.key !== 'Shift') {
        // TODO: Mark browser support IE >= 9 Chrome >= 51 Firefox >= 23
        handleClick(e.key, _ref);
    }
});

// function that update _this object
function handleClick(value, _this) {
    if (!isNaN(value)) {
        // Case Number
        _this.temp += value;
        updateScreen({ result: _this.temp });
    } else if (value === '.') {
        // Case .
        _this.temp = _this.temp || '0' + '.';
        updateScreen({ result: _this.temp });
    } else if (value === 'Backspace') {
        _this.temp = '';
        updateScreen({ result: 0 });
    } else if (value === 'Escape') {
        _this.numStack = [];
        _this.operatorStack = [];
        _this.temp = '';
        updateScreen({
            result: 0,
            expression: '',
            operator: ''
        });
        updateScreen('result', 0);
        updateScreen('expression', '');
        updateScreen('operator', '');
    } else if (value === 'Enter' || value === '=') {
        // Case =
        _this.expression = calculateAll(_this);
        updateScreen({
            result: _this.temp,
            expression: _this.expression,
            operator: '='
        });
    } else if (_this.operators[value]) {
        // Case + - * /
        // Update numStack
        _this.numStack.push(+checkDot(_this.temp));
        updateScreen({ operator: value });

        if (_this.operators[value] > _this.operators[_this.operatorStack[_this.operatorStack.length - 1]]) {
            var tempResult = calculate(_this.numStack.pop(), _this.operatorStack.pop(), _this.numStack.pop());
            _this.numStack.push(tempResult);
            updateScreen({ result: tempResult });
        }
        _this.operatorStack.push(value);
        _this.temp = '';
    }
}

function checkDot(numStr) {
    if (/\.$/.test(numStr)) {
        return numStr + '0';
    }
    return numStr;
}

function calculateAll(ref) {
    // Set default expression to temp
    var expression = ref.temp;
    while (ref.numStack.length > 0) {
        var num = ref.numStack.pop();
        var operator = ref.operatorStack.pop();
        // Prepend num and operator to expression
        expression = [num, operator, ''].join(' ') + expression;
        ref.temp = calculate(num, operator, +ref.temp);
    }
    return expression;
}

function calculate(num1, operator, num2) {
    return new Function('return ' + num1 + operator + num2)();
}

function updateScreen(valueObj) {
    for (var key in valueObj) {
        $.one('#screen-' + key).innerHTML = valueObj[key];
    }
}

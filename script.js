document.addEventListener('DOMContentLoaded', () => {
    const convertBtn = document.getElementById('convertBtn');
    const solveBtn = document.getElementById('solveBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const conversionResult = document.getElementById('conversionResult');
    const evaluationResult = document.getElementById('evaluationResult');
    const stepsTableBody = document.querySelector('#stepsTable tbody');
    const evalStepsTableBody = document.querySelector('#evalStepsTable tbody');
    convertBtn.addEventListener('click', convertExpression);
    solveBtn.addEventListener('click', solveExpression);
    clearAllBtn.addEventListener('click', clearAll);
   
    function convertExpression() {
        const expression = document.getElementById('expression').value.trim();
        const conversionType = document.getElementById('conversion').value;

        clearOutputs();

        if (!isValidExpression(expression, conversionType)) {
            alert('Invalid expression. Please check your input for missing operators, misplaced parentheses, or invalid characters.');
            return;
        }

        let result = '';
        let steps = [];

        try {
            switch (conversionType) {
                case 'infixToPostfix':
                    result = infixToPostfix(expression, steps);
                    break;
                case 'infixToPrefix':
                    result = infixToPrefix(expression, steps);
                    break;
                case 'prefixToInfix':
                    result = prefixToInfix(expression, steps);
                    break;
                case 'prefixToPostfix':
                    result = prefixToPostfix(expression, steps);
                    break;
                case 'postfixToInfix':
                    result = postfixToInfix(expression, steps);
                    break;
                case 'postfixToPrefix':
                    result = postfixToPrefix(expression, steps);
                    break;
                case 'evaluateInfix':
                case 'evaluatePrefix':
                case 'evaluatePostfix':
                    result = expression; // For evaluation, display the original expression
                    break;
                default:
                    alert('Unsupported conversion type.');
                    return;
            }

            if (conversionType.startsWith('evaluate')) {
                conversionResult.innerText = expression;
                solveBtn.disabled = false;
            } else {
                conversionResult.innerText = result;
                solveBtn.disabled = false; // Enable the solve button
            }

            populateSteps(steps);
        } catch (error) {
            alert('Error during conversion: ' + error.message);
        }
    }
    

    function solveExpression() {
        const conversionType = document.getElementById('conversion').value;
        const expression = conversionType.startsWith('evaluate') ? document.getElementById('expression').value.trim() : conversionResult.innerText;

        if (!expression) {
            alert('No expression to evaluate.');
            return;
        }

        clearEvaluation();
        clearSteps();

        let steps = [];
        let result = '';

        try {
            switch (conversionType) {
                case 'evaluateInfix':
                    result = evaluateInfix(expression, steps);
                    break;
                case 'evaluatePrefix':
                    result = evaluatePrefix(expression, steps);
                    break;
                case 'evaluatePostfix':
                    result = evaluatePostfix(expression, steps);
                    break;
                default:
                    alert('Unsupported evaluation type.');
                    return;
            }

            evaluationResult.innerText = `Result: ${result}`;
            populateEvalSteps(steps);
        } catch (error) {
            alert('Error during evaluation: ' + error.message);
        }
    }
    function clearEvalSteps() {
        evalStepsTableBody.innerHTML = '';
    }

    function populateSteps(steps) {
        stepsTableBody.innerHTML = '';
        steps.forEach(step => {
            const row = stepsTableBody.insertRow();
            row.insertCell(0).innerText = step.step;
            row.insertCell(1).innerText = step.operation;
            row.insertCell(2).innerText = step.stack;
        });
    }

    function populateEvalSteps(steps) {
        evalStepsTableBody.innerHTML = '';
        steps.forEach(step => {
            const row = evalStepsTableBody.insertRow();
            row.insertCell(0).innerText = step.step;
            row.insertCell(1).innerText = step.operation;
            row.insertCell(2).innerText = step.stack;
        });
    }


    function clearOutputs() {
        conversionResult.innerText = '';
        evaluationResult.innerText = '';
        clearSteps();
    }

    function clearEvaluation() {
        evaluationResult.innerText = '';
    }

    function clearSteps() {
        stepsTableBody.innerHTML = '';
    }

    function populateSteps(steps) {
        stepsTableBody.innerHTML = '';
        steps.forEach(step => {
            const row = stepsTableBody.insertRow();
            row.insertCell(0).innerText = step.step;
            row.insertCell(1).innerText = step.operation;
            row.insertCell(2).innerText = step.stack;
        });   
    }
    // function clearAll() {
    //     clearOutputs();
    //     clearEvaluation();
    //     clearSteps();
    //     clearEvaluationTable();
    // }
    // function clearEvaluationTable(){
    //     evalStepsTableBody.innerHTML = '';
    // }
    // function clearOutputs() {
    //     conversionResult.innerText = '';
    //     evaluationResult.innerText = '';
    //     clearSteps();
    // }
   
    // function clearEvaluation() {
    //     evaluationResult.innerText = '';
    // }

    // function clearSteps() {
    //     stepsTableBody.innerHTML = '';
    // }
    function clearInputField() {
        document.getElementById('expression').value = '';
    }

    function clearAllOutputs() {
        conversionResult.innerText = '';
        evaluationResult.innerText = '';
        clearSteps();
    }

    function clearEvaluationTable() {
        evalStepsTableBody.innerHTML = '';
    }

    function clearSteps() {
        stepsTableBody.innerHTML = '';
    }

    function clearEvaluation() {
        evaluationResult.innerText = '';
    }

    function clearAll() {
        clearInputField();            // Clear the input field
        clearAllOutputs();           // Clear conversion and evaluation outputs
        clearEvaluation();           // Clear evaluation results
        clearSteps();                // Clear conversion steps
        clearEvaluationTable();       // Clear evaluation steps table
    }

    function isValidExpression(expression, conversionType) {
        if (!expression) return false;

        const regex = /^[A-Za-z0-9+\-*/^()]+$/;
        if (!regex.test(expression)) return false;

        if (!areParenthesesBalanced(expression)) return false;

        return true;
    }

    function areParenthesesBalanced(expression) {
        const stack = [];
        for (let char of expression) {
            if (char === '(') {
                stack.push(char);
            } else if (char === ')') {
                if (stack.length === 0) return false; // No matching opening parenthesis
                stack.pop(); // Found a matching opening parenthesis
            }
        }
        return stack.length === 0; // Stack should be empty if balanced
    }
    

    // Utility functions
    function isOperator(c) {
        return ['+', '-', '*', '/', '^'].includes(c);
    }

    function getPrecedence(op) {
        switch (op) {
            case '^': return 3;
            case '*':
            case '/': return 2;
            case '+':
            case '-': return 1;
            default: return 0;
        }
    }

    function infixToPostfix(expression, steps) {
        let stack = [];
        let postfix = '';
        let stepCount = 1;

        for (let char of expression) {
            if (/\w/.test(char)) {
                postfix += char;
                steps.push({
                    step: stepCount++,
                    operation: `Output '${char}'`,
                    stack: stack.join(' ')
                });
            } else if (char === '(') {
                stack.push(char);
                steps.push({
                    step: stepCount++,
                    operation: `Push '(' to stack`,
                    stack: stack.join(' ')
                });
            } else if (char === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    const popped = stack.pop();
                    postfix += popped;
                    steps.push({
                        step: stepCount++,
                        operation: `Pop '${popped}' from stack to output`,
                        stack: stack.join(' ')
                    });
                }
                stack.pop(); // This removes the '(' from the stack
                steps.push({
                    step: stepCount++,
                    operation: `Pop '(' from stack`,
                    stack: stack.join(' ') // Ensure the stack is updated without the '('
                });
            }
             else if (isOperator(char)) {
                while (stack.length && getPrecedence(char) <= getPrecedence(stack[stack.length - 1])) {
                    const popped = stack.pop();
                    postfix += popped;
                    steps.push({
                        step: stepCount++,
                        operation: `Pop '${popped}' from stack to output`,
                        stack: stack.join(' ')
                    });
                }
                stack.push(char);
                steps.push({
                    step: stepCount++,
                    operation: `Push '${char}' to stack`,
                    stack: stack.join(' ')
                });
            }
        }

        while (stack.length) {
            const popped = stack.pop();
            postfix += popped;
            steps.push({
                step: stepCount++,
                operation: `Pop '${popped}' from stack to output`,
                stack: stack.join(' ')
            });
        }

        return postfix;
    }

    function infixToPrefix(expression, steps) {
        let reversed = reverseExpression(expression);
        reversed = reversed.split('').map(char => {
            if (char === '(') return ')';
            if (char === ')') return '(';
            return char;
        }).join('');
        let postfixSteps = [];
        let postfix = infixToPostfix(reversed, postfixSteps);
        let prefix = postfix.split('').reverse().join('');
        steps.push(...postfixSteps.map(s => ({
            step: s.step,
            operation: `Reverse and process: ${s.operation}`,
            stack: s.stack.split('').reverse().join(' ')
        })));
        return prefix;
    }

    function prefixToInfix(expression, steps) {
        let stack = [];
        let stepCount = 1;

        for (let i = expression.length - 1; i >= 0; i--) {
            let char = expression[i];
            if (isOperator(char)) {
                let op1 = stack.pop();
                let op2 = stack.pop();
                let temp = `(${op1}${char}${op2})`;
                stack.push(temp);
                steps.push({
                    step: stepCount++,
                    operation: `Pop '${op1}' and '${op2}', form '(${op1}${char}${op2})' and push to stack`,
                    stack: stack.join(' ')
                });
            } else {
                stack.push(char);
                steps.push({
                    step: stepCount++,
                    operation: `Push operand '${char}' to stack`,
                    stack: stack.join(' ')
                });
            }
        }

        return stack.pop();
    }

    function evaluateInfix(expression, steps) {
        let postfixSteps = [];
        let postfix = infixToPostfix(expression, postfixSteps);
        steps.push(...postfixSteps);
        return evaluatePostfix(postfix, steps);
    }
    function evaluatePostfix(expression, steps) {
        let stack = [];
        let stepCount = steps.length + 1;
    
        for (let char of expression) {
            if (/\d/.test(char)) {
                stack.push(parseInt(char));
                steps.push({
                    step: stepCount++,
                    operation: `Push operand '${char}' to stack`,
                    stack: stack.join(' ')
                });
            } else if (isOperator(char)) {
                let op2 = stack.pop();
                let op1 = stack.pop();
                let result = performOperation(op1, op2, char);
                stack.push(result);
    
                steps.push({
                    step: stepCount++,
                    operation: `Pop '${op1}' and '${op2}', perform '${op1} ${char} ${op2}' = ${result}, and push result to stack`,
                    stack: stack.join(' ')
                });
            }
        }
    
        return stack.pop(); // Final result
    }
    
    function evaluatePrefix(expression, steps) {
        let stack = [];
        let stepCount = steps.length + 1;
    
        for (let i = expression.length - 1; i >= 0; i--) {
            let char = expression[i];
    
            if (/\d/.test(char)) {
                stack.push(parseInt(char));
                steps.push({
                    step: stepCount++,
                    operation: `Push operand '${char}' to stack`,
                    stack: stack.join(' ')
                });
            } else if (isOperator(char)) {
                let op1 = stack.pop();
                let op2 = stack.pop();
                let result = performOperation(op1, op2, char);
                stack.push(result);
    
                steps.push({
                    step: stepCount++,
                    operation: `Pop '${op1}' and '${op2}', perform '${op1} ${char} ${op2}' = ${result}, and push result to stack`,
                    stack: stack.join(' ')
                });
            }
        }
    
        return stack.pop(); // Final result
    }
    
    function performOperation(op1, op2, operator) {
        switch (operator) {
            case '+':
                return op1 + op2;
            case '-':
                return op1 - op2;
            case '*':
                return op1 * op2;
            case '/':
                return op1 / op2;
            case '^':
                return Math.pow(op1, op2);
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }
    
    function reverseExpression(expression) {
        return expression.split('').reverse().join('');
    }
    
    // Conversion functions (continued)
    function postfixToInfix(expression, steps) {
        let stack = [];
        let stepCount = 1;
    
        for (let char of expression) {
            if (/\w/.test(char)) {
                stack.push(char);
                steps.push({
                    step: stepCount++,
                    operation: `Push operand '${char}' to stack`,
                    stack: stack.join(' ')
                });
            } else if (isOperator(char)) {
                let op2 = stack.pop();
                let op1 = stack.pop();
                let temp = `(${op1}${char}${op2})`;
                stack.push(temp);
                steps.push({
                    step: stepCount++,
                    operation: `Pop '${op1}' and '${op2}', form '(${op1}${char}${op2})' and push to stack`,
                    stack: stack.join(' ')
                });
            }
        }
    
        return stack.pop();
    }
    
    function postfixToPrefix(expression, steps) {
        let infix = postfixToInfix(expression, steps);
        let prefixSteps = [];
        let prefix = infixToPrefix(infix, prefixSteps);
        steps.push(...prefixSteps.map(s => ({
            step: s.step,
            operation: `Convert infix to prefix: ${s.operation}`,
            stack: s.stack
        })));
        return prefix;
    }
    
});
   

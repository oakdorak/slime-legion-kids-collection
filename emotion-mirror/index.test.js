const assert = require('assert');
const fs = require('fs');
const path = require('path');

// 1. Mock the DOM and globals
global.document = {
    elements: {},
    getElementById: function(id) {
        if (!this.elements[id]) {
            this.elements[id] = {
                style: {},
                textContent: ''
            };
        }
        return this.elements[id];
    }
};

global.score = 0;
global.total = 10;

// 2. Extract and eval the function from index.html
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// The exact body of updateProgress to avoid dealing with varying AST
// We match it via regex and execute it within an IIFE context where variables are accessible
const regex = /function updateProgress\(\) \{([\s\S]*?)        \}/;
const match = htmlContent.match(regex);

if (!match) {
    console.error("Could not find updateProgress function in index.html");
    process.exit(1);
}

// Instead of global eval, we create a function dynamically that binds to global variables
const updateProgressBody = match[1];

const updateProgress = new Function('document', 'score', 'total', updateProgressBody);

// Wrap it to simulate the environment
const updateProgressWrapper = () => updateProgress(global.document, global.score, global.total);

// 3. Write the tests
function runTests() {
    console.log("Running tests for updateProgress...");

    // Test 1: Initial state
    global.score = 0;
    global.total = 10;
    updateProgressWrapper();
    assert.strictEqual(document.getElementById('prog-text').textContent, '0 / 10');
    assert.strictEqual(document.getElementById('progress-fill').style.width, '0%');
    console.log("✅ Test 1 Passed: Initial state (0/10)");

    // Test 2: Halfway
    global.score = 5;
    global.total = 10;
    updateProgressWrapper();
    assert.strictEqual(document.getElementById('prog-text').textContent, '5 / 10');
    assert.strictEqual(document.getElementById('progress-fill').style.width, '50%');
    console.log("✅ Test 2 Passed: Halfway (5/10)");

    // Test 3: Complete
    global.score = 10;
    global.total = 10;
    updateProgressWrapper();
    assert.strictEqual(document.getElementById('prog-text').textContent, '10 / 10');
    assert.strictEqual(document.getElementById('progress-fill').style.width, '100%');
    console.log("✅ Test 3 Passed: Complete (10/10)");

    console.log("All tests passed!");
}

try {
    runTests();
} catch(e) {
    console.error(e);
    process.exit(1);
}

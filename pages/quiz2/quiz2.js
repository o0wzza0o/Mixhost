// Quiz Data - 30 HTML, CSS & Bootstrap Questions
const quizData = [
    {
        question: "What is HTML mainly used for?",
        options: ["Styling", "Structure", "Animation", "Database"],
        answer: 1
    },
    {
        question: "What is CSS mainly used for?",
        options: ["Structure", "Styling", "Logic", "Database"],
        answer: 1
    },
    {
        question: "What does HTML describe?",
        options: ["Colors", "Structure of page", "Database", "Logic"],
        answer: 1
    },
    {
        question: "Which HTML tag creates a main heading?",
        options: ["h1", "p", "div", "span"],
        answer: 0
    },
    {
        question: "Which element is used to display an image?",
        options: ["image", "img", "pic", "src"],
        answer: 1
    },
    {
        question: "What does the \"alt\" attribute do in images?",
        options: ["Style image", "Add link", "Show text if image fails", "Resize image"],
        answer: 2
    },
    {
        question: "Which HTML element creates a link?",
        options: ["link", "a", "href", "nav"],
        answer: 1
    },
    {
        question: "What does target=\"_blank\" do?",
        options: ["Open same tab", "Open new tab", "Close page", "Refresh"],
        answer: 1
    },
    {
        question: "What is the difference between block and inline elements?",
        options: ["Color", "Position", "Block takes full width", "None"],
        answer: 2
    },
    {
        question: "What is CSS selector used for?",
        options: ["Selecting database", "Selecting HTML elements", "Styling images", "Animation"],
        answer: 1
    },
    {
        question: "Which property changes text color?",
        options: ["font", "color", "background", "style"],
        answer: 1
    },
    {
        question: "What does margin control?",
        options: ["Inside spacing", "Outside spacing", "Border", "Color"],
        answer: 1
    },
    {
        question: "What does padding control?",
        options: ["Outside spacing", "Inside spacing", "Border", "Height"],
        answer: 1
    },
    {
        question: "What is the Box Model?",
        options: ["Animation", "Layout", "Content + Padding + Border + Margin", "Grid"],
        answer: 2
    },
    {
        question: "What does display:flex do?",
        options: ["Hide element", "Make layout flexible", "Change color", "Add border"],
        answer: 1
    },
    {
        question: "In Flexbox, row means?",
        options: ["Vertical", "Horizontal", "Center", "Block"],
        answer: 1
    },
    {
        question: "column in flex means?",
        options: ["Horizontal", "Vertical", "Inline", "Hidden"],
        answer: 1
    },
    {
        question: "justify-content controls?",
        options: ["Vertical", "Horizontal", "Color", "Size"],
        answer: 1
    },
    {
        question: "align-items controls?",
        options: ["Horizontal", "Vertical", "Border", "Margin"],
        answer: 1
    },
    {
        question: "What is responsive design?",
        options: ["Fixed layout", "Works on all screen sizes", "Only mobile", "Only desktop"],
        answer: 1
    },
    {
        question: "Which tool helps responsive design?",
        options: ["HTML", "CSS only", "Media Queries", "JavaScript"],
        answer: 2
    },
    {
        question: "What is Bootstrap?",
        options: ["Language", "Framework", "Database", "Server"],
        answer: 1
    },
    {
        question: "What are Bootstrap components?",
        options: ["Ready UI elements", "Functions", "Variables", "APIs"],
        answer: 0
    },
    {
        question: "What is Navbar in Bootstrap?",
        options: ["Image", "Navigation menu", "Table", "Footer"],
        answer: 1
    },
    {
        question: "What is a table used for?",
        options: ["Styling", "Data display", "Animation", "Script"],
        answer: 1
    },
    {
        question: "What is CRUD in projects?",
        options: ["Create, Read, Update, Delete", "Copy, Run, Update, Delete", "Code, Read, Use, Design", "None"],
        answer: 0
    },
    {
        question: "What is the purpose of linking CSS file?",
        options: ["Add logic", "Add styles", "Add database", "Add server"],
        answer: 1
    },
    {
        question: "What is Flexbox mainly used for?",
        options: ["Colors", "Layout alignment", "Fonts", "Animation"],
        answer: 1
    },
    {
        question: "What does width:100% mean?",
        options: ["Half width", "Full width", "Fixed", "Small"],
        answer: 1
    },
    {
        question: "What is the role of frontend in project?",
        options: ["Database", "Server", "User interface", "Backend logic"],
        answer: 2
    }
];

// User answers array
let userAnswers = new Array(quizData.length).fill(null);

// Initialize quiz
function initQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    
    // Generate questions
    quizData.forEach((item, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.id = `question-${index}`;
        
        questionCard.innerHTML = `
            <span class="question-number">Question ${index + 1}</span>
            <h3 class="question-text">${item.question}</h3>
            <div class="options-container">
                ${item.options.map((option, optIndex) => `
                    <label class="option-label">
                        <input type="radio" name="question-${index}" value="${optIndex}" onchange="selectAnswer(${index}, ${optIndex})">
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
        
        quizContainer.appendChild(questionCard);
    });
    
    // Add submit button
    const submitContainer = document.createElement('div');
    submitContainer.className = 'submit-container';
    submitContainer.innerHTML = `
        <button class="submit-btn" id="submit-btn" onclick="finishQuiz()">
            <i class="fa-solid fa-check-circle"></i> Finish Quiz
        </button>
    `;
    quizContainer.appendChild(submitContainer);
}

// Handle answer selection
function selectAnswer(questionIndex, answerIndex) {
    userAnswers[questionIndex] = answerIndex;
    updateProgress();
}

// Update progress bar
function updateProgress() {
    const answered = userAnswers.filter(a => a !== null).length;
    const percentage = (answered / quizData.length) * 100;
    
    // Update the progress bar width
    const bar = document.querySelector('.progress-bar');
    bar.innerHTML = `<div style="height: 100%; background: linear-gradient(90deg, #ffffff93, #2b2a2aa4); border-radius: 4px; transition: width 0.3s ease; width: ${percentage}%;"></div>`;
    
    document.getElementById('progress-text').textContent = `Question ${answered} of ${quizData.length} answered`;
}

// Finish quiz and show results
function finishQuiz() {
    const answered = userAnswers.filter(a => a !== null).length;
    
    if (answered < quizData.length) {
        const confirmFinish = confirm(`You have answered ${answered} out of ${quizData.length} questions. Are you sure you want to finish?`);
        if (!confirmFinish) return;
    }
    
    showResults();
}

// Calculate and show results
async function showResults() {
    // Hide quiz container
    document.getElementById('quiz-container').style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    
    // Show results container
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.style.display = 'block';
    
    // Calculate score
    let score = 0;
    quizData.forEach((item, index) => {
        if (userAnswers[index] === item.answer) {
            score++;
        }
    });
    
    // Update score display
    document.getElementById('score-value').textContent = score;
    
    // Score message
    let message = '';
    if (score === 30) message = 'Perfect! You are a master! 🌟';
    else if (score >= 25) message = 'Excellent work! 🎉';
    else if (score >= 20) message = 'Great job! 👏';
    else if (score >= 15) message = 'Good effort! Keep practicing! 💪';
    else if (score >= 10) message = 'Not bad! Room for improvement! 📚';
    else message = 'Keep learning! You will get better! 🌱';
    
    document.getElementById('score-message').textContent = message;
    
    // Generate detailed results
    const summaryContainer = document.getElementById('results-summary');
    summaryContainer.innerHTML = '';
    
    quizData.forEach((item, index) => {
        const isCorrect = userAnswers[index] === item.answer;
        const userAnswer = userAnswers[index] !== null ? item.options[userAnswers[index]] : 'Not answered';
        const correctAnswer = item.options[item.answer];
        
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${isCorrect ? 'correct' : 'wrong'}`;
        
        resultItem.innerHTML = `
            <div class="result-icon">
                <i class="fa-solid ${isCorrect ? 'fa-check' : 'fa-xmark'}"></i>
            </div>
            <div class="result-content">
                <div class="result-question">${index + 1}. ${item.question}</div>
                <div class="result-answer">
                    ${isCorrect 
                        ? `<span class="correct-answer">✓ ${correctAnswer}</span>` 
                        : `<span class="user-answer">✗ Your answer: ${userAnswer}</span> <span class="correct-answer">| Correct: ${correctAnswer}</span>`
                    }
                </div>
            </div>
        `;
        
        summaryContainer.appendChild(resultItem);
    });
    
    // Save to localStorage (prevent retake)
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    setStorage('quiz2_completed', 'true');
    setStorage('quiz2_name', encodeURIComponent(studentName));
    setStorage('quiz2_score', score);
    setStorage('quiz2_date', encodeURIComponent(dateStr));
    
    console.log('Storage set:', {
        completed: getStorage('quiz2_completed'),
        name: getStorage('quiz2_name'),
        score: getStorage('quiz2_score')
    });
    
    // Save to Supabase
    try {
        const percentage = Math.round((score / quizData.length) * 100);
        console.log('Saving to Supabase:', { name: studentName, score, percentage });
        
        const { data, error } = await supabaseClient
            .from('scores')
            .insert([{
                name: studentName,
                score: score,
                total: quizData.length,
                percentage: percentage,
                quiz: 'quiz2',
                ip: 'unknown',
                date: new Date().toISOString()
            }]);
        
        if (error) {
            console.error('Supabase error:', error);
            alert('Error saving score: ' + error.message);
        } else {
            console.log('Score saved to Supabase:', data);
        }
    } catch (error) {
        console.error('Could not save to Supabase:', error);
    }
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Restart quiz - redirects to leaderboard (retake not allowed without admin)
function restartQuiz() {
    window.location.href = 'leaderboard.html';
}

// Student name
let studentName = '';
let quizCompleted = false;

// Storage functions (using localStorage for better compatibility)
function setStorage(name, value) {
    localStorage.setItem(name, value);
}

function getStorage(name) {
    return localStorage.getItem(name);
}

function clearStorage(name) {
    localStorage.removeItem(name);
}

// Check if quiz already completed (also verifies with Supabase)
async function checkQuizStatus() {
    const completed = getStorage('quiz2_completed');
    const savedName = getStorage('quiz2_name');
    const savedScore = getStorage('quiz2_score');
    const savedDate = getStorage('quiz2_date');
    
    console.log('Checking quiz status:', { completed, savedName, savedScore, savedDate });
    
    if (completed === 'true' && savedName) {
        const studentName = decodeURIComponent(savedName);
        
        // Check if score still exists in Supabase (admin might have deleted it)
        try {
            const { data, error } = await supabaseClient
                .from('scores')
                .select('*')
                .eq('name', studentName)
                .eq('quiz', 'quiz2')
                .order('date', { ascending: false })
                .limit(1);
            
            // If no record found in Supabase, admin deleted it - allow retake
            if (!error && (!data || data.length === 0)) {
                console.log('Score was deleted by admin, allowing retake');
                clearQuizStorage();
                return false; // Allow to take quiz
            }
            
            // Score exists, show retake button option
            document.getElementById('retake-note').style.display = 'block';
            document.getElementById('retake-btn').style.display = 'inline-flex';
            
        } catch (e) {
            console.log('Could not verify with Supabase, using storage only');
        }
        
        // Show already completed message
        document.getElementById('name-modal').style.display = 'none';
        document.getElementById('completed-message').style.display = 'flex';
        document.getElementById('completed-details').innerHTML = 
            `Hello <strong>${studentName}</strong>,<br>` +
            `You already completed this quiz on <strong>${decodeURIComponent(savedDate)}</strong><br>` +
            `Your score: <strong>${decodeURIComponent(savedScore)}/30</strong>`;
        return true;
    }
    return false;
}

// Request retake - checks if admin deleted the score
async function requestRetake() {
    const savedName = getStorage('quiz2_name');
    if (!savedName) return;
    
    const studentName = decodeURIComponent(savedName);
    const retakeBtn = document.getElementById('retake-btn');
    retakeBtn.disabled = true;
    retakeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';
    
    try {
        const { data, error } = await supabaseClient
            .from('scores')
            .select('*')
            .eq('name', studentName)
            .eq('quiz', 'quiz2')
            .order('date', { ascending: false })
            .limit(1);
        
        if (!error && (!data || data.length === 0)) {
            // Score was deleted by admin
            clearQuizStorage();
            alert('Your score was cleared by admin. You can now retake the quiz!');
            location.reload();
        } else {
            alert('Your score still exists in the database. Contact admin if you need to retake.');
            retakeBtn.disabled = false;
            retakeBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Request Retake';
        }
    } catch (e) {
        alert('Could not verify. Please try again later.');
        retakeBtn.disabled = false;
        retakeBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Request Retake';
    }
}

// Clear quiz cookies (used when admin deletes score)
function clearQuizStorage() {
    clearStorage('quiz2_completed');
    clearStorage('quiz2_name');
    clearStorage('quiz2_score');
    clearStorage('quiz2_date');
}

// Start quiz after name input
function startQuiz() {
    const nameInput = document.getElementById('student-name');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert('Please enter your name to start the quiz');
        return;
    }
    
    studentName = name;
    document.getElementById('student-name-display').innerHTML = 
        `<i class="fa-solid fa-user"></i> ${studentName}`;
    
    // Hide modal, show quiz
    document.getElementById('name-modal').style.display = 'none';
    document.getElementById('Quiz').style.display = 'block';
    
    // Initialize quiz
    initQuiz();
}

// Allow Enter key to start quiz
document.addEventListener('DOMContentLoaded', async function() {
    const nameInput = document.getElementById('student-name');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startQuiz();
            }
        });
    }
    
    // Check if already completed (async)
    const isCompleted = await checkQuizStatus();
    if (!isCompleted) {
        // Show name modal
        document.getElementById('name-modal').style.display = 'flex';
    }
});

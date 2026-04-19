// Quiz Data - 30 CSS & HTML Questions
const quizData = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language", "None"],
        answer: 0
    },
    {
        question: "What is the main purpose of HTML?",
        options: ["Styling", "Structure", "Logic", "Animation"],
        answer: 1
    },
    {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Color Style Syntax", "Computer Style Sheets"],
        answer: 1
    },
    {
        question: "What is CSS used for?",
        options: ["Structure", "Styling", "Database", "Logic"],
        answer: 1
    },
    {
        question: "Which tag is used for the main heading?",
        options: ["h6", "h3", "h1", "p"],
        answer: 2
    },
    {
        question: "Which CSS property is used to change text color?",
        options: ["background", "color", "font", "text-style"],
        answer: 1
    },
    {
        question: "What is the correct CSS syntax?",
        options: ["{color:red;}", "color = red;", "color: red;", "(color:red)"],
        answer: 2
    },
    {
        question: "Which property controls spacing inside element?",
        options: ["margin", "padding", "border", "space"],
        answer: 1
    },
    {
        question: "Which property controls spacing outside element?",
        options: ["padding", "margin", "gap", "border"],
        answer: 1
    },
    {
        question: "What is display:block?",
        options: ["Inline element", "Hidden element", "Full width element", "Flex element"],
        answer: 2
    },
    {
        question: "What is display:inline?",
        options: ["Full width", "Same line", "Hidden", "Flex"],
        answer: 1
    },
    {
        question: "What is Flexbox used for?",
        options: ["Colors", "Layout", "Images", "Fonts"],
        answer: 1
    },
    {
        question: "Which value makes items horizontal in flex?",
        options: ["column", "row", "center", "block"],
        answer: 1
    },
    {
        question: "Which value makes items vertical?",
        options: ["row", "column", "flex", "inline"],
        answer: 1
    },
    {
        question: "justify-content is used for?",
        options: ["Vertical alignment", "Horizontal alignment", "Font size", "Colors"],
        answer: 1
    },
    {
        question: "align-items is used for?",
        options: ["Horizontal", "Vertical", "Color", "Border"],
        answer: 1
    },
    {
        question: "What is responsive design?",
        options: ["Fixed layout", "Works on all screens", "Only desktop", "Only mobile"],
        answer: 1
    },
    {
        question: "Which is used for responsive design?",
        options: ["Flexbox", "Media Queries", "Grid", "All"],
        answer: 3
    },
    {
        question: "What is Bootstrap?",
        options: ["Programming language", "Framework", "Database", "Server"],
        answer: 1
    },
    {
        question: "What is a Navbar?",
        options: ["Image", "Navigation menu", "Table", "Footer"],
        answer: 1
    },
    {
        question: "Which element is used for images?",
        options: ["img", "image", "pic", "src"],
        answer: 0
    },
    {
        question: "Which attribute defines image source?",
        options: ["href", "src", "link", "img"],
        answer: 1
    },
    {
        question: "What is <a> tag used for?",
        options: ["Image", "Link", "Text", "Button"],
        answer: 1
    },
    {
        question: "What is target=\"_blank\"?",
        options: ["Same tab", "New tab", "Close tab", "Refresh"],
        answer: 1
    },
    {
        question: "What is a table used for?",
        options: ["Styling", "Data display", "Animation", "Script"],
        answer: 1
    },
    {
        question: "What is margin-top?",
        options: ["Space below", "Space above", "Space left", "Space right"],
        answer: 1
    },
    {
        question: "What does width:100% mean?",
        options: ["Fixed size", "Full width", "Half width", "No width"],
        answer: 1
    },
    {
        question: "What is class in CSS?",
        options: ["Style group", "Function", "Variable", "Loop"],
        answer: 0
    },
    {
        question: "What is ID in CSS?",
        options: ["Multiple elements", "Single element", "Class type", "Variable"],
        answer: 1
    },
    {
        question: "What is the Box Model?",
        options: ["Animation", "Layout system", "Margin + Border + Padding + Content", "Grid system"],
        answer: 2
    }
];

// User answers array
let userAnswers = new Array(quizData.length).fill(null);

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

function clearQuizStorage() {
    clearStorage('quiz_completed');
    clearStorage('quiz_name');
    clearStorage('quiz_score');
    clearStorage('quiz_date');
}

// Check if quiz already completed (also verifies with Supabase)
async function checkQuizStatus() {
    const completed = getStorage('quiz_completed');
    const savedName = getStorage('quiz_name');
    const savedScore = getStorage('quiz_score');
    const savedDate = getStorage('quiz_date');
    
    console.log('Checking quiz status:', { completed, savedName, savedScore, savedDate });
    
    if (completed === 'true' && savedName) {
        const studentName = decodeURIComponent(savedName);
        
        // Check if score still exists in Supabase (admin might have deleted it)
        try {
            const { data, error } = await supabaseClient
                .from('scores')
                .select('*')
                .eq('name', studentName)
                .eq('quiz', 'quiz1')
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
    const savedName = getStorage('quiz_name');
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
            .eq('quiz', 'quiz1')
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
    
    const progressBar = document.querySelector('.progress-bar::after');
    document.querySelector('.progress-bar').style.setProperty('--progress', percentage + '%');
    
    // Update the pseudo element width through inline style on parent
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
    setStorage('quiz_completed', 'true');
    setStorage('quiz_name', encodeURIComponent(studentName));
    setStorage('quiz_score', score);
    setStorage('quiz_date', encodeURIComponent(dateStr));
    
    console.log('Storage set:', {
        completed: getStorage('quiz_completed'),
        name: getStorage('quiz_name'),
        score: getStorage('quiz_score')
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
                quiz: 'quiz1',
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
    window.location.href = '../quiz2/leaderboard.html';
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

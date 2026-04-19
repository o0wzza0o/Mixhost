// Admin Dashboard functionality with Supabase

let isLoggedIn = false;
let currentFilter = 'all';
let allScores = [];

// Set quiz filter
function setQuizFilter(filter) {
    currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`filter-${filter}`).classList.add('active');
    
    // Reload with filter
    displayScores();
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', async function() {
    checkLoginStatus();
});

// Check if admin is logged in (using localStorage)
function checkLoginStatus() {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession === 'logged_in') {
        isLoggedIn = true;
        showDashboard();
    } else {
        showLogin();
    }
}

// Login function (simple check against supabase-config.js)
async function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    // Simple admin check (in real apps, use proper auth)
    if (username === 'admin' && password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        localStorage.setItem('admin_session', 'logged_in');
        showDashboard();
    } else {
        errorElement.textContent = 'Invalid username or password';
    }
    
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('admin_session');
    isLoggedIn = false;
    showLogin();
}

// Show login form
function showLogin() {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').textContent = '';
}

// Show dashboard
function showDashboard() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'block';
    loadAllScores();
}

// Load all scores for admin
async function loadAllScores() {
    const tbody = document.getElementById('admin-table-body');
    const emptyState = document.getElementById('empty-state');
    const tableWrapper = document.querySelector('.leaderboard-table-wrapper');
    
    try {
        // Fetch all scores from Supabase
        const { data: scores, error } = await supabaseClient
            .from('scores')
            .select('*')
            .order('score', { ascending: false });
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        allScores = scores || [];
        displayScores();
        
    } catch (error) {
        console.error('Error loading scores:', error);
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #888;">Failed to load scores.</td></tr>';
    }
}

// Display scores with current filter
function displayScores() {
    const tbody = document.getElementById('admin-table-body');
    const emptyState = document.getElementById('empty-state');
    const tableWrapper = document.querySelector('.leaderboard-table-wrapper');
    
    // Filter scores
    let scores = allScores;
    if (currentFilter !== 'all') {
        scores = allScores.filter(s => s.quiz === currentFilter);
    }
    
    if (scores.length === 0) {
        tableWrapper.style.display = 'none';
        emptyState.style.display = 'block';
        updateStats(0, 0, 0, 0);
        return;
    }
    
    tableWrapper.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Calculate stats
    let totalScore = 0;
    let maxScore = 0;
    let passCount = 0;
    
    scores.forEach((score, index) => {
        totalScore += score.percentage;
        if (score.score > maxScore) maxScore = score.score;
        if (score.percentage >= 60) passCount++;
        
        const row = document.createElement('tr');
        
        // Determine rank class
        let rankClass = 'rank-other';
        if (index === 0) rankClass = 'rank-1';
        else if (index === 1) rankClass = 'rank-2';
        else if (index === 2) rankClass = 'rank-3';
        
        // Determine percentage badge
        let badgeClass = 'needs-work';
        if (score.percentage >= 80) badgeClass = 'excellent';
        else if (score.percentage >= 60) badgeClass = 'good';
        
        // Quiz badge with better names
        let quizBadgeClass = score.quiz === 'quiz2' ? 'quiz2' : 'quiz1';
        let quizName = score.quiz === 'quiz2' ? 'HTML/CSS/BS' : 'CSS/HTML';
        
        row.innerHTML = `
            <td><span class="rank ${rankClass}">${index + 1}</span></td>
            <td><strong>${escapeHtml(score.name)}</strong></td>
            <td><span class="quiz-badge ${quizBadgeClass}">${quizName}</span></td>
            <td>${score.score}/${score.total}</td>
            <td><span class="percentage-badge ${badgeClass}">${score.percentage}%</span></td>
            <td class="ip-address">${score.ip || 'N/A'}</td>
            <td>${formatDate(score.date)}</td>
            <td>
                <button class="btn-delete" onclick="deleteScore('${score.id}', this)">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Update stats
    const avgScore = Math.round(totalScore / scores.length);
    const passRate = Math.round((passCount / scores.length) * 100);
    updateStats(scores.length, avgScore, maxScore, passRate);
}

// Update stats display
function updateStats(totalStudents, avgScore, topScore, passRate) {
    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('avg-score').textContent = avgScore + '%';
    document.getElementById('top-score').textContent = topScore + '/30';
    document.getElementById('pass-rate').textContent = passRate + '%';
}

// Delete a single score
async function deleteScore(scoreId, button) {
    if (!confirm('Are you sure you want to delete this score? The student will be able to retake the quiz.')) {
        return;
    }
    
    button.disabled = true;
    
    try {
        const { error } = await supabaseClient
            .from('scores')
            .delete()
            .eq('id', scoreId);
        
        if (error) {
            console.error('Supabase error:', error);
            alert('Failed to delete score: ' + error.message);
            button.disabled = false;
        } else {
            // Reload scores
            loadAllScores();
        }
    } catch (error) {
        alert('Failed to delete score. Please try again.');
        button.disabled = false;
    }
}

// Delete all scores
async function deleteAllScores() {
    if (!confirm('WARNING: This will delete ALL scores! Are you sure?')) {
        return;
    }
    
    if (!confirm('This action cannot be undone. Really delete all scores?')) {
        return;
    }
    
    try {
        // Get all scores first
        const { data: scores, error: fetchError } = await supabaseClient
            .from('scores')
            .select('id');
        
        if (fetchError) throw fetchError;
        
        if (!scores || scores.length === 0) {
            alert('No scores to delete.');
            return;
        }
        
        // Delete all scores (Supabase allows deleting all by not filtering)
        const { error } = await supabaseClient
            .from('scores')
            .delete()
            .neq('id', '0'); // Delete all rows
        
        if (error) {
            console.error('Supabase error:', error);
            alert('Failed to delete all scores: ' + error.message);
        } else {
            // Reload
            loadAllScores();
            alert('All scores have been deleted.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete all scores.');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

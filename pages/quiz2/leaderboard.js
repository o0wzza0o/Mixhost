// Leaderboard functionality

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

// Load and display scores
async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
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
        console.error('Error loading leaderboard:', error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #888;">Failed to load scores. Please try again later.</td></tr>';
    }
}

// Display scores based on current filter
function displayScores() {
    const tbody = document.getElementById('leaderboard-body');
    const emptyState = document.getElementById('empty-state');
    const tableWrapper = document.querySelector('.leaderboard-table-wrapper');
    
    // Filter scores
    let scores = allScores;
    if (currentFilter !== 'all') {
        scores = allScores.filter(s => s.quiz === currentFilter);
    }
    
    // Update table header based on filter
    const thead = document.querySelector('.leaderboard-table thead tr');
    if (currentFilter === 'all') {
        thead.innerHTML = `
            <th>Rank</th>
            <th>Student</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Date</th>
        `;
    } else {
        thead.innerHTML = `
            <th>Rank</th>
            <th>Student</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Date</th>
        `;
    }
    
    if (scores.length === 0) {
        tableWrapper.style.display = 'none';
        emptyState.style.display = 'block';
        updateStats(0, 0, 0);
        return;
    }
    
    tableWrapper.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Calculate stats
    let totalScore = 0;
    let maxScore = 0;
    
    scores.forEach((score, index) => {
        totalScore += score.percentage;
        if (score.score > maxScore) maxScore = score.score;
        
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
        
        // Determine bar fill class
        let barClass = 'low';
        if (score.percentage >= 80) barClass = 'high';
        else if (score.percentage >= 60) barClass = 'medium';
        
        // Quiz badge
        let quizBadge = '';
        if (currentFilter === 'all') {
            const quizClass = score.quiz === 'quiz2' ? 'quiz2' : 'quiz1';
            const quizName = score.quiz === 'quiz2' ? 'HTML/CSS/BS' : 'CSS/HTML';
            quizBadge = `<td><span class="quiz-badge ${quizClass}">${quizName}</span></td>`;
        }
        
        row.innerHTML = `
            <td><span class="rank ${rankClass}">${index + 1}</span></td>
            <td><strong>${escapeHtml(score.name)}</strong></td>
            ${quizBadge}
            <td>
                <div class="score-bar">
                    <div class="bar">
                        <div class="bar-fill ${barClass}" style="width: ${score.percentage}%"></div>
                    </div>
                    <span class="score-value">${score.score}/30</span>
                </div>
            </td>
            <td><span class="percentage-badge ${badgeClass}">${score.percentage}%</span></td>
            <td>${formatDate(score.date)}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Update stats
    const avgScore = Math.round(totalScore / scores.length);
    updateStats(scores.length, avgScore, maxScore);
}

// Update stats display
function updateStats(totalStudents, avgScore, topScore) {
    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('avg-score').textContent = avgScore + '%';
    document.getElementById('top-score').textContent = topScore + '/30';
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

// Load leaderboard on page load
document.addEventListener('DOMContentLoaded', loadLeaderboard);

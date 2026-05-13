const votedPosts = new Set();
const voteCounts = {};
let currentSort = 'newest';

// 1. Handle upvote/unvote
function handleVote(btn) {
  const postCard = btn.closest('.post-card');
  const postId = postCard.dataset.id;
  const countEl = btn.querySelector('.vote-count');

  if (votedPosts.has(postId)) {
    votedPosts.delete(postId);
    voteCounts[postId] = (voteCounts[postId] || 1) - 1;
    countEl.textContent = voteCounts[postId];
    btn.classList.remove('voted');
  } else {
    votedPosts.add(postId);
    voteCounts[postId] = (voteCounts[postId] || 0) + 1;
    countEl.textContent = voteCounts[postId];
    btn.classList.add('voted');
  }
}

// 2. Set active sort button and re-render
function setSort(btn) {
  currentSort = btn.dataset.sort;
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadAllResponses();
}

// 3. Build a response card element
function createResponseCard(response) {
  const card = document.createElement('div');
  card.classList.add('post-card');
  card.dataset.id = response.id;
 
  card.innerHTML = `
    <span class="side-badge">${response.author}'s Stance: ${response.side}</span>
    <p>${response.reason}</p>
    <div style="display: flex; gap: 10px; align-items: center; margin-top: 8px;">
      <button class="upvote-btn" onclick="handleVote(this)">
        AGREE? <span class="vote-count">${voteCounts[response.id] || 0}</span>
      </button>
      <button class="report-btn" onclick="reportResponse('${response.id}')">Report</button>
    </div>
  `;
  return card;

// 4. Sort responses based on currentSort
function sortResponses(responses) {
  switch (currentSort) {
    case 'newest':
      return [...responses].sort((a, b) => b.id - a.id);
    case 'oldest':
      return [...responses].sort((a, b) => a.id - b.id);
    case 'mostVotes':
      return [...responses].sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0));
    case 'sideA':
      return [...responses].sort((a, b) => a.side.localeCompare(b.side));
    case 'sideB':
      return [...responses].sort((a, b) => b.side.localeCompare(a.side));
    default:
      return responses;
  }
}

// 5. Load all responses from localStorage and render them
function loadAllResponses() {
  const container = document.getElementById('responsesContainer');
  const question = localStorage.getItem('publishedQuestion');
  const allResponses = JSON.parse(localStorage.getItem('allResponses')) || [];

  // Show the current question
  if (question) {
    document.getElementById('currentQuestion').textContent = question;
    document.getElementById('currentQuestion').className = '';
  }

  if (allResponses.length === 0) {
    container.innerHTML = "<p>No responses yet!</p>";
    return;
  }

  // Sort then render
  const sorted = sortResponses(allResponses);
  container.innerHTML = '';
  sorted.forEach(response => {
    container.appendChild(createResponseCard(response));
  });
}

// 6. Run on page load
window.onload = loadAllResponses;

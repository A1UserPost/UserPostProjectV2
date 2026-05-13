const votedPosts = new Set();
const voteCounts = {};
let currentSort = 'newest';

//Handle upvote/unvote
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

//Sort Button
function setSort(btn) {
  currentSort = btn.dataset.sort;
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadAllResponses();
}

//Response Card
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
}
// bring to report page
function reportResponse(responseId) {
  window.location.href = `reportPage.html?id=${responseId}`;
}

//Sort responses
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

//Load all responses
function loadAllResponses() {
  const container = document.getElementById('responsesContainer');
  const question = localStorage.getItem('publishedQuestion');
  const allResponses = JSON.parse(localStorage.getItem('allResponses')) || [];

  //Show question
  if (question) {
    document.getElementById('currentQuestion').textContent = question;
    document.getElementById('currentQuestion').className = '';
  }

  if (allResponses.length === 0) {
    container.innerHTML = "<p>No responses yet!</p>";
    return;
  }

  // render + sort
  const sorted = sortResponses(allResponses);
  container.innerHTML = '';
  sorted.forEach(response => {
    container.appendChild(createResponseCard(response));
  });
}
window.onload = loadAllResponses;

const votedPosts = new Set();

// 1. Handle upvote/unvote
function handleVote(btn) {
  const postCard = btn.closest('.post-card');
  const postId = postCard.dataset.id;
  const countEl = btn.querySelector('.vote-count');

  if (votedPosts.has(postId)) {
    votedPosts.delete(postId);
    countEl.textContent = parseInt(countEl.textContent) - 1;
    btn.classList.remove('voted');
  } else {
    votedPosts.add(postId);
    countEl.textContent = parseInt(countEl.textContent) + 1;
    btn.classList.add('voted');
  }
}

// 2. Build a response card element
function createResponseCard(id, author, side, reason) {
  const card = document.createElement('div');
  card.classList.add('post-card');
  card.dataset.id = id;
  card.innerHTML = `
    <span class="side-badge">${author}'s Stance: ${side}</span>
    <p>${reason}</p>
    <button class="upvote-btn" onclick="handleVote(this)">
      AGREE? <span class="vote-count">0</span>
    </button>
  `;
  return card;
}

// 3. Load all responses from localStorage and render them
function loadAllResponses() {
  const container = document.getElementById('responsesContainer');

  const question = localStorage.getItem('publishedQuestion');
  const allResponses = JSON.parse(localStorage.getItem('allResponses')) || [];

  // Show the current question
  if (question) {
    document.getElementById('currentQuestion').textContent = question;
    document.getElementById('currentQuestion').className = '';
  }

  // Render cards
  if (allResponses.length === 0) {
    container.innerHTML = "<p>No responses yet!</p>";
    return;
  }

  container.innerHTML = '';
  allResponses.forEach((response, index) => {
    const card = createResponseCard(index + 1, response.author, response.side, response.reason);
    container.appendChild(card);
  });
}

// 4. Run on page load
window.onload = loadAllResponses;

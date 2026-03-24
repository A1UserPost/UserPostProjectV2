// Load and render all published questions from localStorage
function loadAllQuestions() {
  const container = document.getElementById('questionsContainer');
  const allQuestions = JSON.parse(localStorage.getItem('publishedQuestions')) || [];

  if (allQuestions.length === 0) {
    container.innerHTML = "<p>No questions published yet!</p>";
    return;
  }

  container.innerHTML = '';

  // Show newest questions first
  [...allQuestions].reverse().forEach(entry => {
    const card = document.createElement('div');
    card.classList.add('post-card');

    card.innerHTML = `
      <h3>${entry.question}</h3>
      <p class="sides-label">Sides: ${entry.sides.join(" vs ")}</p>
      <p class="published-date">Published: ${entry.publishedAt}</p>
    `;

    container.appendChild(card);
  });
}

window.onload = loadAllQuestions;

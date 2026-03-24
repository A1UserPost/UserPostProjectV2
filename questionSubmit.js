// Open User UI with cache busting
function openUserUI() {
  const cacheBuster = `?v=${Date.now()}`;
  window.open(`index.html${cacheBuster}`, '_blank');
}

// Add new custom side input
function addSide() {
  const container = document.getElementById('sidesContainer');
  const newSide = document.createElement('div');
  newSide.className = 'side-item';
  newSide.innerHTML = `
    <input type="text" class="side-input" placeholder="Side name (e.g., Maybe, Triangulum)">
    <button class="delete-side" onclick="deleteSide(this)">Delete</button>
  `;
  container.appendChild(newSide);
}

// Delete side
function deleteSide(btn) {
  const container = document.getElementById('sidesContainer');
  if (container.children.length > 2) btn.parentElement.remove();
  else alert("Minimum 2 sides required for the platform!");
}

// Publish question and custom sides
function publishQuestion() {
  const question = document.getElementById('modQuestionInput').value.trim();
  const sideInputs = document.querySelectorAll('.side-input');
  const sides = Array.from(sideInputs)
    .map(input => input.value.trim())
    .filter(side => side);

  const status = document.getElementById('publishStatus');

  // Validation
  if (!question) {
    status.textContent = "Error: Enter a valid question first!";
    status.className = "status error";
    return;
  }
  if (sides.length < 2) {
    status.textContent = "Error: Add at least 2 valid sides (no empty names!)";
    status.className = "status error";
    return;
  }

  // Build the new question entry
  const newQuestion = {
    id: Date.now(),
    question: question,
    sides: sides,
    publishedAt: new Date().toLocaleString(),
  };

  // Add to the running list of all published questions
  const existing = JSON.parse(localStorage.getItem('publishedQuestions')) || [];
  existing.push(newQuestion);
  localStorage.setItem('publishedQuestions', JSON.stringify(existing));

  // Also keep the latest question handy for userInterface.html
  localStorage.setItem('publishedQuestion', question);
  localStorage.setItem('publishedSides', JSON.stringify(sides));
  localStorage.setItem('questionLastUpdated', Date.now());

  status.textContent = `Success! Published: "${question}" | Sides: ${sides.join(", ")} — Click "Refresh User UI" to see changes!`;
  status.className = "status success";
}

// Load saved question and sides on mod page refresh
window.onload = () => {
  const savedQ = localStorage.getItem('publishedQuestion');
  const savedSides = JSON.parse(localStorage.getItem('publishedSides'));

  if (savedQ) document.getElementById('modQuestionInput').value = savedQ;

  if (savedSides && savedSides.length >= 2) {
    const container = document.getElementById('sidesContainer');
    container.innerHTML = '';
    savedSides.forEach(side => {
      const sideItem = document.createElement('div');
      sideItem.className = 'side-item';
      sideItem.innerHTML = `
        <input type="text" class="side-input" value="${side}">
        <button class="delete-side" onclick="deleteSide(this)">Delete</button>
      `;
      container.appendChild(sideItem);
    });
  }
};

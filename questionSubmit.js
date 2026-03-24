
// Open User UI with cache busting 
function openUserUI() {
  const cacheBuster = `?v=${Date.now()}`;
  window.open(`questionSubmit.html${cacheBuster}`, '_blank');
}

// Add new custom side input 
function addSide() {
  const container = document.getElementById('sidesContainer');
  const sideCount = container.children.length + 1;
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

// Publish question and  custom sides 
function publishQuestion() {
  const question = document.getElementById('modQuestionInput').value.trim();
  const sideInputs = document.querySelectorAll('.side-input');
  const sides = Array.from(sideInputs)
    .map(input => input.value.trim())
    .filter(side => side); 

  // Validation
  const status = document.getElementById('publishStatus');
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

  // Clear ALL old session storage 
  sessionStorage.clear();
  // Save new question/sides
  sessionStorage.setItem('publishedQuestion', question);
  sessionStorage.setItem('publishedSides', JSON.stringify(sides));
  // Add timestamp for tracking
  sessionStorage.setItem('questionLastUpdated', Date.now());

  // Success message 
  status.textContent = `Success! Published: "${question}" | Sides: ${sides.join(", ")} — Click "Refresh User UI" to see changes!`;
  status.className = "status success";

}

// Load saved question and sides on mod page refresh
window.onload = () => {
  const savedQ = sessionStorage.getItem('publishedQuestion');
  const savedSides = JSON.parse(sessionStorage.getItem('publishedSides'));
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
}

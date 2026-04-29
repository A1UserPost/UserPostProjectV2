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

function showExpiryDate() {
  const now = Date.now();
  const expireTime = now + (7 * 24 * 60 * 60 * 1000);
  const formatted = new Date(expireTime).toLocaleString();

  const box = document.getElementById('expiryDateDisplay');
  box.innerHTML = `
    This question will <span class="expiry-date-text">EXPIRE ON:</span> ${formatted}
  `;
}

// Insert a question to the database
async function insertQuestion(){
   const questionData = {
    question: question
  };
  
  try {
    const response = await fetch("https://server-o01l.onrender.com/question", {
      mode: "cors",
      method: "POST",
      include: "credentials",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(questionData)
    });
    const result = await response.text();
  }
  catch (error) {
    console.error("Fetch failed:", error);
    alert("Could not connect to server");
  }

}

// Publish question and custom sides
function publishQuestion() {
  const question = document.getElementById('modQuestionInput').value.trim();
  const sideInputs = document.querySelectorAll('.side-input');
  const sides = Array.from(sideInputs)
    .map(input => input.value.trim())
    .filter(Boolean);
  const status = document.getElementById('publishStatus');

  if (!question) {
    status.textContent = "Error: Enter a question!";
    status.className = "status error";
    return;
  }
  if (sides.length < 2) {
    status.textContent = "Error: At least 2 sides required!";
    status.className = "status error";
    return;
  }

  insertQuestion();
  
  const publishTime = Date.now();
  const expireTime = publishTime + (7 * 24 * 60 * 60 * 1000);
  const newQuestion = {
    id: Date.now(),
    question: question,
    sides: sides,
    publishTime: publishTime,
    expireTime: expireTime,
    publishedAt: new Date(publishTime).toLocaleString()
  };

  // Save to question list
  const allQuestions = JSON.parse(localStorage.getItem('publishedQuestions')) || [];
  allQuestions.push(newQuestion);
  localStorage.setItem('publishedQuestions', JSON.stringify(allQuestions));

  // Save full object for mod page reload
  localStorage.setItem('publishedQuestionData', JSON.stringify(newQuestion));

  localStorage.setItem('publishedQuestion', question);
  localStorage.setItem('publishedSides', JSON.stringify(sides));

  status.textContent = `SUCCESS! Question expires: ${new Date(expireTime).toLocaleString()}`;
  status.className = "status success";
  showExpiryDate();
}

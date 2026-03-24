let savedQuestion = "";
let selectedAnswer = "No side selected yet!";
let savedReason = "";

// Save the question from input
function saveQuestion() {
  const questionInput = document.getElementById("questionInput");
  savedQuestion = questionInput.value.trim();
  if (savedQuestion) {
    localStorage.setItem("funQuestion", savedQuestion);
    alert("Question saved: " + savedQuestion);
  } else {
    alert("Please enter a question first!");
  }
}

// Select Side A/B
function selectAnswer(side) {
  selectedAnswer = side;
  document.getElementById("selectedAnswer").textContent = `Selected: ${selectedAnswer}`;
}

// Count characters for reason input
function countChars() {
  const reasonInput = document.getElementById("reasonInput");
  const charCount = document.getElementById("charCount");
  charCount.textContent = `${reasonInput.value.length} / 500 characters`;
}

// Save the reason and add it to the shared responses list
function saveReason() {
  const reasonInput = document.getElementById("reasonInput");
  savedReason = reasonInput.value.trim();

  if (!savedReason) {
    alert("Please enter a reason first!");
    return;
  }

  if (selectedAnswer === "No side selected yet!") {
    alert("Please pick a side first!");
    return;
  }

  // Build the new response entry
  const newResponse = {
    id: Date.now(), // unique ID based on timestamp
    author: "Anonymous",
    side: selectedAnswer,
    reason: savedReason,
  };

  // Load existing responses, add new one, save back
  const existing = JSON.parse(localStorage.getItem("allResponses")) || [];
  existing.push(newResponse);
  localStorage.setItem("allResponses", JSON.stringify(existing));

  alert("Reason saved! It will appear on the Others' Responses page.");
}

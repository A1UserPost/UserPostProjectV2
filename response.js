 <script>
    // Global State
    let selectedSide = null;
    let reasonSubmitted = false;
    let publishedSides = [];

    // 1. Initialize UI on load
    window.onload = () => {
      loadPublishedQuestionAndSides();
      loadUserState();
      updateSubmitButton();
      loadOtherReasons();
    };

    // 2. Load MOD-PUBLISHED Question and Sides 
    function loadPublishedQuestionAndSides() {
      const question = sessionStorage.getItem('questionsContainer');
      publishedSides = JSON.parse(sessionStorage.getItem('publishedSides')) || [];
      const qElement = document.getElementById('publishedQuestion');
      const sideContainer = document.getElementById('sideButtonsContainer');

      // Reset all UI state 
      selectedSide = null;
      reasonSubmitted = false;
      document.getElementById('selectedSideStatus').textContent = "No side selected yet!";
      document.getElementById('reasonInput').value = "";
      document.getElementById('charCount').textContent = "0 / 500 characters";
      document.getElementById('yourResponseContainer').style.display = "none";
      document.getElementById('othersResponsesContainer').style.display = "none";
      document.getElementById('submitReasonBtn').disabled = true;
      
      // Clear side button styles
      sideContainer.innerHTML = ''; 

      // Load question
      if (question) {
        qElement.textContent = question;
        qElement.className = ""; 
      } else {
        qElement.textContent = "No question published yet! Check back soon.";
        qElement.className = "no-question";
      }

      // Load dynamic side buttons 
      if (publishedSides.length >= 2) {
        publishedSides.forEach(side => {
          const btn = document.createElement('button');
          btn.id = `side-${side.replace(/\s+/g, '-')}`;
          btn.textContent = side;
          btn.onclick = () => selectSide(side);
          sideContainer.appendChild(btn);
        });
      }
    }

    // 3. Select Side 
    function selectSide(side) {
      if (reasonSubmitted) return; 

      selectedSide = side;
      sessionStorage.setItem('userSelectedSide', side);
      document.getElementById('selectedSideStatus').textContent = `You selected: ${side} (cannot be switched once your reason is submitted)`;

      document.querySelectorAll('.side-buttons button').forEach(btn => {
        btn.classList.toggle('selected', btn.textContent === side);
      });

      updateSubmitButton();
    }

    // 4. Character Count for Reason Input
    function countChars() {
      const len = document.getElementById('reasonInput').value.length;
      document.getElementById('charCount').textContent = `${len} / 500 characters`;
      updateSubmitButton();
    }

    // 5. Submit Button
    function updateSubmitButton() {
      const reason = document.getElementById('reasonInput').value.trim();
      const btn = document.getElementById('submitReasonBtn');
      btn.disabled = !selectedSide || reason.length === 0 || reasonSubmitted;
    }

    // 6. Submit Reason 
    function submitReason() {
      const reason = document.getElementById('reasonInput').value.trim();
      if (!selectedSide || !reason || reasonSubmitted) return;

      reasonSubmitted = true;
      sessionStorage.setItem('userSubmittedReason', reason);

      // LOCK UI ELEMENTS
      document.querySelectorAll('.side-buttons button').forEach(btn => {
        btn.classList.add('locked');
        btn.classList.remove('selected');
        btn.disabled = true;
      });
      document.getElementById('reasonInput').classList.add('locked');
      document.getElementById('reasonInput').disabled = true;
      document.getElementById('submitReasonBtn').disabled = true;
      document.getElementById('selectedSideStatus').textContent = `You selected: ${selectedSide} `;

      // SHOW YOUR RESPONSE
      const yourResponse = document.getElementById('yourResponseContainer');
      document.getElementById('yourSideBadge').textContent = `Your Stance: ${selectedSide}`;
      document.getElementById('yourReasonText').textContent = reason;
      yourResponse.style.display = "block";

      // SHOW OTHER'S RESPONSES
      document.getElementById('othersResponsesContainer').style.display = "block";
      loadOtherReasons();
    }

    // 7. Load Other Users' Reasons
    function loadOtherReasons() {
      const otherReasons = JSON.parse(sessionStorage.getItem('otherUserReasons')) || [];
      const listContainer = document.getElementById('otherReasonsList');

      if (otherReasons.length === 0) {
        listContainer.innerHTML = "<p>No other user responses yet!</p>";
        return;
      }

      listContainer.innerHTML = otherReasons.map(item => `
        <div class="other-reason">
          <span class="side-badge">${item.author}'s Stance: ${item.side}</span>
          <p>${item.reason}</p>
        </div>
      `).join('');
    }

    // 8. Load User Saved State 
    function loadUserState() {
      const savedSide = sessionStorage.getItem('userSelectedSide');
      const savedReason = sessionStorage.getItem('userSubmittedReason');

      if (savedSide && !reasonSubmitted) {
        selectedSide = savedSide;
        selectSide(savedSide);
      }

      if (savedReason && !reasonSubmitted) {
        reasonSubmitted = true;
        document.getElementById('reasonInput').value = savedReason;
        countChars();
        // Lock UI
        document.querySelectorAll('.side-buttons button').forEach(btn => {
          btn.classList.add('locked');
          btn.disabled = true;
        });
        document.getElementById('reasonInput').classList.add('locked');
        document.getElementById('reasonInput').disabled = true;
        document.getElementById('submitReasonBtn').disabled = true;
        document.getElementById('selectedSideStatus').textContent = `You selected: ${selectedSide}`;
        // Show sections
        document.getElementById('yourResponseContainer').style.display = "block";
        document.getElementById('yourSideBadge').textContent = `Your Stance: ${selectedSide}`;
        document.getElementById('yourReasonText').textContent = savedReason;
        document.getElementById('othersResponsesContainer').style.display = "block";
      }
    }

    // 9. Demo: Add Sample Other User Reasons
    setTimeout(() => {
      if (sessionStorage.getItem('publishedQuestion') && !JSON.parse(sessionStorage.getItem('otherUserReasons'))) {
        const demoReasons = [
          { author: "User 42", side: "No", reason: "Pineapple is a fruit and doesn't belong on savory pizza. Its sweetness clashes with cheese and tomato sauce and the texture is too mushy!" },
          { author: "User 189", side: "Yes", reason: "Pineapple's sweet and tangy flavor balances the salty cheese and rich tomato sauce. Hawaiian pizza is a classic for a reason!" },
        ];
        sessionStorage.setItem('otherUserReasons', JSON.stringify(demoReasons));
        if (reasonSubmitted) loadOtherReasons();
      }
    }, 1000);
  </script>

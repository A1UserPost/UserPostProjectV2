    const username = localStorage.getItem("username");
    const page = document.getElementById("app");

    if (username) {
      page.classList.remove("account-shell--guest");
      page.classList.add("account-shell--logged-in");
      page.innerHTML = `
        <div class="account-logged-in-layout">
          <div class="account-welcome-wrap">
            <div class="app-section auth-form-card">
              <h2>Welcome, ${username}!</h2>
              <p class="account-welcome-sub">You're signed in. Jump into the debate from the nav, or log out when you're done.</p>
              <p><a class="account-link-button account-link-button--ghost" href="#" id="logout-button">Log out</a></p>
            </div>
          </div>
          <aside class="account-admin-slot" id="accountAdminSlot" aria-label="Moderator access"></aside>
        </div>
      `;
      document.getElementById("logout-button").addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem("username");
        window.location.href = "account.html";
      });
    } else {
      page.classList.remove("account-shell--logged-in");
      page.classList.add("account-shell--guest");
      page.innerHTML = `
        <div class="app-section auth-form-card account-guest-card">
          <h2>Account</h2>
          <p class="account-guest-lead">Log in to pick a side, post your reason, and see what everyone else thinks. New here? Create an account—it only takes a moment.</p>
          <div class="account-guest-actions">
            <a class="account-link-button account-link-button--primary" href="login_account.html">Log in</a>
            <a class="account-link-button account-link-button--secondary" href="create_account.html">Create account</a>
          </div>
        </div>
      `;
    }


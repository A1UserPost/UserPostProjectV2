    const username = localStorage.getItem("username");
    const page = document.getElementById("app");

    if (username) {
      page.innerHTML = `
        <div class="app-section">
          <h2>Welcome, ${username}!</h2>
          <p><a class="account-link-button" href="#" id="logout-button">Log Out</a></p>
        </div>
      `;
      document.getElementById("logout-button").addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem("username");
        window.location.href = "account.html";
      });
    } else {
      page.innerHTML = `
        <div class="app-section">
          <h2>Account</h2>
          <p><a href="login_account.html" style="display: inline-block; background-color: #6f8fe8; color: white; padding: 10px 16px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Account</a></p>
          <p><a href="create_account.html" style="display: inline-block; background-color: #6f8fe8; color: white; padding: 10px 16px; text-decoration: none; border-radius: 6px; font-weight: bold;">Create Account</a></p>
        </div>
      `;
    }

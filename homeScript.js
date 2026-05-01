document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem('username');
  const restrictedItems = document.querySelectorAll('.restricted');

  if (!username) {
    // Hide nav links and show guest message
    restrictedItems.forEach(item => item.classList.add('hidden'));
    document.getElementById('guestMessage').style.display = 'block';
    document.getElementById('loggedInMessage').style.display = 'none';
  } else {
    // Show nav links and swap to logged-in message
    restrictedItems.forEach(item => item.classList.remove('hidden'));
    document.getElementById('guestMessage').style.display = 'none';
    document.getElementById('loggedInMessage').style.display = 'block';
  }
});

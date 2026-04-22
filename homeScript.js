document.addEventListener("DOMContentLoaded", function() {
  const hasAccount = localStorage.getItem('username');
  const restrictedItems = document.querySelectorAll('.restricted');

  if(!hasAccount) {
    restrictedItems.forEach(item => {

      item.classList.add('hidden');
    });
  }
});

// Load and render all reports 
function getReports() {
  const container = document.getElementById('reportsContainer');
  const reports = JSON.parse(localStorage.getItem('reports')) || [];

  if (reports.length === 0) {
    container.innerHTML = '<p>No reports submitted yet.</p>';
    return;
  }

  // Show newest reports first
  const sorted = [...reports].sort((a, b) => b.id - a.id);

  container.innerHTML = '';
  sorted.forEach(report => {
    const card = document.createElement('div');
    card.className = 'report-card';
    card.dataset.reportId = report.id;

    card.innerHTML = `
      <div class="report-header">
        <strong>Report #${report.id}</strong>
        <span class="report-timestamp">${report.timestamp}</span>
      </div>
      <p><strong>Rule Violated:</strong> ${report.rule}</p>
      <p><strong>Description:</strong> ${report.description}</p>
      <hr>
      <p><strong>Reported Response:</strong></p>
      <p><em>${report.reportedAuthor} — Stance: ${report.reportedSide}</em></p>
      <p>${report.reportedReason}</p>
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button class="delete-response-btn" onclick="deleteResponse('${report.responseId}', this)">
          Delete Response
        </button>
        <button class="dismiss-report-btn" onclick="dismissReport('${report.id}', this)">
          Dismiss Report
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Delete the reported response
function deleteResponse(responseId, btn) {
  if (!confirm('Delete this response permanently?')) return;

  const allResponses = JSON.parse(localStorage.getItem('allResponses')) || [];
  const updated = allResponses.filter(r => String(r.id) !== String(responseId));
  localStorage.setItem('allResponses', JSON.stringify(updated));

  // Give visual feedback on the card
  const card = btn.closest('.report-card');
  card.style.opacity = '0.5';
  card.querySelector('.delete-response-btn').disabled = true;
  card.querySelector('.delete-response-btn').textContent = 'Response Deleted';
}

// Dismiss a report
function dismissReport(reportId, btn) {
  const reports = JSON.parse(localStorage.getItem('reports')) || [];
  const updated = reports.filter(r => String(r.id) !== String(reportId));
  localStorage.setItem('reports', JSON.stringify(updated));

  const card = btn.closest('.report-card');
  card.remove();

  // Show empty message if no reports left
  const container = document.getElementById('reportsContainer');
  if (container.children.length === 0) {
    container.innerHTML = '<p>No reports submitted yet.</p>';
  }
}

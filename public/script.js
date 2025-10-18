// Global variables
let extractedEvents = [];

// DOM elements
const textInput = document.getElementById('textInput');
const extractBtn = document.getElementById('extractBtn');
const resultsSection = document.getElementById('resultsSection');
const eventsList = document.getElementById('eventsList');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Event listeners
extractBtn.addEventListener('click', extractEvents);
selectAllBtn.addEventListener('click', selectAllEvents);
deselectAllBtn.addEventListener('click', deselectAllEvents);
downloadBtn.addEventListener('click', downloadCalendar);

// Extract events from text
async function extractEvents() {
    const text = textInput.value.trim();
    
    if (!text) {
        showError('Please enter some text to analyze.');
        return;
    }

    showLoading();
    hideError();

    try {
        const response = await fetch('/api/extract-events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to extract events');
        }

        extractedEvents = data.events || [];
        displayEvents(extractedEvents);
        showResults();

    } catch (err) {
        console.error('Error extracting events:', err);
        showError(err.message || 'Failed to extract events. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display extracted events
function displayEvents(events) {
    eventsList.innerHTML = '';

    if (events.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">No events found in the text.</p>';
        return;
    }

    events.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        eventElement.innerHTML = `
            <label style="display: flex; align-items: flex-start; cursor: pointer;">
                <input type="checkbox" class="event-checkbox" checked data-index="${index}">
                <div style="flex: 1;">
                    <div class="event-title">${escapeHtml(event.title)}</div>
                    <div class="event-details">
                        <span class="event-date">📅 ${event.date} at ${event.time}</span>
                        ${event.location && event.location !== 'TBD' ? `<span class="event-location">📍 ${escapeHtml(event.location)}</span>` : ''}
                        ${event.description ? `<div class="event-description">${escapeHtml(event.description)}</div>` : ''}
                    </div>
                </div>
            </label>
        `;
        eventsList.appendChild(eventElement);
    });
}

// Download calendar file
async function downloadCalendar() {
    const selectedEvents = getSelectedEvents();
    
    if (selectedEvents.length === 0) {
        showError('Please select at least one event to download.');
        return;
    }

    try {
        const response = await fetch('/api/generate-calendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ events: selectedEvents })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate calendar');
        }

        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.ics';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (err) {
        console.error('Error downloading calendar:', err);
        showError(err.message || 'Failed to download calendar file.');
    }
}

// Get selected events
function getSelectedEvents() {
    const checkboxes = document.querySelectorAll('.event-checkbox:checked');
    return Array.from(checkboxes).map(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        return extractedEvents[index];
    });
}

// Select all events
function selectAllEvents() {
    const checkboxes = document.querySelectorAll('.event-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = true);
}

// Deselect all events
function deselectAllEvents() {
    const checkboxes = document.querySelectorAll('.event-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = false);
}

// Show/hide sections
function showLoading() {
    loading.style.display = 'block';
    extractBtn.disabled = true;
    extractBtn.textContent = 'Analyzing...';
}

function hideLoading() {
    loading.style.display = 'none';
    extractBtn.disabled = false;
    extractBtn.textContent = '🤖 Extract Events';
}

function showResults() {
    resultsSection.style.display = 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    error.style.display = 'block';
}

function hideError() {
    error.style.display = 'none';
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Example text for testing
const exampleText = `Tech Conference 2025
Join us on October 25, 2025 at 2:00 PM at the Convention Center.

Workshop: AI Basics
December 10, 2025 at 3:30 PM in Room 204.

Team Meeting
Next Monday at 10:00 AM in the conference room.

Project Deadline
March 15, 2025 at 5:00 PM - submit final report.`;

// Add example button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add example text button
    const exampleBtn = document.createElement('button');
    exampleBtn.textContent = '📝 Load Example';
    exampleBtn.className = 'btn btn-secondary';
    exampleBtn.style.marginTop = '10px';
    exampleBtn.addEventListener('click', () => {
        textInput.value = exampleText;
    });
    
    const inputSection = document.querySelector('.input-section');
    inputSection.appendChild(exampleBtn);
});


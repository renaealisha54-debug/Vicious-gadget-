// WebView safety: prevent crash on native date/time inputs
document.addEventListener('focusin', function(e) {
    if (e.target.tagName === 'INPUT' && ['time', 'date'].includes(e.target.type)) {
        setTimeout(() => e.target.blur(), 100);
    }
});

// Fallback date/time prompt for WebView environments
function showDatePicker(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const val = prompt('Enter date (YYYY-MM-DD):', input.value);
    if (val) input.value = val;
}

function showTimePicker(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const val = prompt('Enter time (HH:MM):', input.value);
    if (val) input.value = val;
}

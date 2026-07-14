const TerminalEngine = {
    get output() {
        return document.getElementById('terminal-output');
    },

    log: function(message, type = 'info') {
        const el = this.output;
        if (!el) return;
        const div = document.createElement('div');
        const colors = { error: '#f85149', success: '#3fb950', info: '#c9d1d9', warn: '#d29922' };
        div.style.color = colors[type] || colors.info;
        div.textContent = `> ${message}`;
        el.appendChild(div);
        el.scrollTop = el.scrollHeight;
    },

    clear: function() {
        const el = this.output;
        if (el) el.innerHTML = '> Console cleared.';
    }
};

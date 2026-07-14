const ProjectManager = {
    STORAGE_KEY: 'ACCIO_OFFLINE_V3',

    save: function(code) {
        try {
            localStorage.setItem(this.STORAGE_KEY, code);
        } catch (e) {
            TerminalEngine.log('Storage full — could not auto-save.', 'error');
        }
        this.updateStorageLabel();
    },

    load: function() {
        return localStorage.getItem(this.STORAGE_KEY) || '';
    },

    clearStorage: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        document.getElementById('code-editor').value = '';
        this.updateStorageLabel();
        TerminalEngine.log('Cache cleared.', 'info');
        document.getElementById('storage-modal').style.display = 'none';
    },

    updateStorageLabel: function() {
        const size = (JSON.stringify(localStorage).length / 1024).toFixed(2);
        const label = document.getElementById('storage-usage');
        if (label) label.textContent = `Cache: ${size}KB`;
    }
};

let autoSaveTimeout;
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('code-editor');
    if (editor) {
        editor.addEventListener('input', (e) => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => ProjectManager.save(e.target.value), 500);
        });
    }
});

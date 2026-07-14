const CompilerCore = {
    isBuilding: false,

    startBuild: function(onComplete) {
        if (this.isBuilding) return;
        this.isBuilding = true;

        const progressBar = document.getElementById('build-progress-bar');
        const statusText = document.getElementById('build-step');
        let progress = 0;

        const steps = [
            "Initializing...",
            "Validating Manifest...",
            "Compiling Resources...",
            "Signing APK...",
            "Finalizing..."
        ];

        const interval = setInterval(() => {
            progress += Math.random() * 18 + 4;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                this.isBuilding = false;
                if (statusText) statusText.textContent = "Build complete.";
                if (progressBar) progressBar.style.width = '100%';
                onComplete();
                return;
            }
            if (progressBar) progressBar.style.width = `${progress}%`;
            const stepIndex = Math.min(
                Math.floor((progress / 100) * steps.length),
                steps.length - 1
            );
            if (statusText) statusText.textContent = steps[stepIndex];
        }, 350);
    }
};

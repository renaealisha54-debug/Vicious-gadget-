const TEMPLATES = [
    {
        name: "Hello World",
        code: `console.log("Hello, World!");`
    },
    {
        name: "Fetch Example",
        code: `fetch("https://jsonplaceholder.typicode.com/todos/1")\n  .then(r => r.json())\n  .then(d => console.log(d));`
    },
    {
        name: "DOM Manipulation",
        code: `const el = document.createElement("div");\nel.textContent = "Injected!";\ndocument.body.appendChild(el);`
    },
    {
        name: "Async/Await",
        code: `async function run() {\n  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");\n  const data = await res.json();\n  console.log(data.title);\n}\nrun();`
    }
];

window.onload = () => {
    const savedCode = ProjectManager.load();
    if (savedCode) document.getElementById('code-editor').value = savedCode;
    ProjectManager.updateStorageLabel();
    buildTemplateList();
};

function buildTemplateList() {
    const list = document.getElementById('template-list');
    if (!list) return;
    list.innerHTML = '';
    TEMPLATES.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t.name;
        li.addEventListener('click', () => {
            document.getElementById('code-editor').value = t.code;
            ProjectManager.save(t.code);
            TerminalEngine.log(`Template "${t.name}" loaded.`, 'info');
            document.getElementById('templates-modal').style.display = 'none';
        });
        list.appendChild(li);
    });
}

function handleAction(action) {
    const editor = document.getElementById('code-editor');

    switch (action) {
        case 'RUN':
            TerminalEngine.clear();
            try {
                const originalLog = console.log;
                console.log = (...args) => {
                    TerminalEngine.log(args.join(' '), 'info');
                    originalLog.apply(console, args);
                };
                new Function(editor.value)();
                console.log = originalLog;
                TerminalEngine.log("Process finished.", "success");
            } catch (e) {
                TerminalEngine.log(e.message, "error");
            }
            break;

        case 'BUILD':
            document.getElementById('build-modal').style.display = 'flex';
            CompilerCore.startBuild(() => {
                TerminalEngine.log("APK generated locally.", "success");
            });
            break;

        case 'TEMPLATES':
            document.getElementById('templates-modal').style.display = 'flex';
            break;

        case 'STORAGE':
            ProjectManager.updateStorageLabel();
            const detail = document.getElementById('storage-detail');
            if (detail) {
                const size = (JSON.stringify(localStorage).length / 1024).toFixed(2);
                detail.textContent = `Current cache usage: ${size}KB`;
            }
            document.getElementById('storage-modal').style.display = 'flex';
            break;
    }
}

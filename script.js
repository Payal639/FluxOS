 (() => {
  const desktop = document.getElementById("desktop");
  const desktopIcons = document.getElementById("desktop-icons");
  const windowsLayer = document.getElementById("windows-layer");
  const taskbarWindows = document.getElementById("taskbar-windows");
  const clockEl = document.getElementById("clock");
  const startButton = document.getElementById("start-button");
  const themeToggle = document.getElementById("theme-toggle");
  const startMenu = document.getElementById("start-menu");
  const contextMenu = document.getElementById("context-menu");

  const LS_THEME = "webos-theme";
  const LS_ICON_ORDER = "webos-icon-order";
  const LS_NOTES_PREFIX = "webos-notes-";

  const loginOverlay = document.getElementById("login-overlay");
  const loginBtn = document.getElementById("login-btn");
  const loginUsername = document.getElementById("login-username");
  const loginPassword = document.getElementById("login-password");
  const loginError = document.getElementById("login-error");
  const taskbar = document.getElementById("taskbar");

  const handleLogin = () => {
    if (loginUsername.value === "root" && loginPassword.value === "root") {
      loginOverlay.classList.add("hidden");
      desktop.style.display = "block";
      taskbar.style.display = "flex";
    } else {
      loginError.classList.remove("hidden");
      loginPassword.value = "";
      loginPassword.focus();
    }
  };

  loginBtn.addEventListener("click", handleLogin);
  [loginUsername, loginPassword].forEach((el) => {
    el.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  });

  const HOME_PAGE = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root { color-scheme: dark; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #e5eefc;
    }
    .wrap { padding: 18px; }
    h1 { margin: 0 0 8px; font-size: 1.7rem; }
    p { margin: 0 0 18px; color: #aab6c9; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 12px;
    }
    button {
      border: 1px solid rgba(148, 163, 184, 0.22);
      background: rgba(255,255,255,0.08);
      color: inherit;
      border-radius: 14px;
      padding: 14px;
      cursor: pointer;
      text-align: left;
      font: inherit;
      min-height: 90px;
    }
    button:hover { background: rgba(255,255,255,0.14); }
    .title { font-weight: 700; margin-bottom: 6px; }
    .desc { font-size: 0.92rem; color: #aab6c9; }
    .note {
      margin-top: 14px;
      font-size: 0.9rem;
      color: #aab6c9;
      line-height: 1.4;
    }
    .bar {
      margin-top: 16px;
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .pill {
      border-radius: 999px;
      padding: 8px 12px;
      border: 1px solid rgba(148, 163, 184, 0.22);
      background: rgba(255,255,255,0.06);
      color: #e5eefc;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Browser Home</h1>
    <p>Choose a website to open in the frame. Some sites may block embedding in an iframe.</p>
    <div class="grid">
      <button data-url="https://example.com">
        <div class="title">Example</div>
        <div class="desc">A simple page for testing.</div>
      </button>
      <button data-url="https://en.wikipedia.org/wiki/Main_Page">
        <div class="title">Wikipedia</div>
        <div class="desc">Popular knowledge source.</div>
      </button>
    </div>
    <div class="bar">
      <span class="pill">Tip</span>
      <span class="pill">Use the address bar for any URL</span>
      <span class="pill">Back / forward work for typed or card navigation</span>
    </div>
    <div class="note">
      If a site refuses to show inside the frame, that is the website blocking iframe embedding.
    </div>
  </div>
  <script>
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-url]');
      if (!btn) return;
      parent.postMessage({ type: 'webos-browser-nav', url: btn.dataset.url }, '*');
    });
  </script>
</body>
</html>
`;

  const FILE_SYSTEM = {
    type: "folder",
    name: "Root",
    children: [
      {
        type: "folder",
        name: "Documents",
        children: [
          { type: "file", name: "Welcome.txt", content: "Welcome to WebOS.\\n\\nThis is a simulated file explorer." },
          { type: "file", name: "Todo.txt", content: "- Build something cool\\n- Open another note\\n- Keep exploring" }
        ]
      },
      {
        type: "folder",
        name: "Projects",
        children: [{ type: "file", name: "Readme.md", content: "# Projects\\n\\nThis is a sample project folder." }]
      },
      {
        type: "file",
        name: "about.txt",
        content: "WebOS demo files live in memory."
      }
    ]
  };

  const APPS = {
    clock: {
      id: "clock",
      name: "Clock",
      icon: "🕒",
      createWindow() {
        const root = document.createElement("div");
        root.className = "clock-app";

        const card = document.createElement("div");
        card.className = "clock-card";

        const time = document.createElement("div");
        time.className = "clock-time";

        const date = document.createElement("div");
        date.className = "clock-date";

        card.append(time, date);
        root.append(card);

        const update = () => {
          const now = new Date();
          time.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });
          date.textContent = now.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          });
        };

        update();
        const timer = setInterval(update, 1000);
        root._cleanup = () => clearInterval(timer);
        return root;
      }
    },

    calculator: {
      id: "calculator",
      name: "Calculator",
      icon: "🧮",
      createWindow() {
        const root = document.createElement("div");
        root.className = "calc-app";

        const display = document.createElement("div");
        display.className = "calc-display";

        const expr = document.createElement("div");
        expr.className = "calc-expression";

        const result = document.createElement("div");
        result.className = "calc-result";

        display.append(expr, result);

        const keys = document.createElement("div");
        keys.className = "calc-keys";

        let expression = "";
        let answer = "0";

        const sanitize = (input) =>
          input
            .replaceAll("×", "*")
            .replaceAll("÷", "/")
            .replaceAll("−", "-")
            .replace(/[^0-9+\-*/().% ]/g, "");

        const evaluate = (input) => {
          const clean = sanitize(input);
          if (!clean.trim()) return "";
          try {
            const value = Function(`"use strict"; return (${clean});`)();
            if (!Number.isFinite(value)) return "Error";
            return String(value);
          } catch {
            return "";
          }
        };

        const render = () => {
          expr.textContent = expression;
          const preview = evaluate(expression);
          result.textContent = preview || answer;
        };

        const press = (value) => {
          if (value === "C") {
            expression = "";
            answer = "0";
          } else if (value === "⌫") {
            expression = expression.slice(0, -1);
          } else if (value === "=") {
            const out = evaluate(expression);
            if (out && out !== "Error") {
              answer = out;
              expression = out;
            } else if (out === "Error") {
              answer = "Error";
            }
          } else {
            if (answer === "Error") {
              expression = "";
              answer = "0";
            }
            expression += value;
          }
          render();
        };

        const buttons = [
          "C", "⌫", "%", "÷",
          "7", "8", "9", "×",
          "4", "5", "6", "−",
          "1", "2", "3", "+",
          "0", ".", "(", ")",
          "="
        ];

        buttons.forEach((label) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className =
            "calc-key" +
            (["÷", "×", "−", "+", "%"].includes(label) ? " op" : "") +
            (label === "=" ? " eq" : "");
          btn.textContent = label;
          btn.addEventListener("click", () => press(label));
          keys.append(btn);
        });

        root.append(display, keys);
        render();
        root._cleanup = null;
        return root;
      }
    },

    browser: {
      id: "browser",
      name: "Browser",
      icon: "🌐",
      createWindow() {
        const root = document.createElement("div");
        root.className = "browser-app";

        const toolbar = document.createElement("div");
        toolbar.className = "browser-toolbar";

        const back = document.createElement("button");
        back.type = "button";
        back.className = "browser-btn";
        back.textContent = "←";
        back.title = "Back";

        const forward = document.createElement("button");
        forward.type = "button";
        forward.className = "browser-btn";
        forward.textContent = "→";
        forward.title = "Forward";

        const reload = document.createElement("button");
        reload.type = "button";
        reload.className = "browser-btn";
        reload.textContent = "↻";
        reload.title = "Reload";

        const url = document.createElement("input");
        url.className = "browser-url";
        url.spellcheck = false;
        url.autocomplete = "off";
        url.placeholder = "Enter URL (example.com)";
        url.value = "home";

        const go = document.createElement("button");
        go.type = "button";
        go.className = "browser-go";
        go.textContent = "Go";

        const frame = document.createElement("iframe");
        frame.className = "browser-frame";
        frame.referrerPolicy = "no-referrer";

        toolbar.append(back, forward, reload, url, go);
        root.append(toolbar, frame);

        const history = ["home"];
        let index = 0;
        let currentUrl = "home";
        let suppressLoadHandling = false;

        const syncButtons = () => {
          back.disabled = index <= 0;
          forward.disabled = index >= history.length - 1;
          back.style.opacity = back.disabled ? 0.5 : 1;
          forward.style.opacity = forward.disabled ? 0.5 : 1;
        };

        const normalize = (value) => {
          let input = value.trim();
          if (!input || input.toLowerCase() === "home") return "home";
          if (/^https?:\/\//i.test(input)) return input;
          if (/^localhost(:\d+)?(\/.*)?$/i.test(input)) return `http://${input}`;
          if (/^[\w.-]+\.[a-z]{2,}([/?#].*)?$/i.test(input)) return `https://${input}`;
          return input;
        };

        const loadHome = () => {
          suppressLoadHandling = true;
          frame.removeAttribute("src");
          frame.srcdoc = HOME_PAGE;
          currentUrl = "home";
          url.value = "home";
          syncButtons();
        };

        const loadExternal = (target) => {
          suppressLoadHandling = true;
          frame.removeAttribute("srcdoc");
          frame.src = target;
          currentUrl = target;
          url.value = target;
          syncButtons();
        };

        const navigate = (value, push = true) => {
          const target = normalize(value);
          if (!target) return;

          if (push) {
            history.splice(index + 1);
            history.push(target);
            index = history.length - 1;
          }

          if (target === "home") loadHome();
          else loadExternal(target);
        };

        const updateFromFrameIfPossible = () => {
          try {
            const href = frame.contentWindow.location.href;
            if (href && href !== currentUrl && href !== "about:srcdoc") {
              currentUrl = href;
              url.value = href;
              history.splice(index + 1);
              history.push(href);
              index = history.length - 1;
            }
          } catch {
            // Cross-origin pages can’t be inspected, so we keep the last requested URL.
          }
        };

        back.addEventListener("click", () => {
          if (index <= 0) return;
          index -= 1;
          const target = history[index];
          if (target === "home") loadHome();
          else loadExternal(target);
          syncButtons();
        });

        forward.addEventListener("click", () => {
          if (index >= history.length - 1) return;
          index += 1;
          const target = history[index];
          if (target === "home") loadHome();
          else loadExternal(target);
          syncButtons();
        });

        reload.addEventListener("click", () => {
          if (currentUrl === "home") {
            loadHome();
          } else {
            frame.src = frame.src;
          }
        });

        const submit = () => navigate(url.value, true);

        go.addEventListener("click", submit);
        url.addEventListener("keydown", (e) => {
          if (e.key === "Enter") submit();
        });

        frame.addEventListener("load", () => {
          if (suppressLoadHandling) {
            suppressLoadHandling = false;
            syncButtons();
            return;
          }
          updateFromFrameIfPossible();
          syncButtons();
        });

        window.addEventListener("message", (e) => {
          if (!e.data || e.data.type !== "webos-browser-nav") return;
          navigate(e.data.url, true);
        });

        loadHome();
        root._cleanup = null;
        return root;
      }
    },

    explorer: {
      id: "explorer",
      name: "File Explorer",
      icon: "📁",
      createWindow() {
        const root = document.createElement("div");
        root.className = "explorer-app";

        const sidebar = document.createElement("div");
        sidebar.className = "explorer-sidebar";

        const main = document.createElement("div");
        main.className = "explorer-main";

        root.append(sidebar, main);

        const renderMain = (node) => {
          main.innerHTML = "";
          const view = document.createElement("div");
          view.className = "file-view";

          if (node.type === "folder") {
            const title = document.createElement("div");
            title.className = "folder-title";
            title.textContent = node.name;

            const meta = document.createElement("div");
            meta.className = "file-meta";
            meta.textContent = `${node.children.length} item(s)`;

            const list = document.createElement("div");
            list.innerHTML = node.children
              .map((child) => `<div>${child.type === "folder" ? "📂" : "📄"} ${child.name}</div>`)
              .join("");

            view.append(title, meta, list);
          } else {
            const title = document.createElement("div");
            title.className = "folder-title";
            title.textContent = node.name;

            const meta = document.createElement("div");
            meta.className = "file-meta";
            meta.textContent = "Text file";

            const content = document.createElement("div");
            content.textContent = node.content;

            view.append(title, meta, content);
          }

          main.append(view);
        };

        const renderNode = (node, container, depth = 0) => {
          const wrapper = document.createElement("div");
          wrapper.className = "tree-node";

          const item = document.createElement("div");
          item.className = "tree-item";
          item.style.paddingLeft = `${10 + depth * 14}px`;

          const icon = document.createElement("span");
          icon.textContent = node.type === "folder" ? "📂" : "📄";

          const label = document.createElement("span");
          label.textContent = node.name;

          item.append(icon, label);
          wrapper.append(item);

          item.addEventListener("click", () => renderMain(node));

          if (node.type === "folder") {
            const childrenWrap = document.createElement("div");
            node.children.forEach((child) => renderNode(child, childrenWrap, depth + 1));
            wrapper.append(childrenWrap);
          }

          container.append(wrapper);
        };

        sidebar.innerHTML = "";
        renderNode(FILE_SYSTEM, sidebar);
        renderMain(FILE_SYSTEM);

        root._cleanup = null;
        return root;
      }
    },

    notes: {
      id: "notes",
      name: "Notes",
      icon: "📝",
      createWindow() {
        const root = document.createElement("div");
        root.className = "notes-app";

        const toolbar = document.createElement("div");
        toolbar.className = "notes-toolbar";

        const titleInput = document.createElement("input");
        titleInput.className = "notes-title-input";
        titleInput.placeholder = "Untitled note";

        const status = document.createElement("div");
        status.className = "small-muted";
        status.textContent = "Saved locally";

        const editor = document.createElement("textarea");
        editor.className = "notes-editor";
        editor.placeholder = "Start typing...";

        toolbar.append(titleInput, status);
        root.append(toolbar, editor);

        const instanceKey = `note-${crypto.randomUUID()}`;
        const saved = localStorage.getItem(LS_NOTES_PREFIX + instanceKey);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            titleInput.value = data.title || "";
            editor.value = data.text || "";
          } catch {}
        }

        let saveTimer = null;

        const save = () => {
          localStorage.setItem(
            LS_NOTES_PREFIX + instanceKey,
            JSON.stringify({
              title: titleInput.value,
              text: editor.value
            })
          );
          status.textContent = "Saved locally";
        };

        const scheduleSave = () => {
          status.textContent = "Saving…";
          clearTimeout(saveTimer);
          saveTimer = setTimeout(save, 250);
        };

        titleInput.addEventListener("input", scheduleSave);
        editor.addEventListener("input", scheduleSave);

        root._cleanup = () => clearTimeout(saveTimer);
        return root;
      }
    },

    settings: {
      id: "settings",
      name: "Settings",
      icon: "⚙️",
      createWindow() {
        const root = document.createElement("div");
        root.className = "settings-app";
        root.innerHTML = `
          <div class="settings-section">
            <h3>Wallpaper</h3>
            <div class="wallpaper-presets">
              <button class="preset-btn" data-val="linear-gradient(135deg, #0f172a, #1e293b)" title="Default" style="background: linear-gradient(135deg, #0f172a, #1e293b)"></button>
              <button class="preset-btn" data-val="#1e1e1e" title="Dark Gray" style="background: #1e1e1e"></button>
              <button class="preset-btn" data-val="#2563eb" title="Blue" style="background: #2563eb"></button>
              <button class="preset-btn" data-val="linear-gradient(to right, #f87171, #facc15)" title="Sunset" style="background: linear-gradient(to right, #f87171, #facc15)"></button>
            </div>
            <div class="settings-row">
              <input type="text" id="wall-url" class="notes-title-input" placeholder="Image URL">
              <button id="wall-url-apply" class="win-btn" style="width: auto; padding: 0 10px;">Apply</button>
            </div>
            <div class="settings-row">
              <label for="wall-file" class="small-muted">Upload Image:</label>
              <input type="file" id="wall-file" accept="image/*">
            </div>
          </div>
        `;

        root.addEventListener('click', (e) => {
          if (e.target.classList.contains('preset-btn')) {
            const val = e.target.dataset.val;
            localStorage.setItem("webos-wallpaper", val);
            loadWallpaper();
          }
        });

        root.querySelector('#wall-url-apply').addEventListener('click', () => {
          const url = root.querySelector('#wall-url').value;
          if (url) {
            localStorage.setItem("webos-wallpaper", url);
            loadWallpaper();
          }
        });

        root.querySelector('#wall-file').addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (rev) => {
              localStorage.setItem("webos-wallpaper", rev.target.result);
              loadWallpaper();
            };
            reader.readAsDataURL(file);
          }
        });

        return root;
      }
    },

    paint: {
      id: "paint",
      name: "Paint",
      icon: "🎨",
      createWindow() {
        const root = document.createElement("div");
        root.className = "paint-app";
        const toolbar = document.createElement("div");
        toolbar.className = "paint-toolbar";
        toolbar.innerHTML = `
          <select id="paint-tool" class="browser-url" style="width: auto;">
            <option value="brush">Brush</option>
            <option value="eraser">Eraser</option>
            <option value="rect">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="line">Line</option>
          </select>
          <input type="color" id="paint-color" value="#60a5fa" style="width: 40px; height: 36px; padding: 0; border: none; background: none; cursor: pointer;">
          <input type="range" id="paint-size" min="1" max="50" value="5" title="Brush Size">
          <button id="paint-clear" class="win-btn" style="width: auto; padding: 0 10px;">Clear</button>
          <button id="paint-save" class="win-btn" style="width: auto; padding: 0 10px;">Save</button>
        `;
        const canvasWrap = document.createElement("div");
        canvasWrap.className = "paint-canvas-wrap";
        const canvas = document.createElement("canvas");
        // We'll set size on mount or fixed
        canvas.width = 800;
        canvas.height = 600;
        canvasWrap.append(canvas);
        root.append(toolbar, canvasWrap);

        const ctx = canvas.getContext("2d");
        let drawing = false;
        let startX, startY;
        let snapshot;

        const getPos = (e) => {
          const rect = canvas.getBoundingClientRect();
          return [e.clientX - rect.left, e.clientY - rect.top];
        };

        canvas.addEventListener("pointerdown", (e) => {
          drawing = true;
          [startX, startY] = getPos(e);
          snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.strokeStyle = root.querySelector('#paint-color').value;
          ctx.lineWidth = root.querySelector('#paint-size').value;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          if (root.querySelector('#paint-tool').value === "brush") {
             ctx.moveTo(startX, startY);
          }
        });

        canvas.addEventListener("pointermove", (e) => {
          if (!drawing) return;
          const [curX, curY] = getPos(e);
          const tool = root.querySelector('#paint-tool').value;
          
          if (tool === "brush" || tool === "eraser") {
            ctx.strokeStyle = tool === "eraser" ? "#ffffff" : root.querySelector('#paint-color').value;
            ctx.lineTo(curX, curY);
            ctx.stroke();
          } else {
            ctx.putImageData(snapshot, 0, 0);
            ctx.beginPath();
            ctx.strokeStyle = root.querySelector('#paint-color').value;
            ctx.lineWidth = root.querySelector('#paint-size').value;
            if (tool === "rect") {
              ctx.strokeRect(startX, startY, curX - startX, curY - startY);
            } else if (tool === "circle") {
              const r = Math.sqrt((curX - startX)**2 + (curY - startY)**2);
              ctx.arc(startX, startY, r, 0, Math.PI * 2);
              ctx.stroke();
            } else if (tool === "line") {
              ctx.moveTo(startX, startY);
              ctx.lineTo(curX, curY);
              ctx.stroke();
            }
          }
        });

        canvas.addEventListener("pointerup", () => {
          drawing = false;
        });

        root.querySelector('#paint-clear').addEventListener('click', () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        root.querySelector('#paint-save').addEventListener('click', () => {
          const link = document.createElement("a");
          link.download = "paint-export.png";
          link.href = canvas.toDataURL();
          link.click();
        });
        
        return root;
      }
    },

    camera: {
      id: "camera",
      name: "Camera",
      icon: "📷",
      createWindow() {
        const root = document.createElement("div");
        root.className = "camera-app";

        const video = document.createElement("video");
        video.className = "camera-preview";
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true; // Often required for autoplay without interaction

        const controls = document.createElement("div");
        controls.className = "camera-controls";

        const capture = document.createElement("button");
        capture.className = "capture-btn";
        capture.title = "Take Photo";

        controls.append(capture);
        root.append(video, controls);

        let stream = null;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          const isLocal = window.location.protocol === "file:";
          root.innerHTML = `
            <div style="padding: 24px; color: #f87171; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 12px;">🚫</div>
              <div style="font-weight: 700; margin-bottom: 8px;">Camera Access Unavailable</div>
              <div style="font-size: 0.9rem; color: #aab6c9;">
                ${isLocal 
                  ? "Browsers block camera access when opening files directly via <code>file://</code>. Please use a local server (e.g. Live Server)." 
                  : "Your browser or connection (non-HTTPS) does not support camera access."}
              </div>
            </div>
          `;
          return root;
        }

        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((s) => {
            stream = s;
            video.srcObject = s;
            video.onloadedmetadata = () => video.play().catch(e => console.error("Video play failed:", e));
          })
          .catch((err) => {
            console.error("Camera error:", err);
            root.innerHTML = `
              <div style="padding: 24px; color: #f87171; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 12px;">⚠️</div>
                <div style="font-weight: 700; margin-bottom: 8px;">Camera Access Denied</div>
                <div style="font-size: 0.9rem; color: #aab6c9;">Please check your browser permissions.</div>
              </div>
            `;
          });

        capture.addEventListener("click", () => {
          if (!video.videoWidth) return;
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0);

          const link = document.createElement("a");
          link.download = `webos-photo-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();
        });

        root._cleanup = () => {
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
        };

        return root;
      }
    },

    calendar: {
      id: "calendar",
      name: "Calendar",
      icon: "📅",
      createWindow() {
        const root = document.createElement("div");
        root.className = "calendar-app";

        const now = new Date();
        let viewMonth = now.getMonth();
        let viewYear = now.getFullYear();

        const header = document.createElement("div");
        header.className = "calendar-header";

        const monthSelect = document.createElement("select");
        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        months.forEach((m, i) => {
          const opt = document.createElement("option");
          opt.value = i;
          opt.textContent = m;
          if (i === viewMonth) opt.selected = true;
          monthSelect.append(opt);
        });

        const yearSelect = document.createElement("select");
        for (let y = viewYear - 10; y <= viewYear + 10; y++) {
          const opt = document.createElement("option");
          opt.value = y;
          opt.textContent = y;
          if (y === viewYear) opt.selected = true;
          yearSelect.append(opt);
        }

        header.append(monthSelect, yearSelect);

        const grid = document.createElement("div");
        grid.className = "calendar-grid";

        const render = () => {
          grid.innerHTML = "";
          const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
          dayNames.forEach((name) => {
            const el = document.createElement("div");
            el.className = "cal-day-name";
            el.textContent = name;
            grid.append(el);
          });

          const firstDay = new Date(viewYear, viewMonth, 1).getDay();
          const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

          // Previous month days to fill the gap
          const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
          for (let i = firstDay - 1; i >= 0; i--) {
            const el = document.createElement("div");
            el.className = "cal-day other-month";
            el.textContent = prevMonthLastDay - i;
            grid.append(el);
          }

          for (let d = 1; d <= daysInMonth; d++) {
            const el = document.createElement("div");
            el.className = "cal-day";
            el.textContent = d;
            if (
              d === now.getDate() &&
              viewMonth === now.getMonth() &&
              viewYear === now.getFullYear()
            ) {
              el.classList.add("today");
            }
            grid.append(el);
          }

          // Next month days to fill the grid (total 42 cells = 6 weeks)
          const remaining = 42 - (firstDay + daysInMonth);
          for (let d = 1; d <= remaining; d++) {
            const el = document.createElement("div");
            el.className = "cal-day other-month";
            el.textContent = d;
            grid.append(el);
          }
        };

        monthSelect.addEventListener("change", (e) => {
          viewMonth = parseInt(e.target.value);
          render();
        });

        yearSelect.addEventListener("change", (e) => {
          viewYear = parseInt(e.target.value);
          render();
        });

        render();
        root.append(header, grid);
        return root;
      }
    }
  };

  const APP_LIST = Object.values(APPS);
  const DEFAULT_ICON_ORDER = APP_LIST.map((a) => a.id);

  function loadTheme() {
    const theme = localStorage.getItem(LS_THEME) || "dark";
    document.body.classList.toggle("theme-light", theme === "light");
    themeToggle.textContent = theme === "light" ? "☀" : "☾";
  }

  function loadWallpaper() {
    const saved = localStorage.getItem("webos-wallpaper");
    if (saved) {
      desktop.style.background = saved.startsWith('http') || saved.startsWith('data:') 
        ? `url("${saved}") center/cover no-repeat` 
        : saved;
    }
  }

  function toggleTheme() {
    const light = !document.body.classList.contains("theme-light");
    document.body.classList.toggle("theme-light", light);
    localStorage.setItem(LS_THEME, light ? "light" : "dark");
    themeToggle.textContent = light ? "☀" : "☾";
  }

  function getIconOrder() {
    const raw = localStorage.getItem(LS_ICON_ORDER);
    if (!raw) return [...DEFAULT_ICON_ORDER];
    try {
      const parsed = JSON.parse(raw);
      const filtered = parsed.filter((id) => APPS[id]);
      for (const id of DEFAULT_ICON_ORDER) {
        if (!filtered.includes(id)) filtered.push(id);
      }
      return filtered;
    } catch {
      return [...DEFAULT_ICON_ORDER];
    }
  }

  function saveIconOrder(order) {
    localStorage.setItem(LS_ICON_ORDER, JSON.stringify(order));
  }

  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function showMenu(menuEl, items, x, y) {
    menuEl.innerHTML = "";
    items.forEach((item) => {
      if (item === "---") {
        const sep = document.createElement("div");
        sep.className = "menu-sep";
        menuEl.append(sep);
        return;
      }
      const btn = document.createElement("button");
      btn.className = "menu-item";
      btn.type = "button";
      btn.innerHTML = `${item.icon ? `<span>${item.icon}</span>` : ""}<span>${item.label}</span>`;
      btn.addEventListener("click", () => {
        hideMenus();
        item.onClick?.();
      });
      menuEl.append(btn);
    });

    menuEl.classList.remove("hidden");
    menuEl.style.left = `${Math.min(x, window.innerWidth - 220)}px`;
    menuEl.style.top = `${Math.min(y, window.innerHeight - 220)}px`;
    menuEl.setAttribute("aria-hidden", "false");
  }

  function hideMenus() {
    startMenu.classList.add("hidden");
    startMenu.setAttribute("aria-hidden", "true");
    contextMenu.classList.add("hidden");
    contextMenu.setAttribute("aria-hidden", "true");
  }

  class WindowManager {
    constructor() {
      this.windows = new Map();
      this.z = 10;
      this.seq = 0;
    }

    open(appId, options = {}) {
      const app = APPS[appId];
      if (!app) return null;

      const id = `win-${++this.seq}`;
      const instanceNumber = [...this.windows.values()].filter((w) => w.appId === appId).length + 1;
      const content = app.createWindow();

      const win = document.createElement("div");
      win.className = "window";
      win.dataset.windowId = id;
      win.dataset.appId = appId;
      win.dataset.title = options.title || app.name;

      const left = Math.min(80 + this.windows.size * 24, Math.max(20, window.innerWidth - 340));
      const top = Math.min(70 + this.windows.size * 22, Math.max(20, window.innerHeight - 240));
      const width = options.width || (appId === "browser" ? 860 : appId === "explorer" ? 760 : 420);
      const height = options.height || (appId === "browser" ? 560 : appId === "explorer" ? 520 : 520);

      Object.assign(win.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${Math.min(width, window.innerWidth - 30)}px`,
        height: `${Math.min(height, window.innerHeight - 80)}px`,
        zIndex: String(++this.z)
      });

      const titlebar = document.createElement("div");
      titlebar.className = "titlebar";

      const leftWrap = document.createElement("div");
      leftWrap.className = "titlebar-left";

      const icon = document.createElement("span");
      icon.textContent = app.icon;

      const title = document.createElement("div");
      title.className = "window-title";
      title.textContent = `${options.title || app.name}${instanceNumber > 1 ? ` ${instanceNumber}` : ""}`;

      leftWrap.append(icon, title);

      const controls = document.createElement("div");
      controls.className = "window-controls";

      const minBtn = document.createElement("button");
      minBtn.className = "win-btn";
      minBtn.type = "button";
      minBtn.title = "Minimize";
      minBtn.textContent = "—";

      const maxBtn = document.createElement("button");
      maxBtn.className = "win-btn";
      maxBtn.type = "button";
      maxBtn.title = "Maximize";
      maxBtn.textContent = "▢";

      const closeBtn = document.createElement("button");
      closeBtn.className = "win-btn";
      closeBtn.type = "button";
      closeBtn.title = "Close";
      closeBtn.textContent = "✕";

      controls.append(minBtn, maxBtn, closeBtn);
      titlebar.append(leftWrap, controls);

      const body = document.createElement("div");
      body.className = "win-content";
      body.append(content);

      const resize = document.createElement("div");
      resize.className = "resize-handle";

      win.append(titlebar, body, resize);
      windowsLayer.append(win);

      const instance = {
        id,
        appId,
        app,
        title: title.textContent,
        win,
        body,
        content,
        minimized: false,
        maximized: false,
        prevBounds: null
      };
      this.windows.set(id, instance);

      const focus = () => this.focus(id);
      const minimize = () => this.minimize(id);
      const maximize = () => this.maximize(id);
      const close = () => this.close(id);

      win.addEventListener("pointerdown", focus);

      // Prevent app right-click from bubbling to desktop menu.
      win.addEventListener("contextmenu", (e) => {
        e.stopPropagation();
      });

      minBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        minimize();
      });
      maxBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        maximize();
      });
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        close();
      });

      // Dragging
      let drag = null;
      titlebar.addEventListener("pointerdown", (e) => {
        if (e.target.closest("button")) return;
        this.focus(id);

        const rect = win.getBoundingClientRect();
        const desktopRect = windowsLayer.getBoundingClientRect();

        if (instance.maximized) {
          this.restoreFromMaximize(instance);
        }

        drag = {
          offsetX: e.clientX - rect.left,
          offsetY: e.clientY - rect.top,
          desktopRect
        };

        titlebar.setPointerCapture(e.pointerId);
      });

      titlebar.addEventListener("pointermove", (e) => {
        if (!drag) return;
        if (instance.maximized) return;

        const maxLeft = drag.desktopRect.width - win.offsetWidth;
        const maxTop = drag.desktopRect.height - win.offsetHeight;
        const leftPos = Math.max(0, Math.min(e.clientX - drag.desktopRect.left - drag.offsetX, maxLeft));
        const topPos = Math.max(0, Math.min(e.clientY - drag.desktopRect.top - drag.offsetY, maxTop));

        win.style.left = `${leftPos}px`;
        win.style.top = `${topPos}px`;
      });

      titlebar.addEventListener("pointerup", () => {
        drag = null;
      });

      // Resize
      let resizing = null;
      resize.addEventListener("pointerdown", (e) => {
        if (instance.maximized) return;
        this.focus(id);

        const rect = win.getBoundingClientRect();
        resizing = {
          startX: e.clientX,
          startY: e.clientY,
          startW: rect.width,
          startH: rect.height
        };

        resize.setPointerCapture(e.pointerId);
        e.preventDefault();
      });

      resize.addEventListener("pointermove", (e) => {
        if (!resizing) return;
        const newW = Math.max(260, resizing.startW + (e.clientX - resizing.startX));
        const newH = Math.max(180, resizing.startH + (e.clientY - resizing.startY));
        win.style.width = `${Math.min(newW, windowsLayer.clientWidth)}px`;
        win.style.height = `${Math.min(newH, windowsLayer.clientHeight)}px`;
      });

      resize.addEventListener("pointerup", () => {
        resizing = null;
      });

      const task = document.createElement("button");
      task.className = "taskbar-item active";
      task.dataset.windowId = id;
      task.type = "button";
      task.innerHTML = `<span class="mini-icon">${app.icon}</span><span class="mini-title">${title.textContent}</span>`;
      task.addEventListener("click", () => {
        const current = this.windows.get(id);
        if (!current) return;
        if (current.minimized) {
          this.restore(id);
          this.focus(id);
        } else if (current.win.classList.contains("focused")) {
          this.minimize(id);
        } else {
          this.focus(id);
        }
      });
      taskbarWindows.append(task);

      this.focus(id);
      return id;
    }

    focus(id) {
      const instance = this.windows.get(id);
      if (!instance) return;

      this.z += 1;
      instance.win.style.zIndex = String(this.z);

      this.windows.forEach((w) => w.win.classList.toggle("focused", w.id === id));
      this.updateTaskbar();
    }

    minimize(id) {
      const instance = this.windows.get(id);
      if (!instance || instance.minimized) return;
      instance.minimized = true;
      instance.win.classList.add("minimized");
      this.updateTaskbar();
    }

    restore(id) {
      const instance = this.windows.get(id);
      if (!instance || !instance.minimized) return;
      instance.minimized = false;
      instance.win.classList.remove("minimized");
      this.focus(id);
      this.updateTaskbar();
    }

    maximize(id) {
      const instance = this.windows.get(id);
      if (!instance) return;

      if (instance.maximized) {
        this.restoreFromMaximize(instance);
        instance.maximized = false;
        instance.win.classList.remove("maximized");
        this.focus(id);
        this.updateTaskbar();
        return;
      }

      const rect = instance.win.getBoundingClientRect();
      instance.prevBounds = {
        left: rect.left - windowsLayer.getBoundingClientRect().left,
        top: rect.top - windowsLayer.getBoundingClientRect().top,
        width: rect.width,
        height: rect.height
      };

      instance.maximized = true;
      instance.win.classList.add("maximized");
      Object.assign(instance.win.style, {
        left: "0px",
        top: "0px",
        width: `${windowsLayer.clientWidth}px`,
        height: `${windowsLayer.clientHeight}px`
      });

      this.focus(id);
      this.updateTaskbar();
    }

    restoreFromMaximize(instance) {
      if (!instance.prevBounds) return;
      Object.assign(instance.win.style, {
        left: `${instance.prevBounds.left}px`,
        top: `${instance.prevBounds.top}px`,
        width: `${instance.prevBounds.width}px`,
        height: `${instance.prevBounds.height}px`
      });
      instance.maximized = false;
      instance.win.classList.remove("maximized");
      instance.prevBounds = null;
    }

    close(id) {
      const instance = this.windows.get(id);
      if (!instance) return;

      try {
        instance.content._cleanup?.();
      } catch {}

      const task = taskbarWindows.querySelector(`[data-window-id="${id}"]`);
      if (task) task.remove();
      instance.win.remove();
      this.windows.delete(id);

      const topmost = [...this.windows.values()].sort((a, b) => Number(b.win.style.zIndex) - Number(a.win.style.zIndex))[0];
      if (topmost) {
        this.windows.forEach((w) => w.win.classList.toggle("focused", w.id === topmost.id));
      }
      this.updateTaskbar();
    }

    updateTaskbar() {
      taskbarWindows.querySelectorAll(".taskbar-item").forEach((btn) => {
        const id = btn.dataset.windowId;
        const instance = this.windows.get(id);
        if (!instance) return;
        btn.classList.toggle("active", instance.win.classList.contains("focused"));
        btn.style.opacity = instance.minimized ? "0.65" : "1";
      });
    }

    closeAll() {
      [...this.windows.keys()].forEach((id) => this.close(id));
    }
  }

  const manager = new WindowManager();
  let iconOrder = getIconOrder();
  let draggingIconId = null;

  function renderDesktopIcons() {
    desktopIcons.innerHTML = "";

    iconOrder.forEach((appId) => {
      const app = APPS[appId];
      const iconBtn = document.createElement("button");
      iconBtn.className = "desktop-icon";
      iconBtn.draggable = true;
      iconBtn.type = "button";
      iconBtn.dataset.appId = appId;
      iconBtn.innerHTML = `
        <div class="icon-emoji">${app.icon}</div>
        <div class="icon-label">${app.name}</div>
      `;

      iconBtn.addEventListener("click", () => manager.open(appId));
      iconBtn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showMenu(contextMenu, [
          { label: `Open ${app.name}`, icon: "↵", onClick: () => manager.open(appId) },
          "---",
          { label: "Toggle theme", icon: "☼", onClick: toggleTheme }
        ], e.clientX, e.clientY);
      });

      iconBtn.addEventListener("dragstart", () => {
        draggingIconId = appId;
      });

      iconBtn.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      iconBtn.addEventListener("drop", (e) => {
        e.preventDefault();
        const target = e.currentTarget.dataset.appId;
        if (!draggingIconId || draggingIconId === target) return;

        const from = iconOrder.indexOf(draggingIconId);
        const to = iconOrder.indexOf(target);
        if (from < 0 || to < 0) return;

        iconOrder.splice(from, 1);
        iconOrder.splice(to, 0, draggingIconId);
        saveIconOrder(iconOrder);
        renderDesktopIcons();
      });

      desktopIcons.append(iconBtn);
    });
  }

  function buildStartMenu() {
    showMenu(startMenu, [
      ...APP_LIST.map((app) => ({
        label: app.name,
        icon: app.icon,
        onClick: () => manager.open(app.id)
      })),
      "---",
      { label: "Toggle theme", icon: "☼", onClick: toggleTheme },
      { label: "Close all windows", icon: "✕", onClick: () => manager.closeAll() }
    ], 12, window.innerHeight - 280);
  }

  startButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (startMenu.classList.contains("hidden")) {
      buildStartMenu();
    } else {
      hideMenus();
    }
  });

  themeToggle.addEventListener("click", toggleTheme);

  desktop.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (e.target.closest(".desktop-icon")) return;
    showMenu(contextMenu, [
      { label: "Change Wallpaper", icon: "🖼️", onClick: () => manager.open("settings") },
      { label: "New Note", icon: "📝", onClick: () => manager.open("notes") },
      { label: "Open File Explorer", icon: "📁", onClick: () => manager.open("explorer") },
      { label: "Toggle theme", icon: "☼", onClick: toggleTheme },
      "---",
      {
        label: "Reset icon order",
        icon: "↺",
        onClick: () => {
          iconOrder = [...DEFAULT_ICON_ORDER];
          saveIconOrder(iconOrder);
          renderDesktopIcons();
        }
      }
    ], e.clientX, e.clientY);
  });

  // Stop the desktop menu from appearing when right-clicking inside any app window.
  windowsLayer.addEventListener("contextmenu", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest("#start-menu") && !e.target.closest("#start-button")) {
      startMenu.classList.add("hidden");
      startMenu.setAttribute("aria-hidden", "true");
    }
    if (!e.target.closest("#context-menu") && !e.target.closest(".desktop-icon")) {
      contextMenu.classList.add("hidden");
      contextMenu.setAttribute("aria-hidden", "true");
    }
  });

  window.addEventListener("resize", () => {
    updateClock();
    manager.windows.forEach((instance) => {
      if (instance.maximized) {
        Object.assign(instance.win.style, {
          width: `${windowsLayer.clientWidth}px`,
          height: `${windowsLayer.clientHeight}px`
        });
      }
    });
  });

  loadTheme();
  loadWallpaper();
  renderDesktopIcons();
  updateClock();
  setInterval(updateClock, 1000);
})();
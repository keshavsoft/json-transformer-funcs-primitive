// Shared interactive enhancements for json-transformer-funcs-primitive documentation portal

document.addEventListener("DOMContentLoaded", () => {
    // 1. Auto-enhance code blocks with headers and copy buttons if not already wrapped
    document.querySelectorAll("pre").forEach((preEl) => {
        if (preEl.closest(".code-wrapper")) return;

        const codeEl = preEl.querySelector("code");
        if (!codeEl) return;

        const wrapper = document.createElement("div");
        wrapper.className = "code-wrapper";

        const header = document.createElement("div");
        header.className = "code-header";

        const langSpan = document.createElement("span");
        langSpan.className = "code-lang";
        langSpan.innerHTML = "<span>📄</span> Snippet";

        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-button";
        copyBtn.type = "button";
        copyBtn.innerHTML = "<span>📋</span> Copy";

        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(codeEl.innerText.trim());
                copyBtn.innerHTML = "<span>✓</span> Copied!";
                copyBtn.classList.add("copied");
                setTimeout(() => {
                    copyBtn.innerHTML = "<span>📋</span> Copy";
                    copyBtn.classList.remove("copied");
                }, 1800);
            } catch (err) {
                console.error("Failed to copy code: ", err);
            }
        });

        header.appendChild(langSpan);
        header.appendChild(copyBtn);

        preEl.parentNode.insertBefore(wrapper, preEl);
        wrapper.appendChild(header);
        wrapper.appendChild(preEl);
    });

    // 2. Attach copy handlers to any explicit copy-button elements
    document.querySelectorAll(".copy-button").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const targetId = btn.getAttribute("data-target");
            const targetEl = targetId ? document.getElementById(targetId) : btn.closest(".code-wrapper")?.querySelector("code");
            if (!targetEl) return;

            try {
                const text = targetEl.value || targetEl.innerText;
                await navigator.clipboard.writeText(text.trim());
                const originalHtml = btn.innerHTML;
                btn.innerHTML = "<span>✓</span> Copied!";
                btn.classList.add("copied");
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove("copied");
                }, 1800);
            } catch (err) {
                console.error("Failed to copy: ", err);
            }
        });
    });
});

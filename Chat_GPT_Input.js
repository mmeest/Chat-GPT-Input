// Loome nupu
const button = document.createElement("button");
button.textContent = "Lisa Fail";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Leia element mille ette lisada
const targetElement = document.querySelector(".m-0");

if (targetElement && targetElement.parentNode) {
    // Lisame nupu antud elemendi ette
    targetElement.parentNode.insertBefore(button, targetElement);

    // Loome progressbar'i
    const progressContainer = document.createElement("div");
    progressContainer.style.width = "99%";
    progressContainer.style.height = "5px";
    progressContainer.style.backgroundColor = "grey";
    progressContainer.style.margin = "5px";
    progressContainer.style.borderRadius = "5px";

    // Loome progress elemendi
    const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "100%";
    progressBar.style.backgroundColor = "blue";
    progressContainer.appendChild(progressBar);

    // Lisame progressbar'i enne valitud elementi
    targetElement.parentNode.insertBefore(progressContainer, targetElement);

    // Lisame nupule click-event'i
    button.addEventListener("click", async () => {
        // Loome Input elemendi
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt,.js,.py,.html,.css,.json,.csv,.cs,.java";

        // Lisame input elemendile event listener'i
        input.addEventListener("change", async () => {
            const file = input.files[0];
            if (!file) return;

            const text = await file.text();
            const chunkSize = 15000;
            const numChunks = Math.ceil(text.length / chunkSize);

            for (let i = 0; i < numChunks; i++) {
                const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);

                // Lisame lõigu vestlusse
                await submitConversation(chunk, i + 1, file.name);

                // Uuendame progressbar'i
                progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

                // Ootame ChatGPT valmidust
                let chatgptReady = false;
                while (!chatgptReady) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
                }
            }

            // Muudame progressbar'i roheliseks
            progressBar.style.backgroundColor = "green";
        });

        // Klikime input elemendile, et käivitada faili valiku dialoog
        input.click();
    });
} else {
    console.error("Sihtmärgi elementi ei leitud!");
}

// Vestlusse lisamise funktsioon
async function submitConversation(text, part, filename) {
    const textarea = document.querySelector("textarea[tabindex='0']");
    if (!textarea) {
        console.error("Tekstiala ei leitud!");
        return;
    }

    const enterKeyEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
    });

    textarea.value = `Part ${part} of ${filename}: \n\n ${text}`;
    textarea.dispatchEvent(enterKeyEvent);
}

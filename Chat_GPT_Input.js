// Loome nupu
const button = document.createElement("button");
button.textContent = "Lisa Fail";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Leia element, mille ette lisada
const targetElement = document.querySelector(".m-0");

// Lisame nupu antud elemendi ette
if (targetElement && targetElement.parentNode) {
    targetElement.parentNode.insertBefore(button, targetElement);
} else {
    console.error("⚠️ Ei leidnud sihtmärgi elementi, kuhu nupp lisada!");
}

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
if (targetElement && targetElement.parentNode) {
    targetElement.parentNode.insertBefore(progressContainer, targetElement);
} else {
    console.error("⚠️ Ei leidnud sihtmärgi elementi, kuhu progressbar lisada!");
}

// Lisame nupule clickEvent'i
button.addEventListener("click", async () => {
    // Loome Input elemendi
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.js,.py,.html,.css,.json,.csv,.cs,.java";

    // Lisame input elemendile event listener'i
    input.addEventListener("change", async () => {
        // Loeme faili tekstina
        const file = input.files[0];
        if (!file) {
            console.error("⚠️ Faili ei valitud!");
            return;
        }

        const text = await file.text();

        // Lõikame faili 15000 tähemärgi suurusteks tükkideks
        const chunkSize = 15000;
        const numChunks = Math.ceil(text.length / chunkSize);
        for (let i = 0; i < numChunks; i++) {
            const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);

            // Lisame lõigu vestlusse
            await submitConversation(chunk, i + 1, numChunks, file.name);

            // Uuendame progressbar'i
            progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

            // Ootame ChatGPT valmidust
            let chatgptReady = false;
            while (!chatgptReady) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
            }
        }

        // Lõpetame progressbar'i uuendamise
        progressBar.style.backgroundColor = "blue";
    });

    // Klikime input elemendile, et avada failivaliku dialoog
    input.click();
});

// Vestlusse lisamise funktsioon (UUS UI!)
async function submitConversation(text, part, totalParts, filename) {
    const inputDiv = document.querySelector("#prompt-textarea");

    if (!inputDiv) {
        console.error("⚠️ Sisestusvälja (#prompt-textarea) ei leitud!");
        return;
    }

    try {
        // Sisestame teksti
        inputDiv.textContent = `📂 Fail: ${filename} | Osa ${part}/${totalParts}\n\n${text}`;

        // Käivitame "input" sündmuse, et simuleerida kasutaja kirjutamist
        inputDiv.dispatchEvent(new Event("input", { bubbles: true }));

        // Otsime saatmise nupu
        const sendButton = document.querySelector("button[data-testid='send-button']") ||
                           document.querySelector("button.absolute");

        if (sendButton) {
            sendButton.click();
        } else {
            console.error("⚠️ Saatmise nuppu ei leitud!");
        }

        // Lühike paus, et vältida liiga kiiret saatmist
        await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
        console.error(`❌ Tõrge vestlusse saatmisel (osa ${part}):`, error);
    }
}

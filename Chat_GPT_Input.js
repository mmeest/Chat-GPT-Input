// Loome nupu
const button = document.createElement("button");
// button.InnerText = "Lisa Fail";
button.textContent = "Lisa Fail";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Leia element mille ette lisada
const targetElement = document.querySelector(".m-0");

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

// Lisame nupule clicEvent'i
button.addEventListener("click", async () =>{
    // Loome Input elemendi
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.js,.py,.html,.css,.json,.csv,.cs,.java";

    // Lisame input elemendile event listener'i
    input.addEventListener("change", async () => {
        // Loeme faili tekstina
        const file = input.files[0];
        const text = await file.text();

        // Lõikame faili 15000 karakteri suurusteks tükkideks
        const chunkSize = 15000;
        const numChunks = Math.ceil(text.length / chunkSize);
        for (let i = 0; i < numChunks; i++){
            const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);

            // Lisame lõigu vestlusse
            await submitConversation(chunk, i + 1, file.name);

            // Uuendame progressbar'i
            //progressBar.style.width = '${((i + 1) / numChunks) * 100}%';
            progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

            // Ootame ChatGPT valmidust
            let chatgptReady = false;
            while (!chatgptReady){
                await new Promise((resolve) => setTimeout(resolve, 1000));
                chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
            }
        }

        // Lõpetamie progressbar'i uuendamise
        progressBar.style.backgroundColor = "blue";
    });

    // Klikime input elemendile, et käivitada faili valiku dialoog
    input.click();
});

// Vestlusse lisamise funktsioon
async function submitConversation(text, part, filename){
    const textarea = document.querySelector("textarea[tabindex='0']");
    const enterKeyEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        keyCode: 13,
    });
    //textarea.value = 'Part ${part} of ${filename}: \n\n ${text}';
    textarea.value = `Part ${part} of ${filename}: \n\n ${text}`;
    textarea.dispatchEvent(enterKeyEvent);
}

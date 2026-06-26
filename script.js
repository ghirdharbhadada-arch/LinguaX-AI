/* ==============================
   LinguaX AI
   script.js (Part 1)
================================ */

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");

const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");

const copyBtn = document.getElementById("copyBtn");
const speakBtn = document.getElementById("speakBtn");
const voiceBtn = document.getElementById("voiceBtn");
const downloadBtn = document.getElementById("downloadBtn");

const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");

const loading = document.getElementById("loading");

const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");

const historyList = document.getElementById("historyList");

/* ==============================
   Languages
================================ */

const languages = {

"auto":"Auto Detect",

"en":"English",

"hi":"Hindi",

"fr":"French",

"de":"German",

"es":"Spanish",

"it":"Italian",

"pt":"Portuguese",

"ru":"Russian",

"ja":"Japanese",

"ko":"Korean",

"zh":"Chinese",

"ar":"Arabic",

"tr":"Turkish",

"bn":"Bengali",

"ur":"Urdu",

"ta":"Tamil",

"te":"Telugu",

"mr":"Marathi",

"gu":"Gujarati",

"pa":"Punjabi",

"ml":"Malayalam",

"kn":"Kannada"

};

/* ==============================
   Load Languages
================================ */

for(let code in languages){

fromLanguage.innerHTML +=
`<option value="${code}">
${languages[code]}
</option>`;

if(code!="auto"){

toLanguage.innerHTML +=
`<option value="${code}">
${languages[code]}
</option>`;

}

}

fromLanguage.value="en";

toLanguage.value="hi";

/* ==============================
 Character Counter
================================ */

inputText.addEventListener("input",()=>{

charCount.innerText=inputText.value.length;

wordCount.innerText=inputText.value
.trim()
.split(/\s+/)
.filter(word=>word!="")
.length;

});

/* ==============================
 Swap Languages
================================ */

swapBtn.onclick = () => {

    const tempLang = fromLanguage.value;
    fromLanguage.value = toLanguage.value;
    toLanguage.value = tempLang;

    const tempText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = tempText;

    charCount.innerText = inputText.value.length;

    wordCount.innerText = inputText.value
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

};
/* ==============================
   Translate Text
================================ */

translateBtn.onclick = async () => {

    const text = inputText.value.trim();

    if (!text) {
        alert("Please enter some text.");
        return;
    }

    loading.style.display = "block";

    try {

        const url =
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLanguage.value}|${toLanguage.value}`;

        const response = await fetch(url);

        const data = await response.json();

        outputText.value = data.responseData.translatedText;

        saveHistory();

    } catch (err) {

        console.log(err);

        alert("Translation Failed.");

    }

    loading.style.display = "none";

};

/* ==============================
   Copy Button
================================ */

copyBtn.onclick = async () => {

    if(outputText.value.trim() === ""){

        alert("Nothing to copy!");

        return;

    }

    try{

        await navigator.clipboard.writeText(outputText.value);

        alert("Copied Successfully ✅");

    }

    catch(err){

        outputText.select();

        document.execCommand("copy");

        alert("Copied Successfully ✅");

    }

};

/* ==============================
   Clear Button
================================ */

clearBtn.onclick = () => {

    inputText.value = "";
    outputText.value = "";

    charCount.innerText = "0";
    wordCount.innerText = "0";

    inputText.focus();

};

/* ==============================
   Download Translation
================================ */

downloadBtn.onclick=()=>{

if(outputText.value=="") return;

const blob=new Blob(

[outputText.value],

{type:"text/plain"}

);

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="translation.txt";

a.click();

};
/* ==============================
   Text To Speech
================================ */

speakBtn.onclick=()=>{

if(outputText.value=="") return;

const speech=new SpeechSynthesisUtterance(outputText.value);

speech.lang=toLanguage.value;

speech.rate=1;

speech.pitch=1;

speechSynthesis.speak(speech);

};

/* ==============================
   Voice Input
================================ */

voiceBtn.onclick=()=>{

const SpeechRecognition=

window.SpeechRecognition||

window.webkitSpeechRecognition;

if(!SpeechRecognition){

alert("Speech Recognition is not supported.");

return;

}

const recognition=new SpeechRecognition();

recognition.lang="en-US";

recognition.start();

recognition.onresult=(event)=>{

inputText.value=event.results[0][0].transcript;

charCount.innerText=inputText.value.length;

wordCount.innerText=inputText.value
.trim()
.split(/\s+/)
.filter(word=>word!="")
.length;

};

};

/* ==============================
   Dark Mode
================================ */

themeBtn.onclick=()=>{

document.body.classList.toggle("light-mode");

themeBtn.innerHTML=document.body.classList.contains("light-mode")

?'<i class="fa-solid fa-sun"></i>'

:'<i class="fa-solid fa-moon"></i>';

};

/* ==============================
   Translation History
================================ */

function saveHistory(){

let history=JSON.parse(localStorage.getItem("linguax"))||[];

history.unshift({

input:inputText.value,

output:outputText.value,

time:new Date().toLocaleString()

});

history=history.slice(0,10);

localStorage.setItem("linguax",JSON.stringify(history));

loadHistory();

}

function loadHistory(){

const history=JSON.parse(localStorage.getItem("linguax"))||[];

historyList.innerHTML="";

history.forEach(item=>{

historyList.innerHTML+=`

<div class="history-item">

<p><strong>${item.input}</strong></p>

<p>${item.output}</p>

<small>${item.time}</small>

<hr>

</div>

`;

});

}

loadHistory();

/* ==============================
   Paste Button
================================ */

document.getElementById("pasteBtn").onclick=async()=>{

const text=await navigator.clipboard.readText();

inputText.value=text;

charCount.innerText=text.length;

wordCount.innerText=text.trim().split(/\s+/).filter(Boolean).length;

};

/* ==============================
   Save History Button
================================ */

document.getElementById("saveHistory").onclick=saveHistory;

/* ==============================
   Clear History
================================ */

document.getElementById("clearHistory").onclick=()=>{

localStorage.removeItem("linguax");

loadHistory();

};

/* ==============================
   END OF SCRIPT
================================ */
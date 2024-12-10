const quoteElement = document.getElementById("quote");
const inputElement = document.getElementById("input");
const startBtn = document.getElementById("start-btn");
const resultsElement = document.getElementById("results");

let startTime, selectedQuote;

// Predefined list of 10 sentences for offline use
const offlineQuotes = [
      "The quick brown fox jumps over the lazy dog",
      "A journey of a thousand miles begins with a single step",
      "To be or not to be, that is the question",
      "All that glitters is not gold",
      "The early bird catches the worm",
      "Actions speak louder than words",
      "When in Rome, do as the Romans do",
      "Time flies when you're having fun",
      "Beauty is in the eye of the beholder",
      "You can't judge a book by its cover"
    ];

// Function to fetch a new quote from the API
async function fetchQuote() {
    try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        return data.quote;
    } catch (error) {
        console.error("Error fetching quote:", error);
        return null;
    }
}

// Set the quote for testing
async function setQuote() {
    let fetchedQuote = await fetchQuote();
    if (!fetchedQuote) {
        // If fetching fails, fallback to predefined quotes
        fetchedQuote = offlineQuotes[Math.floor(Math.random() * offlineQuotes.length)];
    }

    let formattedQuote = fetchedQuote.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase(); // Remove special characters and convert to lowercase
    const words = formattedQuote.split(" ").slice(0, 10).join(" "); // Keep only the first 10 words
    selectedQuote = words.charAt(0).toUpperCase() + words.slice(1); // Capitalize the first letter only
    quoteElement.textContent = selectedQuote;
}

async function startTest() {
    await setQuote();
    inputElement.value = "";
    inputElement.disabled = false;
    inputElement.focus();
    resultsElement.innerHTML = "";
    startTime = new Date().getTime();
    startBtn.textContent = "Restart Test";
}

function calculateResults() {
    const inputText = inputElement.value.trim();
    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000;

    const inputWords = inputText.split(" ");
    const quoteWords = selectedQuote.split(" ");

    let incorrectCharacters = 0;
    for (let i = 0; i < inputWords.length; i++) {
        if (inputWords[i].toLowerCase() !== quoteWords[i].toLowerCase()) {
            incorrectCharacters++;
        }
    }

    const accuracy = ((1 - (incorrectCharacters / inputWords.length)) * 100).toFixed(2);
    const wpm = (inputWords.length / (timeTaken / 60)).toFixed(2);

    resultsElement.innerHTML = `
        <p><strong>Incorrect Characters:</strong> ${incorrectCharacters}</p>
        <p><strong>Words Per Minute (WPM):</strong> ${wpm}</p>
        <p><strong>Accuracy:</strong> ${accuracy}%</p>
        <p><strong>Time Taken:</strong> ${timeTaken.toFixed(2)} seconds</p>
      `;
}

inputElement.addEventListener("input", () => {
    const inputText = inputElement.value.trim().toLowerCase();
    const quoteText = selectedQuote.trim().toLowerCase();

    // Check if the last word is correct and stop the test
    const inputWords = inputText.split(" ");
    const quoteWords = quoteText.split(" ");

    if (inputWords.length >= quoteWords.length && inputWords[inputWords.length - 1] === quoteWords[quoteWords.length - 1].toLowerCase()) {
        inputElement.disabled = true;
        calculateResults();
    }
});

startBtn.addEventListener("click", startTest);

// Initial setup: load a quote from the predefined list
setQuote();
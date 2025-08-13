let quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "inspiration",
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    category: "life",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "dreams",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    category: "inspiration",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    category: "success",
  },
];

const showQuoteButton = document.getElementById("newQuote");

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <p><strong>Category: ${randomQuote.category}</strong></p>
  `;
}

showQuoteButton.addEventListener("click", showRandomQuote);

function createAddQuoteForm() {
  // Form elements are already in HTML as specified in the instructions
  console.log("Add quote form elements are present in the DOM");
}

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory,
    };

    // Update the quotes array
    quotes.push(newQuote);

    saveQuote();

    // Update the DOM dynamically using createElement and appendChild
    const quoteDisplay = document.getElementById("quoteDisplay");

    // Clear previous content
    quoteDisplay.innerHTML = "";

    // Create quote text element
    const quoteTextElement = document.createElement("p");
    quoteTextElement.textContent = `"${newQuote.text}"`;

    // Create category element
    const categoryElement = document.createElement("p");
    const strongElement = document.createElement("strong");
    strongElement.textContent = `Category: ${newQuote.category}`;
    categoryElement.appendChild(strongElement);

    // Append elements to the display
    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(categoryElement);

    // Clear the input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

function saveQuote() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuote();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Use JSON.stringify() when saving quotes to localStorage
// Use JSON.parse() when loading quotes from localStorage
// Task 2: Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add category options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Task 2: Filter quotes function
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  // Save filter preference to localStorage
  localStorage.setItem('selectedCategory', selectedCategory);
  
  if (selectedCategory === 'all') {
    // Show random quote from all quotes
    showRandomQuote();
  } else {
    // Filter and show quote from selected category
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p><strong>Category: ${randomQuote.category}</strong></p>
      `;
    } else {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
    }
  }
}

// Task 2: Load last selected filter
function loadLastSelectedFilter() {
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    document.getElementById('categoryFilter').value = savedCategory;
    filterQuotes();
  }
}

// Task 3: Sync with server simulation
async function syncWithServer() {
  try {
    // Simulate fetching data from JSONPlaceholder
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
    const posts = await response.json();
    
    // Convert posts to quotes format
    const serverQuotes = posts.map(post => ({
      text: post.title,
      category: 'server'
    }));
    
    // Simple conflict resolution: server data takes precedence
    const existingTexts = quotes.map(q => q.text);
    const newQuotes = serverQuotes.filter(sq => !existingTexts.includes(sq.text));
    
    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      populateCategories();
      alert(`Synced ${newQuotes.length} new quotes from server!`);
    } else {
      alert('No new quotes from server.');
    }
  } catch (error) {
    alert('Failed to sync with server.');
    console.error('Sync error:', error);
  }
}

// Task 3: Periodic sync (every 30 seconds for demo)
function startPeriodicSync() {
  setInterval(syncWithServer, 30000);
}

// Initialize application
window.addEventListener('DOMContentLoaded', function() {
  // Load existing quotes from localStorage
  loadQuotes();
  
  // Populate categories dropdown
  populateCategories();
  
  // Load last selected filter
  loadLastSelectedFilter();
  
  // Show initial random quote
  showRandomQuote();
  
  // Start periodic sync
  startPeriodicSync();
});
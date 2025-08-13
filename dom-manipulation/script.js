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

    quotes.push(newQuote);
    saveQuotes(); // Fixed function name

    // Update the DOM dynamically using createElement and appendChild
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    const quoteTextElement = document.createElement("p");
    quoteTextElement.textContent = `"${newQuote.text}"`;

    const categoryElement = document.createElement("p");
    const strongElement = document.createElement("strong");
    strongElement.textContent = `Category: ${newQuote.category}`;
    categoryElement.appendChild(strongElement);

    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(categoryElement);

    // Update categories after adding new quote
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

// Fixed function name to match calls
function saveQuotes() {
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
    saveQuotes();
    populateCategories(); // Update categories after import
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

// Task 2: Populate categories dynamically - FIXED
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add category options using createElement and appendChild
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Task 2: Filter quotes function - FIXED with advanced DOM manipulation
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  // Save filter preference to localStorage
  localStorage.setItem('selectedCategory', selectedCategory);
  
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  if (selectedCategory === 'all') {
    showRandomQuote();
  } else {
    const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    
    // Clear previous content
    quoteDisplay.innerHTML = '';
    
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      
      // Use createElement and appendChild for DOM manipulation
      const quoteTextElement = document.createElement('p');
      quoteTextElement.textContent = `"${randomQuote.text}"`;
      
      const categoryElement = document.createElement('p');
      const strongElement = document.createElement('strong');
      strongElement.textContent = `Category: ${randomQuote.category}`;
      categoryElement.appendChild(strongElement);
      
      quoteDisplay.appendChild(quoteTextElement);
      quoteDisplay.appendChild(categoryElement);
    } else {
      const noQuotesElement = document.createElement('p');
      noQuotesElement.textContent = 'No quotes available for this category.';
      quoteDisplay.appendChild(noQuotesElement);
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

// Task 3: fetchQuotesFromServer function - fetch data from server using mock API
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    
    return posts.map(post => ({
      text: post.title,
      category: 'server'
    }));
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    return [];
  }
}

// Task 3: postQuotesToServer function - post data to server using mock API
async function postQuotesToServer(quotesToPost) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Quotes Update',
        body: JSON.stringify(quotesToPost),
        userId: 1
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error posting quotes to server:', error);
    throw error;
  }
}

// Task 3: syncQuotes function - sync local data with server and handle conflicts
async function syncQuotes() {
  try {
    // First, post current quotes to server
    await postQuotesToServer(quotes);
    
    // Then fetch quotes from server
    const serverQuotes = await fetchQuotesFromServer();
    
    if (serverQuotes.length > 0) {
      // Simple conflict resolution: avoid duplicates based on text
      const existingTexts = quotes.map(q => q.text.toLowerCase());
      const newQuotes = serverQuotes.filter(sq => 
        !existingTexts.includes(sq.text.toLowerCase())
      );
      
      if (newQuotes.length > 0) {
        quotes.push(...newQuotes);
        saveQuotes();
        populateCategories();
        
        // Create notification element for data updates
        createSyncNotification(`Quotes synced with server!`);
      } else {
        createSyncNotification('No new quotes from server.');
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
    createSyncNotification('Failed to sync with server.');
  }
}

// Task 3: Create UI notification for sync updates
function createSyncNotification(message) {
  // Check if notification area exists, if not create it
  let notificationArea = document.getElementById('syncNotification');
  if (!notificationArea) {
    notificationArea = document.createElement('div');
    notificationArea.id = 'syncNotification';
    notificationArea.style.cssText = `
      padding: 10px;
      margin: 10px 0;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      color: #155724;
    `;
    document.body.appendChild(notificationArea);
  }
  
  notificationArea.textContent = message;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (notificationArea) {
      notificationArea.style.display = 'none';
    }
  }, 3000);
}

// Task 3: Sync with server simulation (keeping existing function)
async function syncWithServer() {
  return await syncQuotes(); // Use the syncQuotes function
}

// Task 3: Periodic sync - check for new quotes from server periodically
function startPeriodicSync() {
  // Initial sync after page load
  setTimeout(async () => {
    await syncQuotes();
  }, 2000);
  
  // Then sync every 30 seconds
  setInterval(async () => {
    await syncQuotes();
  }, 30000);
}

// Initialize application
window.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  populateCategories();
  loadLastSelectedFilter();
  showRandomQuote();
  startPeriodicSync();
});
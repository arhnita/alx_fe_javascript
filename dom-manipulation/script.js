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

const showQuoteButton = document.getElementById('newQuote');


function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available.</p>';
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <p><strong>Category: ${randomQuote.category}</strong></p>
  `;
}

showQuoteButton.addEventListener('click', showRandomQuote);

function createAddQuoteForm() {
  // Form elements are already in HTML as specified in the instructions
  console.log('Add quote form elements are present in the DOM');
}



function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };
        
        // Update the quotes array
        quotes.push(newQuote);
        
        // Update the DOM dynamically using createElement and appendChild
        const quoteDisplay = document.getElementById('quoteDisplay');
        
        // Clear previous content
        quoteDisplay.innerHTML = '';
        
        // Create quote text element
        const quoteTextElement = document.createElement('p');
        quoteTextElement.textContent = `"${newQuote.text}"`;
        
        // Create category element
        const categoryElement = document.createElement('p');
        const strongElement = document.createElement('strong');
        strongElement.textContent = `Category: ${newQuote.category}`;
        categoryElement.appendChild(strongElement);
        
        // Append elements to the display
        quoteDisplay.appendChild(quoteTextElement);
        quoteDisplay.appendChild(categoryElement);
        
        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}



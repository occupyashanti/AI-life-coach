const OPENAI_API_KEY = 'actual API key';
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let conversationHistory = [{
  role: 'system',
  content: `You are a professional life coach AI assistant. Your approach is:
    - Empathetic and supportive
    - Solution-focused
    - Action-oriented
    - Encouraging personal growth
    - Professional but warm
    Provide practical advice and actionable steps when helping users with their life challenges.`
}];

function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
  messageDiv.textContent = content;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<span></span><span></span><span></span>';
  indicator.id = 'typing-indicator';
  chatMessages.appendChild(indicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

async function getAIResponse(userMessage) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-turbo',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    return 'I apologize, but I encountered an error. Please try again.';
  }
}

async function handleUserInput() {
  const message = userInput.value.trim();
  if (!message) return;

  // Clear input
  userInput.value = '';

  // Add user message to UI
  addMessage(message, true);

  // Add to conversation history
  conversationHistory.push({
    role: 'user',
    content: message
  });

  // Show typing indicator
  addTypingIndicator();

  // Get AI response
  const aiResponse = await getAIResponse(message);
  
  // Remove typing indicator and add AI response
  removeTypingIndicator();
  addMessage(aiResponse);

  // Add to conversation history
  conversationHistory.push({
    role: 'assistant',
    content: aiResponse
  });
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleUserInput();
  }
});

// Focus input on load
userInput.focus();
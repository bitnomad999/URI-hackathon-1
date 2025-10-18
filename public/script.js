const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const buttonText = document.getElementById('buttonText');
const buttonLoader = document.getElementById('buttonLoader');

// Remove welcome message when first message is sent
let isFirstMessage = true;

// Handle Enter key to send message (Shift+Enter for new line)
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Remove welcome message on first interaction
    if (isFirstMessage) {
        const welcomeMessage = chatContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        isFirstMessage = false;
    }
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Disable input while processing
    setLoading(true);
    
    // Create placeholder for AI response
    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.className = 'message ai';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = ''; // Start empty
    aiMessageDiv.appendChild(contentDiv);
    chatContainer.appendChild(aiMessageDiv);
    
    try {
        // Send request to server with streaming
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        // Read the stream
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            // Decode the chunk
            buffer += decoder.decode(value, { stream: true });
            
            // Process complete SSE messages
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep incomplete line in buffer
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6); // Remove 'data: ' prefix
                    
                    if (data === '[DONE]') {
                        // Stream finished
                        break;
                    }
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.text) {
                            // Append text to the message
                            contentDiv.textContent += parsed.text;
                            // Auto-scroll to bottom
                            chatContainer.scrollTop = chatContainer.scrollHeight;
                        } else if (parsed.error) {
                            contentDiv.textContent = `Error: ${parsed.error}`;
                        }
                    } catch (e) {
                        // Ignore parse errors
                    }
                }
            }
        }
        
    } catch (error) {
        contentDiv.textContent = `Error: ${error.message}`;
    } finally {
        setLoading(false);
        messageInput.focus();
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setLoading(loading) {
    sendButton.disabled = loading;
    messageInput.disabled = loading;
    
    if (loading) {
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-block';
    } else {
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
}

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});



document.addEventListener('DOMContentLoaded', function() {
    function toggleChatbot() {
        const chatbotContainer = document.querySelector('.chatbot-container');
        const toggleIcon = document.getElementById('chatbot-toggle-icon');
        if (chatbotContainer.style.display === 'block') {
            chatbotContainer.style.display = 'none';
            toggleIcon.classList.remove('fa-chevron-down');
            toggleIcon.classList.add('fa-chevron-up');
        } else {
            chatbotContainer.style.display = 'block';
            toggleIcon.classList.remove('fa-chevron-up');
            toggleIcon.classList.add('fa-chevron-down');
        }
    }
  
    document.querySelector('.chatbot-header').addEventListener('click', toggleChatbot);
    document.querySelector('.message-icon').addEventListener('click', toggleChatbot);
  
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }
  
    document.getElementById('chatbot-input').addEventListener('keypress', handleKeyPress);
  
      function sendMessage() {
          const input = document.getElementById('chatbot-input');
          const message = input.value.trim();
          if (message) {
              addMessage('You', message, 'customer-message');
              input.value = '';
              setTimeout(() => {
                  addMessage('Chatbot', getChatbotResponse(message), 'bot-message');
              }, 1000);
          }
      }
  
      document.querySelector('.chatbot-input button').addEventListener('click', sendMessage);
  
      function sendChoice(choice) {
          addMessage('You', choice, 'customer-message');
          setTimeout(() => {
              addMessage('Chatbot', getChatbotResponse(choice), 'bot-message');
          }, 1000);
      }
  
      document.querySelectorAll('.chatbot-choices button').forEach(button => {
          button.addEventListener('click', () => sendChoice(button.textContent));
      });
  
      function addMessage(sender, message, className) {
          const messagesContainer = document.getElementById('chatbot-messages');
          const messageElement = document.createElement('div');
          messageElement.classList.add('chatbot-message', className);
          messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
          messagesContainer.appendChild(messageElement);
          messagesContainer.scrollTop = messagesContainer.scrollHeight; 
      }
  
    function getChatbotResponse(message) {
        const responses = {
            'hello': 'Hi there! How can I help you today?',
            'hi': 'Hello! How can I assist you?',
            'opening hours': 'Uncle’s Brew is open daily from 2:00 PM to 11:00 PM. Whether it is an afternoon pick-me-up or an evening treat we are here to serve you.',
            'delivery service': 'As of now, we don’t offer delivery services, but advance orders can be placed through our webpage, with a 50% down payment to confirm your order. Your drinks will be prepared and ready for pick-up when you arrive.',
            'payment options': 'We accept both cash and online payments, including GCash. For advance orders placed through our website, a 50% downpayment is required to secure your reservation. The remaining balance can be paid upon pick-up at the store. However, if you choose to pay in cash, this option is available when visiting our physical store.',
            'promotions or discounts': 'We’re excited to share our special offer. For every 5 drinks you order, a 6th drink is on the house. Perfect for sharing—or keeping all to yourself.',
            'order process': 'Placing an order is simple. Visit our webpage to select your favorite drinks, make a 50% down payment to confirm your order, and pick it up at your convenience. Your perfect beverage is just a few clicks away.',
            'recommendations': 'Not sure what to pick? Out kopi matcha, kopi moca, and kopi macchiaito are a fan favorite, while the okinawa, cheesecake, matcha milktea are a delightful treat. For something refreshing, try our lychee fruit tea-pure bliss in a cup.'
        };
  
        const defaultResponse = 'Thank you for your message. How can I help you?';
  
        const response = responses[message.toLowerCase()] || defaultResponse;
        return response;
    }
  });
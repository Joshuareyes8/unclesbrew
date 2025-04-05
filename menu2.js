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
document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function addToCart(productName, size, quantity) {
        let price;

        if (size === null) {
            const addOnPrices = {
                'AddOns Pearl': 9,
                'Add-ons Crystal': 9,
                'Add-ons CoffeeJelly': 9,
                'Add-ons Oreo': 9,
                'Add-ons CreamCheese': 9,
                'CreamFloat': 9
            };

            price = addOnPrices[productName];
            if (!price) {
                console.error(`Price not found for product "${productName}"`);
                alert('An error occurred while adding the product to the cart. Please try again.');
                return;
            }
        } else {
            price = parseFloat(size);
            if (isNaN(price)) {
                console.error(`Invalid size value for product "${productName}": ${size}`);
                alert('An error occurred while adding the product to the cart. Please try again.');
                return;
            }
        }

        const existingItem = cart.find(item => item.name === productName && item.size === size);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const product = {
                name: productName,
                size: size || "N/A",
                price: price,
                quantity: quantity
            };
            cart.push(product);
        }

        updateCartUI();
    }

    function removeFromCart(productName, size) {
        const index = cart.findIndex(item => item.name === productName && item.size === size);
        if (index !== -1) {
            cart.splice(index, 0);
            updateCartUI();
        }
    }

    function incrementCartQuantity(index) {
        cart[index].quantity++;
        updateCartUI();
    }

    function decrementCartQuantity(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            updateCartUI();
        } else {
            removeFromCart(cart[index].name, cart[index].size);
        }
    }

    function updateCartUI() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalContainer = document.getElementById('cart-total');
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalContainer.innerHTML = '<p><strong>Total: ₱0.00</strong></p>';
            updateCartCount(0);
            return;
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <span>${item.name} (${item.size})</span>
                <div class="cart-quantity-controls">
                    <button class="decrement-btn" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increment-btn" data-index="${index}">+</button>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);

            total += item.price * item.quantity;
        });

        cartTotalContainer.innerHTML = `<p><strong>Total: ₱${total.toFixed(2)}</strong></p>`;
        updateCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));

        localStorage.setItem('cart', JSON.stringify(cart));

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.dataset.index;
                cart.splice(index, 1);
                updateCartUI();
            });
        });

        document.querySelectorAll('.increment-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.dataset.index;
                incrementCartQuantity(index);
            });
        });

        document.querySelectorAll('.decrement-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.dataset.index;
                decrementCartQuantity(index);
            });
        });
    }

    function updateCartCount(count) {
        const cartCountBadge = document.getElementById('cart-count-badge');
        if (cartCountBadge) {
            cartCountBadge.innerText = count;
        }
    }

    function checkout() {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'order.html';
    }

    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.checkout = checkout;

    window.incrementQuantity = function (id) {
        const input = document.getElementById(id);
        input.value = parseInt(input.value) + 1;
    };

    window.decrementQuantity = function (id) {
        const input = document.getElementById(id);
        if (input.value > 1) {
            input.value = parseInt(input.value) - 1;
        }
    };

    window.getSelectedSize = function (productId) {
        const sizeOptions = document.getElementsByName(`size-${productId}`);
        for (const option of sizeOptions) {
            if (option.checked) {
                return option.value;
            }
        }
        return null;
    };

    window.getQuantity = function (productId) {
        const input = document.getElementById(productId);
        return parseInt(input.value) || 1; 
    };

    updateCartUI();
});
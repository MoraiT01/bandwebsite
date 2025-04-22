// Form handlers for Smokin' Breadsticks website

document.addEventListener('DOMContentLoaded', function() {
    // Contact form handler
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // In a real application, this would send data to the server
            // For now, we'll simulate a successful submission
            console.log('Contact form submitted:', formDataObj);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }
    
    // Newsletter form handler
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email
            const email = this.querySelector('input[type="email"]').value;
            
            // Validate email
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // In a real application, this would send data to the server
            // For now, we'll simulate a successful subscription
            console.log('Newsletter subscription:', email);
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            
            // Reset form
            this.reset();
        });
    }
    
    // Merch page - Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productItem = this.closest('.product-item');
                const productTitle = productItem.querySelector('h3').textContent;
                const productPrice = productItem.querySelector('.product-price').textContent;
                const productImage = productItem.querySelector('.product-image img').src;
                
                // Get selected size if available
                let selectedSize = '';
                const sizeButtons = productItem.querySelectorAll('.size-btn');
                if (sizeButtons.length > 0) {
                    const activeSize = productItem.querySelector('.size-btn.active');
                    selectedSize = activeSize ? activeSize.textContent : 'M'; // Default to M if none selected
                }
                
                // Get quantity
                const quantityInput = productItem.querySelector('.quantity-input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                // Create cart item object
                const cartItem = {
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    size: selectedSize,
                    quantity: quantity
                };
                
                // In a real application, this would add the item to the cart in a database or session
                console.log('Added to cart:', cartItem);
                
                // Update cart UI
                updateCartUI(cartItem);
                
                // Show success message
                alert(`Added ${quantity} x ${productTitle} to your cart!`);
            });
        });
    }
    
    // Helper function to validate email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Helper function to update cart UI
    function updateCartUI(cartItem) {
        const cartEmpty = document.querySelector('.cart-empty');
        const cartItems = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (cartEmpty && cartItems && cartSummary) {
            // Hide empty cart message
            cartEmpty.style.display = 'none';
            
            // Show cart items and summary
            cartItems.style.display = 'block';
            cartSummary.style.display = 'block';
            
            // Create cart item element
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${cartItem.image}" alt="${cartItem.title}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${cartItem.title}</h4>
                    <p class="cart-item-details">Qty: ${cartItem.quantity}${cartItem.size ? ' | Size: ' + cartItem.size : ''}</p>
                </div>
                <div class="cart-item-price">${cartItem.price}</div>
                <button class="cart-item-remove"><i class="fas fa-times"></i></button>
            `;
            
            // Add to cart items
            cartItems.appendChild(cartItemElement);
            
            // Add remove functionality
            const removeBtn = cartItemElement.querySelector('.cart-item-remove');
            removeBtn.addEventListener('click', function() {
                cartItemElement.remove();
                
                // If no items left, show empty cart message
                if (cartItems.children.length === 0) {
                    cartEmpty.style.display = 'block';
                    cartItems.style.display = 'none';
                    cartSummary.style.display = 'none';
                }
                
                // Update cart summary
                updateCartSummary();
            });
            
            // Update cart summary
            updateCartSummary();
        }
    }
    
    // Helper function to update cart summary
    function updateCartSummary() {
        const cartItems = document.querySelector('.cart-items');
        const subtotalElement = document.querySelector('.cart-subtotal');
        const shippingElement = document.querySelector('.cart-shipping');
        const totalElement = document.querySelector('.cart-total');
        
        if (cartItems && subtotalElement && shippingElement && totalElement) {
            // Count items
            const itemCount = cartItems.children.length;
            
            // Calculate subtotal (in a real app, this would use actual prices)
            const subtotal = itemCount * 25; // Simplified calculation
            
            // Calculate shipping (free over $50)
            const shipping = subtotal > 50 ? 0 : 5;
            
            // Calculate total
            const total = subtotal + shipping;
            
            // Update elements
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
});

// Form handlers for Smokin' Breadsticks website

document.addEventListener('DOMContentLoaded', function() {
    // Contact form handler (e.g., on about.html)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // In a static site context, this data isn't sent to a server
            // unless you integrate a third-party service (e.g., Formspree).
            // This simulates a successful submission for demo purposes.
            console.log('Contact form submitted (client-side):', formDataObj);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon. (Demo - no data sent)');
            
            // Reset form
            this.reset();
        });
    }
    
    // Newsletter form handler (e.g., in footer)
    // Note: main.js also has a newsletter handler. Ensure only one is active
    // or that they don't conflict if both scripts are loaded.
    // This version includes email validation.
    const newsletterForms = document.querySelectorAll('.newsletter form'); // Targets all newsletter forms
    if (newsletterForms.length > 0) {
        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); // Prevent default form submission
                
                // Get email
                const emailInput = this.querySelector('input[type="email"]');
                if (!emailInput) return;
                const email = emailInput.value;
                
                // Validate email
                if (!validateEmail(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                // In a static site context, this data isn't sent to a server
                // unless you integrate a third-party service.
                // This simulates a successful subscription for demo purposes.
                console.log('Newsletter subscription (client-side):', email);
                
                // Show success message
                alert('Thank you for subscribing to our newsletter! (Demo - no data sent)');
                
                // Reset form
                this.reset();
            });
        });
    }
    
    // Merch page - Add to cart functionality
    // This logic is also present inline in the converted merch.html.
    // For a final static site, it's best to have this code in one place,
    // preferably here, and remove the duplicate inline script from merch.html.
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productItem = this.closest('.product-item');
                if (!productItem) return;

                const productTitleEl = productItem.querySelector('h3');
                const productPriceEl = productItem.querySelector('.product-price');
                const productImageEl = productItem.querySelector('.product-image img');

                const productTitle = productTitleEl ? productTitleEl.textContent : 'Unknown Product';
                const productPrice = productPriceEl ? productPriceEl.textContent : '$0.00';
                const productImage = productImageEl ? productImageEl.src : 'static/images/merch_placeholder.jpg'; // Fallback image
                
                let selectedSize = '';
                const sizeOptionsContainer = productItem.querySelector('.size-options');
                if (sizeOptionsContainer) {
                    const activeSizeButton = sizeOptionsContainer.querySelector('.size-btn.active');
                    selectedSize = activeSizeButton ? activeSizeButton.textContent : ''; // Default to no size if not applicable or selected
                }
                
                const quantityInput = productItem.querySelector('.quantity-input');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                
                const cartItemData = { // Renamed to avoid conflict if cartItem var is used elsewhere
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    size: selectedSize,
                    quantity: quantity
                };
                
                // This is client-side only. It doesn't process an actual order.
                console.log('Added to cart (client-side demo):', cartItemData);
                
                updateCartUI(cartItemData); // This function updates the cart display on the page
                
                alert(`Added ${quantity} x ${productTitle} to your cart! (Demo)`);
            });
        });
    }
    
    // Helper function to validate email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Helper function to update cart UI on merch.html
    function updateCartUI(cartItemData) {
        const cartEmpty = document.querySelector('.cart-empty');
        const cartItemsContainer = document.querySelector('.cart-items'); // Changed var name
        const cartSummary = document.querySelector('.cart-summary');
        
        if (cartEmpty && cartItemsContainer && cartSummary) {
            cartEmpty.style.display = 'none';
            cartItemsContainer.style.display = 'block';
            cartSummary.style.display = 'block';
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            let detailsText = `Qty: ${cartItemData.quantity}`;
            if (cartItemData.size) {
                detailsText += ` | Size: ${cartItemData.size}`;
            }

            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${cartItemData.image}" alt="${cartItemData.title}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${cartItemData.title}</h4>
                    <p class="cart-item-details">${detailsText}</p>
                </div>
                <div class="cart-item-price">${cartItemData.price}</div>
                <button class="cart-item-remove"><i class="fas fa-times"></i></button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            const removeBtn = cartItemElement.querySelector('.cart-item-remove');
            removeBtn.addEventListener('click', function() {
                cartItemElement.remove();
                updateCartSummary(); // Recalculate summary when an item is removed
                if (cartItemsContainer.children.length === 0) {
                    cartEmpty.style.display = 'block';
                    cartItemsContainer.style.display = 'none';
                    cartSummary.style.display = 'none';
                }
            });
            
            updateCartSummary(); // Recalculate summary when a new item is added
        }
    }
    
    // Helper function to update cart summary totals on merch.html
    function updateCartSummary() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const subtotalElement = document.querySelector('.cart-subtotal');
        const shippingElement = document.querySelector('.cart-shipping');
        const totalElement = document.querySelector('.cart-total');
        
        if (cartItemsContainer && subtotalElement && shippingElement && totalElement) {
            let subtotal = 0;
            const items = cartItemsContainer.querySelectorAll('.cart-item');
            
            items.forEach(item => {
                const priceString = item.querySelector('.cart-item-price')?.textContent || '$0';
                const quantityString = item.querySelector('.cart-item-details')?.textContent.match(/Qty: (\d+)/);
                
                const price = parseFloat(priceString.replace('$', ''));
                const quantity = quantityString ? parseInt(quantityString[1]) : 1;
                
                if (!isNaN(price) && !isNaN(quantity)) {
                    subtotal += price * quantity; // Assuming price is per item, not total for quantity already
                }
            });
            
            const shipping = subtotal > 50 ? 0 : 5; // Example shipping logic
            const total = subtotal + shipping;
            
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;

            // If cart is empty after updates, reflect this
            if (items.length === 0) {
                const cartEmpty = document.querySelector('.cart-empty');
                const cartSummaryDiv = document.querySelector('.cart-summary'); // Check actual class name
                if (cartEmpty) cartEmpty.style.display = 'block';
                if (cartItemsContainer) cartItemsContainer.style.display = 'none';
                if (cartSummaryDiv) cartSummaryDiv.style.display = 'none';
            }
        }
    }

    // Initial cart summary update in case the cart is pre-populated (e.g. from localStorage - not implemented here)
    // or to ensure correct state if no items are added.
    if (document.querySelector('.shopping-cart')) { // Only run on pages with a shopping cart
        updateCartSummary();
    }
});
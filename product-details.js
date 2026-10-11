
const product = JSON.parse(localStorage.getItem('selectedProduct'));
const productDetails = document.querySelector('#product-details');

if (!product) {
    productDetails.innerHTML = `
        <p>Product not found.</p>
        <a href="user-home.html">Back to offers</a>
    `;
} else {
    productDetails.innerHTML = `
        ${
            product.image
                ? `<img src="${product.image}" alt="" class="product-detail-image">`
                : ''
        }

        <h2 id="detail-name"></h2>
        <p><strong>Product Number:</strong> <span id="detail-number"></span></p>
        <p><strong>Category:</strong> <span id="detail-category"></span></p>
        <p><strong>Price:</strong> <span id="detail-price"></span></p>
        <p><strong>Status:</strong> <span id="detail-status"></span></p>
        <p><strong>Description:</strong> <span id="detail-description"></span></p>

        <button id="add-to-cart" type="button">Add to Cart</button>
        <p id="cart-message"></p>

        <a href="user-home.html">Back to offers</a>
    `;

    document.querySelector('#detail-name').textContent = product.productName || 'Unnamed product';
    document.querySelector('#detail-number').textContent = product.productNumber || 'N/A';
    document.querySelector('#detail-category').textContent = product.category || 'Other';
    document.querySelector('#detail-price').textContent = product.price ?? 'N/A';
    document.querySelector('#detail-status').textContent = product.status || 'Unknown';
    document.querySelector('#detail-description').textContent =
        product.description || 'No description available';

    document.querySelector('#add-to-cart').addEventListener('click', () => {
        const message = document.querySelector('#cart-message');

        if (product.status !== 'Available') {
            message.textContent = 'This offer is currently unavailable.';
            return;
        }

        const cart = JSON.parse(localStorage.getItem('chocolifeCart')) || [];
        const existingItem = cart.find(item =>
            item.productNumber === product.productNumber
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                productNumber: product.productNumber,
                productName: product.productName,
                price: product.price,
                image: product.image || '',
                quantity: 1
            });
        }

        localStorage.setItem('chocolifeCart', JSON.stringify(cart));
        message.textContent = 'Product added to cart!';
    });
}

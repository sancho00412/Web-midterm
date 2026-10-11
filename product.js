const defaultProducts = [
    {
        productName: 'SPA & Massage',
        productNumber: '58241',
        price: '12,000 ₸',
        category: 'Beauty',
        status: 'Available'
    },
    {
        productName: 'Restaurant Dinner',
        productNumber: '73185',
        price: '8,500 ₸',
        category: 'Food',
        status: 'Available'
    },
    {
        productName: 'Cinema Tickets for Two',
        productNumber: '42673',
        price: '5,000 ₸',
        category: 'Entertainment',
        status: 'Available'
    },
    {
        productName: 'Beauty Salon',
        productNumber: '91524',
        price: '15,000 ₸',
        category: 'Beauty',
        status: 'Available'
    },
    {
        productName: 'Hotel Weekend',
        productNumber: '34862',
        price: '35,000 ₸',
        category: 'Travel',
        status: 'Available'
    },
    {
        productName: 'Fitness Club Membership',
        productNumber: '65731',
        price: '20,000 ₸',
        category: 'Fitness',
        status: 'Available'
    },
    {
        productName: 'Bowling Night',
        productNumber: '82416',
        price: '7,000 ₸',
        category: 'Entertainment',
        status: 'Available'
    },
    {
        productName: 'Water Park Family',
        productNumber: '39175',
        price: '18,000 ₸',
        category: 'Entertainment',
        status: 'Available'
    }
];

// Load products only once.
// Do not automatically add deleted products again.
function loadProducts() {
    try {
        const savedProducts = JSON.parse(
            localStorage.getItem('products')
        );

        if (Array.isArray(savedProducts)) {
            return savedProducts;
        }
    } catch (error) {
        console.error('Could not load products:', error);
    }

    localStorage.setItem(
        'products',
        JSON.stringify(defaultProducts)
    );

    return [...defaultProducts];
}

let products = loadProducts();

const tableBody = document.querySelector('table tbody');

if (tableBody) {
    renderProducts();
}

function renderProducts() {
    if (!tableBody) return;

    tableBody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${product.productName}</td>
            <td>${product.productNumber}</td>
            <td>${product.price}</td>
            <td class="success">${product.status || 'Available'}</td>
            <td>
                <button type="button" class="primary details-product">
                    Details
                </button>
                <button type="button" class="primary edit-product">
                    Edit
                </button>
                <button type="button" class="danger delete-product">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Handle Details, Edit and Delete
if (tableBody) {
    tableBody.addEventListener('click', event => {
        const button = event.target.closest(
            '.delete-product, .edit-product, .details-product'
        );

        if (!button) return;

        const row = button.closest('tr');
        const productNumber = row.children[1].textContent.trim();

        const product = products.find(item =>
            String(item.productNumber) === productNumber
        );

        if (!product) return;

        if (button.classList.contains('delete-product')) {
            const confirmed = confirm(
                `Are you sure you want to delete "${product.productName}"?`
            );

            if (!confirmed) return;

            products = products.filter(item =>
                String(item.productNumber) !== productNumber
            );

            saveProducts();
            renderProducts();
        }

        if (button.classList.contains('edit-product')) {
            localStorage.setItem(
                'editProduct',
                JSON.stringify(product)
            );

            window.location.href = 'add-product.html';
        }

        if (button.classList.contains('details-product')) {
            localStorage.setItem(
                'selectedProduct',
                JSON.stringify(product)
            );

            window.location.href = 'product-details.html';
        }
    });
}
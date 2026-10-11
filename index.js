const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

menuBtn.addEventListener('click', () =>{
    sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', () =>{
    sideMenu.style.display = 'none';
})

themeToggler.addEventListener('click', () =>{
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

})




const ordersTableBody = document.querySelector('table tbody');

if (ordersTableBody) {
    ordersTableBody.innerHTML = '';

    Orders.forEach((order, index) => {
        const tr = document.createElement('tr');

        const statusClass =
            order.shipping === 'Declined' ? 'danger' :
            order.shipping === 'Pending' ? 'warning' : 'primary';

        tr.innerHTML = `
            <td>${order.productName}</td>
            <td>${order.productNumber}</td>
            <td>${order.paymentStatus}</td>
            <td>
                <select class="order-status-select"
                        data-order-id="${order.productNumber}">
                    <option value="Pending" ${order.shipping === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Completed" ${order.shipping === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Declined" ${order.shipping === 'Declined' ? 'selected' : ''}>Declined</option>
                </select>
            </td>

        `;

        ordersTableBody.appendChild(tr);
    });

    ordersTableBody.addEventListener('click', event => {
        const button = event.target.closest('.order-details-btn');
        if (!button) return;

        const order = Orders[Number(button.dataset.orderIndex)];
        if (!order) return;

        function parseOrderPrice(price) {
            if (typeof price === 'number') return price;

            return Number(
                String(price ?? '0').replace(/[^\d.-]/g, '')
            ) || 0;
        }

        const itemsText = (order.items || []).map(item => {
            const price = parseOrderPrice(item.price);
            const quantity = Number(item.quantity) || 1;
            const subtotal = price * quantity;

            return `${item.productName || 'Product'} — ${quantity} шт. × ${price.toLocaleString('en-US')} ₸ = ${subtotal.toLocaleString('en-US')} ₸`;
        }).join('\n');


        alert(
            `Order: ${order.productNumber}\n` +
            `Customer: ${order.productName}\n` +
            `Email: ${order.customerEmail || 'Not provided'}\n` +
            `Phone: ${order.customerPhone || 'Not provided'}\n` +
            `Address: ${order.customerAddress || 'Not provided'}\n` +
            `Items:\n${itemsText || order.itemNames || 'No products'}\n\n` +
            `Total: ${order.paymentStatus}\n` +
            `Status: ${order.shipping}\n` +
            `Date: ${order.createdAt || 'Not provided'}`
        );
    });

    
    ordersTableBody.addEventListener('change', event => {
        const select = event.target.closest('.order-status-select');
        if (!select) return;

        const orderId = select.dataset.orderId;
        const newStatus = select.value;

        try {
            const savedOrders = JSON.parse(
                localStorage.getItem('chocolifeOrders') || '[]'
            );

            const order = savedOrders.find(
                item => String(item.id) === String(orderId)
            );

            if (!order) {
                alert('Order not found!');
                return;
            }

            order.status = newStatus;

            localStorage.setItem(
                'chocolifeOrders',
                JSON.stringify(savedOrders)
            );

            // Обновляем статус в текущей таблице
            const index = Orders.findIndex(
                item => String(item.productNumber) === String(orderId)
            );

            if (index !== -1) {
                Orders[index].shipping = newStatus;
            }

            alert('Order status updated to ' + newStatus);
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Could not update order status.');
        }
    });

    }


    const productSearch = document.querySelector('#product-search');

    productSearch.addEventListener('input', () => {

        const searchValue = productSearch.value.toLowerCase();

        const products = JSON.parse(localStorage.getItem('products')) || [];

        const result = products.filter(product => {
            return product.productName.toLowerCase().includes(searchValue);
        });

        const searchResults = document.querySelector('#search-results');

        searchResults.innerHTML = '';

        result.forEach(product => {

            const item = document.createElement('div');

            item.innerHTML = `
                <strong>${product.productName}</strong>
                <span>${product.price}</span>
            `;

            searchResults.appendChild(item);

        });

});

const categoryFilter = document.querySelector('#product-category-filter');

categoryFilter.addEventListener('change', () => {

    const selectedCategory = categoryFilter.value;

    const products = JSON.parse(localStorage.getItem('products')) || [];

    const result = products.filter(product => {

        if (selectedCategory === 'All') {
            return true;
        }

        return product.category === selectedCategory;

    });

    console.log(result);

});

function filterProducts() {

    const searchValue = productSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const products = JSON.parse(localStorage.getItem('products')) || [];

    const result = products.filter(product => {

        const matchesSearch = product.productName
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =
            selectedCategory === 'All' ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    const searchResults = document.querySelector('#search-results');

    searchResults.innerHTML = '';

    result.forEach(product => {

        const item = document.createElement('div');

        item.innerHTML = `
            <strong>${product.productName}</strong>
            <span>${product.price}</span>
        `;

        searchResults.appendChild(item);

    });
}


const searchResults = document.querySelector('#search-results');

function closeSearchResults() {
    if (searchResults) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
    }
}


productSearch.addEventListener('input', () => {
    if (productSearch.value.trim() === '') {
        closeSearchResults();
    } else {
        searchResults.style.display = 'block';
    }
});

document.addEventListener('click', (event) => {
    const searchContainer = document.querySelector('.search');

    if (searchContainer && !searchContainer.contains(event.target)) {
        closeSearchResults();
    }
});


searchResults.addEventListener('click', (event) => {
    const item = event.target.closest('div');

    if (item) {
        closeSearchResults();
    }
});


categoryFilter.addEventListener('change', () => {
    closeSearchResults();
});


productSearch.addEventListener('input', filterProducts);

categoryFilter.addEventListener('change', filterProducts);


const adminLogout = document.querySelector('#admin-logout');

if (adminLogout) {
    adminLogout.addEventListener('click', (event) => {
        event.preventDefault();

        localStorage.removeItem('chocolifeUserRole');
        localStorage.removeItem('chocolifeCurrentUser');

        window.location.href = 'welcome.html';
    });
}

function deleteProduct(productNumber) {
    const products = JSON.parse(
        localStorage.getItem('products') || '[]'
    );

    const updatedProducts = products.filter(
        product => String(product.productNumber) !== String(productNumber)
    );

    localStorage.setItem('products', JSON.stringify(updatedProducts));

    location.reload();
}

const usersMenu = document.querySelector('#users-menu');
const usersSection = document.querySelector('#users-section');
const usersTableBody = document.querySelector('#users-table-body');
const usersSearch = document.querySelector('#users-search');
const totalUsers = document.querySelector('#total-users');

function renderUsers() {
    if (!usersTableBody) return;

    let users = [];

    try {
        const savedUsers = JSON.parse(
            localStorage.getItem('chocolifeUsers') || '[]'
        );

        users = Array.isArray(savedUsers) ? savedUsers : [];
    } catch (error) {
        console.error('Could not load users:', error);
    }

    if (totalUsers) {
        totalUsers.textContent = users.length;
    }

    const query = usersSearch
        ? usersSearch.value.trim().toLowerCase()
        : '';

    const filteredUsers = users.filter(user => {
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const email = user.email || '';

        return `${firstName} ${lastName} ${email}`
            .toLowerCase()
            .includes(query);
    });

    usersTableBody.innerHTML = '';

    if (filteredUsers.length === 0) {
        usersTableBody.innerHTML =
            '<tr><td colspan="3">No users found</td></tr>';
        return;
    }

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');

        [user.firstName, user.lastName, user.email].forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value || '—';
            row.appendChild(cell);
        });

        usersTableBody.appendChild(row);
    });
}

if (usersMenu && usersSection) {
    usersMenu.addEventListener('click', event => {
        event.preventDefault();

        document.querySelectorAll('main > section').forEach(section => {
            section.style.display = 'none';
        });

        usersSection.style.display = 'block';
        renderUsers();
    });
}

if (usersSearch) {
    usersSearch.addEventListener('input', renderUsers);
}
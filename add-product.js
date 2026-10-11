const productForm = document.querySelector('#product-form');

const editProduct = JSON.parse(localStorage.getItem('editProduct'));

if (editProduct) {

    document.querySelector('#product-name').value = editProduct.productName;
    document.querySelector('#product-number').value = editProduct.productNumber;
    document.querySelector('#product-price').value = editProduct.price.replace(' ₸', '');
    document.querySelector('#product-category').value = editProduct.category;
    document.querySelector('#product-description').value = editProduct.description;
    document.querySelector('#product-status').value = editProduct.status;

}

productForm.addEventListener('submit', (event) => {

    event.preventDefault();

    const imageInput = document.querySelector('#product-image');
    const imageFile = imageInput.files[0];

    const reader = new FileReader();

    reader.onload = function () {

        const product = {
            productName: document.querySelector('#product-name').value,
            productNumber: document.querySelector('#product-number').value,
            price: document.querySelector('#product-price').value + ' ₸',
            category: document.querySelector('#product-category').value,
            description: document.querySelector('#product-description').value,
            status: document.querySelector('#product-status').value,
            image: reader.result
        };

        let products = JSON.parse(localStorage.getItem('products')) || [];

        if (editProduct) {

            const index = products.findIndex(item => {
                return item.productNumber === editProduct.productNumber;
            });

            products[index] = product;

        } else {

            products.push(product);

        }

        localStorage.setItem('products', JSON.stringify(products));

        console.log(product);

        alert('Product added successfully!');

        productForm.reset();
    };

    reader.readAsDataURL(imageFile);

});
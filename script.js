document.addEventListener("DOMContentLoaded", function () {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById("product-list");

            data.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>Precio: $${product.price}</p>
                    <button class="add-to-cart" data-product-id="${product.id}">Agregar al carrito</button>
                `;
                productList.appendChild(productCard);
            });

            let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

            document.addEventListener("click", function (event) {
                if (event.target.classList.contains("add-to-cart")) {
                    const productId = parseInt(event.target.getAttribute("data-product-id"));
                    const existingItem = cartItems.find(item => item.id === productId);
                    const product = data.find(product => product.id === productId);

                    if (existingItem) {
                        existingItem.quantity++;
                    } else if (product) {
                        cartItems.push({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: 1
                        });
                    }

                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    updateCartDisplay(cartItems);
                }

                if (event.target.classList.contains("subtract-from-cart")) {
                    const productId = parseInt(event.target.getAttribute("data-product-id"));
                    const existingItem = cartItems.find(item => item.id === productId);

                    if (existingItem && existingItem.quantity > 1) {
                        existingItem.quantity--;
                        localStorage.setItem("cart", JSON.stringify(cartItems));
                        updateCartDisplay(cartItems);
                    }
                }
            });

            function updateCartDisplay(cartItems) {
                const cartContainer = document.getElementById("cart-container");
                cartContainer.innerHTML = "";

                cartItems.forEach(item => {
                    const cartItem = document.createElement("div");
                    cartItem.classList.add("cart-item");
                    cartItem.innerHTML = `
                        <p>${item.name} - Precio: $${item.price} - Cantidad: ${item.quantity}</p>
                        <button class="subtract-from-cart" data-product-id="${item.id}">Restar</button>
                    `;
                    cartContainer.appendChild(cartItem);
                });
            }

            updateCartDisplay(cartItems);
        })
        .catch(error => console.error("Error al cargar los productos:", error));
});
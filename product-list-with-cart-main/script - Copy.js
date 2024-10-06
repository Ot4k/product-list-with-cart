document.addEventListener("DOMContentLoaded", () => {
  const cart = {};
  const cartBox = document.querySelector(".box");
  const cartTitle = cartBox.querySelector("h4");
  const cartContent = cartBox.querySelector("p");
  const cartImg = cartBox.querySelector("img");

  function addToCart(itemElement) {
    const itemName = itemElement
      .querySelector(".card-title")
      .textContent.trim();
    const itemPrice = parseFloat(
      itemElement.querySelector(".card-text span").textContent.replace("$", "")
    );

    if (cart[itemName]) {
      cart[itemName].quantity += 1;
    } else {
      cart[itemName] = {
        price: itemPrice,
        quantity: 1,
      };
    }

    updateCart();
  }

  function updateCart() {
    let totalItems = 0;
    let totalPrice = 0;
    cartContent.innerHTML = ""; // Clear previous cart items

    for (let item in cart) {
      totalItems += cart[item].quantity;
      totalPrice += cart[item].price * cart[item].quantity;

      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
                <div class="item-details">
                    <span class="first">${item}</span>
                    <span class="second"><span class="sec1">${cart[item].quantity}x</span> <span class="sec2">@ $${cart[item].price.toFixed(2)}</span> $${(cart[item].price * cart[item].quantity).toFixed(2)}</span>
                </div>
                <div class="remove-item"><i class="fa-regular fa-circle-xmark"></i></div>
            `;
      cartContent.appendChild(itemElement);

      // Remove item functionality
      itemElement.querySelector(".remove-item").addEventListener("click", () => {
          if (cart[item].quantity > 1) {
            cart[item].quantity -= 1;
          } else {
            delete cart[item];
          }
          updateCart();
        });
    }

    cartTitle.textContent = `Your Cart (${totalItems})`;

    
    const totalElement = document.createElement("div");
    totalElement.className = "order-total";
    totalElement.innerHTML = `
            <span>Order Total</span>
            <span>$${totalPrice.toFixed(2)}</span>
        `;
    cartContent.appendChild(totalElement);

    // Carbon-neutral delivery message
    const carbonNeutralElement = document.createElement("div");
    carbonNeutralElement.className = "carbon-neutral";
    carbonNeutralElement.innerHTML = `
        <img src="product-list-with-cart-main/assets/images/icon-carbon-neutral.svg" alt="carbon">
        <span>This is a <strong>carbon-neutral</strong> delivery</span>
        `;
    cartContent.appendChild(carbonNeutralElement);

    // Confirm order button
    const confirmButton = document.createElement("button");
    confirmButton.className = "confirm-order";
    confirmButton.textContent = "Confirm Order";
    cartContent.appendChild(confirmButton);

    if (totalItems === 0) {
      cartTitle.textContent = "Your Cart (0)";
      cartImg.style.display = "block";
      cartContent.innerHTML = "Your added items will appear here";
    } else {
      cartImg.style.display = "none";
    }
  }

  // Event listeners for 'Add to Cart' buttons
  document.querySelectorAll(".add a").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const itemElement = button.closest(".card");
      addToCart(itemElement);
    });
  });
});

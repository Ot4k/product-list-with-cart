document.addEventListener("DOMContentLoaded", () => {
  const cart = {};
  const cartBox = document.querySelector(".box");
  const cartTitle = cartBox.querySelector("h4");
  const cartContent = cartBox.querySelector("p");
  const cartImg = cartBox.querySelector("img");
  const modal = document.getElementById("order-confirmation-modal");
  const modalContent = modal.querySelector(".order-summary");
  const modalTotal = document.getElementById("modal-total");

  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add .btn").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const itemElement = button.closest(".card-body");
      addToCart(itemElement);
    });
  });

  function addToCart(itemElement) {
    const itemName = itemElement.querySelector(".card-title").textContent.trim();
    const itemPrice = parseFloat(
      itemElement.querySelector(".card-text span").textContent.replace("$", "")
    );
    const itemThumbnail = itemElement.closest(".card").querySelector("img").src;

    // Check if the item is already in the cart
    if (cart[itemName]) {
      cart[itemName].quantity += 1;
    } else {
      cart[itemName] = {
        price: itemPrice,
        quantity: 1,
        thumbnail: itemThumbnail,
      };

      // Replace "Add to Cart" button with quantity controls
      const quantityControl = document.createElement("div");
      quantityControl.className =
        "quantity-control d-flex align-items-center justify-content-center";
      quantityControl.innerHTML = `
                
                <button class="quantity-btn decrease" type="button"><img src="product-list-with-cart-main/assets/images/icon-decrement-quantity.svg" alt=""></button>
                <span class="quantity-value">${cart[itemName].quantity}</span>
                <button class="quantity-btn increase" type="button"><img src="product-list-with-cart-main/assets/images/icon-increment-quantity.svg" alt=""></button>
                
            `;

      itemElement.querySelector(".btn").replaceWith(quantityControl);

      // Add event listeners for the new quantity buttons
      const decreaseButton = quantityControl.querySelector(".decrease");
      const increaseButton = quantityControl.querySelector(".increase");
      const quantityValue = quantityControl.querySelector(".quantity-value");

      increaseButton.addEventListener("click", () => {
        cart[itemName].quantity += 1;
        quantityValue.textContent = cart[itemName].quantity;
        updateCart();
      });

      decreaseButton.addEventListener("click", () => {
        if (cart[itemName].quantity > 1) {
          cart[itemName].quantity -= 1;
          quantityValue.textContent = cart[itemName].quantity;
        } else {
          delete cart[itemName];
          revertToAddButton(itemElement);
        }
        updateCart();
      });
    }

    updateCart();
  }

  function revertToAddButton(itemElement) {
    // Restore the "Add to Cart" button
    const addButton = document.createElement("a");
    addButton.href = "#";
    addButton.className = "btn border border-secondary rounded-5";
    addButton.innerHTML = `
            <img src="product-list-with-cart-main/assets/images/icon-add-to-cart.svg" alt="cart">
            Add to Cart
        `;

    // Replace the quantity control with the "Add to Cart" button
    itemElement.querySelector(".quantity-control").replaceWith(addButton);

    // Reassign the event listener for the "Add to Cart" button
    addButton.addEventListener("click", function (event) {
      event.preventDefault();
      addToCart(itemElement);
    });
  }

  function updateCart() {
    let totalItems = 0;
    let totalPrice = 0;
    cartContent.innerHTML = ""; // Clear previous cart items

    for (let item in cart) {
      totalItems += cart[item].quantity;
      totalPrice += cart[item].price * cart[item].quantity;

      const itemElement = document.createElement("div");
      itemElement.className = "cart-item crtitm";
      itemElement.innerHTML = `
                <div class="item-details">
                    <span class="first">${item}</span>
                    <span class="second"><span class="sec1">${
                      cart[item].quantity
                    }x</span> <span class="sec2">@ $${cart[item].price.toFixed(
        2
      )}</span> $${(cart[item].price * cart[item].quantity).toFixed(2)}</span>
                </div>
                <div class="remove-item"><i class="fa-regular fa-circle-xmark"></i></div>
            `;
      cartContent.appendChild(itemElement);

      // Remove item functionality
      itemElement
        .querySelector(".remove-item")
        .addEventListener("click", () => {
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
            <span id="modall">Order Total</span>
            <span id="modal-total">$${totalPrice.toFixed(2)}</span>
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

    confirmButton.addEventListener("click", () => {
      openModal();
    });

    if (totalItems === 0) {
      cartTitle.textContent = "Your Cart (0)";
      cartImg.style.display = "block";
      cartContent.innerHTML = "Your added items will appear here";
    } else {
      cartImg.style.display = "none";
    }
  }

  function openModal() {
    modalContent.innerHTML = ""; // Clear previous modal content
    let totalPrice = 0;

    for (let item in cart) {
      totalPrice += cart[item].price * cart[item].quantity;

      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
                <div class="item-details itemdetails">
                    <img src="${
                      cart[item].thumbnail
                    }" alt="${item}" class="thumbnail">
                    <div class="item-text">
                        <span class="first fst">${item}</span>
                        <span class="second scd"><span class="sec1">${
                          cart[item].quantity
                        }x</span> <span class="sec2">@ $${cart[
        item
      ].price.toFixed(2)}</span> <span class="sec3">$${(
        cart[item].price * cart[item].quantity
      ).toFixed(2)}</span></span>
                    </div>
                </div>
            `;
      modalContent.appendChild(itemElement);
    }

    modalTotal.textContent = `$${totalPrice.toFixed(2)}`;

    modal.style.display = "block";
  }

  // Close the modal and reset the cart
  document.querySelector(".start-new-order").addEventListener("click", () => {
    modal.style.display = "none";
    cartContent.innerHTML = "Your added items will appear here";
    cartTitle.textContent = "Your Cart (0)";
    cartImg.style.display = "block";

    // Revert each item to its original state
    document.querySelectorAll(".quantity-control").forEach((quantityControl) => {
        const itemElement = quantityControl.closest(".card-body");
        revertToAddButton(itemElement);
      });

    // Clear the cart object
    for (let item in cart) {
      delete cart[item];
    }
  });
});

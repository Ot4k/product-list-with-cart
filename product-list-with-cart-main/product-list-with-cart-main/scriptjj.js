
document.addEventListener("DOMContentLoaded", function () {
  const cartItems = [];
  const addToCartButtons = document.querySelectorAll('#pick');
  const cartBox = document.querySelector("#cart");
  const cartContent = cartBox.querySelector("#carttext");
  const cartTitle = cartBox.querySelector("h3"); 
  const picture = cartBox.querySelector('img');
  const fullTotal = document.getElementById("full-total");
  const btnDifferent = cartBox.querySelector('aside') 
  
  addToCartButtons.forEach(button => {
      button.addEventListener('click', function () { 

          const dessertCard = this.closest('.card');
          const dessertName = dessertCard.querySelector('#name').textContent;
          const dessertPrice = parseFloat(dessertCard.querySelector('#price').textContent);
          let quantity = 1;
          btnDifferent.style.display='block'
          this.style.backgroundColor = 'red';
          this.innerHTML = `
              <button class="quantity-btn decrease" type="button"><img src="./assets/images/icon-decrement-quantity.svg" style="width: 15px; margin-right: 5px; cursor: pointer;">
              <span id="quantity">${quantity}</span> 
              <img src="./assets/images/icon-increment-quantity.svg" id="increment" style="width: 15px; margin-left: 5px; cursor: pointer;">
          `;

          picture.style.display = "none";
          
          const decrementIcon = this.querySelector('#decrement');
          const incrementIcon = this.querySelector('#increment');
          const quantitySpan = this.querySelector('#quantity');

          let cartItem = cartItems.find(item => item.name === dessertName);
          if (!cartItem) {
              cartItem = { name: dessertName, price: dessertPrice, quantity: quantity };
              cartItems.push(cartItem);
          } else {
              cartItem.quantity += 1;
              quantity = cartItem.quantity;
              quantitySpan.textContent = quantity;
          }

          updateCart();

          decrementIcon.addEventListener('click', function(event) {
              event.stopPropagation(); // Prevent triggering the parent button click event
              if (cartItem.quantity > 1) {
                  cartItem.quantity -= 1;
                  quantitySpan.textContent = cartItem.quantity;
              } else {
                  // Reset to original state if quantity is 1
                  button.style.backgroundColor = 'white';
                  button.innerHTML = '<img src="./assets/images/icon-add-to-cart.svg">Add to Cart';
                  cartItems.splice(cartItems.indexOf(cartItem), 1); // Remove item from the cart
              }
              updateCart();
          });

          incrementIcon.addEventListener('click', function(event) {
              event.stopPropagation(); // Prevent triggering the parent button click event
              cartItem.quantity += 1;
              quantitySpan.textContent = cartItem.quantity;
              updateCart();
          });
      });
  });

  function updateCart() {
      let totalItems = 0;
      let totalPrice = 0;
      cartContent.innerHTML = "";

      cartItems.forEach(item => {
          totalItems += item.quantity;
          totalPrice += item.price * item.quantity;

          const itemElement = document.createElement("div");
          itemElement.className = "cart-item";
          itemElement.innerHTML = `
              <div class="item-details">
                  <span class="first">${item.name}</span>
                  <span class="second"><span class="sec1">${item.quantity}x</span> <span class="sec2">@ $${item.price.toFixed(2)}</span> $${(item.price * item.quantity).toFixed(2)}</span>
              </div>
          `;
          cartContent.appendChild(itemElement);
      });

      cartTitle.textContent = `Your Cart (${totalItems})`; 
      cartContent.style.fontSize='0.7rem';
      cartContent.style.padding='3px';
      fullTotal.textContent = `$${totalPrice.toFixed(2)}`;

      if (totalItems === 0) {
          cartTitle.textContent = "Your Cart (0)";
          cartContent.textContent = "Your added items will appear here";
      }
  } 
  btnDifferent.addEventListener('click', ()=>{ 
    const orderFene = document.getElementById('order-confirmation') 
    orderFene.style.display='block'
  })
document.getElementById('doings').addEventListener('click', ()=>{ 
   const orderFene = document.getElementById('order-confirmation') 
    orderFene.style.display='none'
})  
});

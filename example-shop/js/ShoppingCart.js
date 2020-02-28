class ShoppingCart extends Base {

  mount() {
    // Remember if the modal is to be shown or not
    this.shown = false;
  }

  show() {
    this.shown = true;
    this.render();
  }

  hide() {
    this.shown = false;
    this.render();
  }

  checkout() {
    this.shown = false;
    this.render();
    // actually going to the checkout page
    // is done by the fact that this button is a link...
  }

  empty() {
    store.cart = [];
    store.save();
    this.render();
    this.show();
  }

  buy(book) {
    // Add the book in the cart if it does not have a row already
    let row = store.cart.find(row => row.book.id === book.id);
    if (!row) {
      row = { book: book, quantity: 0 };
      store.cart.push(row);
    }
    // Add 1 to the quantity
    row.quantity++;
    // Save to the store
    store.save();
    this.animateBuy();
  }

  keydown(e) {
    // Do not allow - and . signs in input
    if (e.key === '-' || e.key === '.') {
      e.preventDefault();
    }
  }

  changeQuantity(e) {
    let rowIndex = e.target.getAttribute('row-index');
    let value = e.target.value;
    if (value) {
      // not more than 999
      if (value > 999) {
        e.target.value = 999;
        value = 999;
      }
      // a value of zero or less is "delete"
      if (value <= 0) {
        store.cart.splice(rowIndex, 1);
      }
      // change value
      else {
        store.cart[rowIndex].quantity = +value;
      }
      store.save();
      this.render();
    }
  }

  animateBuy() {
    // jQuery-based animation (not necessary)
    let bi = $('.book-image:visible');
    let bic = $('.book-image').clone();
    let cim = $('.cart-in-menu');
    bic.css({
      position: 'absolute',
      left: bi.offset().left,
      top: bi.offset().top,
      position: 'absolute',
      width: bi.width(),
      height: bi.height()
    });
    bic.removeClass('w-100');
    $('body').append(bic);
    bic.animate({
      left: cim.offset().left + 30,
      top: cim.offset().top + 20,
      width: 0,
      height: 0
    }, 300, () => {
      // Re-render after animation
      // to show new quantity
      this.render();
    });
  }

  render() {
    // Needed to stop scrolling when the modal is shown
    setTimeout(() => $('body')[this.shown ? 'addClass' : 'removeClass']('modal-open'), 0);
    // Render the cart
    return /*html*/`
      <div not-route="/checkout">
        <div class="cart-in-menu" click="show">
          <h1>
            <i class="icofont-shopping-cart"></i>
            <span class="m-3 ml-n1 d-block float-right badge badge-pill badge-light">${store.cart.reduce((count, row) => count + row.quantity, 0)}</span>
          </h1>
        </div>
        <div class="modal-backdrop ${this.shown ? 'show' : 'd-none'}"></div>
        <div class="modal shopping-cart ${this.shown ? 'd-block open' : ''}" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">
                  <span><i class="icofont-shopping-cart"></i></span>
                  Your shopping cart 
                </h5>
                <button type="button" class="close" click="hide">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ${store.cart.length === 0 ? 'Your cart is empty.' : this.renderCartTable(true)}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" click="hide">Continue shopping</button>
                ${store.cart.length === 0 ? '' : /*html*/`
                  <button type="button" class="btn btn-secondary" click="empty">Empty cart</button>
                  <a role="button" class="btn btn-primary" href="/checkout" click="checkout">Checkout</a>
                `}
              </div>   
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderCartTable(smallTable) {
    // Separate method, not in main render
    // because we want to reuse it in the CheckoutPage
    return /*html*/`
      <table class="table table-striped ${smallTable ? 'table-sm' : ''}">
        ${store.cart.map((row, index) => /*html*/`
          <tr>
            <td class="align-middle">${row.book.title}</td>
            <td class="align-middle text-right">${app.format(row.book.price)}</td>
            <td not-route="/checkout" class="align-middle text-right w-25">x
              <input row-index="${index}" class="form-control p-0 w-75 text-right d-inline" type="number" min="0" max="999" value="${row.quantity}" click="changeQuantity" keyup="changeQuantity" keydown="keydown">
            </td>
            <td route="/checkout" class="align-middle text-right w-25">x ${row.quantity}</td>
            <td class="align-middle text-right w-20"><b>${app.format(row.quantity * row.book.price)}</b></td>
          </tr>
        `)}
        <tr>
          <td colspan="3"><b>Total:</b></td>
          <td class="text-right"><b>${app.format(store.cart.reduce((sum, row) => sum + row.quantity * row.book.price, 0))}</b></td>
      </table>
    `
  }

}
class CheckoutPage extends Base {

  mount() {
    // data about the form fields, used in the render method
    this.formFields = [
      { key: 'name', label: 'Name', placeholder: 'Your name' },
      { key: 'email', label: 'Email', placeholder: 'Your email-address', type: 'email' },
      { key: 'street', label: 'Street', placeholder: 'Street address' },
      { key: 'zipCode', label: 'Zip code', pattern: '.{5,}' },
      { key: 'state', label: 'State', optional: true },
      { key: 'country', label: 'Country' }
    ]
  }

  resetFields(e) {
    for (let element of [...e.target.closest('form').elements]) {
      element.value = '';
    }
    this.storeFormInfo(e);
  }

  storeFormInfo(e) {
    // runs on keyup
    // store what the user has entered in the store so
    // that it does not get lost on page changes/reloads
    store.formData = this.collectFormData(e);
    store.save();
  }

  collectFormData(e) {
    // Loop through the form and collect the input
    let data = {};
    for (let element of [...e.target.closest('form').elements]) {
      if (!element.name) { continue; }
      data[element.name] = element.value;
    }
    return data;
  }

  async placeOrder(e) {
    // Prevent the page from reloading (default behavior for forms)
    e.preventDefault();
    let data = this.collectFormData(e);
    // Insert the order into the database
    await sql(/*sql*/`
      INSERT INTO orders (name, email, street, zipCode, state, country) 
      VALUES($name, $email, $street, $zipCode, $state, $country);
    `, data);
    // Get the order id created by the database
    let result = await sql(/*sql*/`
      SELECT id FROM orders WHERE email = $email 
      ORDER BY ID DESC LIMIT 1
    `, { email: data.email });
    this.orderId = result && result[0].id;
    // Insert the order rows in the database
    for (let row of store.cart) {
      await sql(/*sql*/`
        INSERT INTO orderRows (orderId, bookId, quantity) 
        VALUES($orderId, $bookId, $quantity);
      `, {
        orderId: this.orderId,
        bookId: row.book.id,
        quantity: row.quantity
      });
    }
    // Render the thankyou message
    this.render();
  }

  thankYou() {
    // Delete the order id and empty the cart
    // (temporarily remember the id while in this method)
    let orderId = this.orderId;
    delete this.orderId;
    store.cart = [];
    store.save();
    // Thank the customer and tell the order id
    return /*html*/`
      <div class="row" page-title="Checkout" route="/checkout">
        <div class="col-12">
          <h1>Thank you for your order!</h1>
          <p>Your order has been placed!</p>
          <p>We will email you as soon as your order is shipped.</p>
          <h3>Order number: ${orderId}</h3>
          <p><i>Please make a note of your order number.</i></p>
          <a class="btn btn-primary float-right" href="/">To the start page</a>
        </div>
      </div>
    `
  }

  empty() {
    return /*html*/`
      <div class="row" page-title="Checkout" route="/checkout">
        <div class="col-12">
          <h1>You have nohting in your to order!</h1>
          <p>Please place books in your shopping cart before you order.</p>
          <a class="btn btn-primary float-right" href="/">To the start page</a>
        </div>
      </div>
    `
  }

  render() {
    if (this.orderId) {
      return this.thankYou();
    }
    if (store.cart.length === 0) {
      return this.empty();
    }
    return /*html*/`
      <div class="row" page-title="Checkout" route="/checkout">
        <div class="col-12">
          <h1>Checkout</h1>
          <h3 class="mt-3 mb-3">Your order:</h3>
          ${app.shoppingCart.renderCartTable()}
          <h3 class="mt-5 mb-3">Please enter your address details:</h3>
          <form class="row checkout-form" submit="placeOrder">
            ${(this.formFields || []).map(field => /*html*/`
              <div class="col-12">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text">${field.label}</span>
                  </div>
                  <input
                    keyup="storeFormInfo"
                    name="${field.key}" 
                    type="${field.type || 'text'}" 
                    class="form-control"
                    placeholder="${field.placeholder || field.label}" 
                    pattern="${field.pattern || '.{2,}'}" ${field.optional ? '' : 'required'} 
                    value="${(store.formData && store.formData[field.key]) || ''}"
                  >
                </div>
              </div>
            `)}
            <div class="col-12 checkout-buttons">
              <button type="submit" class="btn btn-primary float-md-right d-block d-md-inline mt-3">Submit</button>
              <button type="button" click="resetFields" class="btn btn-secondary float-md-right d-block d-md-inline mt-3 mr-md-3">Empty fields</button>
              <a role="button" class="btn btn-secondary float-md-right mt-3 mr-md-3 d-block d-md-inline" href="/">Continue shopping</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

}
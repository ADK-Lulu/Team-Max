class BookPage extends Base {

  async mount() {
    // Get complete book details
    let details = await sql(/*sql*/`
      SELECT * FROM bookInfo WHERE title = $title
    `, {
      title: this.title
    });
    Object.assign(this, details[0]);
  }

  buy() {
    $('.buy-button').blur();
    // Call the shopping cart
    app.shoppingCart.buy(this);
  }

  render() {
    return /*html*/`
      <div route="/books/${this.title}" page-title="${this.title}">
        <div class="row">
          <div class="col">
            <h5>
              Category: <a href="/books/categories/${this.category}">${this.category}</a>
            </h5>
            <h1>${this.title}</h1>
            <h4 class="mb-3">${this.authors}</h4>
            <div class="row mb-3">
             <div class="col-lg-3 mb-3 mb-lg-0 order-lg-last">
                <button class="btn btn-primary w-100 p-2 buy-button" click="buy">
                  Buy now!&nbsp;&nbsp;
                  <span class="badge badge-pill badge-light">Price: ${(app.format(this.price || 0))}</span>
                </button>
              </div>
              <div class="col-12 d-md-none pl-4 mb-3">
                <img class="img-fluid w-100 bg-secondary book-image" src="/images/book-covers/${this.id}.jpg">
              </div>
              <div class="col-lg-3 mb-3 mb-lg-0">
                <span class="badge badge-secondary p-3 w-100">ISBN: ${this.isbn}</span>
              </div>
              <div class="col-lg-3 mb-3 mb-lg-0">
                <span class="badge badge-secondary p-3 w-100">Published: ${this.publishedDate}</span>
              </div>
              <div class="col-lg-3 mb-3 mb-lg-0">
                <span class="badge badge-secondary p-3 w-100">Pages: ${this.pageCount}</span>
              </div>
            </div>
            <div class="row mt-n4 mt-lg-0">
              <div class="col-md-12">
                <hr>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <p class="mb-4"><i>${this.shortDesc.split('\n').join('</p><p>')}</i></p>
            <hr>
            <p>${this.longDesc.split('\n').join('</p><p>')}</p>
          </div>
          <div class="col-md-4 d-none d-md-block">
            <div class="bg-secondary">
              <img class="img-fluid w-100 bg-secondary book-image" src="/images/book-covers/${this.id}.jpg">
            </div>
          </div>
        </div>
      </div>
    `
  }

}
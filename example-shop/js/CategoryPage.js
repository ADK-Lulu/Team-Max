class CategoryPage extends Base {

  async mount() {
    // Get basic info about the books in the category
    // (enough to list them)
    this.books = await sql(/*sql*/`
      SELECT id, title FROM books WHERE categoryId = $categoryId
    `, {
      categoryId: this.id
    });
  }

  render() {
    return /*html*/`
      <div class="row book-category" route="/books/categories/${this.name}" page-title="Produktkategori: ${this.name}">
        <div class="col">
          <h1>${this.name}<span class="badge badge-pill badge-primary float-right">${this.bookCount} titles</span></h1>
          <hr>
          <div class="row">
            ${this.books.map(book => /*html*/`
              <div class="col-6 col-md-4 col-lg-3 mb-3">
                <a href="/books/${book.title}">
                  <div class="card">
                    <img class="card-img-top book-image-in-list" src="/images/book-covers/${book.id}.jpg" alt="${book.title}">
                    <div class="card-body bg-light py-2 px-3">
                      <h5 class="card-title book-title-in-list mb-0 d-flex align-items-center justify-content-center">${book.title}</h5>
                    </div>
                  </div>
                </a>
              </div>
            `)}
          </div>
        </div>
      </div>
    `
  }

}
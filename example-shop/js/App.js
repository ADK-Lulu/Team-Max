class App extends Base {

  async mount() {
    // Setup the store
    this.setupStore();
    // Run sql queries
    await this.sqlQueries();
    // Setup navbar link
    this.setupNavbarLinks();
    // Create instances of views and pages
    this.navBar = new NavBar({ links: this.navBarLinks });
    this.footer = new Footer();
    this.shoppingCart = new ShoppingCart();
    this.startPage = new StartPage();
    this.aboutPage = new AboutPage();
    this.missingPage = new MissingPage();
    this.checkoutPage = new CheckoutPage();
  }

  setupStore() {
    // Which local store to use
    store.use('book-store-cart');
    // Create a cart object in the store if it does not exist
    store.cart = store.cart || [];
  }

  async sqlQueries() {
    // Which database to use
    await sql(/*sql*/`
      USE book-store
    `);
    // Create category pages from a db query
    this.categoryPages = await sql(CategoryPage, /*sql*/`
      SELECT * FROM bookCountPerCategory
    `);
    // Create book pages from a db query (only title needed)
    this.bookPages = await sql(BookPage, /*sql*/`
      SELECT title FROM books
    `);
  }

  setupNavbarLinks() {
    this.navBarLinks = [
      { label: 'Welcome', route: '/' },
      { label: 'About us', route: '/about-us' },
      {
        label: 'Books',
        route: '#books',
        dropdown: this.categoryPages.map(page => ({
          label: `${page.name} (${page.bookCount})`,
          route: `/books/categories/${page.name}`
        }))
      }
    ];
  }

  format(x) {
    // Create a new formatter for our currency, if not done before
    this.formatter = this.formatter || new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    // Use the formatter
    // (it is called in BookPage and ShoppingCart)
    return this.formatter.format(x);
  }

  render() {
    return /*html*/`
      <div base-title="CompuBooks: ">
        <header>
          ${this.navBar}
        </header>
        <main class="container my-4">
          ${this.startPage}
          ${this.aboutPage}
          ${this.missingPage}
          ${this.categoryPages}
          ${this.bookPages}
          ${this.checkoutPage}
        </main>
        ${this.footer}
        ${this.shoppingCart}
      </div>
    `;
  }

}
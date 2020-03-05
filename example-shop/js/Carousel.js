class Carousel extends Base {

  async mount() {
    await this.getRandomCategory();
  }

  async getRandomCategory() {
    // Choose a random category with at least 5 books in
    let category;
    while (!category || category === this.category) {
      category = (await sql(/*sql*/`
        SELECT id, name FROM bookCountPerCategory 
        WHERE bookCount >= 5 ORDER BY random() LIMIT 1;
      `))[0];
    }
    this.category = category;
    // Get basic info about books in that category
    this.books = await sql(/*sql*/`
      SELECT id, title FROM books 
      WHERE categoryId = $categoryId
      ORDER BY random()
    `, { categoryId: this.category.id });
  }

  breakNice(x) {
    // inserts br:s in a title so that it 
    // looks nice in the carousel..
    x = x.split('Second').join('2nd');
    x = x.replace(/\s(\w{4,})/g, '<br>$1');
    if (x.split('<br>').length < 3) {
      x = x.split(' ').join('<br>');
    }
    while (x.split('<br>').length > 4) {
      x = x.replace(/<br>/, ' ');
    }
    return x;
  }

  render() {
    let toRender = /*html*/`
      <div class="row">
        <div class="col-12">
          <h2 class="serif mb-3">Did you know we have all these books about ${(this.category || {}).name}?</h2>
          <div id="start-carousel" class="carousel slide bg-dark" data-ride="carousel">
            <ol class="carousel-indicators bg-secondary rounded">
              ${this.books.map((book, index) => /*html*/`
                <li data-target="#start-carousel" data-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>
              `)}
            </ol>
            <div class="carousel-inner">
              ${this.books.map((book, index) => /*html*/`
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                  <a href="/books/${book.title}">
                    <div class="d-flex justify-content-center">
                      <img class="d-block book-image book-image-in-carousel" src="/images/book-covers/${book.id}.jpg" alt="${book.title}">
                      <h3 class="text-light p-5">${this.breakNice(book.title)}</h3>
                    </div>
                  </a>
                </div>
              `)}
            </div>
            <a class="carousel-control-prev" href="#start-carousel" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#start-carousel" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    `;
    // start the carousel
    setTimeout(() => $('#start-carousel').carousel('cycle'));
    // start getting a new random category, in case we are shown again
    this.getRandomCategory();
    // return the html to render
    return toRender;
  }

}
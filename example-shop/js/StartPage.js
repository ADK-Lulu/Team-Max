class StartPage extends Base {

  mount() {
    this.carousel = new Carousel();
  }

  render() {
    return /*html*/`
      <div class="row" route="/" page-title="Welcome">
        <div class="col">
          <h1>Welcome to CompuBooks!</h1>
          ${this.carousel}
        </div>
      </div>
    `
  }

}
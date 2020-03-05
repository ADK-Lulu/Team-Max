class AboutPage extends Base {

  render() {
    return /*html*/`
      <div class="row" route="/about-us" page-title="About us">
        <div class="col-md-6">
          <h1>About CompuBooks</h1>
          <p>We love computer books. The older the better. So we are a book store with a special niche: We cater for all geeks that want to find the old computer books they once learned how to program from.</p>
          <p>New computer books? That's too easy. Instead we give you the original editions from a time when computers were slower and people were friendlier.</p>
          <p><b>Please Note:</b> If you order large amounts of a title it might take some time for us to scourge the market and fill your order. But we will. Eventually.</p>
        </div>
        <div class="col-md-6">
          <img class="img-fluid" src="/images/about-us.jpg">
        </div>
      </div>
    `
  }

}
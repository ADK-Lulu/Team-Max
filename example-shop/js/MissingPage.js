class MissingPage extends Base {

  render() {
    return /*html*/`
      <div class="row" route="404" title-page="Missing page">
        <div class="col">
          <h1>Could not find that page! 😢</h1>
          <p>We are sorry, but we could not find that page.</p>
          <p><a href="/">Click here to goto the start page</a>.</p>
        </div>
      </div>
    `
  }

}
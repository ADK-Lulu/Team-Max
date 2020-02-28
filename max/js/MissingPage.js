class MissingPage extends Base {

  render() {
    return /*html*/`
      <div class="row" route="404" page-title="Missing page">
        <div class="col-12">
          <h1>Could not find that page! 😢</h1>
          <p>We are sorry, but we could not find that page.</p>
          <p><a href="/">Click here to goto the start page</a>.</p>
        </div>
      </div>
    `;
  }

}
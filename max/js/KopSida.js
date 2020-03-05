class KopSida extends Base {

  render() {
    return /*html*/`
      <div class="container">
        <div class="row" route="/kop-sida" page-title="Köpa bostad">
          <div class="col-12">
            <h1>Köpa bostad</h1>
            <p>Det här är en sida där du kan köpa bostad</p>
            ${!app.navBar.chosen ? '' : `<p>Du vill köpa bostäder i ${app.navBar.chosen}.</p>`}
          </div>
        </div>
      </div>
    `;
  }

}
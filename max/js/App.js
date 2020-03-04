class App extends Base {

  mount() {
    this.navBarLinks = [
      { label: 'Välkommen', route: '/' },
      { label: 'Om oss', route: '/om-oss' },
      { label: 'Köpa bostad', route: '/kop-sida' },
      { label: 'Sälja bostad', route: '/salj-sida' },
      { label: 'Söka bostad', route: '/sok-sida' }
    ];
    this.navBar = new NavBar({ links: this.navBarLinks });
    this.footer = new Footer();
    this.startSida = new StartSida();
    this.omOss = new OmOss();
    this.kopSida = new KopSida();
    this.objektSida = new ObjektSida();
    this.saljSida = new SaljSida();
    this.sokSida = new SokSida();
  }

  render() {
    return /*html*/`
      <div base-title="Dhyr & Rumson">
        <header>
          ${this.navBar}
        </header>
        <main class="container my-4">
          ${this.startSida}
          ${this.omOss}
          ${this.kopSida}
          ${this.objektSida}
          ${this.saljSida}
          ${this.sokSida}
        </main>
        ${this.footer}
      </div>
    `;
  }

}
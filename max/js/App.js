class App extends Base {

  mount() {
    this.navBarLinks = [
      { label: 'Välkommen', route: '/' }, //Loggan ska ligga här istaället för "välkommen", alternativt ta bort. 
      { label: 'Sälja bostad', route: '/salj-sida' },
      { label: 'Köpa bostad', route: '/kop-sida' },
      {
        label: 'Kontakt',
        route: '#kontakt',
        dropdown: [
          { label: 'Kontakta oss', route: '/kontakt-sida' },
          { label: 'Om oss', route: '/om-oss' }
        ]
      },
      { label: 'Söka bostad', route: '/sok-sida' } //Ska bli ett sökfällt senare

    ];
    this.navBar = new NavBar({ links: this.navBarLinks });
    this.footer = new Footer();
    this.startSida = new StartSida();
    this.omOss = new OmOss();
    this.kopSida = new KopSida();
    this.objektSida = new ObjektSida();
    this.saljSida = new SaljSida();
    this.sokSida = new SokSida();
    this.kontaktSida = new KontaktSida();
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
          ${this.kontaktSida}
        </main>
        ${this.footer}
      </div>
    `;
  }

}
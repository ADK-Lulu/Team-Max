class App extends Base {

  async mount() {
    this.navBarLinks = [
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

    this.footerBarLinks = [
      { label: 'Mer om oss', route: this.navBarLinks[1].route }

    ];

    this.navBar = new NavBar({ links: this.navBarLinks });
    this.footer = new Footer({ links: this.footerBarLinks });
    this.startSida = new StartSida();
    this.omOss = new OmOss();
    this.kopSida = new KopSida();
    this.objektSida = new ObjektSida();
    this.saljSida = new SaljSida();
    this.sokSida = new SokSida();
    this.kontaktSida = new KontaktSida();


    // Läs in databasen max
    await sql(/*sql*/`USE max`);

    // Konvertera alla SaljObjekt från databasen till en instans av ObjektSida.js
    this.objektSidor = await sql(ObjektSida, /*sql*/`
      SELECT objektId FROM SaljObjekt
    `);
  }

  render() {
    return /*html*/`
      <div base-title="Dhyr & Rumson - ">
        <header>
          ${this.navBar}
        </header>
        <main class="container my-4">
          ${this.startSida}
          ${this.omOss}
          ${this.kopSida}
          ${this.objektSidor}
          ${this.saljSida}
          ${this.sokSida}
          ${this.kontaktSida}
        </main>
        ${this.footer}
      </div>
    `;
  }

}
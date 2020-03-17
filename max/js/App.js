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
    ];

    this.settings = {
      minRum: 0,
      maxRum: 6,
      minKvm: 0,
      maxKvm: 31,
      minPris: 0,
      maxPris: 999,
      sortering: 'nyast',
      sokBostadsratt: true,
      sokRadhus: true,
      sokVilla: true,
      sokNybygge: false,
      sokOmrade: '%'
    };

    this.navBar = new NavBar({ links: this.navBarLinks });
    this.footer = new Footer({ links: this.navBarLinks });
    this.startSida = new StartSida();
    this.omOss = new OmOss();
    this.kopSida = new KopSida();
    this.saljSida = new SaljSida();
    this.sokning = new Sokning();
    this.kontaktSida = new KontaktSida();
    this.notFound = new NotFound();


    // Använd databasen max
    await sql(/*sql*/`USE max`);

    // Konvertera alla SaljObjekt från databasen till en instans av ObjektSida.js
    this.objektSidor = await sql(ObjektSida, /*sql*/`
      SELECT objektId FROM SaljObjekt
    `);
  }

  // Metod som formaterar pris snyggare
  formateraPris(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
  }

  render() {
    return /*html*/`
      <div base-title="Dhyr & Rumson - ">
        <header class="bg-primary">
          ${this.navBar}
        </header>
        <main class="container my-4">
          ${this.startSida}
          ${this.saljSida}
          ${this.kopSida}
          ${this.omOss}
          ${this.objektSidor}
          ${this.kontaktSida}
          ${this.notFound}
        </main>
        ${this.footer}
      </div>
    `;
  }

}
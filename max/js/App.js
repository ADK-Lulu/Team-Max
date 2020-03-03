class App extends Base {

  mount() {
    this.navBarLinks = [
      { label: 'Välkommen', route: '/' },
      { label: 'Om oss', route: '/om-oss' }
    ];
    this.navBar = new NavBar({ links: this.navBarLinks });
    this.footer = new Footer();
    this.startSida = new StartSida();
    this.omOss = new OmOss();
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
        </main>
        ${this.footer}
      </div>
    `;
  }

}
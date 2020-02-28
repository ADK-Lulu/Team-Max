class App extends Base {

  mount() {
    this.navBarLinks = [
      { label: 'Welcome', route: '/' },
      { label: 'About us', route: '/about-us' }
    ];
    this.navBar = new NavBar({ links: this.navBarLinks });
    this.footer = new Footer();
    this.startPage = new StartPage();
    this.aboutUsPage = new AboutUsPage();
  }

  render() {
    return /*html*/`
      <div base-title="Minimal: ">
        <header>
          ${this.navBar}
        </header>
        <main class="container my-4">
          ${this.startPage}
          ${this.aboutUsPage}
        </main>
        ${this.footer}
      </div>
    `;
  }

}
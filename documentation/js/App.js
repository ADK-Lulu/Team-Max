class App extends Base {

  async mount() {
    this.pages = [];
    this.navBarLinks = [];
    let doc = await (await fetch('/README.md')).text();
    let converter = new showdown.Converter();
    let div = document.createElement('div');
    div.innerHTML = converter.makeHtml(doc);
    let html = '';
    for (let el of div.children) {
      if (el.tagName === 'H2') {
        this.pages.length && (this.pages[this.pages.length - 1].html = html);
        html = '';
        let strong = el.querySelector('strong');
        let label = strong ? strong.innerText[0].toUpperCase() + strong.innerText.slice(1) : el.innerText;
        let route = '/' + label;
        el.innerHTML = el.innerText;
        this.navBarLinks.push({ label, route });
        this.pages.push(new Page({ route }));
      }
      html += el.outerHTML;
    }

    // remove about - let it be the start page
    this.navBarLinks.shift();
    this.pages[0].route = '/';

    this.pages[this.pages.length - 1].html = html;
    this.navBar = new NavBar({ links: this.navBarLinks });
    this.footer = new Footer();
  }

  render() {
    return /*html*/`
      <div base-title="Documentation: ">
        <header>
          ${this.navBar}
        </header>
        <main class="container my-4">
          ${this.pages}
        </main>
        ${this.footer}
      </div>
    `;
  }

}
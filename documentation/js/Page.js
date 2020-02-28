class Page extends Base {

  render() {
    setTimeout(() => Prism.highlightAll(), 0);
    return /*html*/`
      <div class="row" route="${this.route}" page-title=${this.route}>
        <div class="col-12 col-lg-8 offset-lg-2">
          <h1>${this.html}</h1>
        </div>
      </div>
    `;
  }

}
class NavBar extends Base {
  mount() {
    this.sokning = new Sokning();
    this.foundCities = [];
    this.selected = -1;
    sql(/*sql*/`USE max`);
  }

  render() {
    return /*html*/`
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-dark navbar-bg" >
      <a class="navbar-brand" href="/">
        <img src="/images/misc/logga_DR.png" width="270px" alt="">
          </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            ${this.links.map(link => !link.dropdown ? /*html*/`
              <li class="nav-item">
                <a class="nav-link" href="${link.route}">
                  ${link.label}
                </a>
              </li>
          ` : /*html*/`
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="${link.route}"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  ${link.label}
                </a>
                <div class="dropdown-menu scrollable-menu" aria-labelledby="navbarDropdownMenuLink">
                  ${link.dropdown.map(item => /*html*/`
                    <a class="dropdown-item" href="${item.route}">${item.label}</a>
                  `)}
                </div>
              </li>
          `)}
          </ul>
        </div>
        <div class="form-inline">${this.sokning}</div>
      </nav>
    </div>
    `
  }

}
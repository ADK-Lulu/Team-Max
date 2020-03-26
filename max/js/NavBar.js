class NavBar extends Base {
  mount() {
    this.sokning = new Sokning();
    this.foundCities = [];
    this.selected = -1;

  }

  render() {
    return /*html*/`
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-dark" >
        <a class="navbar-brand" href="/">
          <img src="/images/misc/logga_DR.png" alt="logo">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
         <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            ${this.links.map(link => !link.dropdown ? /*html*/`
            <li class="nav-item">
              <a class="nav-link" href="${link.route}">${link.label}</a>
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
        <div>
          <ul class="navbar-nav">
            <a class="nav-link" href='/mina-favoriter'>
              <li class="nav-item nav-icon-heart icofont-heart icofont-2x"></li>
            </a> 
          </ul>
        </div>
      </nav>
    </div>
    `
  }

}
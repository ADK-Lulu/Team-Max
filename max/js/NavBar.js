class NavBar extends Base {
  mount() {
    this.foundCities = [];
    this.selected = -1;
    sql(/*sql*/`USE max`);
  }

  clickCity(e) {
    this.foundCities = [];
    this.selected = -1;
    this.chosen = e.target.innerText;
    this.render();
  }

  selectWithUpDownArrows(e) {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      this.selected += (e.key === 'ArrowDown') - (e.key === 'ArrowUp');
      if (this.selected < 0) { this.selected = this.foundCities.length - 1; }
      if (this.selected >= this.foundCities.length) { this.selected = 0; }
      this.render();
      return;
    }
  }

  async searchCity(e) {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) { return; }
    if (e.key === 'Enter' && this.selected >= 0) {
      this.chosen = this.foundCities[this.selected].name;
      this.foundCities = [];
      this.selected = -1;
      this.render();
      return;
    }
    this.selected = 0;
    this.foundCities = e.target.value.length < 1 ? [] : await sql(/*sql*/`
      SELECT namn FROM Omraden WHERE namn LIKE $name
    `, {
      name: e.target.value + '%'
    });
    this.render();
  }

  render() {
    return /*html*/`
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="/">
        <img src="/images/misc/logga_DR.png" width="50" height="50" alt="">
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


            <div class="dropdown col-auto ml-auto">
             <form class="form-inline my-2 my-lg-0">
              <button class="btn btn-primary" type="submit"><i class="p-3 icofont-search-map icofont-2x"></i></button>
              <input class="form-control mr-sm-2" type="text" placeholder="Område" keyup="searchCity" keydown="selectWithUpDownArrows" autocomplete="off" autocorrect="off">
              ${this.foundCities.length < 1 ? '' : /*html*/`
                <div class="dropdown-menu show w-100 position-absolute">
                  ${this.foundCities.map((city, index) => /*html*/`
                    <button click="clickCity" class="dropdown-item ${this.selected !== index ? '' : 'bg-primary text-light'}" type="button">${city.namn}</button>
                   
                  `)}
                </div>
                
              `}
            </div>
          </div>
      </nav>
    `
  }

}
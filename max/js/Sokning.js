class Sokning extends Base {

  async mount() {
    this.foundCities = [];
    this.selected = -1;
    sql(/*sql*/`USE max`);

  }

  preventReload(e) {
    // Do not reload the form on submit
    e.preventDefault();
  }

  clickCity(e) {
    this.foundCities = [];
    this.selected = -1;
    this.chosen = e.target.innerText;
    document.querySelector('.search').value = this.chosen || '';
    this.render();
    this.gotoByPage();
  }

  gotoByPage() {
    if (location.pathname === '/kop-sida') {
      app.kopSida.fangaSokord(this.chosen);
      app.kopSida.search();
      app.kopSida.render();
    }
    else {
      // Tell the framework to go to another page
      app.goto('/kop-sida');
      app.kopSida.fangaSokord(this.chosen);
      app.kopSida.search();
      Base.router();
    }
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
      this.chosen = this.foundCities[this.selected] && this.foundCities[this.selected].namn;
      document.querySelector('.search').value = this.chosen || '';
      this.foundCities = [];
      this.selected = -1;
      this.render();
      this.gotoByPage();
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

        <div class="input-group input-group-lg">
          <div class="input-group-prepend">
            <button click="gotoByPage" type="submit" class="input-group-text btn-info" id="inputGroup-sizing-lg">Sök</button>
          </div>
          <input type="text" class="form-control search" type="text" placeholder="Område" keyup="searchCity" keydown="selectWithUpDownArrows" autocomplete="off" autocorrect="off">
           ${this.foundCities.length < 1 ? '' : /*html*/`
                <div class="dropdown-menu show w-100 position-absolute">
                  ${this.foundCities.map((city, index) => /*html*/`
                    <button click="clickCity" class="dropdown-item ${this.selected !== index ? '' : 'bg-primary text-light'}" type="button">${city.namn}</button>
                   
                  `)}
                </div>
                
            `}

        </div>

    `;
  }

}
class Footer extends Base {
  async mount() {
    await app.kopSida.search();
  }

  render() {
    return /*html*/ `
  <footer class="bg-secondary pt-3 text-light">
  <div class="container">
    <div class="row align-items-end justify-content-center">
      <div class="col-auto">
        ${app.navBarLinks.find(x => x.label === 'Kontakt').dropdown.map(x => x.label === "Kontakta oss" ?/*html*/`
        <a class="btn btn-info" role="button" href="${x.route}">${x.label}</a>
        `: null)}
      </div>
      <div class="col-auto">
        <div>
          <a href="https://www.facebook.com/" target="_blank">
            <i class="icofont-facebook icofont-2x"></i>
          </a>
          <a href="https://www.instagram.com/" target="_blank">
            <i class="icofont-instagram icofont-2x"></i>
          </a>
        </div>
      </div>
    </div> 
    <div class="row align-items-end justify-content-center">
      <div class="col-auto">
        <p class="mb-3 pt-3">©<small> Dhyr & Rumson 2020</small></p>
      </div>
    </div>
  </div>
  
    
  </footer>  
    `;
  }
}

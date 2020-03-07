class StartSida extends Base {

  mount() {
    this.carousel = new Carousel();
    this.sokning = new Sokning();
  }
  render() {
    return /*html*/`
        <div class="row" route="/" page-title="Startsida">
          <div class="col-12">
            <h4>Är vi nyckeln till ditt nya hem?</h4>
            <div class="row position-absolute w-100">
              <div class="col-lg-10 col-md-10 col-sm-8 mx-auto mt-6 mt-sm-6 mt-md-7 mt-lg-8 mt-xl-9">${this.sokning}</div>
            </div>
            <img src="images/misc/startsida_stamningsbild.jpg" class="img-fluid" alt="Ditt nya hem?">
          </div>
          ${this.carousel}
          </div>
        </div>
    `;
  }

}
class StartSida extends Base {

  mount() {
    this.carousel = new Carousel();
    this.sokning = new Sokning();
  }
  render() {
    return /*html*/`
        <div class="row" route="/" page-title="Startsida">
          <div class="col-12">
            <div class="row position-absolute w-100 mx-auto">
              <div class="col-lg-10 col-md-10 col-sm-8 mx-auto mt-5 mt-sm-5 mt-md-6 mt-lg-7 mt-xl-8">
                <h1 class="text-center text-shadow w-100 mx-auto pb-3">Är vi nyckeln till ditt nya hem?</h1>
                ${this.sokning}
              </div>
            </div>
            <img src="images/misc/startsida_stamningsbild.jpg" class="img-fluid" alt="Ditt nya hem?">
          </div>
          ${this.carousel}
          </div>
        </div>
    `;
  }

}
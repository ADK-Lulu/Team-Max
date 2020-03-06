class StartSida extends Base {

  mount() {
    this.carousel = new Carousel();
  }
  render() {
    return /*html*/`
        <div class="row" route="/" page-title="Startsida">
          <div class="col-12">
            <h4>Är vi nyckeln till ditt nya hem?</h4>
            <img src="images/misc/startsida_stamningsbild.jpg" class="img-fluid" alt="Ditt nya hem?">
          </div>
          ${this.carousel}
          </div>
        </div>
    `;
  }

}
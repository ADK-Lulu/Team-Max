class StartSida extends Base {

  mount() {
    this.carousel = new Carousel();
    this.sokning = new Sokning();
  }
  render() {
    return /*html*/`
        <div class="row" route="/" page-title="Startsida">
          <div class="col-12">
            <div class="row w-100">
              <div class="position-absolute pt-6 pt-md-7 col-lg-12">
                <h1 class="h1-responsive text-center text-shadow">Är vi nyckeln till ditt nya hem?</h1>
              </div>
            </div>
            <img src="images/misc/startsida_stamningsbild.jpg" class="img-fluid crop-image" alt="Ditt nya hem?">
          </div>
          <div class="row justify-content-center">
            <div class="col-md-8 mx-3 py-3">
              <h4>Stockholm i vårt hjärta... Vi på Dhyr & Rumson säljer allt ifrån slott till koja i Storstockholm. 
              Oavsett om du har en stor eller liten plånbok så är du alltid välkommen att höra av dig till oss. Vi gillar alla pengar.</h4>
            </div>
          </div>
          ${this.carousel}
        </div>
    `;
  }

}
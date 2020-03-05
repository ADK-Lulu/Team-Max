class ObjektSida extends Base {

  // Läs in databasen max
  async mount() {
    await sql(/*sql*/`USE max`);

    // Hämta alla bilder för aktuell SaljObjekt
    this.images = await sql(/*sql*/`
      SELECT * 
      FROM ObjektBilder 
      WHERE ObjektBilder.objektId = $objektSidaId
    `, {
      objektSidaId: this.objektId
    });

    // Hitta bilden som är framsidebild för aktuell SaljObjekt
    this.frontImage = this.images.find(front => front.framsidebild);
    //Hitta bilden för planritning
    this.planImage = this.images.find(plan => plan.planritning);
    //Hitta alla övriga bilder
    this.allPictures = this.images.filter(pictures => !pictures.framsidebild && !pictures.planritning);
  }

  render() {
    return /*html*/`
      <div class="container" route="/objekt-sida/${this.objektId}">
        <div class="row" page-title="Visa objekt ${this.objektId}">
          <div class="col-12">
            <img src="${this.frontImage.bildUrl}" class="img-fluid" alt="Frontbild ${this.objektId}">
            <h1 class="text-center">Objekttitel ${this.objektId}</h1> 
            <div class="col text-center sticky-top"><!--Kod för att knapparna ska vara centrerade och sticky när man scrollar.-->
              <div class="btn-group btn-group-lg" role="group" aria-label="Basic-example"> <!--Kod för button group -->
                <button type="button" class="btn btn-primary">Alla bilder</button> 
                <button type="button" class="btn btn-primary">Planritning</button> 
                <button type="button" class="btn btn-primary">Fakta om</button> 
                <button type="button" class="btn btn-primary">Anmäl intresse</button> 
                <button type="button" class="btn btn-primary">Om området</button>
                <button type="button" class="btn btn-primary">Dela</button>
              </div>
            </div>
            <!--Skriv kod här som inte har med knapparna att göra-->
            <div class="row"><!--Kod för bilderna-->
              ${this.allPictures.map(image => /*html*/`
                    <img class="img-fluid col-6" src="${image.bildUrl}">
                  `)}
              ${console.log(this.allPictures)}
            </div>
            <div><!--Planritning-->
            <img src="${this.planImage.bildUrl}" class="img-fluid" alt="Planritning ${this.objektId}">
            </div>
          </div>
        </div>
      </div>
    `;
  }

}
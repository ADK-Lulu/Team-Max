class ObjektSida extends Base {

  // Läs in databasen max
  async mount() {
    await sql(/*sql*/`USE max`);

    // Hämta alla bilder för aktuell SaljObjekt
    this.images = await sql(/*sql*/`
      SELECT * 
      FROM ObjektBilder 
      WHERE ObjektBilder.objektId = $objektSidaId
    `,
      {
        objektSidaId: this.objektId
      });

    // Hämta alla detaljer för aktuell SaljObjekt
    let details = await sql(/*sql*/`
      SELECT * 
      FROM SaljObjekt 
      JOIN ObjektProfiler 
      ON SaljObjekt.objektProfilId = ObjektProfiler.objektProfilId
      JOIN Adresser 
      ON SaljObjekt.adressId = Adresser.adressId
      JOIN Omraden 
      ON Omraden.omradeId = Adresser.omradeId
      WHERE SaljObjekt.objektId = $objektSidaId
    `,
      {
        objektSidaId: this.objektId
      });

    Object.assign(this, details[0]);

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
                <button type="button" class="btn btn-primary"><a href="#AllaBilder">Alla bilder</a></button>
                <button type="button" class="btn btn-primary"><a href="#Planritning">Planritning</a></button> 
                <button type="button" class="btn btn-primary"><a href="#FaktaOm">Fakta om</a></button> 
                <button type="button" class="btn btn-primary"><a href="#AnmälIntresse">Anmäl intresse</a></button> 
                <button type="button" class="btn btn-primary"><a href="#OmOmrådet">Om området</a></button>
                <button type="button" class="btn btn-primary"><a href="#Dela">Dela</a></button>
              </div>
            </div>
            <!--Skriv kod här som inte har med knapparna att göra-->

            <!--Hårdfakta-ruta här-->
            <div class="col-12 py-2">
              <div class="row bg-light">
                <div class="col">Storlek: ${this.kvm} kvm</div>
                <div class="col">Område: ${this.namn}</div>
              </div>
              <div class="row bg-light">
                <div class="col">Antal rum: ${this.antalRum}</div>
                <div class="col">Pris: ${this.pris} kr</div>
              </div>
            </div>

            <div class="row"><a id="AllaBilder"></a><!--Kod för bilderna-->
              ${this.allPictures.map(image => /*html*/`
                    <img class="img-fluid col-6" src="${image.bildUrl}">
                  `)}
            </div>
            <div class="col" id="Planritning"><!--Planritning-->
            <img src="${this.planImage.bildUrl}" class="img-fluid" alt="Planritning ${this.objektId}">
            </div>
            <div class="col" id="FaktaOm"><!--Fakta om-->
            Hej
            </div>
            <div class="col" id="AnmälIntresse"><!--Anmäl intresse-->
            Hej
            </div>
            <div class="col" id="OmOmrådet"><!--Om området-->
            Hej
            </div>
            <div class="col" id="Dela"><!--Dela-->
            Hej
            </div>
          </div>
        </div>
      </div>
    `;
  }

}
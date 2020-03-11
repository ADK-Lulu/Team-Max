class ObjektSida extends Base {

  showModal() {
    // Needed to stop scrolling when the modal is shown
    this.shown = true;
    setTimeout(() => $('body').addClass('modal-open'), 0);
    this.render();
  }

  closeModal() {
    // Needed to stop scrolling when the modal is shown
    this.shown = false;
    setTimeout(() => $('body').removeClass('modal-open'), 0);
    this.render();
  }

  // Använd databasen max
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

    // Hämta mäklarinfo till aktuellt objekt
    this.maklarinfo = await sql(/*sql*/`
      SELECT *
      FROM Maklare
      JOIN SaljObjekt
      WHERE SaljObjekt.objektId = $objektSidaId
      AND SaljObjekt.maklarId=Maklare.maklarId
      
    `,
      {
        objektSidaId: this.objektId
      });

    //Hämta detaljer

    //Hitta bilden som är framsidebild för aktuell SaljObjekt
    this.frontImage = this.images.find(front => front.framsidebild);
    //Hitta bilden för planritning
    this.planImage = this.images.find(plan => plan.planritning);
    //Hitta alla övriga bilder
    this.allPictures = this.images.filter(pictures => !pictures.framsidebild && !pictures.planritning);
    //Plocka ut mäklarobjektet
    this.maklare = this.maklarinfo[0];

  }

  // Fånga upp infon från formuläret "Anmäl intresse", längre ner i denna komponent
  async collectFormData(e) {
    e.preventDefault();
    let form = e.target;
    let formData = {};
    // Loopar elementen från formuläret
    for (let element of form.elements) {
      if (!element.name) { continue; }
      formData[element.name] = element.value;

    }
    // Sänder till db
    await sql(/*sql*/`
      INSERT INTO KopKontakter(namn, epost) VALUES($namn, $epost)
    `, formData);

    this.formSent = true;
    this.render();
  }

  kopieraLank() {
    /* Get the text field */
    let copyText = document.getElementById("lank")
    console.log(copyText)

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    document.getElementById("kopieratLank").innerHTML = "Länk kopierad till clipboard!";
  }


  render() {
    return /*html*/`
        <div class="row" route="/objekt-sida/${this.objektId}" page-title="Visa objekt ${this.objektId}">
          <div class="col-12">
            <img src="${this.frontImage.bildUrl}" class="img-fluid col-12" alt="Frontbild ${this.objektId}">
            <h1 class="text-center m-3">${this.saljRubrik}</h1> 
            <div class="col text-center sticky-top2"><!--Kod för att knapparna ska vara centrerade och sticky när man scrollar.-->
              <div class="btn-group btn-group-lg text-center" role="group" aria-label="Basic-example"> <!--Kod för button group -->
                <button type="button" class="btn btn-primary"><a href="#AllaBilder">Alla bilder</a></button>
                <button type="button" class="btn btn-primary"><a href="#Planritning">Planritning</a></button> 
                <button type="button" class="btn btn-primary"><a href="#FaktaOm">Fakta om</a></button> 
                <button type="button" class="btn btn-primary"><a href="#AnmälIntresse">Anmäl intresse</a></button> 
                <button type="button" class="btn btn-primary"><a href="#OmOmrådet">Om området</a></button>
                <button type="button" class="btn btn-primary" click="showModal">Dela</button>
              </div>
            </div>
            <!--Skriv kod här som inte har med knapparna att göra-->
            <!--Hårdfakta-ruta här-->
            <div class="row py-2 justify-content-center m-3">
              <div class="col-4 bg-light">
                <div class="col-auto">Storlek: ${this.kvm} kvm</div>
                <div class="col-auto">Garage: ${this.garage ? 'finns' : 'finns ej'}</div>
                <div class="col-auto">Hiss: ${this.hiss ? 'finns' : 'finns ej'}</div>
              </div>
              <div class="col-4 bg-light">
                <div class="col-auto">Antal rum: ${this.antalRum}</div>
                <div class="col-auto">Område: ${this.namn}</div>
                <div class="col-auto">Pris: ${app.formateraPris(this.pris)} kr</div>
              </div>
            </div>

            <div class="col-12">
              <p>${this.saljText}</p>
            </div>

            <div class="row"><a id="AllaBilder"></a><!--Kod för bilderna-->
              ${this.allPictures.map(image => /*html*/`
                    <img class="img-fluid col-6 py-2" src="${image.bildUrl}">
                  `)}
            </div>
            <div class="col" id="Planritning"><!--Planritning-->
              <img src="${this.planImage.bildUrl}" class="img-fluid" alt="Planritning ${this.objektId}">
            </div>
            <div class="col mt-3" id="FaktaOm"><!--Fakta om-->
            <p>${this.objektBeskrivning}</p>
            </div>
            

            <!--Aktuell mäklare för objektet presenteras, Marit parprogr med Sören (i något skede)-->
        <div class="container">
            <div class="row">
              <div class="col-4">
               <img class="card-img-top" src="${this.maklare.bildUrl}" alt="Mäklarinfo">
                  <div class="card-body text-center">
                    <h5 class="card-title text-center mb-2">Aktuell mäklare</h5>
                      <div class="card-text">
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">${this.maklare.namn}</li>
                          <li class="list-group-item">${this.maklare.telefonnummer}</li>
                          <li class="list-group-item">${this.maklare.epost}</li>
                        </ul>
                      </div>
                </div>
            </div>

              
  <!--Tack för visat intresse (svar på intresseformulär)-->
  
    ${this.formSent ? /*html*/`
      <div class="col-8">
        <h1>Tack för att du kontaktar oss!</h1>
      </div>
      ` :
    //Intresseformulär
      /*html*/`
      
      <div class="col-8" id="AnmälIntresse">
        <div class="col mt-2">
          <h4>Intresseanmälan:</h4>
          <form submit="collectFormData">
            <div class="form-group">
              <label class="w-100">Namn:
                        <input name="namn" type="text" class="form-control" placeholder="Ditt namn" required pattern=".{2,}">
                      </label>
                    </div>
              <div class="form-group">
                <label class="w-100">E-post:
                        <input name="epost" type="email" class="form-control" placeholder="Din e-postadress" required>
                        </label>
                      </div>
                <input class="btn btn-primary float-right" type="submit" value="Skicka">
                    </form>
              </div>
            `}
            </div>
              </div>
    </div>

          <!--Om området-->
            <div class="row" id="OmOmrådet">
            <div class="col-6 mt-3">
              <h4>Om ${this.namn}:</h4>
              ${this.omradesBeskrivning}
            </div>
            <div class="col-6 mt-3">
              <img class="img-fluid" src="${this.bildUrl}">
             </div>
            </div>

            <div id="Dela">
              <div class="modal-backdrop ${this.shown ? 'show' : 'd-none'}"></div>
              <div class="modal ${this.shown ? 'd-block open' : ''}" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Kopiera länk</h5>
                      <button type="button" class="close" click="closeModal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <input type="text" class="w-100" value="${window.location.href}" id="lank" readonly>
                      <p id="kopieratLank"></p>
                    </div>
                    <div class="modal-footer">
                      <button role="button" class="btn btn-primary" click="kopieraLank" aria-label="Copy">Kopiera länk</button>
                      <button type="button" class="btn btn-primary" click="closeModal">Stäng</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
  }

}
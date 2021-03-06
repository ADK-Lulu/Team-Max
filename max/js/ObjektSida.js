class ObjektSida extends Base {

  showModal() {
    // Needed to stop scrolling when the modal is shown
    this.shown = true;
    setTimeout(() => $('body').addClass('modal-open'), 0);
    this.render();
  }

  closeModal() {
    this.shown = false;
    setTimeout(() => $('body').removeClass('modal-open'), 0);
    this.render();
  }

  async mount() {

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

    //Hämta diverse-detaljer(datum, bilder, mäklare)
    this.frontImage = this.images.find(front => front.framsidebild);
    this.planImage = this.images.find(plan => plan.planritning);
    this.allPictures = this.images.filter(pictures => !pictures.framsidebild && !pictures.planritning);
    this.maklare = this.maklarinfo[0];
    this.todayDate = new Date();


    //Sticky-top ska försvinna vid nerscrollning och återuppstå vid uppscroll
    let prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
      if (document.getElementById("stickyTop")) {
        let currentScrollPos = window.pageYOffset;
        prevScrollpos > currentScrollPos ?
          document.getElementById("stickyTop").style.top = "0" :
          document.getElementById("stickyTop").style.top = "-110px";
        prevScrollpos = currentScrollPos;
      }
    }

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
    await sql(/*sql*/`
      INSERT INTO KopKontakter(namn, epost) VALUES($namn, $epost)
    `, formData);

    this.formSent = true;
    this.render();
  }

  kopieraLank() {//Kod för dela-länken
    //Hitta text-fältet
    let copyText = document.getElementById("lank")
    console.log(copyText)

    //Välj text fältet
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*För mindre skärmar*/

    //kopiera texten i text-fältet
    document.execCommand("copy");
    document.getElementById("kopieratLank").innerHTML = "Länk kopierad till clipboard!";
  }

  favorit() {
    app.fav.pushFav(this.objektId);
    this.render();
  }

  render() {
    return /*html*/`
      <div route="/objekt-sida/${this.objektId}" page-title="Visa objekt ${this.objektId}">
        <div class="row">
          <div class="col-12 mt-4 px-0">
            <img src="${this.frontImage.bildUrl}" class="img-fluid crop-image"  alt="Frontbild ${this.objektId}">
            <!--Badge "Visning idag" ifall dagens datum stämmer med visningsdatumet i db -->
            ${this.visning === this.todayDate.toISOString().split("").slice(0, 10).join("") ? /*html*/`
              <div class="position-absolute notify-badge">
                <h3 class="text-dark mt-3 px-1 pt-1">Visning idag</h3>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="row mt-1 mb-2 ml-2">
         <div click="favorit">${store.favoriter.includes(this.objektId) ?  /*html*/`
         <i class="icofont-heart card-title-gold icon-text"></i> Ta bort från favoriter`
        :/*html*/`<i class="icofont-heart text-secondary icon-text"></i> Spara som favorit`}
         </div>
        </div>
        <div class="row">
          <div class="col-12"> 
            <h1 class="text-center m-2 h1-responsive">${this.saljRubrik}</h1> 
          </div>
        </div>
        <div class="row sticky-top" id="stickyTop">
          <div class="col-12 text-center"><!--Kod för att knapparna ska vara centrerade och sticky när man scrollar.-->
            <div class="btn-group btn-group-lg text-center tab-choices-object-page" role="group" aria-label="Basic-example">
              <div class="row">
                <div class="btn-group col-12 col-lg-6">
                  <button type="button" class="btn btn-secondary py-3 white-btn-text" onclick="window.location.href='#AllaBilder'">
                    <img class="svg-icon" src="/images/iconer/sticky-bilder.svg">Alla bilder
                  </button>
                  <button type="button" class="btn btn-secondary py-3 white-btn-text" onclick="window.location.href='#Planritning'">
                    <img class="svg-icon" src="/images/iconer/sticky-plan.svg">Planritning
                  </button> 
                  <button type="button" class="btn btn-secondary py-3 white-btn-text" onclick="window.location.href='#FaktaOm'">
                    <img class="svg-icon" src="/images/iconer/sticky-fakta.svg">Fakta om
                  </button>
                </div>
                <div class="btn-group col-12 col-lg-6 sticky-menu-right">
                  <button type="button" class="btn btn-secondary py-3 white-btn-text" onclick="window.location.href='#AnmälIntresse'">
                    <img class="svg-icon" src="/images/iconer/sticky-anmal.svg">Anmäl intresse
                  </button> 
                  <button type="button" class="btn btn-secondary py-3 white-btn-text" onclick="window.location.href='#OmOmrådet'">
                   <img class="svg-icon" src="/images/iconer/sticky-omrade.svg">Om området
                  </button>
                  <button type="button" class="btn btn-secondary py-3 white-btn-text" click="showModal">
                    <img class="svg-icon" src="/images/iconer/sticky-dela.svg">Dela
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row no-gutters mt-4 pt-3 px-3 pb-lg-3 bg-light">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/money.png"> Pris: </span>${app.formateraPris(this.pris)} kr</div>
            <div class="pb-2 "><span class="font-weight-bold"><img src="/images/iconer/linjal.png"> Boarea: </span> ${this.kvm} kvm</div>
            <div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/door.png"> Antal rum: </span>${this.antalRum}</div>
            ${this.typId === 2 ? '' : /*html*/`<div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/fence.png"> Tomtarea: </span>${this.tomtArea} kvm</div>`}
            <div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/kalender.png"> Visningsdatum: </span>${this.visning}</div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/location.png"> Område: </span> ${this.namn}</div>
            <div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/spade.png"> Byggnadsår:  </span>${this.byggAr}</div>
            ${this.typId === 2 || this.typId === 3 ? /*html*/`<div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/drift.png">  Avgift: </span>${app.formateraPris(this.avgift)} kr/mån</div>`
        :/*html*/`<div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/drift.png">  Driftkostnad: </span>${app.formateraPris(this.driftKostnad)} kr/år</div>`}
            <div class="pb-2"><span class="font-weight-bold"><img src="/images/iconer/car.png"> Garage: </span>${this.garage ? 'finns' : 'finns ej'}</div>
            <div class="pb-2"><span class="font-weight-bold"> <img src="/images/iconer/hiss.png"> Hiss: </span>${this.hiss ? 'finns' : 'finns ej'}</div>
          </div>
          <div class="col-12 col-lg-4 pt-3 pt-lg-0">
            <p class="text-left text-break">${this.saljText}</p>
          </div>
        </div>
        <div class="row"><a id="AllaBilder"></a>
          <h3 class="col-12 pt-5 py-2">Alla bilder</h3>
            ${this.allPictures.map(image => /*html*/`
            <div class="col-12 col-md-6">
              <img class="crop-image py-2" src="${image.bildUrl}">
            </div>
          `)}
        </div>
        <div class="row"><a id="Planritning"></a>
          <h3 class="col-12 pt-5 py-2">Planritning</h3>
            <div class="col-12 col-med-6">
              <img src="${this.planImage.bildUrl}" class="img-fluid py-2" alt="Planritning ${this.objektId}">
            </div>
        </div>
        <div class="row" id="FaktaOm">
          <h3 class="col-12 text-align-center pt-5 py-2">Fakta om</h3>
          <div class="col-12 col-lg-6">
            <p class="text-break">${this.objektBeskrivning}</p>
          </div>
          <div class="col-12 col-lg-6">
            <p class="text-break">${this.objektBeskrivning2}</p>
          </div>
        </div>     
        <div class="row align-items-center py-5" id="AnmälIntresse">
          <h3 class="col-12 text-align-center pt-5 py-2">Anmäl intresse</h3>
            <div class="col-6 col-md-3">
              <img class="card-img" src="${this.maklare.bildUrl}" alt="Mäklarinfo">
            </div>
          <!--mäklarinfo start-->
          <div class="col-6 col-md-3">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">${this.maklare.namn}</li>
              <li class="list-group-item">${this.maklare.telefonnummer}</li>
              <li class="list-group-item text-break">${this.maklare.epost}</li>
            </ul>
          </div>        
          <!--Intresseformulär-->
            ${this.formSent ? /*html*/`
            <div class="col-6">
              <h2 class="text-center text-dark py-5 px-3">
                Tack för ditt meddelande!<br>
                Vi återkommer till dig så snabbt som möjligt.
              </h2>
            </div>
             ` :
          /*html*/`
          <div class="col-12 col-md-6 mt-3 mt-md-0">
           <div class="col mt-2 pr-0">
             <h4>Intresseanmälan:</h4>
              <form submit="collectFormData">
               <div class="form-group">
                <label class="w-100">Namn:
                 <input name="namn" type="text" class="form-control" autocomplete="name" placeholder="för- & efternamn" required pattern=".{2,}">
                </label>
                </div>
                <div class="form-group">
                  <label class="w-100">E-post:
                   <input name="epost" type="email" class="form-control" autocomplete="email" placeholder="namn@email.com" required>
                  </label>
                 </div>
                 <input class="btn btn-primary float-right" type="submit" value="Skicka">
                </form>
             </div>
             </div>
           `}
          </div>
          <!--mäklarinfo slut-->
          <div class="row align-items-end" id="OmOmrådet">
           <div class="col-12 col-lg-4 mt-4">
            <h3>Om ${this.namn}:</h3>
             ${this.omradesBeskrivning}
           </div>
           <div class="col-12 col-lg-8 mt-4">
            <img class="crop-image" src="${this.bildUrl}">
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
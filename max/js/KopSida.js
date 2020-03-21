class KopSida extends Base {

  // Läs in databasen max
  async mount() {

    this.sokning = new Sokning();

    //Dagens datum - att använda till "visning idag"
    this.todayDate = new Date();
  }

  // Fånga upp sökordet från Sokning.js
  fangaSokord(e) {
    e ? (app.settings.sokOmrade = e ? e + '%' : '%') : '';
    this.sokOrd = e;
  }

  async search() {
    this.results = await sql(/*sql*/`
    SELECT 
      SaljObjekt.objektId, 
      SaljObjekt.pris, 
      SaljObjekt.saljText,
      SaljObjekt.visning,
      ObjektProfiler.kvm, 
      ObjektProfiler.antalRum, 
      ObjektBilder.framsidebild, 
      ObjektBilder.bildUrl, 
      Omraden.namn, 
      Adresser.gata, 
      Adresser.gatunummer,
      ObjektTyper.typNamn,
      ObjektTyper.typId,
      ObjektProfiler.nyproduktion
      FROM SaljObjekt 
      JOIN ObjektProfiler 
      ON SaljObjekt.objektProfilId = ObjektProfiler.objektProfilId
      JOIN Adresser 
      ON SaljObjekt.adressId = Adresser.adressId
      JOIN Omraden 
      ON Omraden.omradeId = Adresser.omradeId
      JOIN ObjektBilder
      ON SaljObjekt.objektId = ObjektBilder.objektId
      JOIN ObjektTyper
      ON ObjektTyper.typId = SaljObjekt.typId
      WHERE antalRum >= $minRum
      AND antalRum <= $maxRum
      AND kvm >= $minKvm * 10
      AND kvm <= $maxKvm * 10
      AND pris >= $minPris * 100000
      AND pris <= $maxPris * 100000
      AND framsidebild = true
      AND namn LIKE $sokOmrade
      AND ObjektProfiler.nyproduktion IN (CASE WHEN $sokNybygge=false THEN 0 END, 1)
      AND ObjektTyper.typId IN (
        CASE WHEN $sokBostadsratt=true OR $sokVilla=false AND $sokRadhus=false AND $sokBostadsratt=false AND $sokNybygge=true THEN 2 END,
        CASE WHEN $sokRadhus=true OR $sokVilla=false AND $sokRadhus=false AND $sokBostadsratt=false AND $sokNybygge=true THEN 3 END,
        CASE WHEN $sokVilla=true OR $sokVilla=false AND $sokRadhus=false AND $sokBostadsratt=false AND $sokNybygge=true THEN 1 END)

      ORDER BY 
        CASE WHEN $sortering='nyast' THEN SaljObjekt.objektId END DESC,
        CASE WHEN $sortering='aldst' THEN SaljObjekt.objektId END ASC,
        CASE WHEN $sortering='billigastPris' THEN pris END ASC,
        CASE WHEN $sortering='dyrastPris' THEN pris END DESC
        
      `, app.settings);
    this.render();
  }

  // Filtrera efter checkboxar
  checkBoxFilter(e) {
    let name = e.target.id;
    let val = document.getElementById(name).checked;
    app.settings[name] = val;
    this.search();
    this.render();
  }


  async getSliderValue(e) {
    // Deklarera jobbigt långa saker till enkla namn
    let name = e.target.id;
    let val = +e.target.value;
    app.settings[name] = (name === 'maxPris' && val >= 90
      || name === 'maxKvm' && val >= 30
      || name === 'maxRum' && val >= 5 ? val * 1000000000000 : val);

    // Deklarera motsats början på namnet (min kontra max)
    let opposite = name.includes('min') ? 'max' : 'min';
    // Sätt ihop motsats början med slut delen av namnet i en egen variable(Rum, Kvm, Pris)
    let oppoName = opposite + name.slice(3);
    // Deklarera en variable med motsatsens value
    let oppoVal = app.settings[oppoName];
    // Om motsatsnamnet börjar på max, sätt motsatsvärdet till det största av värdena. Annars tvärt om.
    oppoVal = opposite == "max" ? Math.max(val, oppoVal) : Math.min(val, oppoVal);
    app.settings[oppoName] = oppoVal;
    this.search();
    this.render();
  }

  // Sätter värdena till sig själva fixa en mysko bugg med startvärdet på slidern
  setSliderValuesHackish() {
    for (let setting in app.settings) {
      // Sörens fix för en bugg där sidan gav error när man bytte från köpsidan till en annan sida
      if (document.querySelector("#" + setting) != null) {
        document.querySelector("#" + setting).value = app.settings[setting];
      }
    }
  }

  sortera(e) {
    app.settings.sortering = e.target.value;
    this.search();
    this.render();
  }

  visaDoljFilter() {
    this.visaFilter = !this.visaFilter;
    this.render();
  }


  render() {
    let s = app.settings;
    return /*html*/`
      <div route="/kop-sida" page-title="Köpa bostad">

        <!-- Fixed-bottom "Antal bostäder hittad för mobilvy"  -->
        <div class="row d-lg-none bg-light shadow fixed-bottom">
          <p class="col pt-3 ml-3">${this.results ? '<strong>' + this.results.length + '</strong> bostäder till salu just nu' : ''}</p>
        </div>

        <div class="row">
          <h1 class="m-3 m-sm-0 h1-responsive py-3">Bostäder till salu i ${this.sokOrd === undefined ? "Storstockholm" : this.sokOrd}</h1>
        </div>

        <div class="row p-3 mb-4">${this.sokning}</div>

        <!-- Filterknappar-->
        <form class="row bg-secondary no-gutters rounded mb-4 align-items-center">
          <div class="col-3 text-center checkmark">
            <div class="btn px-0 py-md-3 pl-md-2 pr-md-4 mt-md-2">
              <input change="checkBoxFilter" value="false" type="checkbox" id="sokBostadsratt" ${app.settings.sokBostadsratt ? 'checked' : ''}>
              <label for="sokBostadsratt" class="rounded">              
                <img class="icon-filter" src="/images/iconer/bostadsratt.svg" alt="bostadsratt">
                <div class="label font-weight-bold">Bostadsrätt</div>
                <span class="checkmarking"></span>
              </label>
            </div>
          </div>
          <div class="col-3 text-center checkmark">
            <div class="btn px-0 py-md-3 pl-md-2 pr-md-4 mt-md-2">
              <input change="checkBoxFilter" value="true" type="checkbox" id="sokRadhus" ${app.settings.sokRadhus ? 'checked' : ''}>
              <label for="sokRadhus" class="rounded"> 
                <img class="icon-filter" src="/images/iconer/radhus.svg" alt="radhus">
                <div class="label font-weight-bold">Radhus</div>
                <span class="checkmarking"></span>
              </label>
            </div>
          </div>
          <div class="col-3 text-center checkmark">
            <div class="btn px-0 py-md-3 pl-md-2 pr-md-4 mt-md-2">
              <input change="checkBoxFilter" value="true" type="checkbox" id="sokVilla" ${app.settings.sokVilla ? 'checked' : ''}>
              <label for="sokVilla" class="rounded"> 
                <img class="icon-filter" src="/images/iconer/villa.svg" alt="villa">
                <div class="label font-weight-bold">Villa</div>
                <span class="checkmarking"></span>
                </label>
            </div>
          </div>
          <div class="col-3 text-center checkmark">
            <div class="btn px-0 py-md-3 pl-md-2 pr-md-4 mt-md-2">
              <input change="checkBoxFilter" value="false" type="checkbox" id="sokNybygge" ${app.settings.sokNybygge ? 'checked' : ''}>
              <label for="sokNybygge" class="rounded"> 
                <img class="icon-filter" src="/images/iconer/nyproduktion.svg" alt="nyproduktion">
                <div class="label font-weight-bold" font-size="1vw">Endast Nyproduktion</div>
                <span class="checkmarking checkmarking-nyproduktion"></span>
              </label>
            </div>
          </div>
        </form>

        <!-- Input range sliders -->
        ${!this.visaFilter ? '' : /*html*/`
          <div class="row p-0">
            <div class="col-12 col-md-4 pb-2 mb-2">
              <label class="w-100">Minst antal rum: ${s.minRum}                   
                <input value="${s.minRum}" type="range" class="form-control-range" min="0" max="5" step="1" id="minRum" input="getSliderValue">
              </label>
              <div class="w-100"></div>
              <label class="w-100">Max. antal rum: ${s.maxRum > 5 ? '5+' : s.maxRum}
                <input value="${s.maxRum}" type="range" class="form-control-range" min="0" max="5" step="1" id="maxRum" input="getSliderValue">
              </label>
            </div>
            <div class="col-12 col-md-4 pb-2 mb-2">
              <label class="w-100">Minst boarea: ${(s.minKvm * 10) > 300 ? '300+' : (s.minKvm * 10)} kvm
                <input value="${s.minKvm}" type="range" class="form-control-range" min="0" max="30" step="1" id="minKvm" input="getSliderValue">
              </label>
              <div class="w-100"></div>
              <label class="w-100">Max. boarea: ${(s.maxKvm * 10) > 300 ? '300+' : (s.maxKvm * 10)} kvm
                <input value="${s.maxKvm}" type="range" class="form-control-range" min="0" max="30" step="1" id="maxKvm" input="getSliderValue">
              </label>
            </div>
            <div class="col-12 col-md-4 pb-2 mb-2">
              <label class="w-100">Minsta pris: ${app.formateraPris((s.minPris * 100000) > 9000000 ? '9 000 000+' : (s.minPris * 100000))} kr
                <input value="${s.minPris}" type="range" class="form-control-range" min="0" max="90" step="1" id="minPris" input="getSliderValue">
              </label>
              <div class="w-100"></div>
              <label class="w-100">Max pris: ${app.formateraPris((s.maxPris * 100000) > 9000000 ? '9 000 000+' : (s.maxPris * 100000))} kr
                <input value="${s.maxPris}" type="range" class="form-control-range" min="0" max="90" step="1" id="maxPris" input="getSliderValue">
              </label>
            </div>
          </div>
        `}

        <!-- Sortering -->
        <div class="row">
          <div class="form-group col-5 col-md-4 mb-4">
          <label for="sort-by">${this.results ? '(' + this.results.length + ')' : ''} Sortera efter</label>
            <select class="form-control" id="sort-by" click="sortera">
              <option value="nyast">Nyast först</option>
              <option value="aldst">Äldst först</option>
              <option value="billigastPris">Billigast först</option>
              <option value="dyrastPris">Dyrast först</option>
            </select>
          </div>
        </div>

        <!-- Knapp för att visa/dölja filter -->
        <div class="row">
          <div class="col-12">
            <div click="visaDoljFilter" class="sort-trigger">
              <i class="icofont-arrow-${!this.visaFilter ? 'down' : 'up'}"></i>
              <span>${!this.visaFilter ? 'Fler filter' : 'Dölj filter'}</span>
            </div>
          </div>
        </div>

        <!-- Sökresultat -->
        ${this.results && this.results.length > 0 ? this.results.map(object => /*html*/`
          <a class="text-dark" href="/objekt-sida/${object.objektId}">
            <div class="row no-gutters mb-4 bg-grey">
              <div class="px-0 pr-md-0 p-xs-0 col-12 col-lg-8 col-xl-9">
                <!-- Nyproduktions-badge -->
                ${object.nyproduktion ? /*html*/`
                  <div class="position-absolute float-left badge badge-secondary m-2">
                    <h3 class="text-light pt-1 px-1">Nyproduktion</h3>
                  </div>
                ` : ''}
                <!--"infoclip" "Visning idag" ifall dagens datum stämmer med visningsdatumet i db -->
                ${object.visning === this.todayDate.toISOString().split("").slice(0, 10).join("") ? /*html*/`
                <div>
                  <span class="onsale-section text-dark pt-1 px-1"><span class="onsale">Visning idag</span></span>
                </div>
                ` : ''}
                <img class="img-fluid crop-image mb-0" src="${object.bildUrl}" alt="Husets bild objektnummer: ${object.objektId}">
              </div>
              <div class="py-sm-3 col-12 col-lg-4 col-xl-3">
                <div class="row p-2 mt-1 p-md-1 pl-md-0">
                  <div class="col-6 col-lg-12">
                    <h2 class="sokresultat-title text-break">${object.gata} ${object.gatunummer}</h2>
                    <h3 class="sokresultat-title">${object.namn}</h3>
                  </div>
                  <div class="col-6 col-lg-12">
                    <p class="mb-1"><span class="font-weight-bold">Boarea:</span> ${object.kvm} kvm</p>
                    <p class="mb-1"><span class="font-weight-bold">Pris:</span> ${app.formateraPris(object.pris)} kr</p>
                    <p class="mb-1"><span class="font-weight-bold">Rum:</span> ${object.antalRum}</p>
                    <p class="mb-1"><span class="font-weight-bold">Typ:</span> ${object.typNamn}</p>
                    <p class="mb-1"><span class="font-weight-bold">Visning:</span> ${object.visning}</p>
                  </div>
                </div>
              </div>
            </div>
          </a>
          `) : /*html*/`
          <div class="row">
            <div class="col-12">
              <h3 class="text-center text-dark py-2 px-3">Tyvärr matchar din sökning inget av våra objekt, gör om din sökning
                eller kontakta en
                av våra mäklare för information om kommande försäljningar.</h3>
            </div>
          </div> 
        `}
      </div>
  `}

}
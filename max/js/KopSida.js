class KopSida extends Base {

  // Läs in databasen max
  async mount() {

    this.sokning = new Sokning();

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
      AND ObjektProfiler.nyproduktion IN (CASE WHEN $sokNybygge=false THEN 0 END,1)
      AND ObjektTyper.typId IN (
        CASE WHEN $sokBostadsratt=true THEN 2 END, 
        CASE WHEN $sokRadhus=true THEN 3 END, 
        CASE WHEN $sokVilla=true THEN 1 END
        )

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
        <div class="row" route="/kop-sida" page-title="Köpa bostad">
          <div class="col-12">
            <div class="row">
              <h1 class="h1-responsive py-3">Bostäder till salu ${this.sokOrd ? 'i ' + this.sokOrd : ''}</h1>
            </div>
        
            <div class="row py-3">${this.sokning}</div>
    
              <!-- Filterknappar-->
            	<form class="row bg-secondary rounded mb-4">
                <div class="form-row col-12 align-items-center">
                  <div class="col-6 col-md-3 text-center checkmark">
                    <div class="btn py-3 pl-3 pr-4 mt-2">
                      <input change="checkBoxFilter" value="false" type="checkbox" id="sokBostadsratt" ${app.settings.sokBostadsratt ? 'checked' : ''}>
                      <label for="sokBostadsratt" class="rounded">               
                        <img class="icon-filter" src="/images/iconer/bostadsratt.svg" alt="bostadsratt">
                        <div class="label font-weight-bold">Bostadsrätt</div>
                        <span class="checkmarking"></span>
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 text-center checkmark">
                    <div class="btn py-3 pl-3 pr-4 mt-2">
                      <input change="checkBoxFilter" value="true" type="checkbox" id="sokRadhus" ${app.settings.sokRadhus ? 'checked' : ''}>
                      <label for="sokRadhus" class="rounded"> 
                        <img class="icon-filter" src="/images/iconer/radhus.svg" alt="radhus">
                        <div class="label font-weight-bold">Radhus</div>
                        <span class="checkmarking"></span>
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 text-center checkmark">
                    <div class="btn py-3 pl-3 pr-4 mt-2">
                      <input change="checkBoxFilter" value="true" type="checkbox" id="sokVilla" ${app.settings.sokVilla ? 'checked' : ''}>
                      <label for="sokVilla" class="rounded"> 
                        <img class="icon-filter" src="/images/iconer/villa.svg" alt="villa">
                        <div class="label font-weight-bold">Villa</div>
                        <span class="checkmarking"></span>
                      </label>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 text-center checkmark">
                    <div class="btn py-3 px-3 mt-2">
                      <input change="checkBoxFilter" value="false" type="checkbox" id="sokNybygge" ${app.settings.sokNybygge ? 'checked' : ''}>
                      <label for="sokNybygge" class="rounded"> 
                        <img class="icon-filter" src="/images/iconer/nyproduktion.svg" alt="nyproduktion">
                        <div class="label font-weight-bold">Nyproduktion</div>
                        <span class="checkmarking"></span>
                      </label>
                    </div>
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

              <!-- Knapp för att visa/dölja filter -->
              <div class="row row-h-25">
                <div class="col-12">
                  <div click="visaDoljFilter" class="sort-trigger">
                    <i class="icofont-arrow-${!this.visaFilter ? 'down' : 'up'}"></i>
                    <span>${!this.visaFilter ? 'Fler filter' : 'Dölj filter'}</span>
                  </div>
                </div>
              </div>
                            
              <!-- Sortering -->
              <div class="row">
                <div class="form-group col-4">
                <label for="sort-by">${this.results ? '(' + this.results.length + ')' : ''} Sortera efter</label>
                  <select class="form-control" id="sort-by" click="sortera">
                    <option value="nyast">Nyast först</option>
                    <option value="aldst">Äldst först</option>
                    <option value="billigastPris">Billigast först</option>
                    <option value="dyrastPris">Dyrast först</option>
                  </select>
                </div>
              </div>

              <!-- Fixed-bottom "Antal bostäder hittad för mobilvy"  -->
              <div class="d-lg-none bg-light row shadow fixed-bottom">
                <p class="col pt-3 ml-3">${this.results ? '<strong>' + this.results.length + '</strong> bostäder till salu just nu' : ''}</p>
              </div>

              <!-- Sökresultat -->
                ${this.results ? this.results.map(object => /*html*/`
                <a class="text-dark" href="/objekt-sida/${object.objektId}">
                  <div class="row mb-4 bg-grey">
                    <div class="px-0 pr-md-0 p-xs-0 col-12 col-lg-8 col-xl-9">
                      ${object.nyproduktion ? /*html*/`
                        <div class="position-absolute float-left badge badge-secondary m-2">
                          <h3 class="text-light pt-1 px-1">Nyproduktion</h3>
                        </div>
                      ` : ''}
                    <img class="img-fluid crop-image mb-0" src="${object.bildUrl}" alt="Husets bild objektnummer: ${object.objektId}">
                    </div>
                    <div class="py-sm-3 col-12 col-lg-4 col-xl-3">
                      <div class="row p-2 mt-1 p-md-1 pl-md-0">
                        <div class="col-7 col-lg-12">
                          <h2>${object.gata} ${object.gatunummer}</h2>
                          <h3>${object.namn}</h3> 
                        </div>
                        <div class="col-5 col-lg-12">
                          <p class="mb-1"><span class="font-weight-bold">Boarea:</span> ${object.kvm} kvm</p>
                          <p class="mb-1"><span class="font-weight-bold">Pris:</span> ${app.formateraPris(object.pris)} kr</p>
                          <p class="mb-1"><span class="font-weight-bold">Rum:</span> ${object.antalRum}</p>
                          <p class="mb-1"><span class="font-weight-bold">Typ:</span> ${object.typNamn}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              `) : ''}

          </div>
        </div>
    `;
  }

}
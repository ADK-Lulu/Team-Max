class KopSida extends Base {

  // Läs in databasen max
  async mount() {
    this.settings = {
      minRum: 0,
      maxRum: 5,
      minKvm: 0,
      maxKvm: 30,
      minPris: 0,
      maxPris: 90,
      sortering: 'nyast',
      sokBostadsratt: true,
      sokRadhus: true,
      sokVilla: true,
      sokNybygge: false,
      sokOmrade: '%'
    };
    this.sokning = new Sokning();
    this.search();
    await sql(/*sql*/`USE max`)

  }

  // Fånga upp sökordet från Sokning.js
  fangaSokord(e) {
    this.settings.sokOmrade = e ? e + '%' : '%';
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
        
      `, this.settings);
    this.render();
  }

  // Filtrera efter checkboxar
  checkBoxFilter(e) {
    let name = e.target.id;
    let val = document.getElementById(name).checked;
    this.settings[name] = val;
    this.search();
    this.render();
  }


  async getSliderValue(e) {
    // Deklarera jobbigt långa saker till enkla namn
    let name = e.target.id;
    let val = e.target.value / 1;
    this.settings[name] = val;

    // Deklarera motsats början på namnet (min kontra max)
    let opposite = name.includes('min') ? 'max' : 'min';
    // Sätt ihop motsats början med slut delen av namnet i en egen variable(Rum, Kvm, Pris)
    let oppoName = opposite + name.slice(3);
    // Deklarera en variable med motsatsens value
    let oppoVal = this.settings[oppoName];
    // Om motsatsnamnet börjar på max, sätt motsatsvärdet till det största av värdena. Annars tvärt om.
    oppoVal = opposite == "max" ? Math.max(val, oppoVal) : Math.min(val, oppoVal);
    this.settings[oppoName] = oppoVal;
    this.search();
    this.render();
  }

  // Sätter värdena till sig själva fixa en mysko bugg med startvärdet på slidern
  setSliderValuesHackish() {
    for (let setting in this.settings) {
      // Sörens fix för en bugg där sidan gav error när man bytte från köpsidan till en annan sida
      if (document.querySelector("#" + setting) != null) {
        document.querySelector("#" + setting).value = this.settings[setting];
      }
    }
  }

  sortera(e) {
    this.settings.sortering = e.target.value;
    this.search();
    this.render();
  }

  render() {
    !this.results ? this.search() : '';
    let s = this.settings;
    return /*html*/`
        <div class="row" route="/kop-sida" page-title="Köpa bostad">
          <div class="col-12">
            <h1>Köpa bostad ${this.sokord ? 'i ' + this.sokord : ''}</h1>
            <p>Det här är en sida där du kan köpa bostad</p>

            <div class="row py-3">${this.sokning}</div>
    
            	<form class="row bg-secondary mb-3">
                <div class="form-row col-12 align-items-center">
                  <div class="col-s-6 col-sm-6 col-xs-1 col-md-3">
                    <label class="btn">
                      <img class="icon-filter" src="/images/iconer/bostadsratt.svg" alt="bostadsratt">
                      <input change="checkBoxFilter" value="false" type="checkbox" id="sokBostadsratt" ${this.settings.sokBostadsratt ? 'checked' : ''}>
                      <div class="label font-weight-bold">Bostadsrätt</div>
                    </label>
                  </div>

                  <div class="col-s-6 col-sm-6 col-xs-1 col-md-3">
                    <label class="btn">
                      <img class="icon-filter" src="/images/iconer/radhus.svg" alt="radhus">
                      <input change="checkBoxFilter" value="true" type="checkbox" id="sokRadhus" ${this.settings.sokRadhus ? 'checked' : ''}>
                      <div class="label font-weight-bold">Radhus</div>
                    </label>
                  </div>

                  <div class="col-s-6 col-sm-6 col-xs-1 col-md-3">
                    <label class="btn">
                      <img class="icon-filter" src="/images/iconer/villa.svg" alt="villa">
                      <input change="checkBoxFilter" value="true" type="checkbox" id="sokVilla" ${this.settings.sokVilla ? 'checked' : ''}>
                      <div class="label font-weight-bold">Villa</div>
                    </label>
                  </div>
                  
                  <div class="col-s-6 col-sm-6 col-xs-1 col-md-3">
                    <label class="btn">
                      <img class="icon-filter" src="/images/iconer/nyproduktion.svg" alt="nyproduktion">
                      <input change="checkBoxFilter" value="false" type="checkbox" id="sokNybygge" ${this.settings.sokNybygge ? 'checked' : ''}>
                      <div class="label font-weight-bold">Nyproduktion</div>
                    </label>
                  </div>
                </div>
              </form>
              
              <form>
                  <div class="row">
                    <div class="col">
                      <label class="w-100">Minst antal rum: ${s.minRum}                   
                        <input value="${s.minRum}" type="range" class="form-control-range" min="0" max="5" step="1" id="minRum" input="getSliderValue">
                      </label>
                    <div class="w-100"></div>
                      <label class="w-100">Max. antal rum: ${s.maxRum}
                        <input value="${s.maxRum}" type="range" class="form-control-range" min="0" max="5" step="1" id="maxRum" input="getSliderValue">
                      </label>
                    </div>
                    <div class="col">
                      <label class="w-100">Minst boarea: ${s.minKvm * 10} kvm
                        <input value="${s.minKvm}" type="range" class="form-control-range" min="0" max="30" step="1" id="minKvm" input="getSliderValue">
                      </label>
                      <div class="w-100"></div>
                      <label class="w-100">Max. boarea: ${s.maxKvm * 10} kvm
                        <input value="${s.maxKvm}" type="range" class="form-control-range" min="0" max="30" step="1" id="maxKvm" input="getSliderValue">
                      </label>
                    </div>
                    <div class="col">
                      <label class="w-100">Minsta pris: ${s.minPris * 100000} kr
                        <input value="${s.minPris}" type="range" class="form-control-range" min="0" max="90" step="1" id="minPris" input="getSliderValue">
                      </label>
                      <div class="w-100"></div>
                      <label class="w-100">Max pris: ${s.maxPris * 100000} kr
                        <input value="${s.maxPris}" type="range" class="form-control-range" min="0" max="90" step="1" id="maxPris" input="getSliderValue">
                      </label>
                    </div>
                  </div>
              </form>
                            
              <!--Gör en knapp som man kan sortera med-->
              <div class="row w-100">
                <div class="form-group">
                <label for="sort-by">Sortera efter</label>
                  <select class="form-control" id="sort-by" click="sortera">
                    <option value="nyast">Nyast först</option>
                    <option value="aldst">Äldst först</option>
                    <option value="billigastPris">Billigast först</option>
                    <option value="dyrastPris">Dyrast först</option>
                  </select>
                </div>
              </div>
              <div class="col-12">
                ${this.results.map(object => /*html*/`<a class="text-dark" href="/objekt-sida/${object.objektId}">
                <div class="row">
                  <div class=col-8>
                   ${object.nyproduktion ? /*html*/`
                    <div class="position-absolute float-left badge badge-secondary m-2">
                    <h3>Nyproduktion</h3>
                    </div>
                    ` : ''}
                   <img class="img-fluid crop-image" src="${object.bildUrl}" alt="Husets bild objektnummer: ${object.objektId}">
                  </div>
                  <div class="col-4">
                    <h1 class="display-4">${object.gata} ${object.gatunummer}<br>
                    <small>${object.namn}</small> </h1>
                    <p class="lead">Kvm: ${object.kvm} <br>
                    Pris: ${app.formateraPris(object.pris)} <br>
                    Rum: ${object.antalRum} <br>
                    Typ: ${object.typNamn} <br>
                    </p>
                  </div>
                </div></a>
                <div class="row">
                <div class=col-12>
                <br>
                </div>
                </div>

              `)}
              </div>
            
            </div>

          </div>
        </div>
    `;
  }

}
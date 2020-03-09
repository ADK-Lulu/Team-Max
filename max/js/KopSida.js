class KopSida extends Base {

  // Läs in databasen max
  async mount() {
    this.sokning = new Sokning();
    await sql(/*sql*/`USE max`);
    this.settings = {
      minRum: 0,
      maxRum: 5,
      minKvm: 0,
      maxKvm: 30,
      minPris: 0,
      maxPris: 900
    };

  }

  async search() {
    this.sokOm = { sokOmrade: this.sokord ? this.sokord + '%' : '%' }
    this.sokSettings = Object.assign({}, this.settings, this.sokOm)

    this.results = await sql(/*sql*/`
      SELECT SaljObjekt.objektId, 
      SaljObjekt.pris, 
      SaljObjekt.saljText,
      ObjektProfiler.kvm, 
      ObjektProfiler.antalRum, 
      ObjektBilder.framsidebild, 
      ObjektBilder.bildUrl, 
      Omraden.namn, 
      Adresser.gata, 
      Adresser.gatunummer
      FROM SaljObjekt 
      JOIN ObjektProfiler 
      ON SaljObjekt.objektProfilId = ObjektProfiler.objektProfilId
      JOIN Adresser 
      ON SaljObjekt.adressId = Adresser.adressId
      JOIN Omraden 
      ON Omraden.omradeId = Adresser.omradeId
      JOIN ObjektBilder
      ON SaljObjekt.objektId = ObjektBilder.objektId
      WHERE antalRum >= $minRum
      AND antalRum <= $maxRum
      AND kvm >= $minKvm * 10
      AND kvm <= $maxKvm * 10
      AND pris >= $minPris * 100000
      AND pris <= $maxPris * 100000
      AND framsidebild = true
      AND namn LIKE $sokOmrade
      `, this.sokSettings);
    this.render();
  }

  catch(e) {
    this.sokord = e;
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

  render() {
    !this.results ? this.search() : '';
    let s = this.settings;
    return /*html*/`
        <div class="row" route="/kop-sida" page-title="Köpa bostad">
          <div class="col-12">
            <h1>Köpa bostad ${this.sokord ? 'i ' + this.sokord : ''}</h1>
            <p>Det här är en sida där du kan köpa bostad</p>

             <div class="row py-3">${this.sokning}</div>
    
            	<form>
              <div class="form-row align-items-center">
                  <div class="col-md-3"><label class="btn btn-secondary">
                  <img src="/images/iconer/bostadsratt.png" alt="bostadsratt">
                  <input type="checkbox"  id="bostadsratt"></label></div>

                  <div class="col-md-3"><label class="btn btn-secondary">
                  <img src="/images/iconer/radhus.png" alt="radhus">
                  <input type="checkbox" id="radhus" ></label></div>

                  <div class="col-md-3"><label class="btn btn-secondary">
                  <img src="/images/iconer/hus.png" alt="hus">
                  <input type="checkbox" id="hus"></label></div>
              

                  <div class="col-md-3"><label class="btn btn-secondary">
                  <img src="/images/iconer/nybygge.png" alt="nybygge">
                  <input type="checkbox" id="nybygge"></label></div>
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
              <div class="">
                ${this.results.map(object => /*html*/`<a style="color:black;" href="/objekt-sida/${object.objektId}">
                <div class="row">
                  <div class=col-8>
                   <img class="img-fluid w-100 h-auto" src="${object.bildUrl}" alt="Husets bild objektnummer: ${object.objektId}">
                  </div>
                  <div class="col-4">
                    <h1 class="display-4">${object.gata} ${object.gatunummer}<br>
                    <small>${object.namn}</small> </h1>
                    <p class="lead">Kvm: ${object.kvm} <br>
                    Pris: ${object.pris} <br>
                    Rum: ${object.antalRum} <br></p>
                  </div>
                </div></a>
                <div class="row">
                <div class=col-12>
                <br>
                </div>
                </div>

              `)}
              </div>

              
              <!--Gör en knapp som man kan sortera med-->
              <label for="sort-by">Sortera efter</label>
              <select name="objekt" id="sort-by">
                <option value="Inget" click="">Ingen sortering</option>
                <option value="Billigast" click="">Billigast först</option>
                <option value="Dyrast" click="">Dyrast först</option>
                <option value="Nyast" click="">Nyast först</option>
                <option value="Äldst" click="">Äldst föst</option>
              </select>
             
              <pre>${JSON.stringify(this.results, '', ' ')}</pre>

            ${!app.navBar.chosen ? '' : `<p>Du vill köpa bostäder i ${app.navBar.chosen}.</p>`}
            
            </div>

          </div>
        </div>
    `;

  }

}
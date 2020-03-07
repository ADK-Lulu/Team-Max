class KopSida extends Base {

  // Läs in databasen max
  async mount() {
    this.sokning = new Sokning();
    await sql(/*sql*/`USE max`);

    this.settings = {
      minRum: 0,
      maxRum: 5,
      minKvm: 0,
      maxKvm: 300,
      minPris: 0,
      maxPris: 9000000
    };

  }

  // Joinar två objekt för sökning
  joining() {
    this.sokFilter = Object.assign({}, this.settings, store.searchSettings);
  }

  async search() {

    this.joining()
    this.results = await sql(/*sql*/`
      SELECT * 
      FROM SaljObjekt 
      JOIN ObjektProfiler 
      ON SaljObjekt.objektProfilId = ObjektProfiler.objektProfilId
      JOIN Adresser 
      ON SaljObjekt.adressId = Adresser.adressId
      JOIN Omraden 
      ON Omraden.omradeId = Adresser.omradeId
      WHERE antalRum >= $minRum
      AND antalRum <= $maxRum
      AND kvm >= $minKvm
      AND kvm <= $maxKvm
      AND pris >= $minPris
      AND pris <= $maxPris
      AND namn LIKE $sokOmrade
      `, this.sokFilter);

    this.render();

  }
  getSliderValue(e) {
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
    let s = this.settings;
    let r =  /*html*/`
        <div class="row" route="/kop-sida" page-title="Köpa bostad">
          <div class="col-12">
            <h1>Köpa bostad</h1>
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
                      <label class="w-100">Minst boarea: ${s.minKvm} kvm
                        <input value="${s.minKvm}" type="range" class="form-control-range" min="0" max="300" step="10" id="minKvm" input="getSliderValue">
                      </label>
                      <div class="w-100"></div>
                      <label class="w-100">Max. boarea: ${s.maxKvm} kvm
                        <input value="${s.maxKvm}" type="range" class="form-control-range" min="0" max="300" step="10" id="maxKvm" input="getSliderValue">
                      </label>
                    </div>
                    <div class="col">
                      <label class="w-100">Minsta pris: ${s.minPris} kr
                        <input value="${s.minPris}" type="range" class="form-control-range" min="0" max="9000000" step="100000" id="minPris" input="getSliderValue">
                      </label>
                      <div class="w-100"></div>
                      <label class="w-100">Max pris: ${s.maxPris} kr
                        <input value="${s.maxPris}" type="range" class="form-control-range" min="0" max="9000000" step="100000" id="maxPris" input="getSliderValue">
                      </label>
                    </div>
                  </div>
              </form>

              <pre>${JSON.stringify(this.results, '', ' ')}</pre>
             
            ${!app.navBar.chosen ? '' : `<p>Du vill köpa bostäder i ${app.navBar.chosen}.</p>`}
            
            </div>

          </div>
        </div>
    `;
    setTimeout(() => this.setSliderValuesHackish(), 0);
    return r;
  }

}
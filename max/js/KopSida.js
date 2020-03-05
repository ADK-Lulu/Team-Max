class KopSida extends Base {

  // Läs in databasen max
  async mount() {
    await sql(/*sql*/`USE max`);

    let searchChosen = app.navBar.chosen;
    let results = await sql(/*sql*/`
      SELECT * 
      FROM SaljObjekt 
      JOIN ObjektProfiler 
      ON SaljObjekt.objektProfilId = ObjektProfiler.objektProfilId
      JOIN Adresser 
      ON SaljObjekt.adressId = Adresser.adressId
      JOIN Omraden 
      ON Omraden.omradeId = Adresser.omradeId
      WHERE Omraden.namn = $sokOmrade
      `,
      {
        sokOmrade: searchChosen
      });

    Object.assign(this, results[0])

  }

  render() {
    return /*html*/`
        <div class="row" route="/kop-sida" page-title="Köpa bostad">
          <div class="col-12">
            <h1>Köpa bostad</h1>
            <p>Det här är en sida där du kan köpa bostad</p>

              <div class="input-group py-4">
                <div class="btn btn-secondary">
                  <i class="p-3 icofont-search-map icofont-1x"></i>
                </div>
                <input type="text" class="form-control mr-sm-2 search" placeholder="Sök område">
              </div>
    
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
                        
            ${!app.navBar.chosen ? '' : `<p>Du vill köpa bostäder i ${app.navBar.chosen}.</p>`}
            ${console.log(this.saljText)}
          </div>
        </div>
    `;
  }

}
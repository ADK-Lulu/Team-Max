class KopSida extends Base {

  render() {
    return /*html*/`
      <div class="container">
        <div class="row" route="/kop-sida" page-title="Köpa bostad">
          <div class="col-12">
            <h1>Köpa bostad</h1>
            <p>Det här är en sida där du kan köpa bostad</p>

    
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
          </div>
        </div>
      </div>
    `;
  }

}
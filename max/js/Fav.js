class Fav extends Base {

  mount() {
    this.fetchFav();
  }

  // Tar bort/lägger till säljobjekt i store.favoriter
  pushFav(objektId) {
    if (!store.favoriter.includes(objektId)) {
      store.favoriter.push(objektId);
      store.save();

    } else if (store.favoriter.includes(objektId)) {
      let indexToRemove = store.favoriter.indexOf(objektId);
      store.favoriter.splice(indexToRemove, 1);
      store.save();

    }
    this.fetchFav();
  }

  // Tar bort enstacka favoriter
  removeFav(e) {
    let objectId = +e.target.getAttribute("value");
    this.pushFav(objectId);
  }

  // Tömmer store.favoriter
  emptyFav() {
    store.favoriter = [];
    store.save();
    this.fetchFav();
    this.render();
  }

  //Hämtar hem info från databasen för favoritobjekten: frontbild, pris, visningsdatum o pushar in i favAfterSQL
  async fetchFav() {

    this.favAfterSQL = [];
    for (let el of store.favoriter) {

      this.object = await sql(/*sql*/`
      SELECT 
      ObjektBilder.bildUrl,
      SaljObjekt.visning, 
      SaljObjekt.pris, 
      SaljObjekt.objektId
      FROM ObjektBilder
      JOIN SaljObjekt
      ON SaljObjekt.objektId=ObjektBilder.objektId 
      WHERE ObjektBilder.objektId = $objektSidaId
      AND ObjektBilder.framsidebild=1
    `,
        {
          objektSidaId: el
        });

      this.favAfterSQL.push(this.object[0]);
    }
    this.render();
  }

  render() {
    return /*html*/`
      <div route="/mina-favoriter" page-title="Mina favoriter">
        <div class="row">
          <div class="col-12">
            <h1 class="h1-responsive py-3 ppl-3 pl-sm-0 pr-3">Mina sparade favoriter</h1>
          </div>
          ${store.favoriter.length > 0 ? `<p click="emptyFav" class="ml-3"><i class="icofont-bin"></i> Ta bort alla mina favoriter</p>` : ''}
        </div>
          <div class="row">
            <div class="col-12">
               ${this.favAfterSQL.length > 0 ? /*html*/`<div class="row">` + this.favAfterSQL.map(object =>/*html*/`
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                  <i click="removeFav" value="${object.objektId}" class="icofont-close icofont-2x position-absolute zindex-fixed"></i>
                  <a class="card border-0" href="/objekt-sida/${object.objektId}">
                    <div class="card">
                      <img class="card-image-hight" src="${object.bildUrl}" alt="Card image cap">
                      <div class="card-img-overlay p-1">
                        <h5 class="card-title text-dark text-center"><i class="icofont-calendar"></i> ${object.visning} <i class="icofont-money-bag"></i> ${app.formateraPris(object.pris)} kr</h5>
                      </div>
                    </div>
                  </a>
                </div>
                `) + `</div>` : /*html*/`
                <div class="row">
                  <div class="col-12">
                    <h3 class="text-dark py-2">Du har inte markerat några favoritobjekt ännu.</h3>
                  </div>
                </div>
              `}
            <div>    
          </div>
      </div>
  `}
}

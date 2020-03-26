class Fav extends Base {

  async mount() {

    this.fetchFav();

  }

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
      console.log(this.favAfterSQL);
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
        </div>
        <!-- Listade favoriter -->

          <div class="row">
            <div class="col-12 card-columns">
                ${this.favAfterSQL.length > 0 ? this.favAfterSQL.map(object =>/*html*/`
                <a class="text-dark" href="/objekt-sida/${object.objektId}">
                    <img class=" card-image-hight" src="${object.bildUrl}" alt="Card image cap">
                    <div class="card-body text-center">
                      <h5 class="card-title-gold">${object.visning}</h5>
                      <h5 class="card-title">${app.formateraPris(object.pris)} kr</h5>
                    </div>
                </a>
                `) : /*html*/`
                <div class="row">
                  <div class="col-12">
                    <h3 class="text-dark py-2 px-3">Du har inte markerat några favoritobjekt ännu.</h3>
                  </div>
                </div> 
              `}

            <div>    
          </div>
      </div>
  `}
}

class Fav extends Base {

  async mount() {

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
      <div class="row" route="/mina-favoriter" page-title="Mina favoriter">
        <div class="row">
          <h1 class="m-3 h1-responsive py-3">Mina sparade favoriter</h1>
        </div>
        <!-- Listade favoriter -->
        ${this.favAfterSQL.length > 0 ? this.favAfterSQL.map(object => /*html*/`
          <a class="text-dark" href="/objekt-sida/${object.objektId}">
            <div class="row no-gutters mb-4 bg-grey">
              <div class="px-0 pr-md-0 p-xs-0 col-12 col-lg-8 col-xl-9">
                <img class="img-fluid crop-image mb-0" src="${object.bildUrl}" alt="Husets bild objektnummer: ${object.objektId}">
              </div>
              <div class="p-sm-3 col-12 col-lg-4 col-xl-3">
                <div class="row p-2 mt-1 p-md-1 pl-md-0">
                  <div class="col-6 col-lg-12 pr-0">
                    <p class="mb-1"><span class="font-weight-bold" >Pris:</span> ${app.formateraPris(object.pris)} kr</p>
                    <p class="mb-1"><span class="font-weight-bold">Visning:</span> ${object.visning}</p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        `) : /*html*/`
          <div class="row">
            <div class="col-12">
              <h3 class="text-center text-dark py-2 px-3">Du har inte markerat några favoritobjekt ännu.</h3>
            </div>
          </div> 
        `}
  </div>
  `}
}

class ObjektSida extends Base {

  // Läs in databasen max
  async mount() {
    await sql(/*sql*/`USE max`);

    // Hämta alla bilder för aktuell SaljObjekt
    this.images = await sql(/*sql*/`
      SELECT * 
      FROM ObjektBilder 
      WHERE ObjektBilder.objektId = $objektSidaId
    `, {
      objektSidaId: this.objektId
    });

    // Hitta bilden som är framsidebild för aktuell SaljObjekt
    this.frontImage = this.images.find(front => front.framsidebild);
  }

  render() {
    return /*html*/`
      <div class="container">
        <div class="row" route="/objekt-sida/${this.objektId}" page-title="Visa objekt ${this.objektId}">
          <div class="col-12">
            <img src="${this.frontImage.bildUrl}" class="img-fluid" alt="Frontbild ${this.objektId}">
            <h1 class="text-center">Objekttitel ${this.objektId}</h1>
          </div>
        </div>
      </div>
    `;
  }

}
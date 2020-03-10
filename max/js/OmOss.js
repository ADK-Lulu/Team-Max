class OmOss extends Base {

  //Databasen max ska användas
  async mount() {

    await sql(/*sql*/`USE max`);

    //info hämtas från tabellen Maklare
    this.maklarInfo = await sql(/*sql*/`
    SELECT 
    bildUrl,
    namn,
    telefonnummer,
    epost
    FROM Maklare`)
  }


  render() {
    return /*html*/`
<div class="container fluid" route="/om-oss" page-title="Om oss">
  <div class="row">

    <!--infofält om företaget o chefen-->
    <div class="col-5 bg-secondary">
      <div class="card my-4">
        <div class="card-body">
          <h4 class="card-title">Vår story</h4>
          <p class="card-text">Redan när vår grundare <strong>Fiona</strong> var en liten flicka så älskade hon hus. Hon
            ritade hus.
            Hon byggde hus av sockerbitar. Hon byggde hus av lego. Hon byggde pepparkakshus som hon sedan sprängde med
            smällare.
            Och nu får hon jobba med det hon älskar mest: Att ta dina pengar för att köpa hus. Eller med hennes egna
            ord: </p>
          <p class="card-text"><small class="text-muted">
              <H4><i>"Dina besparingar - mitt semesterparadis på Rhodos."</i></H4>
            </small></p>
          <img class="card-img-bottom" src="/images/maklare/2.jpg" alt="Företagschefen">
        </div>
      </div>
    </div>

    <!--info om samt bilder från db om mäklarna.-->
    <div class="col-7">
      <div class="card-columns">
        ${this.maklarInfo.map(info =>/*html*/`
        <div class="card mb-4">
          <img class="card-img-top" src="${info.bildUrl}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${info.namn}</h5>
            <ul class="list-unstyled">
              <li>${info.telefonnummer}</li>
              <li>${info.epost}</li>
            </ul>
            <p class="card-text"><small class="text-muted">Tramstext om vad de gillar för bostäder</small></p>
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
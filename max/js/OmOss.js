class OmOss extends Base {

  async mount() {


    //info hämtas från tabellen Maklare
    this.maklarInfo = await sql(/*sql*/`
    SELECT 
    bildUrl,
    namn,
    telefonnummer,
    epost,
    personligt
    FROM Maklare`)
  }


  render() {
    return /*html*/`
<div class="row" route="/om-oss" page-title="Om oss">
  
    <!--infofält om företaget o chefen-->
    <div class="col-md-6 col-xl-6 bg-secondary">
      <div class="card col-my-2">
        <div class="card-body">
          <h4 class="card-title">Vår story</h4>
          <p class="card-text">Redan när vår grundare <strong>Fiona</strong> var en liten flicka så älskade hon hus. Hon
            ritade hus.
            Hon byggde hus av sockerbitar. Hon byggde hus av lego. Hon byggde pepparkakshus som hon sedan sprängde med
            smällare.
            Och nu får hon jobba med det hon älskar mest: Att ta dina pengar för att köpa hus. Eller med hennes egna
            ord: 
          </p>
            <p class="card-text"><small class="text-muted">
              <H4><i>"Dina besparingar - mitt semesterparadis på Rhodos."</i></H4></small>
            </p>
          <img class="card-img-bottom" src="/images/maklare/2.jpg" alt="Företagschefen">
        </div>
      </div>
    </div>

    <!--info om samt bilder från db om mäklarna.-->
    <div class="col-md-6 col-xl-6">
      <div class="row card-columns">
        ${this.maklarInfo.map(info =>/*html*/`
        <div class="col-md-6 card-mb-2">
          <img class="card-img-top" src="${info.bildUrl}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${info.namn}</h5>
              <ul class="list-unstyled">
                <li>${info.telefonnummer}</li>
                <li>${info.epost}</li>
              </ul>
            <p class="card-text"><small class="text-muted">${info.personligt}</small></p>
          </div>
        </div>
        `)}
      </div>
    </div>

  </div>

`;
  }

}
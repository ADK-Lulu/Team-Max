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
    FROM Maklare
    ORDER BY
     telefonnummer DESC
    `)

  }


  render() {
    return /*html*/`
<div class="row" route="/om-oss" page-title="Om oss">
  
    <div class="col-12">
      <h1 class="h1-responsive pl-3 pl-sm-0 pr-3 mt-3">Vi är Dhyr & Rumson</h1>
    </div>
  

  <!--info om samt bilder från db om mäklarna.-->
  <div class="col-12 my-4">
    <div class="row">
      ${this.maklarInfo.map(info =>/*html*/`
        <div class="col-12 col-md-4 pl-sm-5 card-mb-2">
          <img class="card-img-top" src="${info.bildUrl}" alt="Card image cap">
          <div class="card-body text-center" >
            <h5 class="card-title-gold">${info.namn}</h5>
            <p class="card-text"><small class="text-muted">
              <h4 class="blockquote"><i>"${info.personligt}"</i></h4></small>
            </p>
            <ul class="list-unstyled">
              <li class="text-break mt-2"><a class="text-dark" href="mailto:${info.epost}">${info.epost}</a></li>
              <li>${info.telefonnummer}</li>
            </ul>
          </div>
        </div>
      `)}
    
  
      <!--infofält om företaget o chefen-->
      
        <div class="col-12  col-md-8 mt-5 mb-1 col-my-1"> 
          <div class="card-body border border-warning">
            <h1 class="h1-responsive pl-3 pl-sm-0 pr-3">Vår story</h1>
            <p class="card-text">Redan när vår grundare <strong>Fiona</strong> var en liten flicka så älskade hon hus.
            Hon byggde pepparkakshus som hon sedan sålde till högstbjudande.<br>
            Nu får hon jobba med det hon älskar mest.<br> Tillsammans med sina fantastiska medarbetare omvandlar hon hus till pengar.<br> 
            Eller med hennes egna ord: 
            </p>
            <p class="card-text"><small class="text-muted">
              <h4 class="blockquote"><i>"Dina besparingar - mitt semesterparadis på Rhodos."</i></h4></small>
            </p>
          </div>
        </div>
   
    </div>
  </div>
</div>

`;
  }

}
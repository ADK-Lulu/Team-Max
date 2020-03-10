class SaljSida extends Base {

  async mount() {
    await sql(/*sql*/`USE max`);
  }
  showModal() {
    // Needed to stop scrolling when the modal is shown
    this.shown = true;
    setTimeout(() => $('body').addClass('modal-open'), 0);
    this.render();
  }

  closeModal() {
    // Needed to stop scrolling when the modal is shown
    this.shown = false;
    setTimeout(() => $('body').removeClass('modal-open'), 0);
    this.render();
  }

  async collectFormData(e) {

    e.preventDefault();

    let form = e.target;
    let formData = {};

    for (let element of form.elements) {
      if (!element.name) { continue; }
      formData[element.name] = element.value;
    }

    await sql(/*sql*/`
      INSERT INTO Kunder (namn,telefonnummer,epost,omrade,kvm,antalRum) VALUES($namn,$epost, $telefonnummer, $omrade, $kvm, $antalRum)
    `, formData);

    this.formSent = true;
    this.render();

  }

  render() {
    return /*html*/`
      <div class="container" route="/salj-sida">
        <div class="row" page-title="Sälja bostad">
          <div class="row w-100 pt-5">
              ${this.formSent ? /*html*/`
                <div class="col-12">
                  <h2>
                    <p>Tack!</p>
                    <p>Vi återkommer till dig så snabbt som möjligt.</p>
                  </h2>
                </div>
                `:
            /*html*/`
          

            <div class="col-12">
            <h3>Redo att sälja? Fyll i formuläret så kontaktar vi dig!</h3>
            
            <form submit="collectFormData">
              <div class="form-row">
                <div class="form-group col-md-4">
                <label class="w-100">För- och efternamn:
                  <input name="namn" type="text" class="form-control" required pattern=".{2,}">
                  </label>
                </div>
                <div class="form-group col-md-4">
                <label>Område:
                  <input name="omrade" type="text" class="form-control"required>
                  </label>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                <label class="w-100">Email:
                  <input name="epost" type="email" class="form-control"required>
                  </label>
                </div>
                <div class="form-group col-md-4">
                <label>Kvm:
                  <input name="kvm" type="text" class="form-control"required>
                  </label>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                <label class="w-100">Telefonnummer:
                  <input name="telefonnummer" type="text" class="form-control"required>
                  </label>
                </div>
                <div class="form-group col-md-4">
                <label>Antal rum:
                  <input name="antalRum" type="text" class="form-control">
                  </label>
                </div>
              </div>
              <input class="btn btn-primary" type="submit" value="Skicka">
            </form> 
            <div> <!--Gör en text under skicka knappen där man kan läsa mer om GDPR-relaterat-->
              Genom att klicka på <b>skicka</b> knappen godkänner du våra <a click="showModal"><b>användarvillkor och personuppgiftspolicy.</b></a>
            </div>
            <div><!--Gör en modal som kommer upp så man slipper gå in på en ny sida för att läsa GDPR-relaterad info.-->
              <div class="modal-backdrop ${this.shown ? 'show' : 'd-none'}"></div>
                <div class="modal ${this.shown ? 'd-block open' : ''}" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">GDPR</h5>
                        <button type="button" class="close" click="closeModal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <H1>Personuppgiftspolicy</H1>
                        <p>
                          Ansvarig för personuppgiftsbehandlingen är Dhyr & Rumson, org. nr. 123456-1234, Liljeholmsgatan 123, Liljeholmen. (”Dhyr & Rumson”). 
                          Dhyr & Rumson behandlar personuppgifter i enlighet med gällande lag, inklusive EU:s dataskyddsförordning.
                          Med benämningarna ”vi, våra, vårt och oss” nedan avses Dhyr & Rumson.
                        </p>
                        <h4> VI SOM BEHANDLAR DINA PERSONUPPGIFTER</h4>
                        <p>Dhyr & Rumson ansvarar för behandlingen av de personuppgifter som du lämnar till oss eller som vi samlar in om dig.
                          Du kan kontakta oss på följande sätt:
                          <ul>
                            <li>via e-post dhyrochrumson@email.com</li>
                            <li>via våra lokala mäklarkontor, eller</li>
                            <li>genom att skriva brev till eller besöka oss på Liljeholmsgatan 123, Liljeholmen.</li>
                          </ul>
                        </p>
                        <h4>VILKA PERSONUPPGIFTER BEHANDLAR VI?</h4>
                        <p>Vi behandlar uppgifter som du lämnar till oss.

                        <h4>VARFÖR BEHANDLAR VI DINA PERSONUPPGIFTER OCH VILKEN RÄTTSLIG GRUND HAR VI FÖR BEHANDLINGEN?</h4>
                          <p>Dhyr & Rumson kommer även att behandla ditt namn, adress, e-postadress, mobil- och telefonnummer som du lämnar till oss genom att ha kontakt med oss via e-post eller samtal. 
                          Vårt intresse av att behandla dina personuppgifter för detta ändamål går därför före ditt eventuella intresse av att skydda din personliga integritet.</p>
                          <p>Försäljningar</p>
                          <p>Om du köper, säljer eller överväger att sälja ett Objekt via oss kommer vi behandla ditt namn, adress, mobil- och telefonnummer, e-postadress, personnummer, dina bankuppgifter, köpeavtalet och bilder hänförliga till bostaden för att administrera försäljningen, såsom för att möjliggöra värdering, styling, fotografering, annonsering, visning, budgivning, slutpris, betalning och eventuellt bolån. 
                          Den rättsliga grunden för behandlingen är att Dhyr & Rumson ska kunna fullgöra ett avtal med dig. 
                          Personuppgiftsbehandlingen sker också mot bakgrund av den rättsliga grunden att Dhyr & Rumsons behandling är nödvändig för att fullgöra rättsliga förpliktelser som åvilar Dhyr & Rumson.</p>
                          <p>Marknadsföring av vår verksamhet</p>
                          <p>Dhyr & Rumson kommer att behandla information om Objektet, nämligen adress, bilder och slutpris för att marknadsföra Dhyr & Rumson och Dhyr & Rumsons verksamhet. Marknadsföringen görs via våra egna och samarbetspartners kanaler och sociala medier. 
                          Den rättsliga grunden för vår behandling av dina personuppgifter är att den är nödvändig för ändamål som rör vårt berättigade intresse, vilket väger tyngre än dina intressen, rättigheter eller friheter. 
                          Dhyr & Rumsons intresse av att marknadsföra de försäljningar vi medverkat till går före ditt eventuella intresse av att skydda din personliga integritet.</p>
                          <p>Kundvård och kvalitetssäkring</p>
                          <p>Dhyr & Rumson kommer att behandla ditt namn, adress, e-postadress, mobil- och telefonnummer samt datum och tid för vår kontakt med dig samt information om Objektet i syfte att vårda vår kundrelation med dig och kvalitetskontrollera vår verksamhet. 
                          Den rättsliga grunden för detta är att behandlingen är nödvändig för att Dhyr & Rumson ska kunna fullgöra ett avtal med dig eller för att vidta åtgärder innan ett sådant avtal ingås eller att den är nödvändig för ändamål som rör vårt berättigade intresse, vilket väger tyngre än dina intressen, rättigheter eller friheter. 
                          Dhyr & Rumsons intresse av att följa upp sin verksamhet går före ditt eventuella intresse av att skydda din personliga integritet.</p>
                          <p>Bokföring</p>
                          <p>Dhyr & Rumson kommer för bokföringsändamål att behandla uppgifter om den transaktion som skett mellan Dhyr & Rumson och dig som säljare eller köpare av ett Objekt som vi förmedlar. 
                          Dhyr & Rumson kommer av den anledningen att behandla ditt namn, adress, mobil- och telefonnummer, e-postadress, personnummer och dina bankuppgifter. 
                          Den rättsliga grunden för Dhyr & Rumsons behandling av dina personuppgifter är att den är nödvändig för att fullgöra en rättslig förpliktelse som åvilar Dhyr & Rumson.</p>
                          <p>Arkivering</p>
                          <p>Dhyr & Rumson kommer att behandla de uppgifter som vi tycker är roliga. 
                          Den rättsliga grunden för Dhyr & Rumsons behandling av dina personuppgifter är att den är nödvändig för att fullgöra en rättslig förpliktelse som åvilar Dhyr & Rumson, dvs. det vi tycker är roligt eller intressant.</p>
                          
                          <h4>TILL VEM LÄMNAR VI VIDARE PERSONUPPGIFTERNA OCH VAR BEHANDLAR VI DEM GEOGRAFISKT?</h4>
                          <p>Vi lämnar bara dina personliga uppgifter till hackare som frågar snällt, inte de som är dumma. 
                          Vi har dina rättigheter på vår lokala server som ligger på blahagatan 3 i centrala Stockholm. 
                          Oj det där kanske jag inte skulle ha sagt men aja, inga dumma hackare kommer försöka ta din information iallafall. 
                          </p>

                          <h4>DINA RÄTTIGHETER</h4>
                          <p>Vi är så pass bra att vi tar hand om alla dina rättigheter åt dig och därför behöver du inte veta vilka rättigheter du har :) 
                          Men om du ändå skulle vilja prata med någon kan du höra av dig till datainspektionen.
                          Datainspektionen / Integritetsskyddsmyndigheten (myndigheten kommer att byta namn till Integritetsskyddsmyndigheten)
                          Box 8114
                          104 20 Stockholm
                          datainspektionen@datainspektionen.se</p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary" click="closeModal">Stäng</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `}
          </div>    
        </div>
      </div>
    `;
  }

}
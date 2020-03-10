class SaljSida extends Base {
 
  async mount() {
    await sql(/*sql*/`USE max`);
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
      INSERT INTO Kunder (namn,epost,telefonnummer,omrade,kvm,antalRum) VALUES($namn,$epost, $telefonnummer, $omrade, $kvm, $antalRum)
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
            <input class="btn btn-primary float-left" type="submit" value="Skicka">
          </form>
  `}
        </div>
      </div>
     
    `;
  }

}
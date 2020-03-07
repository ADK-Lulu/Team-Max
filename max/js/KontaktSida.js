class KontaktSida extends Base {

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
      INSERT INTO KopKontakter (namn, epost, fritext) VALUES($namn, $epost, $fritext)
    `, formData);

    this.formSent = true;
    this.render();

  }

  render() {
    return /*html*/`
      <div class="row" route="/kontakt-sida" page-title="Kontakta oss">
          <div class="row mx-md-n5">
            <div class="col px-md-5">
              <div class="p-3 border bg-light"><img src="images/misc/kontaktsida_kontorsfasad.jpg" class="card-img-top" alt="">
              </div>
            </div>
            <div class="col px-md-5">
              <div class="p-3 border bg-light">
                <h2>Dhyr & Rumson</h2><br>Adress: Liljeholmsgatan 123, Liljeholmen<br>Öppettider:<br>Måndag-Fredag: 10-16<br>Lördag-Söndag: Stängt
                <br>Telefon: +46 23 456 78 90<br>Email:<a href="mailto:dhyrochrumson@email.com">dhyrochrumson@email.com</a>
              </div>
            </div>
          </div>

          <div class="row w-100 pt-5">
            ${this.formSent ? /*html*/`
              <div class="col-12">
                <h2>
                  <p>Tack för ditt meddelande!</p>
                  <p>Vi återkommer till dig så snabbt som möjligt.</p>
                </h2>
              </div>
              `:
                /*html*/`  
              <div class="col-5">
                  <h4>Kontakta oss:</h4>
              </div>
              <div class="col-7">
                <form submit="collectFormData">
                    <div class="form-group">
                      <label class="w-100">Namn:
                        <input name="namn" type="text" class="form-control" placeholder="Ditt namn" required pattern=".{2,}">
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="w-100">E-post:
                        <input name="epost" type="email" class="form-control" placeholder="Din e-postadress" required>
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="w-100">Meddelande:
                        <textarea name="fritext" class="form-control" placeholder="Skriv ditt meddelande här" required></textarea>
                      </label>
                    </div>
                    <input class="btn btn-primary float-right" type="submit" value="Skicka">
                  </form>
              </div> 
            `}
          </div>
        </div>
    `;
  }

}
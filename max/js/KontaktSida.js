class KontaktSida extends Base {

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
        <div class="row m-3 m-sm-0">
          <div class="col-6 d-none d-lg-block">
            <div class="mt-3">
              <img src="images/misc/office.jpg" class="card-img-top" alt="">
            </div>
          </div>
          <div class="col-6">
            <div class="mt-3">
              <h1 class="h1-responsive">Dhyr & Rumson</h1><br>Adress: Liljeholmsgatan 123, Liljeholmen
              <br>Telefon: +46 23 456 78 90<br>Email: <a class="text-dark" href="mailto:dhyrochrumson@email.com">dhyrochrumson@email.com</a><br>
              <br><p>Öppettider:<br>Måndag-Fredag: 10-16<br>Lördag-Söndag: Stängt</p>
            </div>
          </div>
        </div>

        <div class="row w-100 pt-5">
          ${this.formSent ? /*html*/`
            <div class="col-12">
              <h2 class="text-center text-dark py-5 px-3">
                Tack för ditt meddelande!<br>
                Vi återkommer till dig så snabbt som möjligt.
              </h2>
            </div>
              `:
         /*html*/`  
          <div class="col-4 text-right bg-secondary pt-3 mb-4 pr-0">
            <h4 class="h1-responsive ml-3">Kontakta oss:</h4>
          </div>
          <div class="col-8 bg-secondary px-4 pt-3 mb-4">
            <form submit="collectFormData">
              <div class="form-group">
                <label class="w-100">Namn:
                  <input name="namn" type="text" class="form-control" placeholder="för- & efternamn" required pattern=".{2,}">
                </label>
              </div>
              <div class="form-group">
                <label class="w-100">E-post:
                  <input name="epost" type="email" class="form-control" placeholder="namn@mail.com" required>
                </label>
              </div>
              <div class="form-group">
                <label class="w-100">Meddelande:
                  <textarea name="fritext" class="form-control" placeholder="skriv ditt meddelande här" required></textarea>
                </label>
              </div>
                <input class="btn btn-primary float-right mb-3" type="submit" value="Skicka">
            </form>
          </div>
            `}
        </div>
      </div>
    `;
  }

}
class KontaktSida extends Base {

  mount() {

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
      <div route="/kontakt-sida" page-title="Kontakta oss">
        <div class="row">
          <div class="col-sm-6 d-none d-md-block my-4">
            <img src="images/misc/office.jpg" class="img-fluid crop-image">
          </div>
          <div class="col-md-6 mt-3">
            <img src="images/misc/logga_DR.png" class="img-fluid">
            <br>Adress: Liljeholmsgatan 123, Liljeholmen
            <br>Telefon: +46 23 456 78 90<br>Email: <a class="text-dark" href="mailto:dhyrochrumson@email.com">dhyrochrumson@email.com</a><br>
            <br><p>Öppettider:<br>Måndag-Fredag: 10-16<br>Lördag-Söndag: Stängt</p>
          </div>
        </div>
        <div class="row pt-3 px-2 py-3">
          ${this.formSent ? /*html*/`
            <div class="col-12">
              <h1 class="h1-responsive text-center text-dark py-5 px-3">
                Tack för ditt meddelande!<br>
                Vi återkommer till dig så snabbt som möjligt.
              </h1>
            </div>
              `:
         /*html*/`  
          <div class="col-4 col-md-6 text-right bg-secondary pt-3 mb-4">
            <h1 class="h1-responsive">Kontakta oss:</h1>
          </div>
          <div class="col-8 col-md-6 bg-secondary pt-3 mb-4 ">
            <form submit="collectFormData">
              <div class="form-group">
                <label class="w-100">Namn:
                  <input name="namn" type="text" class="form-control" placeholder="för- & efternamn" required pattern=".{2,}">
                </label>
              </div>
              <div class="form-group">
                <label class="w-100">E-post:
                  <input name="epost" type="email" class="form-control" placeholder="namn@email.com" required>
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
    `}

}
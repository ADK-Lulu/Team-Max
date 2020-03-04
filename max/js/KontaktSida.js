class KontaktSida extends Base {

  render() {
    return /*html*/`
      <div class="container">
        <div route="/kontakt-sida" page-title="Kontakta oss">
          <div class="row">
                <div class="col-3">
                  <h1>Kontakta oss:</h1>
                </div>
                <div class="col-9">
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
          </div>
        </div>
      </div>
    `;
  }

}
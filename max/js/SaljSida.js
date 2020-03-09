class SaljSida extends Base {

  render() {
    return /*html*/`
      <div class="container" route="/salj-sida">
        <div class="row" page-title="Sälja bostad">
         <div class="col-12">
           <h3>Redo att sälja? Fyll i formuläret så kontaktar vi dig!</h3>
           <form>
            <div class="form-row">
              <div class="form-group col-md-4">
               <label>För- och efternamn:</label>
                <input type="text" class="form-control">
              </div>
              <div class="form-group col-md-4">
               <label>Område:</label>
                <input type="text" class="form-control">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-4">
               <label>Email:</label>
                <input type="email" class="form-control">
              </div>
              <div class="form-group col-md-4">
               <label>Kvm:</label>
                <input type="text" class="form-control">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-4">
               <label>Telefonnummer:</label>
                <input type="text" class="form-control">
              </div>
              <div class="form-group col-md-4">
               <label>Antal rum:</label>
                <input type="text" class="form-control">
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Skicka</button>
           </form>
        </div>
      </div>
    `;
  }

}
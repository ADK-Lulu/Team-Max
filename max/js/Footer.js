class Footer extends Base {

  render() {
    return /*html*/`
      <footer class="bg-primary p-4 container-fluid">
        <div class="row">
          <div class="col text-center text-light">
            <p>© Dhyr & Rumson 2020</p>
            <!--Här nedan kan vi fylla på med fler länkar. Lägg länkar i footerBarLink i app och villkora i map hur just dina länkar 
            ska presenteras. Kanske inte som buttons?-->
            ${this.links.map(link => /*html*/`<a class="btn btn-info" role="button" href="${link.route}">${link.label}</a>`)}
          </div>
    
          </div>
        </div>
      </footer>
    ;
 ` }

}
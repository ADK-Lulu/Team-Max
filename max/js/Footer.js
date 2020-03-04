class Footer extends Base {
  render() {
    return /*html*/ `
  <footer class="bg-primary p-3 container-fluid text-light ">
    <div class="row justify-content-md-center">
      <div class="col-md-auto text-left">
        <p>
          Adress:
          <a href="https://goo.gl/maps/EXpMJvJwQ3HncHXb7" target="_blank">
            Liljeholmsgatan 123, Liljeholmen, Stockholm</a>
        </p>
        <p>
          Email:
          <a href="mailto:dhyrochrumson@email.com">dhyrochrumson@email.com</a>
        </p>
        <p>Telefon: +46 23 456 78 90</p>
      </div>
      <div class="col-md-auto">
        <a href="/kontakt-sida" class="btn btn-info float-left" role="button">Mer om oss</a>
      </div>
    </div>
    <div class="row text-center">
      <div class="col">
        <a href="https://www.facebook.com/" target="_blank">
          <i class="icofont-facebook"></i>
        </a>
        <a href="https://www.instagram.com/" target="_blank">
          <i class="icofont-instagram"></i>
        </a>
        <p>© Dhyr & Rumson 2020</p>
      </div>
    </div>
  </footer>  
    `;
  }
}

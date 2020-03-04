class NavBar extends Base {

  render() {
    return /*html*/`
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="/">Dhyr & Rumson</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            ${this.links.map(link => !link.dropdown ? /*html*/`
              <li class="nav-item">
                <a class="nav-link" href="${link.route}">
                  ${link.label}
                </a>
              </li>
          ` : /*html*/`
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="${link.route}" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  ${link.label}
                </a>
                <div class="dropdown-menu scrollable-menu" aria-labelledby="navbarDropdownMenuLink">
                  ${link.dropdown.map(item => /*html*/`
                    <a class="dropdown-item" href="${item.route}">${item.label}</a>
                    <a class="dropdown-item" href="${item.route}">${item.label}</a>
                  `)}
                </div>
              </li>
          `)}
          </ul>
          <div class="col-auto ml-auto">
           <form class="form-inline">
             <button type="submit" class="btn btn-default"></button> 
             <i class="p-3 icofont-search-map icofont-2x"></i>
             <input type="text" class="form-control pull-left" placeholder="Sök område">
             
             
                </form>
            </div>
          </div>
      </nav>
    `
  }

}
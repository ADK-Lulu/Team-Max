// Copyright: Thomas Frank, Node Hill 2020
// MIT-licensed
(async () => {
  let firstError = true;
  function errorReport(...args) {
    if (args.join('').includes('DiffDOM')) { return; }
    window.diffDOM = null;
    let d = 'source, line number, column number, error'.split(', ');
    let heading = args.shift();
    let apph = document.querySelector(`[data-id="0"]`);
    if (apph) { apph.remove(); }
    document.body.innerHTML += `
      <article class="container" style="min-height:0">
        <div class="row">
          <div class="col mt-3">
            <div class="alert alert-danger border" role="alert">
              <h4 class="alert-heading">${heading}</h4>
              ${args.map((a, i) => `<h6>${d[i]}</h6><p>${a}</p>`).join('')}
            </div>
          </div>
        </div>
      </article>
    `;
  };

  class MyError extends Error {
    constructor(...args) {
      super(...args);
      errorReport(this + '', this.stack + '');
    }
  }
  window.Error = MyError;
  window.onerror = errorReport;

  let r = await fetch('/sass-error');
  let sassError = await r.json();
  if (sassError.error) {
    errorReport('SASS not compiling...',
      sassError.error.split('[31m').join('').split('[39m').join('<br>'));
  }

  window.addEventListener("unhandledrejection", function (a) {
    errorReport(a.reason, a.reason.stack);
  });

})();
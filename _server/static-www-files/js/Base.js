// Copyright: Thomas Frank, Node Hill 2020
// MIT-licensed
class Base {

  constructor(settings) {
    Object.assign(this, settings);
    !Base.setupDone && Base.setup(this);
    this.instanceId = Base.idCounter++;
    Base.instanceMemory[this.instanceId] = this;
    let orgRender = this.render;
    let o = orgRender + '';
    let beforeMountRenderer;
    try {
      eval(('beforeMountRenderer = function ' + o.slice(0, o.indexOf('>')) + '>' + (o.slice(o.lastIndexOf('<')))).split('function function').join('function'));
    }
    catch (e) { }
    this._render = function () {
      try {
        if (!this.__mountHasRun && beforeMountRenderer) {
          return beforeMountRenderer.apply(this);
        }
        return (orgRender.apply(this) + '').split('undefined').join('');
      }
      catch (e) { new Error(e); }
    }
    this.render = this.toString;
    let orgMount = this.mount || (() => { });
    this.mount = async function () {
      let r = await orgMount.apply(this);
      this.__mountHasRun = true;
      this.render();
      return r;
    };
    (async () => {
      if (this.constructor.name === 'App') {
        this.mounted = true;
        Base.mount(this);
      }
    })();
  }

  toString() {
    let element = Base.createElement(this);
    let oldElement = Base.shadowDom.querySelector(`[data-id="${this.instanceId}"]`);
    if (oldElement) { oldElement.replaceWith(element); }
    setTimeout(async () => {
      let domMe = Base.shadowDom.querySelector(`[data-id="${this.instanceId}"]`);
      if (domMe && domMe.tagName !== 'SCRIPT' && !this.mounted) {
        this.mounted = true;
        this.mount();
      }
    }, 1);
    return element.outerHTML;
  }

  static setup() {
    [...document.querySelectorAll('script')].forEach(s => s.remove());
    this.shadowDom = document.createElement('body');
    this.shadowDom2 = document.createElement('body');
    const observer = new MutationObserver(() => this.updateDom());
    observer.observe(this.shadowDom, { attributes: true, childList: true, subtree: true });
    this.instanceMemory = [];
    this.idCounter = 0;
    this.setupDone = true;
    this.eventListener();
    window.onpopstate = () => {
      window.scrollTo(0, 0);
      this.router();
    }
    window.sql = this.sql;
    this.sql = null;
    window.store = this.storeHandler();
    this.storeHandler = null;
    Array.prototype.toString = function () {
      return this.join('');
    }
    this.hotreload();
  }

  static updateDom() {
    let dd = new diffDOM.DiffDOM();
    let tdiff = dd.diff(this.shadowDom2, this.shadowDom);
    dd.apply(this.shadowDom2, tdiff);
    [...this.shadowDom2.querySelectorAll('script')].forEach(s => s.remove());
    let diff = dd.diff(document.body, this.shadowDom2);
    dd.apply(document.body, diff);
    let a = document.querySelector('[base-title]');
    let b = document.querySelector('[page-title]');
    let c = a ? a.getAttribute('base-title') : '';
    let d = b ? b.getAttribute('page-title') : '';
    document.title = c + d;
  }

  static hotreload() {
    if (typeof EventSource !== 'function') { return; }
    let e = new EventSource('/hotchanges');
    e.onerror = () => location.reload();
    e.close = () => location.reload();
    let first = true;
    document.addEventListener('visibilitychange', () => {
      !first && !document.hidden && location.reload();
      first = false;
    });
  }

  static mount(instance, element = this.shadowDom) {
    instance.mount();
    element.innerHTML += instance.render();
    Base.router();
  }

  static eventListener() {
    for (let type of ['click', 'submit', 'keyup', 'keydown', 'focus', 'blur']) {
      document.body.addEventListener(type, e => {
        type === 'click' && document.querySelectorAll('a').forEach(a => a.blur());
        type === 'click' && this.routerLinks(e);
        let clickedEl = e.target.closest([`[${type}]`]);
        if (!clickedEl) { return; }
        let instanceId = +e.target.closest(`[data-id]`)
          .getAttribute('data-id');
        let instance = this.instanceMemory[instanceId];
        let args = clickedEl.getAttribute(type).split(':');
        let method = instance[args.shift()];
        args.push(e);
        method && method.apply(instance, args);
      });
    }
  }

  static createElement(instance) {
    let tempElement = document.createElement('div');
    tempElement.innerHTML = instance._render();
    let elements = tempElement.children;
    if (elements.length !== 1) {
      throw (new Error(instance.constructor.name + '.render() does not return one root element...'));
    }
    this.router(tempElement);
    let element = elements[0];
    element.setAttribute('data-id', instance.instanceId);
    return element;
  }

  static linkCleaner(href) {
    return encodeURI(href.split(' ').join('-').split('#').join('-').toLowerCase());
  }

  static routerLinks(e) {
    let a = e.target.closest('a');
    let href = (a && a.getAttribute('href')) + '';
    if (href[0] !== '/') { return; }
    window.history.pushState(null, null, this.linkCleaner(href));
    window.scrollTo(0, 0);
    this.router();
    e.preventDefault();
  }

  static router(element = this.shadowDom) {
    let anyMatch, mem404;
    for (let routeEl of element.querySelectorAll('[route], [not-route]')) {
      let route = routeEl.getAttribute('route');
      let notRoute = routeEl.getAttribute('not-route');
      let match = this.routeMatch(route || notRoute);
      if (notRoute) { match = !match; }
      anyMatch = notRoute ? anyMatch : anyMatch || match;
      let isPlaceHolder = routeEl.tagName === 'SCRIPT';
      route === '404' && (mem404 = { routeEl });
      if (match && isPlaceHolder) {
        this.rerenderOnMount(routeEl);
      }
      if (!match && !isPlaceHolder) {
        let placeHolder = document.createElement('script');
        route && placeHolder.setAttribute('route', route);
        notRoute && placeHolder.setAttribute('not-route', notRoute);
        route === '404' && (mem404 = { routeEl, placeHolder });
        routeEl.replaceWith(placeHolder);
      }
    }
    !anyMatch && mem404 && !mem404.placeHolder && this.rerenderOnMount(mem404.routeEl);
    !anyMatch && mem404 && mem404.placeHolder && mem404.placeHolder.replaceWith(mem404.routeEl);
    if (!anyMatch && mem404 && mem404.placeHolder) {
      this.updateDom();
      return;
    }
    for (let link of this.shadowDom.querySelectorAll('a[href]')) {
      link.classList.remove('active');
      if (this.routeMatch(link.getAttribute('href'), true)) {
        link.classList.add('active');
      }
    }
  }

  static routeMatch(route, loose = false) {
    route = encodeURI(this.linkCleaner(route));
    if (location.pathname === route) { return true; }
    if (loose && route.length > 1 && location.pathname.slice(1).indexOf(route.slice(1)) === 0) {
      return true;
    }
  }

  static rerenderOnMount(routeEl) {
    let rootEl = routeEl.closest('[data-id]');
    rootEl && this.instanceMemory[+rootEl.getAttribute('data-id')].render();
  }

  static async sql(...args) {
    let sqlQuery, sqlParams, castTo;
    [sqlQuery, sqlParams] = args;
    if (typeof sqlQuery !== 'string') {
      [castTo, sqlQuery, sqlParams] = args;
    }
    sqlParams = sqlParams || [];
    if (sqlParams.constructor === Object) {
      let org = sqlParams;
      sqlParams = {};
      for (let key of Object.keys(org)) {
        sqlParams[(key[0] !== '$' ? '$' : '') + key] = org[key];
      }
    }
    sqlQuery = sqlQuery.trim();
    let raw = await (await fetch('/sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sqlQuery, sqlParams })
    })).json();
    if (raw.error) { throw new Error(JSON.stringify(raw.error)); }
    if (!castTo) { return raw; }
    return raw.map(x => new castTo(x));
  }

  static storeHandler() {
    return {
      use(x) {
        if (x === Base.usedStore) { return; }
        Base.usedStore = x;
        for (let key of Object.keys(this)) {
          if (typeof this[key] !== 'function') { delete this[key]; }
        }
        try {
          Object.assign(this, JSON.parse(window.localStorage[x]));
        }
        catch (e) { }
      },
      save() {
        if (!Base.usedStore) { throw (new Error('Select a store to use before trying to save to a store!')); }
        localStorage[Base.usedStore] = JSON.stringify(this);
      }
    }
  }

}
window.addEventListener('DOMContentLoaded', function() {

  const view = document.getElementById('view');

  // activeRoutes
  const activeRoutes = Array.from(document.querySelectorAll('[route]'));

  function navigate(event) {

    let route = event.target.attributes[0].value;
    const routeInfo = myFirstRouter.routes.filter(function(r) {
      return r.path === route;
    })[0];

    if(!routeInfo) {
      window.history.pushState({}, '', 'error');
      view.innerHTML = 'Route inexistante';
    }
    else {
      window.history.pushState({}, '', routeInfo.path);
      view.innerHTML = 'Vous avez cliquez sur le bouton de ' + routeInfo.name + ' route';
    }
  };

  // add event listeners
  activeRoutes.forEach(function(route) {
    route.addEventListener('click', navigate, false);
  });

  // Router
  class Router {
    constructor(name, routes) {
      this.name = name
      this.routes = routes
    }
  };

  // prototype
  Router.prototype.getName = function() {
    return alert('Variable router => ' + this.name + ' (prototype)');
  };

  const myFirstRouter = new Router('myFirstRouter', [
    {
      path: '/',
      name: 'Accueil'
    },
    {
      path: '/about',
      name: 'A propos'
    },
    {
      path: '/contact',
      name: 'Contact'
    }
  ]);

  document.getElementById('btn-prototype').addEventListener('click', () => {
    myFirstRouter.getName();
  })

  const currentPath = window.location.pathname;
  if(currentPath === '/') {
    view.innerHTML = 'Bienvenue sur la page d\'accueil';
  }
  else {
    let route = myFirstRouter.routes.filter(function(route) {
      return route.path === currentPath;
    })[0];
    if(route) {
      view.innerHTML = 'Vous êtes sur la page ' + route.name;
    }
    else {
      view.innerHTML = '404!';
    }
  }
});
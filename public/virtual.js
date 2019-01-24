// Virtual.js
function getVirtual() {
  setTimeout(() => {

    // class Virtual
    const Virtual = (() => {

      const render = (type, props, ...content) => {
        return {
          type,
          props : props || {},
          content
        }
      };

      const isEventProp = name => /^on/.test(name); // return boolean
      const isCustomProp = name => isEventProp(name) || name === "forceUpdate";

      // Props Functions //
      const setProp = (target, name, value) => {
        if (isCustomProp(name)) {
          return;
        } else if (name === "className") {
          target.setAttribute("class", value);
        } else {
          target.setAttribute(name, value);
        }
      };

      const removeProp = (target, name, value) => {
        if (isCustomProp(name)) {
          return;
        } else if (name === "className") {
          target.removeAttribute("class", value);
        } else {
          target.removeAttribute(name);
        }
      };

      const setProps = (target, props) => {
        Object.keys(props).forEach(name => {
          setProp(target, name, props[name]);
        });
      };

      const updateProp = (target, name, newVal, oldVal) => {
        if (!newVal) {
          removeProp(target, name, oldVal);
        } else if (!oldVal || newVal !== oldVal) {
          setProp(target, name, newVal);
        }
      };

      const updateProps = (target, newProps, oldProps = {}) => {
        const props = Object.assign({}, newProps, oldProps);
        Object.keys(props).forEach(name => {
          updateProp(target, name, newProps[name], oldProps[name]);
        });
      };

      // Element Function //
      const createElement = (node) => {
        if (typeof node === "string") {
          return document.createTextNode(node);
        }

        const el = document.createElement(node.type);
        setProps(el, node.props);
        node.content.map(createElement).forEach(el.appendChild.bind(el));
        return el;
      }

      function compareType(node1, node2) {
        return (
          typeof node1 !== typeof node2 ||
          (typeof node1 === "string" && node1 !== node2) ||
          node1.type !== node2.type
        )
      }

      function update(parent, newNode, oldNode, index = 0) {
        if (!oldNode) {
          parent.appendChild(createElement(newNode));
        } else if (!newNode) {
          parent.removeChild(parent.childNodes[index]);
        } else if (compareType(newNode, oldNode)) {
          parent.replaceChild(createElement(newNode), parent.childNodes[index]);
        } else if (newNode.type) {
          updateProps(parent.childNodes[index], newNode.props, oldNode.props);

          const newLength = newNode.content.length;
          const oldLength = oldNode.content.length;

          for (let i = 0 ; i < newLength || i < oldLength ; i++) {
            update(parent.childNodes[index], newNode.content[i], oldNode.content[i], i);
          }
        }
      }

      return {
        render,
        update
      }
    })();

    // Create el
    const el = Virtual.render('h2', {
      'style': 'color: white',
      'class': 'hello',
      'test':'',
      'id': 'hello'
    }, 'Tag Virtual create');

    Virtual.update(document.getElementById('test'), el);

    // Replace el
    setTimeout(() => {
      let newEl = Virtual.render('h3', {
        'style': 'color: orange',
        'class': 'helloworld',
        'test':'',
        'id': 'helloworld'
      }, 'Tag replace');
      Virtual.update(document.getElementById('test'), newEl, el);

      // Update type newEl
      setTimeout(() => {
        let secondNewEl = Virtual.render('h3', {
          'style': 'color: purple',
          'class': 'testUpdate',
          'test':'',
          'id': 'testUpdate'
        }, 'Tag update');
        Virtual.update(document.getElementById('test'), secondNewEl, newEl);

        // Remove newEl
        setTimeout(() => {
          Virtual.update(document.getElementById('test'), null, newEl);
        }, 2000);
      }, 2000);
    }, 2000);
  }, 2000);
};

// Async Await
function getPromise() {

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const error = false;
      if (!error) {
        document.getElementById('virtual').insertAdjacentHTML('afterbegin', '<h1>Bienvenue sur Virtual.js</h1>');
        resolve();
      } else {
        reject('Une erreur est survenue.');
      }
    }, 1500);
  });
};

async function init() {
  try {
    await getPromise();
    getVirtual();
  } catch(err) {
    console.log(err);
  }
};

init();
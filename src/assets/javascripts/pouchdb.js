(function () {
  var dinoDB = new PouchDB('dino_db2');

  var form = document.querySelector('.form');
  var submitButton = form.querySelector('button[type="submit"]');
  var nameEl = form.querySelector('#name');
  var emailEl = form.querySelector('#email');
  var vegetarianEl = form.querySelectorAll('input[name="vegetarian"]');

  // Listener do form
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  // bind on submit click
  submitButton.addEventListener('click', (event) => {
    submitButton.disabled = true;

    var isVeg = null;

    // check if element of check option is checked
    vegetarianEl.forEach(function(item) {
      if (item.checked) isVeg = item.value;
    });

    // Calling method that adds a Dino to DB
    addDino(nameEl.value, emailEl.value, isVeg, function(error, success) {

      // enable button again
      submitButton.disabled = false;

      // clear field values
      nameEl.value = '';
      emailEl.value = '';
      vegetarianEl.value = '';
    })
  });

  function addDino(_name, _email, _vegetarian, _callback) {
    // _id is just for timestamp
    var dino = {
      _id: new Date().toISOString(),
      name: _name,
      email: _email,
      vegetarian: _vegetarian
    };

    // put data into local DB (indexedDB)
    dinoDB.put(dino, function(err, result) {
      if (!err) {
        alert('Dino inserted!');
        if (_callback) _callback(err, result);
      }
    })
  }

  // hook of changes on db
  dinoDB.changes({
    since: 'now',
    live: true
  }).on('change', findDinos);

  // query to find dinos and call updateDinoList function
  function findDinos() {
    dinoDB.allDocs({include_docs: true, descending: true}, function(err, doc) {
      updateDinoList(doc.rows);
    });
  }

  function updateDinoList(dinos) {
    var dinoList = document.querySelector('.dino-list ul');

    if (!dinoList) return false;

    // clear childrens
    while (dinoList.firstChild) {
      console.log('while');
      dinoList.removeChild(dinoList.firstChild);
    }

    // for each of dino, create a li
    dinos.forEach((dino) => {
      var dinoItem = document.createElement('li');
      dinoItem.innerHTML = '<strong>Name:</strong> ' + dino.doc.name + '<br/>';
      dinoItem.innerHTML += '<strong>Creator email:</strong> ' + dino.doc.email + '<br/>';
      dinoItem.innerHTML += '<strong>Vegetarian?:</strong> ' + (dino.doc.vegetarian ? 'yes' : 'no') + '<br/>';

      dinoList.appendChild(dinoItem);
    });
  }

  findDinos();
})();

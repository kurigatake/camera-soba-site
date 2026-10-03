
(function(){
  var table = document.getElementById('deal-table');
  if(!table) return;
  var makerSel = document.getElementById('f-maker');
  var catGroup = document.getElementById('f-cat');
  var countEl = document.getElementById('deal-count');
  var rows = Array.prototype.slice.call(table.querySelectorAll('tr[data-maker]'));
  var tbodyParent = table;
  var headerRow = table.querySelector('tr:not([data-maker])');

  // メーカー選択肢を出現順(出品数降順)で動的生成
  var makerCount = {};
  rows.forEach(function(r){
    var m = r.getAttribute('data-maker');
    makerCount[m] = (makerCount[m]||0) + 1;
  });
  Object.keys(makerCount).sort(function(a,b){return makerCount[b]-makerCount[a];}).forEach(function(m){
    var opt = document.createElement('option');
    opt.value = m; opt.textContent = m + '(' + makerCount[m] + ')';
    makerSel.appendChild(opt);
  });

  var state = { maker: '', cat: '', sortKey: null, sortDir: 1 };

  function applyFilter(){
    var visible = 0;
    var catList = state.cat ? state.cat.split(',') : null;
    rows.forEach(function(r){
      var okMaker = !state.maker || r.getAttribute('data-maker') === state.maker;
      var okCat = !catList || catList.indexOf(r.getAttribute('data-cat')) !== -1;
      var show = okMaker && okCat;
      r.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    if(countEl) countEl.textContent = visible + '件を表示中';
  }

  function applySort(){
    if(!state.sortKey) return;
    var sorted = rows.slice().sort(function(a,b){
      var av = parseFloat(a.getAttribute('data-'+state.sortKey));
      var bv = parseFloat(b.getAttribute('data-'+state.sortKey));
      return (av - bv) * state.sortDir;
    });
    sorted.forEach(function(r){ tbodyParent.appendChild(r); });
  }

  makerSel.addEventListener('change', function(){
    state.maker = makerSel.value;
    applyFilter();
  });

  catGroup.querySelectorAll('.deal-cat-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      catGroup.querySelectorAll('.deal-cat-btn').forEach(function(b){b.classList.remove('is-active');});
      btn.classList.add('is-active');
      state.cat = btn.getAttribute('data-cat');
      applyFilter();
    });
  });

  if(headerRow){
    headerRow.querySelectorAll('th[data-sort]').forEach(function(th){
      th.classList.add('sortable');
      th.addEventListener('click', function(){
        var key = th.getAttribute('data-sort');
        if(state.sortKey === key){
          state.sortDir *= -1;
        } else {
          state.sortKey = key;
          state.sortDir = 1;
        }
        headerRow.querySelectorAll('th[data-sort]').forEach(function(h){
          h.classList.remove('sort-asc','sort-desc');
        });
        th.classList.add(state.sortDir === 1 ? 'sort-asc' : 'sort-desc');
        applySort();
      });
    });
  }

  applyFilter();
})();

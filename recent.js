
(function(){
  var KEY = 'cs_recent_v1', MAX = 10;
  function load(){
    try{
      var v = JSON.parse(window.localStorage.getItem(KEY));
      return (v && v.length) ? v : [];
    }catch(e){ return []; }
  }
  function save(a){
    try{ window.localStorage.setItem(KEY, JSON.stringify(a)); }catch(e){}
  }
  var cur = document.getElementById('recent-current');
  var box = document.getElementById('recent-viewed');
  var list = load();
  var curSlug = cur ? (cur.getAttribute('data-slug') || '') : '';
  if(curSlug){
    var entry = {s: curSlug,
                 n: cur.getAttribute('data-name') || curSlug,
                 p: cur.getAttribute('data-price') || ''};
    list = list.filter(function(x){ return x && x.s && x.s !== curSlug; });
    list.unshift(entry);
    if(list.length > MAX) list = list.slice(0, MAX);
    save(list);
  }
  if(!box) return;
  var base = box.getAttribute('data-base') || '';
  var show = list.filter(function(x){ return x && x.s && x.s !== curSlug; });
  if(!show.length) return;
  var ul = document.createElement('ul');
  ul.className = 'rel-list';
  show.forEach(function(x){
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = base + '/item/' + encodeURIComponent(x.s) + '/';
    var nm = document.createElement('span');
    nm.className = 'rel-name';
    nm.textContent = x.n;
    a.appendChild(nm);
    if(x.p){
      var pr = document.createElement('span');
      pr.className = 'rel-price';
      pr.textContent = '最安 ' + x.p;
      a.appendChild(pr);
    }
    li.appendChild(a);
    ul.appendChild(li);
  });
  box.appendChild(ul);
  box.hidden = false;
})();

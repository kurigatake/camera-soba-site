
(function(){
  var API = "https://camera-soba-admin.kakakuhikaku.workers.dev";
  var btns = document.querySelectorAll('.dv-btn');
  if(!btns.length) return;
  if(!API){
    // API未設定: ボタンは意味を持たないので隠す(既存表示を壊さない)。
    btns.forEach(function(b){ b.style.display = 'none'; });
    return;
  }
  var LS_KEY = 'soba_downvotes';
  function voted(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch(e){ return {}; }
  }
  function markVoted(id){
    var v = voted(); v[id] = 1;
    try{ localStorage.setItem(LS_KEY, JSON.stringify(v)); }catch(e){}
  }
  function setDone(btn){
    btn.classList.add('is-voted');
    btn.disabled = true;
    btn.setAttribute('aria-pressed', 'true');
    var lbl = btn.querySelector('.dv-lbl');
    if(lbl) lbl.textContent = '報告済み';
    btn.setAttribute('title', 'この機種と無関係な商品として報告済みです');
  }
  var already = voted();
  btns.forEach(function(btn){
    var source = btn.getAttribute('data-source') || '';
    var key = btn.getAttribute('data-key') || '';
    var id = source + ':' + key;
    if(already[id]){ setDone(btn); return; }
    btn.addEventListener('click', function(){
      if(btn.disabled) return;
      setDone(btn);        // 楽観的UI(応答を待たず反映)
      markVoted(id);
      var payload = {
        source: source, source_key: key,
        title: btn.getAttribute('data-title') || '',
        slug: btn.getAttribute('data-slug') || '',
        price: parseInt(btn.getAttribute('data-price') || '0', 10) || null,
        seller: btn.getAttribute('data-seller') || ''
      };
      fetch(API + '/vote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      }).catch(function(){ /* 障害時も楽観的UIは維持 */ });
    });
  });
})();

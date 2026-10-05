/* ---------------- state (localStorage-backed) ---------------- */
const LS = {
  get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v===null?d:v;}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k, JSON.stringify(v));}catch(e){}}
};
let users = LS.get("crionix_users", []);
let session = LS.get("crionix_session", null);
let cart = LS.get("crionix_cart", []); // [{id, qty}]
let tickets = LS.get("crionix_pqr", []);

function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2400);
}

/* ---------------- render: catalog ---------------- */
const grid = document.getElementById('grid');
const filtersEl = document.getElementById('filters');
let activeGenre = "Todos";
function renderFilters(){
  const genres = ["Todos", ...new Set(GAMES.map(g=>g.genre))];
  filtersEl.innerHTML = genres.map(g=>`<button class="chip ${g===activeGenre?'active':''}" data-genre="${g}">${g}</button>`).join('');
  filtersEl.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{activeGenre=c.dataset.genre;renderFilters();renderGrid();});
}
function renderGrid(){
  const list = activeGenre==="Todos" ? GAMES : GAMES.filter(g=>g.genre===activeGenre);
  grid.innerHTML = list.map(g=>`
    <div class="card" tabindex="0" data-id="${g.id}">
      ${tileHTML(g)}
      <div class="card-body">
        <h3>${g.title}</h3>
        <div class="dev">${g.dev}</div>
        <div class="card-foot">
          <span class="price">${fmt(g.price)}</span>
          <span class="rating">★ ${g.rating}</span>
        </div>
      </div>
    </div>`).join('');
  grid.querySelectorAll('.card').forEach(c=>{
    const open=()=>openGameModal(+c.dataset.id);
    c.onclick=open;
    c.onkeydown=e=>{if(e.key==='Enter')open();};
  });
}
renderFilters(); renderGrid();

/* hero featured game */
const featured = GAMES[0];
document.getElementById('heroTile').outerHTML = tileHTML(featured).replace('class="tile"','class="tile" id="heroTile"');
document.getElementById('heroTitle').textContent = featured.title;
document.getElementById('heroMeta').textContent = featured.dev + " · " + featured.genre;
document.getElementById('heroPrice').textContent = fmt(featured.price);
document.getElementById('heroAdd').onclick = ()=>{addToCart(featured.id,1); toast(featured.title+" agregado al carrito");};
document.getElementById('statGames').textContent = GAMES.length;

/* ---------------- game detail modal ---------------- */
const gdOverlay=document.getElementById('gdOverlay');
let gdCurrent=null, gdQty=1;
function openGameModal(id){
  gdCurrent = GAMES.find(g=>g.id===id); gdQty=1;
  document.getElementById('gdTile').outerHTML = tileHTML(gdCurrent).replace('class="tile"','class="tile gd-tile" id="gdTile"');
  document.getElementById('gdGenre').textContent = gdCurrent.genre;
  document.getElementById('gdTitle').textContent = gdCurrent.title;
  document.getElementById('gdDev').textContent = gdCurrent.dev;
  document.getElementById('gdDesc').textContent = gdCurrent.desc;
  document.getElementById('gdPrice').textContent = fmt(gdCurrent.price);
  document.getElementById('gdQty').textContent = gdQty;
  gdOverlay.classList.add('show');
}
document.getElementById('gdClose').onclick=()=>gdOverlay.classList.remove('show');
gdOverlay.addEventListener('click',e=>{if(e.target===gdOverlay)gdOverlay.classList.remove('show');});
document.getElementById('gdMinus').onclick=()=>{gdQty=Math.max(1,gdQty-1);document.getElementById('gdQty').textContent=gdQty;};
document.getElementById('gdPlus').onclick=()=>{gdQty=Math.min(9,gdQty+1);document.getElementById('gdQty').textContent=gdQty;};
document.getElementById('gdAdd').onclick=()=>{addToCart(gdCurrent.id,gdQty);toast(gdCurrent.title+" agregado al carrito");gdOverlay.classList.remove('show');};

/* ---------------- cart ---------------- */
function addToCart(id,qty){
  const item = cart.find(c=>c.id===id);
  if(item) item.qty += qty; else cart.push({id,qty});
  LS.set("crionix_cart",cart);
  renderCart();
}
function updateQty(id,delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(c=>c.id!==id);
  LS.set("crionix_cart",cart);
  renderCart();
}
function removeFromCart(id){ cart = cart.filter(c=>c.id!==id); LS.set("crionix_cart",cart); renderCart(); }

function renderCart(){
  const badge=document.getElementById('cartBadge');
  const count = cart.reduce((s,c)=>s+c.qty,0);
  badge.style.display = count>0 ? 'flex':'none';
  badge.textContent = count;
  const wrap = document.getElementById('drawerItems');
  const foot = document.getElementById('drawerFoot');
  if(cart.length===0){
    wrap.innerHTML = `<div class="empty-note">Tu carrito está vacío.<br>Explora el catálogo y agrega algún juego.</div>`;
    foot.style.display='none';
    return;
  }
  foot.style.display='block';
  let total=0;
  wrap.innerHTML = cart.map(c=>{
    const g = GAMES.find(x=>x.id===c.id);
    const sub = g.price*c.qty; total+=sub;
    return `<div class="cart-item">
      ${tileHTML(g)}
      <div class="ci-info">
        <h4>${g.title}</h4>
        <div class="u-price">${fmt(g.price)} c/u</div>
        <div class="ci-controls">
          <div class="qty">
            <button onclick="updateQty(${g.id},-1)">−</button><span>${c.qty}</span><button onclick="updateQty(${g.id},1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${g.id})">Quitar</button>
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('drawerTotal').textContent = fmt(total);
}
renderCart();

const cartDrawer=document.getElementById('cartDrawer'), drawerOverlay=document.getElementById('drawerOverlay');
function openCart(){cartDrawer.classList.add('show');drawerOverlay.classList.add('show');}
function closeCart(){cartDrawer.classList.remove('show');drawerOverlay.classList.remove('show');}
document.getElementById('cartBtn').onclick=openCart;
document.getElementById('closeDrawer').onclick=closeCart;
drawerOverlay.onclick=closeCart;

/* ---------------- auth ---------------- */
const authOverlay=document.getElementById('authOverlay');
function renderAuthArea(){
  const area=document.getElementById('authArea');
  if(session){
    area.innerHTML = `<div class="user-chip">Hola, <b>${session.name.split(' ')[0]}</b><button class="logout" id="logoutBtn">Salir</button></div>`;
    document.getElementById('logoutBtn').onclick=()=>{session=null;LS.set("crionix_session",null);renderAuthArea();toast("Sesión cerrada");};
  } else {
    area.innerHTML = `<button class="btn btn-ghost" id="openAuth">Iniciar sesión</button>`;
    document.getElementById('openAuth').onclick=()=>openAuth('login');
  }
}
function openAuth(tab){
  authOverlay.classList.add('show');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
  document.getElementById('panel-login').classList.toggle('show',tab==='login');
  document.getElementById('panel-register').classList.toggle('show',tab==='register');
}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>openAuth(t.dataset.tab));
document.getElementById('authClose').onclick=()=>authOverlay.classList.remove('show');
authOverlay.addEventListener('click',e=>{if(e.target===authOverlay)authOverlay.classList.remove('show');});
document.getElementById('openRegisterHero').onclick=()=>openAuth('register');
document.getElementById('ordersLink').onclick=(e)=>{
  e.preventDefault();
  const orders = LS.get("crionix_orders",[]).filter(o=>session && o.email===session.email);
  if(!session){toast("Inicia sesión para ver tus pedidos");openAuth('login');return;}
  toast(orders.length ? `Tienes ${orders.length} pedido(s) registrado(s)` : "Aún no tienes pedidos");
};

document.getElementById('loginBtn').onclick=()=>{
  const email=document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass=document.getElementById('loginPass').value;
  const err=document.getElementById('loginError');
  const u = users.find(u=>u.email===email && u.pass===pass);
  if(!u){err.textContent="Correo o contraseña incorrectos.";err.classList.add('show');return;}
  err.classList.remove('show');
  session={name:u.name,email:u.email}; LS.set("crionix_session",session);
  renderAuthArea(); authOverlay.classList.remove('show'); toast("Bienvenido, "+u.name.split(' ')[0]);
};
document.getElementById('regBtn').onclick=()=>{
  const name=document.getElementById('regName').value.trim();
  const email=document.getElementById('regEmail').value.trim().toLowerCase();
  const pass=document.getElementById('regPass').value;
  const err=document.getElementById('regError');
  if(!name||!email||pass.length<4){err.textContent="Completa todos los campos (contraseña de mínimo 4 caracteres).";err.classList.add('show');return;}
  if(users.some(u=>u.email===email)){err.textContent="Ya existe una cuenta con ese correo.";err.classList.add('show');return;}
  err.classList.remove('show');
  users.push({name,email,pass}); LS.set("crionix_users",users);
  session={name,email}; LS.set("crionix_session",session);
  renderAuthArea(); authOverlay.classList.remove('show'); toast("Cuenta creada. ¡Bienvenido, "+name.split(' ')[0]+"!");
};
renderAuthArea();

/* ---------------- checkout (simulated payment) ---------------- */
const payOverlay=document.getElementById('payOverlay'), payContent=document.getElementById('payContent');
document.getElementById('checkoutBtn').onclick=()=>{
  if(cart.length===0) return;
  if(!session){ closeCart(); openAuth('login'); toast("Inicia sesión para pagar"); return; }
  closeCart();
  renderPayForm();
  payOverlay.classList.add('show');
};
document.getElementById('payClose').onclick=()=>payOverlay.classList.remove('show');
payOverlay.addEventListener('click',e=>{if(e.target===payOverlay)payOverlay.classList.remove('show');});

function renderPayForm(){
  const total = cart.reduce((s,c)=>s+GAMES.find(g=>g.id===c.id).price*c.qty,0);
  payContent.innerHTML = `
    <h2 style="font-size:26px;margin-bottom:16px;">Finalizar compra</h2>
    <div class="pay-methods">
      <label><input type="radio" name="pm" value="Tarjeta" checked><span>Tarjeta</span></label>
      <label><input type="radio" name="pm" value="PSE"><span>PSE</span></label>
      <label><input type="radio" name="pm" value="Nequi"><span>Nequi</span></label>
    </div>
    <div id="pmFields"></div>
    <div class="total-row"><span>Total a pagar</span><span>${fmt(total)}</span></div>
    <button class="btn btn-primary btn-block" id="payNow">Pagar ahora</button>
    <div class="disclaimer">Simulación de pago con fines de demostración — no se procesan transacciones ni datos financieros reales.</div>
  `;
  const pmFields = payContent.querySelector('#pmFields');
  function drawFields(method){
    if(method==='Tarjeta'){
      pmFields.innerHTML = `
        <div class="field"><label>Nombre del titular</label><input type="text" id="pfName"></div>
        <div class="field"><label>Número de tarjeta</label><input type="text" id="pfCard" maxlength="19" placeholder="0000 0000 0000 0000"></div>
        <div class="row2">
          <div class="field"><label>Vencimiento</label><input type="text" id="pfExp" placeholder="MM/AA" maxlength="5"></div>
          <div class="field"><label>CVV</label><input type="text" id="pfCvv" maxlength="3"></div>
        </div>`;
    } else if(method==='PSE'){
      pmFields.innerHTML = `
        <div class="field"><label>Banco</label>
          <select id="pfBank"><option>Bancolombia</option><option>Davivienda</option><option>BBVA</option><option>Banco de Bogotá</option><option>Nu</option></select>
        </div>
        <div class="field"><label>Tipo de persona</label>
          <select id="pfPersona"><option>Natural</option><option>Jurídica</option></select>
        </div>`;
    } else {
      pmFields.innerHTML = `<div class="field"><label>Número de celular Nequi</label><input type="text" id="pfPhone" maxlength="10" placeholder="3XXXXXXXXX"></div>`;
    }
  }
  drawFields('Tarjeta');
  payContent.querySelectorAll('input[name="pm"]').forEach(r=>r.onchange=()=>drawFields(r.value));

  document.getElementById('payNow').onclick=()=>{
    payContent.innerHTML = `<div class="success"><div class="check">✓</div><h2 style="font-size:24px;">¡Pago simulado con éxito!</h2>
      <p style="color:var(--text-mute);margin:10px 0 20px;">Pedido #${Math.floor(100000+Math.random()*900000)} por ${fmt(total)}.</p>
      <button class="btn btn-primary btn-block" id="payDone">Listo</button></div>`;
    const orders = LS.get("crionix_orders",[]);
    orders.push({email:session.email, items:cart, total, date:new Date().toISOString()});
    LS.set("crionix_orders",orders);
    cart=[]; LS.set("crionix_cart",cart); renderCart();
    document.getElementById('payDone').onclick=()=>payOverlay.classList.remove('show');
  };
}

/* ---------------- PQR ---------------- */
function renderTickets(){
  const list=document.getElementById('ticketList');
  if(tickets.length===0){ list.innerHTML=`<p style="color:var(--text-mute);font-size:14px;">Aún no has radicado ninguna solicitud.</p>`; return; }
  list.innerHTML = tickets.slice().reverse().map(t=>`
    <div class="ticket"><span><span class="id">${t.id}</span> · ${t.tipo}</span><span class="status">${t.estado}</span></div>
  `).join('');
}
renderTickets();
document.getElementById('pqrForm').addEventListener('submit',e=>{
  e.preventDefault();
  const id = "PQR-"+Math.floor(10000+Math.random()*90000);
  tickets.push({
    id, tipo:document.getElementById('pqrTipo').value,
    nombre:document.getElementById('pqrNombre').value,
    correo:document.getElementById('pqrCorreo').value,
    asunto:document.getElementById('pqrAsunto').value,
    detalle:document.getElementById('pqrDetalle').value,
    estado:"Recibido"
  });
  LS.set("crionix_pqr",tickets);
  renderTickets();
  e.target.reset();
  toast("Solicitud enviada. Tu número de ticket es "+id);
});

/* =======================================================
   RECAUDA — Capa de datos y autenticación (demo académica)
   Todo vive en localStorage del navegador. No hay backend
   real: esto simula el comportamiento de una plataforma de
   cobros recurrentes para la sustentación del proyecto.
   ======================================================= */

const RECAUDA_DB_KEY = 'recauda_db_v1';
const RECAUDA_SESSION_KEY = 'recauda_session_v1';

const PLAN_INFO = {
  Bronce: { amount: 80000, months: 1, label: 'mensual' },
  Plata:  { amount: 220000, months: 3, label: 'trimestral' },
  Oro:    { amount: 620000, months: 12, label: 'anual' }
};

/* ---------- Utilidades ---------- */
function cop(value){
  return '$' + Math.round(Number(value) || 0).toLocaleString('es-CO');
}
function uid(prefix){
  return prefix + '_' + Math.random().toString(36).slice(2, 9);
}
function addMonths(dateIso, months){
  const d = new Date(dateIso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}
function formatDate(iso){
  return new Date(iso).toLocaleDateString('es-CO', { day:'numeric', month:'long', year:'numeric' });
}

/* ---------- Semilla de datos ficticios ----------
   Cuatro negocios de ejemplo con clientes ya cargados,
   para que el jurado pueda entrar sin tener que registrar
   nada primero. */
function seedDatabase(){
  const now = new Date().toISOString();

  const businesses = [
    {
      id: 'biz_powerfit',
      type: 'empresa',
      name: 'PowerFit Gym',
      category: 'Gimnasio / Fitness',
      email: 'contacto@powerfit.demo',
      password: 'powerfit123',
      city: 'Villavicencio, Meta',
      createdAt: now,
      software: 50000
    },
    {
      id: 'biz_ritmovital',
      type: 'empresa',
      name: 'Ritmo Vital',
      category: 'Academia de baile',
      email: 'hola@ritmovital.demo',
      password: 'ritmo123',
      city: 'Villavicencio, Meta',
      createdAt: now,
      software: 50000
    },
    {
      id: 'biz_golazo',
      type: 'empresa',
      name: 'Golazo Escuela Deportiva',
      category: 'Escuela de fútbol',
      email: 'info@golazo.demo',
      password: 'golazo123',
      city: 'Villavicencio, Meta',
      createdAt: now,
      software: 50000
    },
    {
      id: 'biz_fluir',
      type: 'empresa',
      name: 'Fluir Idiomas',
      category: 'Academia de idiomas',
      email: 'contacto@fluir.demo',
      password: 'fluir123',
      city: 'Villavicencio, Meta',
      createdAt: now,
      software: 50000
    }
  ];

  const clients = [
    {
      id: 'cli_maria', type: 'cliente', businessId: 'biz_powerfit',
      name: 'María Sánchez', email: 'maria@correo.demo', password: 'cliente123',
      plan: 'Bronce', method: 'Tarjeta', status: 'Activo',
      startedAt: now, nextCharge: addMonths(now, 1),
      history: [
        { date: addMonths(now, -1), amount: PLAN_INFO.Bronce.amount, status: 'Pagado' },
        { date: addMonths(now, -2), amount: PLAN_INFO.Bronce.amount, status: 'Pagado' }
      ]
    },
    {
      id: 'cli_juan', type: 'cliente', businessId: 'biz_powerfit',
      name: 'Juan Rojas', email: 'juan@correo.demo', password: 'cliente123',
      plan: 'Plata', method: 'PSE', status: 'Reintento',
      startedAt: now, nextCharge: addMonths(now, 0),
      history: [
        { date: addMonths(now, -3), amount: PLAN_INFO.Plata.amount, status: 'Pagado' }
      ]
    },
    {
      id: 'cli_laura', type: 'cliente', businessId: 'biz_ritmovital',
      name: 'Laura Castillo', email: 'laura@correo.demo', password: 'cliente123',
      plan: 'Bronce', method: 'Nequi', status: 'Activo',
      startedAt: now, nextCharge: addMonths(now, 1),
      history: [
        { date: addMonths(now, -1), amount: PLAN_INFO.Bronce.amount, status: 'Pagado' }
      ]
    },
    {
      id: 'cli_diego', type: 'cliente', businessId: 'biz_golazo',
      name: 'Diego Torres', email: 'diego@correo.demo', password: 'cliente123',
      plan: 'Oro', method: 'Daviplata', status: 'Activo',
      startedAt: now, nextCharge: addMonths(now, 12),
      history: [
        { date: addMonths(now, -12), amount: PLAN_INFO.Oro.amount, status: 'Pagado' }
      ]
    },
    {
      id: 'cli_valentina', type: 'cliente', businessId: 'biz_ritmovital',
      name: 'Valentina Gómez', email: 'valentina@correo.demo', password: 'cliente123',
      plan: 'Plata', method: 'Tarjeta', status: 'Activo',
      startedAt: now, nextCharge: addMonths(now, 3),
      history: []
    },
    {
      id: 'cli_andres', type: 'cliente', businessId: 'biz_fluir',
      name: 'Andrés Peña', email: 'andres@correo.demo', password: 'cliente123',
      plan: 'Bronce', method: 'Tarjeta', status: 'Vencido',
      startedAt: now, nextCharge: addMonths(now, -1),
      history: [
        { date: addMonths(now, -1), amount: PLAN_INFO.Bronce.amount, status: 'Fallido' }
      ]
    }
  ];

  const db = { businesses, clients };
  localStorage.setItem(RECAUDA_DB_KEY, JSON.stringify(db));
  return db;
}

function loadDatabase(){
  try{
    const raw = localStorage.getItem(RECAUDA_DB_KEY);
    if(!raw) return seedDatabase();
    const db = JSON.parse(raw);
    if(!db || !Array.isArray(db.businesses) || !Array.isArray(db.clients)) return seedDatabase();
    return db;
  }catch{
    return seedDatabase();
  }
}
function saveDatabase(db){
  localStorage.setItem(RECAUDA_DB_KEY, JSON.stringify(db));
}
function resetDemoData(){
  localStorage.removeItem(RECAUDA_DB_KEY);
  return seedDatabase();
}

/* ---------- Sesión ---------- */
function getSession(){
  try{
    const raw = localStorage.getItem(RECAUDA_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch{
    return null;
  }
}
function setSession(session){
  localStorage.setItem(RECAUDA_SESSION_KEY, JSON.stringify(session));
}
function clearSession(){
  localStorage.removeItem(RECAUDA_SESSION_KEY);
}

/* ---------- Autenticación: negocios ---------- */
function loginBusiness(email, password){
  const db = loadDatabase();
  const biz = db.businesses.find(b => b.email.toLowerCase() === String(email).toLowerCase());
  if(!biz) return { ok:false, error:'No encontramos un negocio con ese correo.' };
  if(biz.password !== password) return { ok:false, error:'La contraseña no coincide.' };
  setSession({ role:'empresa', id: biz.id });
  return { ok:true, business: biz };
}
function registerBusiness({ name, category, email, password, city }){
  const db = loadDatabase();
  if(db.businesses.some(b => b.email.toLowerCase() === email.toLowerCase())){
    return { ok:false, error:'Ya existe un negocio registrado con ese correo.' };
  }
  const biz = {
    id: uid('biz'), type:'empresa', name, category, email, password,
    city: city || 'Villavicencio, Meta', createdAt: new Date().toISOString(), software:50000
  };
  db.businesses.push(biz);
  saveDatabase(db);
  setSession({ role:'empresa', id: biz.id });
  return { ok:true, business: biz };
}

/* ---------- Autenticación: clientes ---------- */
function loginClient(email, password){
  const db = loadDatabase();
  const cli = db.clients.find(c => c.email.toLowerCase() === String(email).toLowerCase());
  if(!cli) return { ok:false, error:'No encontramos una cuenta con ese correo.' };
  if(cli.password !== password) return { ok:false, error:'La contraseña no coincide.' };
  setSession({ role:'cliente', id: cli.id });
  return { ok:true, client: cli };
}
function registerClient({ name, email, password, businessId, plan, method }){
  const db = loadDatabase();
  if(db.clients.some(c => c.email.toLowerCase() === email.toLowerCase())){
    return { ok:false, error:'Ya existe una cuenta con ese correo.' };
  }
  const now = new Date().toISOString();
  const months = PLAN_INFO[plan]?.months || 1;
  const cli = {
    id: uid('cli'), type:'cliente', businessId, name, email, password,
    plan, method, status:'Activo', startedAt: now, nextCharge: addMonths(now, months), history: []
  };
  db.clients.push(cli);
  saveDatabase(db);
  setSession({ role:'cliente', id: cli.id });
  return { ok:true, client: cli };
}

/* ---------- Guardas de página ---------- */
function requireBusiness(){
  const session = getSession();
  if(!session || session.role !== 'empresa'){
    window.location.href = 'login-empresa.html';
    return null;
  }
  const db = loadDatabase();
  const biz = db.businesses.find(b => b.id === session.id);
  if(!biz){
    clearSession();
    window.location.href = 'login-empresa.html';
    return null;
  }
  return biz;
}
function requireClient(){
  const session = getSession();
  if(!session || session.role !== 'cliente'){
    window.location.href = 'login-cliente.html';
    return null;
  }
  const db = loadDatabase();
  const cli = db.clients.find(c => c.id === session.id);
  if(!cli){
    clearSession();
    window.location.href = 'login-cliente.html';
    return null;
  }
  return cli;
}
function logout(){
  clearSession();
  window.location.href = 'index.html';
}

/* ---------- Datos derivados para paneles ---------- */
function clientsOf(businessId){
  return loadDatabase().clients.filter(c => c.businessId === businessId);
}
function businessOf(businessId){
  return loadDatabase().businesses.find(b => b.id === businessId);
}
function addClientToBusiness(businessId, data){
  const db = loadDatabase();
  const now = new Date().toISOString();
  const months = PLAN_INFO[data.plan]?.months || 1;
  const cli = {
    id: uid('cli'), type:'cliente', businessId,
    name: data.name, email: data.email, password: data.password || 'cliente123',
    plan: data.plan, method: data.method, status:'Activo',
    startedAt: now, nextCharge: addMonths(now, months), history: []
  };
  db.clients.push(cli);
  saveDatabase(db);
  return cli;
}
function markClientPaid(clientId){
  const db = loadDatabase();
  const cli = db.clients.find(c => c.id === clientId);
  if(!cli) return null;
  const months = PLAN_INFO[cli.plan]?.months || 1;
  cli.history = cli.history || [];
  cli.history.unshift({ date: new Date().toISOString(), amount: PLAN_INFO[cli.plan]?.amount || 0, status:'Pagado' });
  cli.status = 'Activo';
  cli.nextCharge = addMonths(new Date().toISOString(), months);
  saveDatabase(db);
  return cli;
}
function removeClient(clientId){
  const db = loadDatabase();
  db.clients = db.clients.filter(c => c.id !== clientId);
  saveDatabase(db);
}

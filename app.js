const STORAGE="al_ryada_store_v1";
const defaultData={
  brand:"Groupe Al-Ryada",
  branch:"Sarl Kahromania — Algérie",
  heroTitle:"Donnez une nouvelle lumière à vos espaces.",
  heroText:"Des solutions d'éclairage modernes pour maisons, commerces, bureaux et projets décoratifs.",
  whatsapp:"+213540588197",
  products:[
    {name:"Suspension décorative",price:8500,image:"https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=80",desc:"Éclairage élégant pour salon et espaces modernes."},
    {name:"Lampe murale",price:4200,image:"https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80",desc:"Une touche lumineuse et décorative."},
    {name:"Projecteur LED",price:6500,image:"https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=900&q=80",desc:"Solution LED pratique pour différents projets."},
    {name:"Éclairage plafond",price:9900,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",desc:"Design contemporain et lumière homogène."}
  ],
  wholesale:[
    {name:"Pack LED professionnel",price:0,image:"https://images.unsplash.com/photo-1493229042584-36e9d9e6b1d2?auto=format&fit=crop&w=900&q=80",desc:"Prix sur devis — idéal pour revendeurs."},
    {name:"Pack éclairage décoratif",price:0,image:"https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80",desc:"Quantités professionnelles et tarifs de gros."}
  ]
};
let data=JSON.parse(localStorage.getItem(STORAGE)||"null")||structuredClone(defaultData);
let cart=[];

const $=s=>document.querySelector(s);
const money=n=>Number(n||0).toLocaleString("fr-DZ")+" DA";
const wa=()=>data.whatsapp.replace(/\D/g,"");

function save(){localStorage.setItem(STORAGE,JSON.stringify(data))}
function render(){
  $("#brandName").textContent=data.brand; $("#branchName").textContent=data.branch;
  $("#heroTitle").textContent=data.heroTitle; $("#heroText").textContent=data.heroText;
  $("#contactWhatsapp").href=`https://wa.me/${wa()}?text=${encodeURIComponent("Bonjour Groupe Al-Ryada, je souhaite avoir des informations.")}`;
  $("#year").textContent=new Date().getFullYear();
  $("#productGrid").innerHTML=data.products.map((p,i)=>card(p,i,false)).join("");
  $("#wholesaleGrid").innerHTML=data.wholesale.map((p,i)=>card(p,i,true)).join("");
  $("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
}
function card(p,i,wholesale){
  return `<article class="product">
    <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" onerror="this.src='https://via.placeholder.com/900x600/171717/ff7a00?text=Produit'">
    <div class="product-body"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.desc)}</p>
    <div class="price">${wholesale ? "Sur devis" : money(p.price)}</div>
    <button class="btn primary" onclick="${wholesale?`addWholesale(${i})`:`addCart(${i})`}">${wholesale?"Demander un devis":"Ajouter au panier"}</button></div>
  </article>`
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function escapeAttr(s){return escapeHtml(s)}
window.addCart=i=>{cart.push({type:"product",i,qty:1});render();openModal("cartModal")}
window.addWholesale=i=>{const p=data.wholesale[i]; const text=`Bonjour, je souhaite un devis pour : ${p.name}.`;window.open(`https://wa.me/${wa()}?text=${encodeURIComponent(text)}`,"_blank")}
function renderCart(){
  $("#cartItems").innerHTML=cart.length?cart.map((x,n)=>{let p=data.products[x.i];return `<div class="cart-row"><span>${escapeHtml(p.name)} × ${x.qty}</span><strong>${money(p.price*x.qty)}</strong><button class="delete" onclick="cart.splice(${n},1);renderCart();render()">×</button></div>`}).join(""):"<p>Votre panier est vide.</p>";
  $("#cartTotal").textContent=money(cart.reduce((s,x)=>s+data.products[x.i].price*x.qty,0));
}
function openModal(id){$( "#"+id).classList.remove("hidden"); if(id==="cartModal")renderCart()}
function closeModal(id){$("#"+id).classList.add("hidden")}

$("#cartBtn").onclick=()=>openModal("cartModal");
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
$("#sendOrder").onclick=()=>{
  if(!cart.length)return;
  const lines=cart.map(x=>{let p=data.products[x.i];return `- ${p.name} x${x.qty} : ${money(p.price*x.qty)}`}).join("\n");
  const total=cart.reduce((s,x)=>s+data.products[x.i].price*x.qty,0);
  const msg=`Bonjour Groupe Al-Ryada, je souhaite commander :\n${lines}\nTotal : ${money(total)}\nMerci.`;
  window.open(`https://wa.me/${wa()}?text=${encodeURIComponent(msg)}`,"_blank");
};

let taps=0,timer;
$("#adminTrigger").onclick=()=>{
  taps++; clearTimeout(timer); timer=setTimeout(()=>taps=0,1500);
  if(taps===5){taps=0;$("#adminPassword").value="";$("#loginError").textContent="";openModal("loginModal");setTimeout(()=>$("#adminPassword").focus(),100)}
};
$("#loginBtn").onclick=()=>{
  if($("#adminPassword").value==="1245"){closeModal("loginModal");loadAdmin();openModal("adminModal")}
  else $("#loginError").textContent="Mot de passe incorrect.";
};
$("#adminPassword").addEventListener("keydown",e=>{if(e.key==="Enter")$("#loginBtn").click()});

document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");
  document.querySelectorAll(".tab-panel").forEach(x=>x.classList.remove("active"));$("#tab-"+t.dataset.tab).classList.add("active");
});
function loadAdmin(){
  $("#editBrand").value=data.brand;$("#editBranch").value=data.branch;$("#editHeroTitle").value=data.heroTitle;$("#editHeroText").value=data.heroText;$("#editWhatsapp").value=data.whatsapp;
  renderAdminList("products",data.products);renderAdminList("wholesale",data.wholesale);
}
function renderAdminList(type,list){
  const box=type==="products"?$("#adminProducts"):$("#adminWholesale");
  box.innerHTML=list.map((p,i)=>`
    <div class="admin-item">
      <div class="admin-item-grid">
        <label>Nom<input data-type="${type}" data-i="${i}" data-k="name" value="${escapeAttr(p.name)}"></label>
        <label>Prix (DA)<input type="number" data-type="${type}" data-i="${i}" data-k="price" value="${Number(p.price)||0}"></label>
        <label class="wide">Image URL<input data-type="${type}" data-i="${i}" data-k="image" value="${escapeAttr(p.image)}"></label>
        <label class="wide">Description<textarea data-type="${type}" data-i="${i}" data-k="desc">${escapeHtml(p.desc)}</textarea></label>
      </div>
      <button class="delete" onclick="removeAdminItem('${type}',${i})">Supprimer</button>
    </div>`).join("");
}
function collectAdmin(type){
  const list=data[type];
  document.querySelectorAll(`[data-type="${type}"]`).forEach(el=>{
    const i=Number(el.dataset.i),k=el.dataset.k;
    list[i][k]=k==="price"?Number(el.value)||0:el.value;
  });
}
window.removeAdminItem=(type,i)=>{data[type].splice(i,1);renderAdminList(type,data[type])};
$("#saveGeneral").onclick=()=>{data.brand=$("#editBrand").value;data.branch=$("#editBranch").value;data.heroTitle=$("#editHeroTitle").value;data.heroText=$("#editHeroText").value;data.whatsapp=$("#editWhatsapp").value||"+213540588197";save();render();alert("Informations enregistrées.")};
$("#saveProducts").onclick=()=>{collectAdmin("products");save();render();alert("Produits enregistrés.")};
$("#saveWholesale").onclick=()=>{collectAdmin("wholesale");save();render();alert("Vente en gros enregistrée.")};
$("#addProduct").onclick=()=>{data.products.push({name:"Nouveau produit",price:0,image:"",desc:"Description du produit"});renderAdminList("products",data.products)};
$("#addWholesale").onclick=()=>{data.wholesale.push({name:"Nouvel article de gros",price:0,image:"",desc:"Prix sur devis"});renderAdminList("wholesale",data.wholesale)};
$("#resetBtn").onclick=()=>{if(confirm("Réinitialiser les données de démonstration ?")){data=structuredClone(defaultData);save();render();loadAdmin()}};

render();
!function(){function n(){var n=[1,2,3,4,5,6].map(function(){return L[L.length*Math.random()|0]});return localStorage.schedule=JSON.stringify(n),n}function e(){q++,M[q]||(M=n(),q=0),localStorage.lessonIndex=q,w=M[q],r(),v=!1,location.hash="#schedule",E.innerHTML="",H=b.map(function(){return[]}),o()}function t(){"#lesson"===window.location.hash?document.querySelector(".page").classList.remove("flipped"):document.querySelector(".page").classList.add("flipped")}function r(){document.querySelector("#schedule").innerHTML="<div><h1>date</h1><ol>".replace("date",(new Date).toLocaleDateString())+M.map(function(n,e){return q>e?"<li> name <span>✓</span>".replace("name",n.name):q===e?'<li> <a href="#lesson"> name </a>'.replace("name",n.name):"<li> name".replace("name",n.name)}).join("</br>")+"</ol>"}function o(){document.querySelector(".teacher p").innerText=w.name,m().then(function(){v=!0,S=0,P=500,document.querySelector(".score").textContent="Let's get started!"})}function c(){S+=1,S&&(document.querySelector(".score").textContent=S.toString()+"%")}function a(n,e){var t=i();return t.x=n,t.y=e,t.type=t.innerHTML,s(t),t}function i(){var n=document.createElement("div");return E.appendChild(n),n.setAttribute("class","tile"),n.innerHTML=u(),n}function u(){return w.icons[w.icons.length*Math.random()|0]}function s(n){return n.style.top=46*n.y+"px",n.style.left=18*n.x+"%",n}function l(n){var e=n.target;C?(f(e,C),C.classList.remove("selected"),m().then(function(){e.parentElement&&C.parentElement&&g(P).then(f.bind(null,e,C)),C=void 0})):(C=e,C.classList.add("selected"))}function m(){return y().then(function(n){return H=n,I?m():void(v&&S>=100&&e())})}function f(n,e){var t=n.x,r=n.y;d(n,e)&&(n.x=e.x,n.y=e.y,e.x=t,e.y=r,H[n.x][n.y]=n,H[e.x][e.y]=e,s(n),s(e))}function d(n,e){return 1===Math.abs(n.x-e.x)&&n.y===e.y||1===Math.abs(n.y-e.y)&&n.x===e.x}function y(){return Promise.all(H.map(function(n){return Promise.all(n.map(h))})).then(function(n){return I=!1,n.map(function(n,e){return n=n.filter(function(n){return void 0!==n}),n.length!==T.length&&(I=!0),T.slice(0,T.length-n.length).map(function(n){return a(e,-1)}).concat(n).map(function(n,t){return n.x=e,n.y=t,s(n),n})})})}function h(n){return p(n)||x(n)?(n.classList.add("crushed"),g(P).then(function(){c(),n.remove()})):n}function p(n){var e=[0,1,2];return e.some(function(t){return e.every(function(e){try{return H[n.x][n.y-t+e].type===H[n.x][n.y].type}catch(n){return!1}})})}function x(n){var e=[0,1,2];return e.some(function(t){return e.every(function(e){try{return H[n.x-t+e][n.y].type===H[n.x][n.y].type}catch(n){return!1}})})}function g(n){return new Promise(function(e){setTimeout(e,n)})}var v,S,L=[{name:"Geography",icons:["🗺","🇺🇸","🇪🇺","🇷🇺","🇨🇳"]},{name:"History",icons:["⚔","🏺","👑","📜","🗿"]},{name:"Chemistry",icons:["⚗","☢","⚛","🔬","🎇"]},{name:"Biology",icons:["☣","🐁","🐒","🌱","🐠"]},{name:"Physics",icons:["⚙","🔭","💡","🔋","🌡"]},{name:"English",icons:["✍","🇬🇧","🇺🇸","📝","💬"]},{name:"Music",icons:["🎺","🎻","🎹","🎵","🎼"]},{name:"Maths",icons:["🔢","➕","➖","➗","📊"]},{name:"Art",icons:["🎭","🖼","🎨","🖌","🖍"]},{name:"Physical education",icons:["⛹","🏐","🏅","⚽","🏈"]},{name:"Informatics",icons:["💾","🖥","💿","⌨","🤖"]}],M=JSON.parse(localStorage.schedule||"false")||n(),q=JSON.parse(localStorage.lessonIndex||"0"),w=M[q],b=[0,1,2,3,4],T=[0,1,2,3,4,5,6,7],E=document.querySelector(".board"),H=b.map(function(){return[]}),P=0;E.addEventListener("mousedown",l),t(),window.onhashchange=t,r(),o();var C,I}();
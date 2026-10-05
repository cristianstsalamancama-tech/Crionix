/* ---------------- data ---------------- */
const GAMES = [
  {id:1,title:"Elden Ring",image:"img/games/elden-ring.jpg",dev:"FromSoftware / Bandai Namco",genre:"RPG de acción",price:199900,rating:4.9,hue:355,
   desc:"Un mundo abierto brutal y hermoso donde cada colina esconde un peligro y cada muerte enseña algo nuevo. Explora las Tierras Intermedias, enfréntate a semidioses caídos y construye tu propia leyenda a tu ritmo, con o sin ayuda de otros jugadores."},
  {id:2,title:"Grand Theft Auto V",image:"img/games/gta-v.jpg",dev:"Rockstar Games",genre:"Mundo abierto",price:79900,rating:4.7,hue:340,
   desc:"Los Santos espera. Tres historias cruzadas, un mundo repleto de posibilidades y un modo en línea que sigue creciendo más de una década después. Robos, caos vehicular y libertad total en cada esquina."},
  {id:3,title:"Red Dead Redemption 2",image:"img/games/red-dead-redemption-2.jpg",dev:"Rockstar Games",genre:"Aventura / Western",price:139900,rating:4.9,hue:20,
   desc:"La historia de Arthur Morgan y la banda Van der Linde en un Oeste que se apaga. Un relato pausado, íntimo y devastador sobre lealtad, supervivencia y el precio de la libertad, en uno de los mundos más detallados jamás creados."},
  {id:4,title:"Cyberpunk 2077",image:"img/games/cyberpunk-2077.jpg",dev:"CD Projekt Red",genre:"RPG de acción",price:149900,rating:4.5,hue:280,
   desc:"Night City nunca duerme. Personaliza a V, toma decisiones que cambian el rumbo de la historia y sumérgete en una metrópolis de neón llena de implantes, corporaciones y peligro a cada paso."},
  {id:5,title:"The Legend of Zelda: Tears of the Kingdom",image:"img/games/zelda-totk.jpg",dev:"Nintendo",genre:"Aventura",price:279900,rating:4.9,hue:45,
   desc:"Hyrule se expande hacia el cielo y hacia las profundidades. Construye, combina y explora con una libertad creativa que redefine lo que puede hacer una aventura de mundo abierto."},
  {id:6,title:"God of War Ragnarök",image:"img/games/god-of-war-ragnarok.jpg",dev:"Santa Monica Studio",genre:"Acción / Aventura",price:259900,rating:4.9,hue:5,
   desc:"Kratos y Atreus enfrentan el fin de los nueve reinos. Combate visceral, una relación padre-hijo que sigue creciendo y un viaje nórdico cargado de emoción y espectáculo."},
  {id:7,title:"Minecraft",image:"img/games/minecraft.jpg",dev:"Mojang Studios",genre:"Sandbox",price:69900,rating:4.8,hue:110,
   desc:"Construye, sobrevive y crea sin límites. El bloque más famoso del mundo sigue siendo el lienzo perfecto para la imaginación, ya sea en solitario o acompañado."},
  {id:8,title:"Stardew Valley",image:"img/games/stardew-valley.jpg",dev:"ConcernedApe",genre:"Simulación / Indie",price:24900,rating:4.9,hue:132,
   desc:"Hereda una granja olvidada y construye la vida tranquila que siempre quisiste: cultiva, pesca, conoce al pueblo y decide qué tan lejos llega tu paz rural."},
  {id:9,title:"Hollow Knight",image:"img/games/hollow-knight.jpg",dev:"Team Cherry",genre:"Metroidvania",price:34900,rating:4.8,hue:190,
   desc:"Desciende a Hallownest, un reino subterráneo en ruinas lleno de insectos, secretos y una atmósfera inolvidable. Difícil, hermoso y profundamente misterioso."},
  {id:10,title:"Baldur's Gate 3",image:"img/games/baldurs-gate-3.jpg",dev:"Larian Studios",genre:"RPG por turnos",price:189900,rating:4.9,hue:262,
   desc:"Reúne un grupo de compañeros inolvidables y toma decisiones que realmente importan en una campaña basada en Dungeons & Dragons con una libertad narrativa descomunal."}
];
const ICONS = {
  "RPG de acción":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3l7 7-9 9-7-7 9-9z"/><path d="M5 19l-1.5 1.5"/></svg>',
  "Mundo abierto":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>',
  "Aventura / Western":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20l6-14 2 5 2-5 6 14"/></svg>',
  "Aventura":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12l4-8 5 5 5-5 4 8-9 9-9-9z"/></svg>',
  "Acción / Aventura":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l2.5 7H21l-5.5 4.2L17.5 21 12 16.5 6.5 21l2-7.8L3 9h6.5z"/></svg>',
  "Sandbox":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v9"/></svg>',
  "Simulación / Indie":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 14c0-5 4-9 8-9s8 4 8 9-4 4-8 4-8 1-8-4z"/></svg>',
  "Metroidvania":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c4 0 6 3 6 7 0 5-3 8-6 11-3-3-6-6-6-11 0-4 2-7 6-7z"/></svg>',
  "RPG por turnos":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>'
};
const fmt = n => "$" + n.toLocaleString("es-CO") + " COP";
const tileHTML = g => `<div class="tile" style="background:linear-gradient(150deg,hsl(${g.hue} 70% 14%),hsl(${g.hue} 80% 30%))">
  <span class="glyph">${g.title[0]}</span>
  ${g.image?`<img class="cover" src="${g.image}" alt="${g.title}" loading="lazy" onerror="this.remove()">`:""}
  <span class="icon">${ICONS[g.genre]||""}</span>
  <span class="genre-tag">${g.genre}</span>
</div>`;

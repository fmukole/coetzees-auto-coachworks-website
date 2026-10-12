// Builds every page of the site + preview.html (one self-contained file with all pages and photos).
// Run:  node build.js
const fs = require("fs"), path = require("path");
const OUT = __dirname;

// ---------- Business details: change once here, then rebuild ----------
const B = {
  name: "Coetzee's Auto Coachworks",
  caps: "COETZEE'S AUTO COACHWORKS",
  domain: "https://www.coetzeesauto.co.za",
  phone: "021 761 0320", phoneIntl: "+27217610320",
  waDisplay: "082 780 9198", wa: "27827809198",
  email: "admin@coetzeesauto.co.za",
  street: "2 Brigid Road, cnr Leo Road", suburb: "Elfindale, Ottery East", city: "Cape Town", code: "7808", province: "Western Cape",
  placeId: "ChIJ9aQ7qv5CzB0R_JfKjUm2LLQ",   // Google Business Profile place ID
  maps: "https://www.google.com/maps/dir/?api=1&destination=Coetzees+Auto+Coachworks&destination_place_id=ChIJ9aQ7qv5CzB0R_JfKjUm2LLQ",
  mapEmbed: "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sCoetzee%27s+Auto+Coachworks+Elfindale+Cape+Town!6i15",
  google: "https://www.google.com/maps/search/?api=1&query=Coetzees+Auto+Coachworks&query_place_id=ChIJ9aQ7qv5CzB0R_JfKjUm2LLQ",
  review: "https://search.google.com/local/writereview?placeid=ChIJ9aQ7qv5CzB0R_JfKjUm2LLQ",
  facebook: "https://www.facebook.com/search/top?q=Coetzee%27s%20Auto%20Coachworks",
  instagram: "https://www.instagram.com/",
  calendly: "",            // paste the Calendly link here once the account exists
  ga: "",                  // Google Analytics ID (G-XXXXXXX); loads only after "Accept"
  vat: "4120268471",
  rating: "4.6", reviews: "94",
  hours: [["Monday to Friday", "08:00 – 17:30"], ["Saturday & Sunday", "Closed"], ["Public holidays", "Closed"]],
};
const address = `${B.street}, ${B.suburb}, ${B.city}, ${B.code}`;
const waMsg = (m) => `https://wa.me/${B.wa}?text=${encodeURIComponent(m)}`;
const WA = waMsg("Hi, I'd like a quote for…");
const TEL = `tel:${B.phoneIntl}`;

// ---------- Icons (outline) ----------
const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const I = {
  phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'stroke-width="2.4"'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 'stroke-width="2.2"'),
  chev: svg('<path d="M6 9l6 6 6-6"/>', 'stroke-width="2.4"'),
  up: svg('<path d="M12 19V5M6 11l6-6 6 6"/>', 'stroke-width="2.2"'),
  family: svg('<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M14 20a4 4 0 0 1 7.5-2"/>'),
  car: svg('<path d="M4 16v-3l2-5a2 2 0 0 1 2-1.3h8A2 2 0 0 1 18 8l2 5v3M3 16h18v2H3zM6 13h12"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/>'),
  spray: svg('<path d="M8 10h7v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zM10 10V7h3v3M13 8h3l2 2M4 5h.01M4 9h.01M6 7h.01M2 7h.01"/>'),
  key: svg('<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>'),
  pin: svg('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.5"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.500 7l8.500 6 8.500-6"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.500 2"/>'),
  shield: svg('<path d="M12 3l8 3v6c0 4.500-3.200 7.700-8 9-4.800-1.300-8-4.500-8-9V6z"/><path d="M8.500 12l2.500 2.500 4.500-5"/>'),
  doc: svg('<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>'),
  slide: svg('<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>', 'stroke-width="2.2"'),
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm0 18.200a8.200 8.200 0 0 1-4.200-1.200l-.300-.200-3 .800.800-2.900-.200-.300A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.200-.100-1.500-.700-1.700-.800s-.400-.100-.600.100-.600.800-.800 1-.300.200-.500.100a6.700 6.700 0 0 1-3.300-2.900c-.300-.400.300-.400.700-1.300a.500.500 0 0 0 0-.500c-.100-.100-.600-1.400-.800-1.900s-.400-.400-.600-.400h-.500a1 1 0 0 0-.700.300 2.900 2.900 0 0 0-.900 2.200 5 5 0 0 0 1.100 2.700 11.600 11.600 0 0 0 4.400 3.900c1.600.700 2.300.800 3.100.600a2.600 2.600 0 0 0 1.700-1.200 2.100 2.100 0 0 0 .100-1.200c0-.100-.200-.200-.500-.300z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.500 21v-7.500h2.600l.400-3h-3V8.600c0-.900.300-1.500 1.500-1.500h1.600V4.400A20 20 0 0 0 14.300 4.300c-2.300 0-3.800 1.400-3.800 3.900v2.300H8v3h2.500V21z"/></svg>',
  ig: svg('<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.200 6.800h.01"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.500l2.900 6.100 6.600.900-4.800 4.600 1.200 6.600L12 17.500l-5.900 3.200 1.200-6.600L2.500 9.500l6.600-.900z"/></svg>',
};
const stars = (n) => `<span class="stars" role="img" aria-label="${n} out of 5 stars">${[1, 2, 3, 4, 5].map((i) => (i <= n ? I.star : I.star.replace("<svg", '<svg class="off"'))).join("")}</span>`;
const img = (file, alt, w, h, eager) => `<img src="/assets/img/${file}.webp" alt="${alt}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;

// ---------- Content ----------
const services = [
  { slug: "accident-repair", name: "Accident repair & panel beating", short: "Accident repair",
    img: ["vw-polo-new-panels-fitted-on-repair-bench", "VW Polo on the repair bench with new door and wing panels fitted", 1146, 837],
    card: "From a bumper scrape to a heavy knock. We strip, repair or replace the damaged panels and line everything up properly before it goes to paint.",
    lead: "Collision damage repaired panel by panel in our Elfindale workshop, on all makes of vehicle.",
    intro: "After an accident you want the car to look and close the way it did before. We strip the damaged area, repair what can be saved, replace what can't, and check the gaps before any paint goes on.",
    list: ["Free quote from photos or a visit to the workshop", "Damaged panels repaired or replaced", "Bumpers, doors, wings, bonnets and boot lids", "Panel gaps and shut lines checked before paint", "Colour-matched respray in our own spray booth", "Insurance and private work both welcome"],
    photos: [["mercedes-c63-rear-quarter-accident-damage", "Mercedes C63 with rear quarter accident damage, stripped for repair", "Rear quarter damage stripped back", 1166, 670], ["blue-bmw-m4-front-end-stripped-for-repair", "Blue BMW M4 with its front end stripped during an accident repair", "Front end stripped for repair", 1064, 727], ["panel-shop-floor-with-cars-in-repair", "Cars in different stages of repair on the workshop floor", "The panel shop floor", 1116, 695]],
    faqs: [["Can you quote from photos?", "Yes. WhatsApp us clear photos of the damage from a few angles and we'll come back to you. For bigger knocks we may ask you to bring the car in so we can look underneath."], ["Do you do insurance claims work?", "Yes, we repair cars on insurance claims as well as for private customers. Tell us who your insurer is when you get in touch and we'll explain the next step."], ["Which makes do you work on?", "All makes. Our floor usually has a mix of everyday hatchbacks, bakkies, SUVs and sports cars."]] },
  { slug: "spray-painting", name: "Spray painting", short: "Spray painting",
    img: ["suv-masked-for-respray-in-spray-booth", "Silver SUV fully masked for a respray inside the spray booth", 1112, 796],
    card: "Panel resprays, full resprays and colour changes, done in our own spray booth. Each car is masked, prepped and painted under cover.",
    lead: "Panel and full resprays in our own spray booth, from one bumper to a complete colour change.",
    intro: "Good paint is mostly preparation. We sand, prime and mask each car carefully, then spray inside the booth so dust stays out of the finish.",
    list: ["Single-panel and bumper resprays", "Full resprays and colour changes", "Colour matching to your existing paint", "Proper masking of glass, trim and wheels", "Sprayed in an enclosed booth", "Polished before handover"],
    photos: [["silver-sedan-masked-in-spray-booth", "Silver sedan masked with tape and plastic in the spray booth", "Masked and ready for paint", 1129, 846], ["classic-porsche-shell-fresh-orange-paint", "Classic Porsche body shell in fresh orange paint inside the booth", "Fresh colour on a classic shell", 1142, 821], ["workshop-floor-and-spray-booth", "Workshop floor with the blue spray booth at the far end", "Our spray booth", 731, 774]],
    faqs: [["Can you match my car's colour?", "Yes. We match the new paint to the panels next to it, so the repair doesn't stand out."], ["Do you respray a single panel?", "Yes. Many jobs are one bumper, door or wing. We blend the paint where needed so the colour reads the same across the car."], ["How long does a respray take?", "It depends on the size of the job and the prep needed. We'll give you a timeframe with your quote."]] },
  { slug: "chassis-straightening", name: "Chassis straightening", short: "Chassis straightening",
    img: ["mercedes-on-chassis-straightening-bench", "Mercedes sedan mounted on the chassis straightening bench with pulling tower", 1047, 833],
    card: "Hard hits can pull a car's structure out of line. We mount the car on our straightening bench and pull it back before any panels go on.",
    lead: "Structural repair on a chassis straightening bench, for cars and bakkies that have taken a hard hit.",
    intro: "If the structure is out, new panels will never fit right. We mount the vehicle on the bench, anchor it and pull the damaged section back into line with a pulling tower and chains.",
    list: ["Vehicle mounted and anchored on the bench", "Pulling tower and chains for controlled pulls", "Front, rear and side structural damage", "Cars, SUVs and bakkies", "Panels fitted only once the structure is right", "Finished in our own spray booth"],
    photos: [["bakkie-cab-on-chassis-straightening-jig", "Stripped bakkie cab mounted on the chassis straightening jig", "Bakkie cab on the jig", 1151, 853], ["chassis-pulling-tower-and-chains-on-front-end", "Yellow pulling tower and chains attached to a car's front end", "Pulling tower and chains", 1187, 647], ["vw-polo-new-panels-fitted-on-repair-bench", "VW Polo on the bench with new panels fitted after repair", "New panels going on", 1146, 837]],
    faqs: [["How do I know if my chassis is bent?", "Uneven panel gaps, doors that don't close properly or a car that pulls to one side after an accident are common signs. Bring it in and we'll take a look."], ["Can a bent chassis be repaired?", "Often, yes. It depends on where and how badly it is damaged. We'll tell you honestly once we've seen the car."], ["Do you work on bakkies?", "Yes. Bakkies and light commercial vehicles go on the same bench."]] },
  { slug: "classic-car-restoration", name: "Classic car restoration", short: "Classic car restoration",
    img: ["two-restored-mercedes-pagoda-sl-roadsters", "Two finished Mercedes Pagoda SL roadsters parked in the workshop", 1200, 614],
    card: "Bodywork and paint for classics. Shells stripped to bare metal, repaired, primed and painted. There's usually an old Mercedes or Porsche on our floor.",
    lead: "Body restoration and paint for classic and sports cars, from bare shell to final polish.",
    intro: "Classics need patience. We strip the body, repair the metal, prime it and paint it in the booth, then build the car back up. Mercedes SLs and air-cooled Porsches are regulars here.",
    list: ["Body shells stripped and repaired", "Rust and old repairs put right", "Primer, paint and polish in-house", "Shells worked on a body trolley for full access", "Classic Mercedes-Benz and Porsche experience", "Sports and collector cars welcome"],
    photos: [["mercedes-pagoda-body-shell-in-primer-on-trolley", "Mercedes Pagoda body shell in white primer on a workshop trolley", "Pagoda shell in primer", 1113, 657], ["classic-mercedes-sedan-final-polish", "Two technicians polishing a classic Mercedes sedan", "Final polish on a classic sedan", 1072, 643], ["black-mercedes-280-sl-pagoda-finished", "Finished black Mercedes 280 SL Pagoda with soft top", "Finished 280 SL", 1200, 596]],
    faqs: [["Which classics do you work on?", "Any make. Most of what you'll see in our photos is Mercedes-Benz and Porsche, but the bodywork skills are the same for other marques."], ["Do you do full restorations or just paint?", "Our side is the body and paint: metalwork, preparation, respray and refitting. Tell us what the car needs and we'll say what we can take on."], ["Can I see the car while it's being done?", "Yes. You're welcome to arrange a visit and see the progress for yourself."]] },
];
const extraCards = [
  { name: "Dent & bumper repair", href: "/contact/", img: ["vw-golf-rear-corner-repair-in-booth", "Blue VW Golf with rear corner under repair in the booth", 1090, 804],
    card: "Parking knocks, dented doors and cracked or scuffed bumpers. Smaller jobs that make a big difference to how your car looks." },
  { name: "Insurance claims & courtesy cars", href: "/contact/", img: ["coetzees-branded-courtesy-cars", "Row of white Coetzee's Auto Coachworks branded courtesy cars", 1200, 740],
    card: "We repair cars on insurance claims and for private customers. Ask us about a courtesy car while yours is in the shop." },
];
const reviews = [
  ["Peter Van Broekhuizen", 5, "I have never come across a coachworks as professional as COETZEES. Every time I have fetched my car it came back looking as if it had just left the showroom floor."],
  ["Rahgib Davids", 5, "Superb customer service. Family run business with true passion for cars and an eye for perfection. Great workmanship and competitive pricing."],
  ["Colin Rinquest", 5, "My car was sent in for repairs after an accident. I was told to expect my car back within 14 days, I received it back in 5 days, the workmanship first class."],
  ["Rick Spencer", 4, "Very nice family-owned panelshop, with a high level of expertise. The Coetzees are arguably leaders in repairs to classic and sports cars. Excellent customer service."],
  ["Bianca Brophy", 5, "Highly recommend Coetzees Auto Coachworks, Cameron and his team did a phenomenal job on my Polo Vivo."],
  ["Andre Frassek", 5, "I have had exceptionally good service from Coetzee's Auto, both when they did a panel beating job for me a few years ago and now recently when they straightened a wheel strut."],
  ["Hugen Nash", 5, "I just want to thank Coetzee coachworks for taking good care of my Hilux bakkie. This company take their work very serious."],
  ["Allison", 5, "This is a company I will recommend with the greatest pleasure to anyone that's looking for excellent, warm, friendly service. No job is too small or big."],
  ["Joshua van Rooyen", 5, "Really good service and great communication."],
];
const faqs = [
  ["How do I get a quote?", "The quickest way is WhatsApp. Send us your name, your suburb and a few clear photos of the damage. You can also call the workshop or fill in the quote form on our contact page."],
  ["Do you handle insurance claims?", "Yes. We repair cars on insurance claims and for private customers. Let us know who you're insured with when you contact us and we'll talk you through what happens next."],
  ["Can I get a courtesy car?", "We keep courtesy cars for customers whose vehicles are in for repair. They're subject to availability, so please ask when you book your car in."],
  ["Which makes of car do you work on?", "All makes. Everyday hatchbacks and bakkies, SUVs, sports cars and classics all come through our workshop."],
  ["How long will my repair take?", "It depends on the damage and on parts. Once we've assessed the car we'll give you a timeframe, and we'll tell you if anything changes."],
  ["Where are you and when are you open?", `We're at ${address}. The workshop is open Monday to Friday, 08:00 to 17:30, and closed on weekends and public holidays.`],
];
const gallery = [
  ["blue-bmw-m4-finished-repair", "Blue BMW M4 after its repair, parked in the workshop", "BMW M4, finished", 1107, 764],
  ["two-restored-mercedes-pagoda-sl-roadsters", "Two Mercedes Pagoda SL roadsters on the workshop floor", "Two Pagoda SLs", 1200, 614],
  ["black-mercedes-280-sl-pagoda-finished", "Black Mercedes 280 SL with soft top in the workshop", "Mercedes 280 SL", 1200, 596],
  ["classic-mercedes-sedan-final-polish", "Technicians polishing a classic Mercedes sedan", "Classic Mercedes, final polish", 1072, 643],
  ["white-range-rover-sport-outside-workshop", "White Range Rover Sport outside the workshop", "Range Rover Sport", 1103, 840],
  ["blue-bmw-e36-coupe-in-reception-bay", "Dark blue BMW E36 coupé in the reception bay", "BMW E36 coupé", 966, 742],
  ["yellow-bmw-m4-on-workshop-floor", "Yellow BMW M4 among other cars on the workshop floor", "BMW M4 on the floor", 926, 756],
  ["white-porsche-911-gt3-in-workshop", "White Porsche 911 GT3 in the workshop", "Porsche 911 GT3", 812, 605],
  ["classic-porsche-911-carrera-rs-in-workshop", "Classic white Porsche 911 Carrera RS in the workshop", "Classic Porsche 911", 1118, 493],
  ["bentley-coupe-in-the-workshop", "Cream Bentley coupé in the workshop", "Bentley coupé", 631, 686],
  ["classic-porsche-shell-fresh-orange-paint-side", "Classic Porsche shell in fresh orange paint, side view", "Porsche shell in fresh paint", 1133, 823],
  ["mercedes-pagoda-and-r107-sl-in-workshop", "White Mercedes Pagoda and blue R107 SL side by side", "Pagoda and R107 SL", 1200, 503],
];
const pairs = [
  ["blue-bmw-m4-front-end-stripped-for-repair", "Blue BMW M4 with front end stripped for repair", "blue-bmw-m4-finished-repair", "Blue BMW M4 finished after repair", "BMW M4: front end stripped, then finished."],
  ["pagoda-body-masked-in-primer-in-spray-booth", "Pagoda body in primer, masked in the spray booth", "pagoda-body-in-fresh-brown-paint", "Pagoda body in fresh brown paint", "Mercedes Pagoda: in primer, then in colour."],
];
const vehicleBrands = ["Chery","Ford","GWM","Haval","Honda","Hyundai","Isuzu","Jaecoo","Jetour","Kia","Mahindra","Mazda","Nissan","Omoda","Opel","Renault","Suzuki","Toyota"];
const insurers = ["Absa iDirect","Auto & General","Bidvest","Budget Insurance","Discovery Insure","Hollard","Hollard Warranties","Old Mutual iWYZE","MiWay","Momentum Insure","OUTsurance","Santam"];
const slug = (n) => n.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// Logo strip that slides sideways forever. dir "ltr" = left to right, "rtl" = right to left.
const marquee = (names, prefix, dir) => {
  const set = (hidden) => names.map((n) => `<li${hidden ? ' aria-hidden="true"' : ""}><img src="/assets/img/${prefix}-${slug(n)}.webp" alt="${hidden ? "" : n + " logo"}" width="180" height="180" loading="lazy" decoding="async"></li>`).join("");
  return `<div class="marquee ${dir}"><ul class="marquee-track">${set(false)}${set(true)}</ul></div>`;
};
const areas = ["Elfindale", "Diep River", "Ottery", "Plumstead", "Wynberg", "Southfield", "Heathfield", "Bergvliet", "Retreat", "Constantia"];

// ---------- Shared parts ----------
const nav = [["Home", "/", "home"], ["Services", "/services/", "services"], ["Projects", "/projects/", "projects"]];
function header(cur) {
  const items = nav.map(([label, href, key]) => {
    const on = cur === key ? ' aria-current="page"' : "";
    return `<li><a href="${href}"${on}><span>${label}</span></a></li>`;
  }).join("");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="header"><div class="wrap">
  <a class="brand" href="/" aria-label="${B.name} home"><img src="/assets/img/coetzees-auto-coachworks-logo-mark.png" alt="" width="67" height="44"><span class="brand-name">Coetzee's Auto Coachworks<small>COLLISION REPAIR CENTRE</small></span></a>
  <nav class="nav" id="nav" aria-label="Main menu"><ul>${items}<li><a class="btn nav-cta" href="/contact/">Get a quote</a></li></ul></nav>
  <a class="head-phone" href="${TEL}" aria-label="Call ${B.phone}">${I.phone}<span>${B.phone}</span></a>
  <a class="btn" href="/contact/"${cur === "contact" ? ' aria-current="page"' : ""}>Get a quote</a>
  <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
</div></header>`;
}
const finalCta = (h = "Ready for a quote?", p = "Send us a few photos on WhatsApp or give the workshop a call. We'll tell you what it needs.") => `
<section class="final"><div class="wrap">
  <h2>${h}</h2><p>${p}</p>
  <div class="btn-row" style="justify-content:center"><a class="btn btn-white" href="/contact/">Get a quote</a><a class="btn btn-ghost" href="${TEL}">${I.phone}Call ${B.phone}</a></div>
</div></section>`;
const footer = () => `
<footer class="footer"><div class="wrap">
  <div class="foot-grid">
    <div>
      <div class="foot-brand"><img src="/assets/img/coetzees-auto-coachworks-logo-mark.png" alt="" width="67" height="44" loading="lazy"><b>Coetzee's Auto Coachworks</b></div>
      <p>Family-run panel beaters and spray painters in Cape Town. All makes, classics included.</p>
      <div class="social">
        <a href="${B.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
        <a href="${B.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
        <a href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
      </div>
    </div>
    <div><h2>Quick links</h2><ul>
      <li><a href="/">Home</a></li><li><a href="/services/">Services</a></li><li><a href="/projects/">Projects</a></li>
      <li><a href="/reviews/">Reviews</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/contact/">Contact / quote</a></li>
    </ul></div>
    <div><h2>Services</h2><ul>
      ${services.map((s) => `<li><a href="/services/#${s.slug}">${s.short}</a></li>`).join("")}
    </ul><h2 style="margin-top:24px">Legal</h2><ul><li><a href="/privacy/">Privacy notice (POPIA)</a></li></ul></div>
    <div><h2>Contact</h2><ul>
      <li><a href="${TEL}">${B.phone}</a></li>
      <li><a href="${WA}" target="_blank" rel="noopener">WhatsApp ${B.waDisplay}</a></li>
      <li><a href="mailto:${B.email}">${B.email}</a></li>
      <li style="padding:5px 0">${B.street},<br>${B.suburb},<br>${B.city}, ${B.code}</li>
      <li style="padding:5px 0">Mon–Fri 08:00–17:30</li>
      <li style="padding:5px 0">VAT no. ${B.vat}</li>
    </ul></div>
  </div>
  <div class="foot-bottom"><p>© <span>2026</span> ${B.name}. All rights reserved.</p><p>Website by RainbowDigital</p></div>
</div></footer>
<a class="wa-float" href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp us for a quote">${I.wa}</a>
<button class="to-top" type="button" aria-label="Back to top">${I.up}</button>
<div class="callbar"><a href="${TEL}">${I.phone}Call</a><a href="/contact/">Get a quote</a></div>
<div class="cookie" role="region" aria-label="Cookie notice"><div class="wrap"><p>We use cookies for visitor statistics. <a href="/privacy/">Privacy notice</a></p><div><button type="button" class="no" data-choice="no">Decline</button> <button type="button" data-choice="yes">Accept</button></div></div></div>`;

const pageHead = (eyebrow, h1, lead) => `<section class="page-head"><div class="wrap"><span class="eyebrow">${eyebrow}</span><h1>${h1}</h1><p class="lead">${lead}</p></div></section>`;
const reviewCard = ([n, s, t]) => `<article class="review reveal">${stars(s)}<blockquote>“${t}”</blockquote><footer><span class="avatar" aria-hidden="true">${n[0]}</span><span><cite>${n}</cite><small>Google review</small></span></footer></article>`;
const ratingBadge = (href, label) => `<a class="rating-badge" href="${href}"><b>${B.rating}</b>${stars(5).replace('5 out of 5', B.rating + ' out of 5')}<span>${label}</span></a>`;
const faqBlock = (list, id, openFirst = true) => `<div class="faq">${list.map(([q, a], i) => `<div class="faq-item"><h3 style="margin:0;text-transform:none;letter-spacing:0"><button class="faq-q" type="button" aria-expanded="${openFirst && i === 0}" aria-controls="${id}-${i}">${q}<span class="pm"></span></button></h3><div class="faq-a${openFirst && i === 0 ? " open" : ""}" id="${id}-${i}"><p>${a}</p></div></div>`).join("")}</div>`;
const serviceCard = (name, href, im, text) => `<article class="card reveal"><a class="card-img" href="${href}" tabindex="-1" aria-hidden="true">${img(im[0], "", im[2], im[3])}</a><div class="card-body"><h3><a href="${href}">${name}</a></h3><p>${text}</p><a class="arrow-link" href="/contact/" aria-label="Request a quote for ${name.toLowerCase()}">Request a quote ${I.arrow}</a></div></article>`;

const schema = () => JSON.stringify({
  "@context": "https://schema.org", "@type": "AutoRepair", name: B.name, url: B.domain + "/",
  image: B.domain + "/assets/img/coetzees-auto-coachworks-link-preview.jpg", logo: B.domain + "/assets/img/coetzees-auto-coachworks-logo-mark.png",
  telephone: B.phoneIntl, email: B.email, priceRange: "$$",
  address: { "@type": "PostalAddress", streetAddress: `${B.street}, ${B.suburb}`, addressLocality: B.city, addressRegion: B.province, postalCode: B.code, addressCountry: "ZA" },
  areaServed: [{ "@type": "City", name: "Cape Town" }, ...areas.map((a) => ({ "@type": "Place", name: a }))],
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:30" }],
  hasMap: B.google,
});

// ---------- Pages ----------
const pages = [];
const add = (p) => pages.push(p);

add({ path: "/", nav: "home", schema: true,
  title: `Panel beater in Cape Town | ${B.caps}`,
  desc: "Trusted panel beater and spraying business in Cape Town. Accident repair, dent repair, chassis straightening and resprays on all makes. WhatsApp us for a quote.",
  main: `
<section class="hero">
  <div class="hero-text">
    ${img("coetzees-auto-coachworks-workshop-front-cape-town", "", 1139, 574, true)}
    <div class="hero-inner">
      <h1 class="reveal">Panel beater &amp; spray painter in Cape Town</h1>
      <p class="lead reveal" style="--d:.12s">Family-run collision repair in Elfindale. Accident damage, dents and resprays on all makes.</p>
      <ul class="ticks reveal" style="--d:.24s"><li>${I.check}Family-run workshop</li><li>${I.check}All makes of vehicle</li><li>${I.check}Insurance &amp; private repairs</li></ul>
    </div>
  </div>
  <div class="hero-photo">${img("coetzee-family-team-in-the-workshop", "Sean, Cameron and Mark Coetzee standing together in the workshop", 829, 511, true)}</div>
</section>

<section class="section"><div class="wrap split">
  <div>
    <span class="eyebrow">Why choose us</span><h2>A panel shop that treats your car like its own</h2>
    <ul class="reasons">
      <li><span class="ico">${I.family}</span><div><h3>Family-run</h3><p>Mark, Sean and Cameron Coetzee are in the business every day. You deal with the people whose name is on the wall.</p></div></li>
      <li><span class="ico">${I.spray}</span><div><h3>Own spray booth and bench</h3><p>Chassis straightening, panel work and paint all happen under one roof.</p></div></li>
      <li><span class="ico">${I.car}</span><div><h3>Daily drivers to classics</h3><p>Hatchbacks, bakkies and SUVs share the floor with classic Mercedes and Porsches.</p></div></li>
      <li><span class="ico">${I.key}</span><div><h3>Courtesy cars</h3><p>Ask about one of our courtesy cars while yours is in for repair, subject to availability.</p></div></li>
    </ul>
    <div class="btn-row"><a class="btn btn-line" href="/services/">See our services</a><a class="arrow-link" href="/projects/">View our projects ${I.arrow}</a></div>
  </div>
  <div class="photo">${img("panel-shop-floor-with-cars-in-repair", "Bright panel shop floor with a BMW coupé and other cars in repair", 1116, 695)}</div>
</div></section>

<section class="section tint"><div class="wrap">
  <div class="sec-head center"><span class="eyebrow">Services</span><h2>What we do</h2><p class="lead">Everything from a scuffed bumper to a full body restoration, done in one workshop.</p></div>
  <div class="grid-3" data-stagger>
    ${services.map((s) => serviceCard(s.name, `/services/#${s.slug}`, s.img, s.card)).join("")}
    ${extraCards.map((s) => serviceCard(s.name, s.href, s.img, s.card)).join("")}
  </div>
</div></section>
<section class="section logos"><div class="wrap center">
  <span class="eyebrow">Vehicle brands</span><h2>Makes we repair</h2>
  <p class="lead">These and all other makes of vehicle are welcome in our workshop.</p>
</div>${marquee(vehicleBrands, "vehicle-brand", "ltr")}</section>
<section class="section tint"><div class="wrap">
  <div class="sec-head center"><span class="eyebrow">How it works</span><h2>Four steps from damage to done</h2></div>
  <ol class="steps" style="list-style:none;padding:0;margin:0">
    <li><h3>Send photos</h3><p>WhatsApp us pictures of the damage, or bring the car to the workshop.</p></li>
    <li><h3>Get your quote</h3><p>We assess the damage and give you a written quote.</p></li>
    <li><h3>We repair it</h3><p>Panel work, straightening and paint, all done in-house.</p></li>
    <li><h3>Collect your car</h3><p>We check and polish it, then call you to collect.</p></li>
  </ol>
</div></section>

<section class="section logos"><div class="wrap center">
  <span class="eyebrow">Insurance</span><h2>Insurers we deal with</h2>
  <p class="lead">We repair vehicles on insurance claims as well as for private customers.</p>
</div>${marquee(insurers, "insurer", "rtl")}</section>

<section class="band"><div class="wrap">
  <h2>Had a knock? Let's get your car sorted.</h2>
  <div class="btn-row"><a class="btn btn-white" href="${TEL}">${I.phone}Call ${B.phone}</a><a class="btn btn-ghost" href="/contact/">Get a quote</a></div>
</div></section>

<section class="section"><div class="wrap split">
  <div class="photo">${img("mark-coetzee-in-the-workshop", "Mark Coetzee standing in the workshop beside a black Mercedes", 700, 861)}</div>
  <div>
    <span class="eyebrow">About us</span><h2>Run by the Coetzee family</h2>
    <p>Coetzee's Auto Coachworks is a family panel beating and spray painting business with more than 20 years in the trade. For years we worked from Lester Road in Wynberg, and today you'll find us at our collision repair centre in Elfindale.</p>
    <p>We repair accident damage on all makes, and we've built a name for bodywork on classic and sports cars. Whatever comes in, it gets the same care.</p>
    <p class="sig">Mark Coetzee<span>Chief Operations Director</span></p>
  </div>
</div></section>

<section class="section tint"><div class="wrap">
  <div class="sec-head center"><span class="eyebrow">Meet the team</span><h2>The Coetzees</h2></div>
  <div class="team">
    <div class="member">${img("mark-coetzee-chief-operations-director", "Mark Coetzee, Chief Operations Director", 400, 400)}<h3>Mark Coetzee</h3><p>Chief Operations Director</p></div>
    <div class="member">${img("sean-coetzee-administrative-director", "Sean Coetzee, Administrative Director", 400, 400)}<h3>Sean Coetzee</h3><p>Administrative Director</p></div>
    <div class="member">${img("cameron-coetzee-operations-director", "Cameron Coetzee, Operations Director", 400, 400)}<h3>Cameron Coetzee</h3><p>Operations Director</p></div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="sec-head center"><span class="eyebrow">Reviews</span><h2>What our customers say on Google</h2>${ratingBadge("/reviews/", `${B.reviews} Google reviews · read them`)}</div>
  <div class="grid-3" data-stagger>${reviews.slice(0, 3).map(reviewCard).join("")}</div>
</div></section>

<section class="section tint"><div class="wrap center">
  <span class="eyebrow">Service areas</span><h2>Serving Cape Town's southern suburbs</h2>
  <p class="lead" style="margin-bottom:32px">Our workshop is in Elfindale, close to these suburbs. Customers bring cars to us from across Cape Town.</p>
  <ul class="chips">${areas.map((a, i) => `<li${i === 0 ? ' class="main"' : ""}>${a}</li>`).join("")}</ul>
  <p>Not on the list? <a href="${waMsg("Hi, do you take cars from my area? I'm in…")}" target="_blank" rel="noopener">Ask us.</a></p>
</div></section>
${finalCta("Get your car looking right again", "Send us photos of the damage on WhatsApp, or call the workshop for a quote.")}` });

add({ path: "/services/", nav: "services",
  title: `Panel beating services in Cape Town | ${B.caps}`,
  desc: "Accident repair, spray painting, chassis straightening and classic car restoration in Cape Town. See what's included in each and request a quote.",
  main: `${pageHead("Services", "Panel beating &amp; spray painting services in Cape Town", "Four main services, all done in our Elfindale workshop. Here is what each one includes.")}
${services.map((s, i) => `<section class="section${i % 2 ? " tint" : ""}" id="${s.slug}"><div class="wrap">
  <div class="split${i % 2 ? " flip" : ""}">
    <div>
      <span class="eyebrow">${s.short}</span><h2>${s.name}</h2><p class="lead">${s.lead}</p><p>${s.intro}</p>
      <ul class="ticklist">${s.list.map((l) => `<li>${I.check}<span>${l}</span></li>`).join("")}</ul>
      <div class="btn-row"><a class="btn" href="/contact/">Request a quote</a><a class="btn btn-line" href="${waMsg(`Hi, I'd like a quote for ${s.short.toLowerCase()}…`)}" target="_blank" rel="noopener">${I.wa}WhatsApp us</a></div>
    </div>
    <div class="photo">${img(s.img[0], s.img[1], s.img[2], s.img[3], i === 0)}</div>
  </div>
  <div class="photo-row" style="margin-top:48px">${s.photos.map((p) => `<figure>${img(p[0], p[1], p[3], p[4])}<figcaption>${p[2]}</figcaption></figure>`).join("")}</div>
</div></section>`).join("\n")}
${finalCta()}` });

add({ path: "/projects/", nav: "projects",
  title: `Projects | ${B.caps}`,
  desc: "Photos of real panel beating, spray painting and classic car restoration jobs from our Cape Town workshop, with before and after comparisons.",
  main: `${pageHead("Projects", "Panel beating &amp; restoration projects in Cape Town", "Real cars from our own workshop floor. Tap any photo to see it larger.")}
<section class="section"><div class="wrap">
  <div class="gallery">${gallery.map((g) => `<button class="shot" type="button">${img(g[0], g[1], g[3], g[4])}<span>${g[2]}</span></button>`).join("")}</div>
</div></section>
<section class="section tint"><div class="wrap">
  <div class="sec-head center"><span class="eyebrow">Before and after</span><h2>Drag to compare</h2><p class="lead">Slide the handle to see each stage.</p></div>
  <div class="grid-2">${pairs.map((p, i) => `<figure style="margin:0"><div class="ba">
    ${img(p[2], p[3], 800, 600)}<img class="before" src="/assets/img/${p[0]}.webp" alt="${p[1]}" width="800" height="600" loading="lazy" decoding="async">
    <span class="tag l">Before</span><span class="tag r">After</span>
    <input type="range" min="0" max="100" value="50" aria-label="Before and after slider ${i + 1}"><span class="knob">${I.slide}</span>
  </div><figcaption class="ba-cap">${p[4]}</figcaption></figure>`).join("")}</div>
</div></section>
<section class="section"><div class="wrap">
  <div class="sec-head center"><span class="eyebrow">Questions</span><h2>Common questions about our services</h2></div>
  ${services.map((s, i) => `<h3 class="faq-group">${s.short}</h3>${faqBlock(s.faqs, "sf" + i, i === 0)}`).join("")}
</div></section>
<div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer"><button class="lb-btn lb-close" type="button" aria-label="Close">×</button><button class="lb-btn lb-prev" type="button" aria-label="Previous photo">‹</button><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""><p></p><button class="lb-btn lb-next" type="button" aria-label="Next photo">›</button></div>
${finalCta("Want your car in this gallery?", "Tell us about the job and we'll quote you.")}` });

add({ path: "/reviews/", nav: "",
  title: `Reviews | ${B.caps}`,
  desc: `Read customer reviews of ${B.name} in Cape Town. Rated ${B.rating} stars from ${B.reviews} Google reviews.`,
  main: `${pageHead("Reviews", "Customer reviews of our Cape Town panel shop", `Rated ${B.rating} out of 5 from ${B.reviews} reviews on Google. These are some of them, in our customers' own words.`)}
<section class="section"><div class="wrap">
  <div class="sec-head center">${ratingBadge(B.google + '" target="_blank" rel="noopener', `${B.reviews} reviews · see all on Google`)}</div>
  <div class="grid-3" data-stagger>${reviews.map(reviewCard).join("")}</div>
  <div class="center" style="margin-top:56px"><h2>Been to us recently?</h2><p class="lead" style="margin-bottom:24px">A review helps other Capetonians find a panel beater they can trust.</p><a class="btn" href="${B.review}" target="_blank" rel="noopener">Leave a review on Google</a></div>
</div></section>
${finalCta()}` });

add({ path: "/faq/", nav: "",
  title: `FAQ | ${B.caps}`,
  desc: "Answers to common questions about quotes, insurance claims, courtesy cars, repair times and opening hours at our Cape Town panel shop.",
  main: `${pageHead("FAQ", "Panel beating questions, answered", "Quick answers about quotes, insurance, courtesy cars and timing.")}
<section class="section"><div class="wrap">${faqBlock(faqs, "faq")}
  <p class="center" style="margin-top:40px">Something else? <a href="${waMsg("Hi, I have a question about…")}" target="_blank" rel="noopener">Ask us on WhatsApp.</a></p>
</div></section>
${finalCta()}` });

add({ path: "/contact/", nav: "contact", schema: true,
  title: `Get a quote | ${B.caps}`,
  desc: "Get a free panel beating or spray painting quote in Cape Town. WhatsApp, call or visit Coetzee's Auto Coachworks in Elfindale.",
  main: `${pageHead("Contact / quote", "Get a panel beating quote in Cape Town", "Fill in the form and it opens WhatsApp with your details ready to send. Or call, email or visit us.")}
<section class="section"><div class="wrap contact-grid">
  <div>
    <h2>Contact details</h2>
    <ul class="details">
      <li><span class="ico">${I.phone}</span><div><small>Workshop</small><a href="${TEL}">${B.phone}</a></div></li>
      <li><span class="ico" style="color:var(--wa)">${I.wa}</span><div><small>WhatsApp</small><a href="${WA}" target="_blank" rel="noopener">${B.waDisplay}</a></div></li>
      <li><span class="ico">${I.mail}</span><div><small>Email</small><a href="mailto:${B.email}">${B.email}</a></div></li>
      <li><span class="ico">${I.pin}</span><div><small>Workshop address</small>${address}</div></li>
    </ul>
    <h3>${"Opening hours"}</h3>
    <table class="hours"><tbody>${B.hours.map(([d, t]) => `<tr><td>${d}</td><td>${t}</td></tr>`).join("")}</tbody></table>
  </div>
  <div>
  <form class="form" id="quote-form">
    <h2>Request a free quote</h2>
    <div class="field-2">
      <div class="field"><label for="q-name">Name</label><input id="q-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="q-phone">Phone</label><input id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div>
    </div>
    <div class="field"><label for="q-suburb">Suburb</label><input id="q-suburb" name="suburb" autocomplete="address-level2" required></div>
    <div class="field"><label for="q-job">What needs doing?</label><textarea id="q-job" name="job" required placeholder="Make and model, and what happened"></textarea></div>
    <div class="field"><label for="q-photo">Photo of the damage</label><input id="q-photo" name="photo" type="file" accept="image/*" multiple><p class="hint">Choose your photos here as a reminder, then attach them in WhatsApp when it opens.</p></div>
    <button class="btn" type="submit">${I.wa}Get my free quote</button>
    <p class="form-msg" role="status" aria-live="polite"></p>
  </form>
  <div class="gmap">
    <iframe src="${B.mapEmbed}" title="Google Map showing ${B.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    <div class="gmap-foot"><p><strong>${B.name}</strong><br>${address}</p><a class="btn btn-line" href="${B.maps}" target="_blank" rel="noopener">${I.pin}Get directions</a></div>
  </div>
  </div>
</div></section>
<section class="section tint"><div class="wrap">
  <div class="book"><div><h2>Book a drop-off time</h2><p>Pick a time that suits you to bring your car in for an assessment.</p></div>
  <a class="btn" href="${B.calendly || waMsg("Hi, I'd like to book a time to bring my car in for an assessment…")}" target="_blank" rel="noopener">Book online</a></div>
</div></section>
${finalCta("Prefer to talk it through?", "Call the workshop and we'll help you over the phone.")}` });

add({ path: "/privacy/", nav: "",
  title: `Privacy notice | ${B.caps}`,
  desc: "How Coetzee's Auto Coachworks collects, uses and protects your personal information under POPIA.",
  main: `${pageHead("Legal", "Privacy notice", "How we handle your personal information under the Protection of Personal Information Act (POPIA).")}
<section class="section"><div class="wrap prose">
  <h2 style="margin-top:0">What we collect</h2>
  <p>When you ask for a quote we receive the details you send us: your name, phone number, suburb, a description of the job and any photos. The quote form on this website does not store these details. It opens WhatsApp on your device with a ready message, and you choose whether to send it.</p>
  <h2>How we use it</h2>
  <ul><li>To prepare your quote and contact you about it</li><li>To carry out and invoice the repair</li><li>To deal with your insurer if you ask us to</li></ul>
  <p>We do not sell your information or use it for marketing without your consent.</p>
  <h2>Cookies and statistics</h2>
  <p>If you press "Accept" on the cookie notice, we use Google Analytics to count visits to this website. If you decline, no analytics cookies are set. The map on our contact page is provided by Google Maps, which may set its own cookies.</p>
  <h2>Your rights</h2>
  <p>You may ask to see, correct or delete the personal information we hold about you. Contact us at <a href="mailto:${B.email}">${B.email}</a> or ${B.phone}. You may also lodge a complaint with the Information Regulator of South Africa.</p>
  <h2>Who we are</h2>
  <p>${B.name}, ${address}.</p>
</div></section>
${finalCta()}` });

add({ path: "/404.html", nav: "", noindex: true,
  title: `Page not found | ${B.caps}`,
  desc: "This page could not be found.",
  main: `<section class="page-head center" style="padding:120px 0"><div class="wrap"><span class="eyebrow">Error 404</span><h1>This page has left the workshop</h1><p class="lead">The page you were looking for isn't here. Let's get you back on the road.</p><div class="btn-row" style="margin-top:28px"><a class="btn" href="/">Back to home</a><a class="btn btn-line" href="/contact/">Get a quote</a></div></div></section>` });

// ---------- Render ----------
const siteCfg = `<script>window.SITE=${JSON.stringify({ wa: B.wa, ga: B.ga })}</script>`;
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Public+Sans:wght@400;600;700&display=swap" rel="stylesheet">`;
const body = (p) => `${header(p.nav)}\n<main id="main">${p.main}\n</main>${footer()}`;
function render(p) {
  const url = B.domain + (p.path === "/404.html" ? "/" : p.path);
  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="geo.region" content="ZA-WC"><meta name="geo.placename" content="Cape Town">
<meta property="og:type" content="website"><meta property="og:locale" content="en_ZA"><meta property="og:site_name" content="${B.name}">
<meta property="og:title" content="${p.title}"><meta property="og:description" content="${p.desc}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${B.domain}/assets/img/coetzees-auto-coachworks-link-preview.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#123C8C">
<link rel="icon" type="image/png" href="/assets/favicon.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
${fonts}
<link rel="stylesheet" href="/assets/css/style.css">
${p.schema ? `<script type="application/ld+json">${schema()}</script>` : ""}
</head>
<body>
${body(p)}
${siteCfg}
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}
for (const p of pages) {
  const file = p.path.endsWith(".html") ? p.path : p.path + "index.html";
  const full = path.join(OUT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, render(p));
}
const indexable = pages.filter((p) => !p.noindex);
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((p) => `  <url><loc>${B.domain}${p.path}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${B.domain}/sitemap.xml\n`);

// ---------- preview.html: all pages + photos in one file (for viewing without a server) ----------
const imgDir = path.join(OUT, "assets/img"), IMG = {};
for (const f of fs.readdirSync(imgDir)) {
  if (/link-preview/.test(f)) continue;
  const mime = f.endsWith(".png") ? "image/png" : "image/webp";
  IMG[f] = `data:${mime};base64,${fs.readFileSync(path.join(imgDir, f)).toString("base64")}`;
}
const P = {}; for (const p of pages) P[p.path] = { t: p.title, b: body(p) };
const safe = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
fs.writeFileSync(path.join(OUT, "preview.html"), `<!doctype html>
<html lang="en-ZA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${pages[0].title}</title>
${fonts}
<style>${fs.readFileSync(path.join(OUT, "assets/css/style.css"), "utf8")}</style>
</head><body><div id="app"></div>
${siteCfg}
<script>${fs.readFileSync(path.join(OUT, "assets/js/site.js"), "utf8")}</script>
<script>
var IMG=${safe(IMG)},PAGES=${safe(P)};
function go(p,top){var id=p.split("#")[1];p=p.split("#")[0];var pg=PAGES[p]||PAGES["/404.html"];
  document.getElementById("app").innerHTML=pg.b.replace(/\\/assets\\/img\\/([\\w.-]+)/g,function(m,f){return IMG[f]||m});
  document.title=pg.t;window.initSite();if(id&&document.getElementById(id))document.getElementById(id).scrollIntoView();else if(top!==false)window.scrollTo(0,0);}
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href^='/']");if(!a)return;e.preventDefault();location.hash=a.getAttribute("href");});
window.addEventListener("hashchange",function(){var h=location.hash.slice(1);if(!h||h[0]==="/")go(h||"/")});
go(location.hash[1]==="/"?location.hash.slice(1):"/",false);
</script></body></html>
`);
console.log(`Built ${pages.length} pages + sitemap, robots, preview.html (${(fs.statSync(path.join(OUT, "preview.html")).size / 1048576).toFixed(1)} MB)`);

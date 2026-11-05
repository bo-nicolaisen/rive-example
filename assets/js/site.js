/*
 * ============================================================
 *  RIVE-TERMOMETER STYRET AF EN SLIDER
 * ============================================================
 *
 *  Idéen:
 *  Filen therm.riv er lavet i Rive (rive.app). Inde i filen findes en
 *  "View Model" der hedder ViewModel1. Den har én variabel (en
 *  "property") der hedder gaugeHeight.
 *
 *  I Rive-editoren er højden på rektanglet "gauge" bundet (data binding)
 *  til gaugeHeight. Det betyder:
 *
 *      Ændrer vi gaugeHeight  →  ændrer rektanglets højde sig automatisk
 *
 *  Så vores JavaScript skal kun gøre én ting: skrive et tal ind i
 *  gaugeHeight, hver gang brugeren flytter slideren.
 *
 *      slider (HTML)  →  JavaScript  →  gaugeHeight (Rive)  →  rektangel
 *
 *  Bemærk: variablen "rive" (med lille r) kommer fra scriptet vi henter
 *  fra unpkg.com i index.html. Derfor skal det script indlæses FØR denne
 *  fil – det sørger rækkefølgen af <script>-tags og "defer" for.
 */


/* ------------------------------------------------------------
 *  1. Find HTML-elementerne vi skal bruge
 * ------------------------------------------------------------
 *  getElementById finder et element ud fra dets id="..." i HTML'en.
 *  Vi gemmer dem i konstanter, så vi ikke skal lede efter dem igen.
 */
const canvas = document.getElementById("therm-canvas"); // tegnefladen Rive tegner på
const slider = document.getElementById("gauge-slider"); // <input type="range">
const output = document.getElementById("gauge-value");  // viser tallet ved siden af slideren


/* ------------------------------------------------------------
 *  2. Indlæs Rive-filen
 * ------------------------------------------------------------
 *  new rive.Rive({...}) opretter en Rive-animation. Vi giver den et
 *  objekt med indstillinger (et "options-objekt"):
 */
const therm = new rive.Rive({
  // Stien til .riv-filen (relativ til index.html)
  src: "assets/img/therm.riv",

  // Hvilket <canvas> der skal tegnes på
  canvas: canvas,

  // Start animationen med det samme
  autoplay: true,

  // Navnet på state machinen i Rive-filen.
  // VIGTIGT: data binding opdaterer kun mens en state machine kører.
  // Uden denne linje ville rektanglet ikke reagere på slideren.
  stateMachine: "State Machine 1",

  // autoBind: true forbinder automatisk artboardet til den View Model
  // (ViewModel1) der er valgt som standard i Rive-filen.
  // Så kan vi bagefter få fat i den via therm.viewModelInstance.
  autoBind: true,

  /* --------------------------------------------------------
   *  3. Når filen er færdig med at loade
   * --------------------------------------------------------
   *  Det tager lidt tid at hente .riv-filen over netværket.
   *  Derfor kan vi IKKE bruge den med det samme. I stedet giver vi
   *  Rive en funktion (et "callback"), som den kalder når filen er klar.
   *  Alt der handler om View Model'en skal derfor stå herinde.
   */
  onLoad: () => {
    // Får canvas'et til at tegne skarpt på skærme med høj opløsning
    // (fx Retina-skærme), hvor 1 CSS-pixel = flere fysiske pixels.
    therm.resizeDrawingSurfaceToCanvas();

    // Hent "number"-variablen gaugeHeight fra View Model'en.
    // Navnet skal stavet PRÆCIS som i Rive (store/små bogstaver tæller).
    // Vi får et objekt tilbage – selve tallet ligger i gaugeHeight.value
    const gaugeHeight = therm.viewModelInstance.number("gaugeHeight");

    // Sæt slideren til den værdi filen blev gemt med, så slider og
    // termometer passer sammen fra start.
    slider.value = gaugeHeight.value;
    output.textContent = Math.round(gaugeHeight.value);

    /* ------------------------------------------------------
     *  4. Lyt efter når brugeren flytter slideren
     * ------------------------------------------------------
     *  "input"-eventet fyrer løbende MENS man trækker.
     *  (Eventet "change" ville først fyre når man slipper musen.)
     */
    slider.addEventListener("input", () => {
      // slider.value er altid en tekst (string), fx "120".
      // Number() laver den om til et rigtigt tal: 120
      const value = Number(slider.value);

      // Her sker magien: vi skriver tallet ind i Rive.
      // Rive opdaterer selv rektanglets højde på næste frame.
      gaugeHeight.value = value;

      // Vis tallet ved siden af slideren
      output.textContent = value;
    });
  },

  // Hvis filen ikke kan loades (forkert sti, ingen server osv.)
  // skriver vi en fejl i konsollen (F12 → Console).
  onLoadError: (err) => console.error("Kunne ikke indlæse therm.riv", err),
});


/* ------------------------------------------------------------
 *  5. Hold tegningen skarp når vinduet ændrer størrelse
 * ------------------------------------------------------------
 *  Canvas'et skalerer med vinduet (se CSS), så vi beder Rive om at
 *  tilpasse sin tegneflade igen hver gang vinduet ændres.
 */
window.addEventListener("resize", () => therm.resizeDrawingSurfaceToCanvas());


/*
 * ============================================================
 *  PRØV SELV
 * ============================================================
 *  - Åbn konsollen (F12) og skriv:  therm.viewModelInstance.number("gaugeHeight").value = 50
 *    Hvad sker der? (Bemærk at slideren IKKE flytter sig – hvorfor ikke?)
 *  - Lav en knap der sætter termometeret til maksimum.
 *  - Lad termometeret stige langsomt af sig selv med setInterval().
 *  - Lav en ny number-property i Rive (fx til farve eller rotation)
 *    og styr den med en slider nr. 2.
 */

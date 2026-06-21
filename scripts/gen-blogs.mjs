import { nanoid } from "nanoid";
import { writeFileSync } from "node:fs";

// ---- portable text helpers -------------------------------------------------
const span = (text, marks = []) => ({ _type: "span", _key: nanoid(8), text, marks });

const para = (text) => ({
  _type: "block",
  _key: nanoid(8),
  style: "normal",
  markDefs: [],
  children: [span(text)],
});

// paragraph with a bold lead-in: "Lead." rest
const lead = (boldText, rest) => ({
  _type: "block",
  _key: nanoid(8),
  style: "normal",
  markDefs: [],
  children: [span(boldText, ["strong"]), span(rest)],
});

const heading = (style, text) => ({
  _type: "block",
  _key: nanoid(8),
  style,
  markDefs: [],
  children: [span(text)],
});
const h2 = (t) => heading("h2", t);
const h3 = (t) => heading("h3", t);

const quote = (text) => ({
  _type: "block",
  _key: nanoid(8),
  style: "blockquote",
  markDefs: [],
  children: [span(text)],
});

const li = (text, listItem) => ({
  _type: "block",
  _key: nanoid(8),
  style: "normal",
  listItem,
  level: 1,
  markDefs: [],
  children: [span(text)],
});
const ul = (items) => items.map((t) => li(t, "bullet"));
const ol = (items) => items.map((t) => li(t, "number"));

// build a body from a flat list, ul()/ol() return arrays so we flatten
const body = (...nodes) => nodes.flat();

// ---------------------------------------------------------------------------
// POSTS
// ---------------------------------------------------------------------------
const posts = [
  {
    _id: "post-denim-hardware-guide",
    title: "Denim Hardware Explained: Jeans Buttons, Rivets, and Burrs",
    slug: "denim-hardware-guide-buttons-rivets",
    publishedAt: "2026-04-22T09:00:00.000Z",
    body: body(
      para(
        "On a finished pair of jeans, the hardware is the first thing a customer touches and the last thing most brands specify properly. The waistband button, the rivets at the pocket corners, and the burrs hidden inside the fly all do quiet structural work, and they also set the tone for how premium the garment feels. Getting them right is a mix of engineering and branding. This guide breaks down the main pieces, how they attach, and the details worth writing into your tech pack."
      ),
      h2("The tack button"),
      para(
        "The waistband fastener on jeans is a tack button, also called a jeans button or shank button. Unlike a sew-through button, it is attached mechanically. A metal tack is pushed through the fabric from the back and locked into the button head from the front under press pressure, so there is no thread to fail. The standard size sits around 17mm across the face, though brands scale this up or down to match the weight of the denim and the look they want."
      ),
      para(
        "Two parts matter here. The button head carries your branding, whether that is an engraved logo, a raised emblem, or a plain dome. The tack, or the post behind it, has to be the correct length for the number of fabric layers at the waistband. Too short and it will not seat properly, too long and it can bend or sit proud of the surface. Always confirm the tack length against the actual stacked thickness at the closure, not the single-layer fabric weight."
      ),
      h2("Rivets: cap versus burr"),
      para(
        "Rivets reinforce the points on a pair of jeans that take the most strain, which is why Jacob Davis and Levi Strauss patented the idea back in 1873. They appear at the front pocket corners and often at the base of the fly. There are two constructions you will specify most often."
      ),
      ul([
        "Cap rivet: a two-piece rivet with a decorative cap on the outside and a post on the inside. It gives a clean, finished face and is the usual choice for premium denim because the visible side can carry a logo or a polished finish.",
        "Burr rivet: a simpler design where a post is set against a washer, or burr, on the reverse. It is functional and economical, and is often used where the rivet is less visible.",
      ]),
      para(
        "The shank, meaning the metal post that joins the front of the rivet to the back, has to match the fabric stack just like a tack button. Pocket corners can pile up several layers of denim plus seam allowance, so the post needs enough length to set firmly without crushing the cloth or leaving a sharp edge against the body."
      ),
      h2("Materials and finishes"),
      para(
        "Most denim hardware is made from brass, copper, or zinc alloy, then plated and coated to hit a target colour and durability. Common finishes include raw or antique brass, nickel, gunmetal, black oxide, and painted or coated colours that are matched to a wash. The finish is not only cosmetic. It governs how the hardware ages, how it resists corrosion through wash cycles, and whether it stays within skin-contact safety limits."
      ),
      para(
        "If a garment will be sold in the EU or tested to OEKO-TEX limits, the plating has to control nickel release on any part that touches skin. This is a real constraint on the waistband button in particular, so it belongs in the spec rather than being treated as an afterthought."
      ),
      h2("Matching hardware to the wash"),
      para(
        "Denim is rarely sold raw. It is washed, and the hardware goes through the laundry with the garment. A finish that looks perfect on a sample board can dull, spot, or shift colour after enzyme and stone wash cycles. The reliable way to avoid surprises is to run the actual hardware through the actual wash recipe on a sample before bulk, and to approve the aged result rather than the bright original. A finish chosen to age gracefully often reads as more premium than one that tries to stay shiny."
      ),
      h2("What to put in the tech pack"),
      para(
        "Vague hardware callouts are where quality problems start. A supplier can only match what is written down. For each piece, specify the following."
      ),
      ul([
        "Component and position: tack button at centre front waistband, cap rivets at front pocket corners, and so on.",
        "Diameter: face size of the button and cap diameter of the rivet, in millimetres.",
        "Base material and finish: for example zinc alloy with antique brass plating.",
        "Tack or post length, checked against the real fabric stack at that position.",
        "Logo treatment: engraved, embossed, debossed, or plain, with artwork attached.",
        "Compliance target: OEKO-TEX STANDARD 100 or nickel-release tested, where the market requires it.",
        "Wash approval: hardware signed off after the production wash, not before.",
      ]),
      para(
        "Hardware is a small share of the bill of materials and an outsized share of how a garment is judged on the shelf. Specifying it with the same care as the fabric is one of the cheapest ways to lift perceived quality. If you are building a denim program and want help translating a design into a buildable hardware spec, our team works with brands on exactly this, from sampling through to washed approval."
      )
    ),
  },

  {
    _id: "post-zipper-types-guide",
    title: "Metal, Coil, or VISLON: How to Choose the Right Zipper",
    slug: "choosing-zippers-metal-coil-molded",
    publishedAt: "2026-05-04T09:00:00.000Z",
    body: body(
      para(
        "A zipper is the most mechanical part of most garments, and it is also the part most likely to generate a return when it fails. Choosing one is not just picking a colour off a card. It means matching the element type, the size, and the finish to how the garment will actually be used. This guide covers the three main zipper families, the anatomy you need to understand the spec, and a simple way to decide which to use."
      ),
      h2("Anatomy of a zipper"),
      para(
        "Before comparing types, it helps to share a vocabulary. Every zipper is built from the same handful of parts, and most spec arguments are really about one of them."
      ),
      ul([
        "Tape: the fabric edges the elements are attached to, sewn into the garment seam.",
        "Elements, or teeth: the interlocking parts that open and close. Their material defines the zipper family.",
        "Slider: the piece that moves to engage or separate the elements.",
        "Pull, or puller: the tab on the slider that the user grips. This is a branding opportunity as much as a functional part.",
        "Top and bottom stops: the hardware that keeps the slider on the chain. A closed-end zipper has a fixed bottom stop, an open-end zipper, used on jackets, separates fully with a box and pin.",
      ]),
      h2("Metal zippers"),
      para(
        "Metal is the original and the most rugged-looking option. The teeth are individual pieces of metal, usually brass, nickel, or aluminium, clamped onto the tape. Metal zippers carry a heritage, workwear association that suits jeans, denim jackets, leather goods, and premium outerwear. They are strong and they age with character. The trade-offs are weight, less flexibility, and a higher cost, and like all metal trims that touch skin they need attention to nickel release for regulated markets."
      ),
      h2("Coil zippers"),
      para(
        "A coil zipper uses a continuous spiral of polyester or nylon as its elements, stitched to the tape. It is the softest and most flexible of the three, which is why it is the default for women's ready-to-wear, dresses, skirts, lightweight trousers, and any curved seam. Coil is light, quiet, self-healing to a degree if a tooth is knocked out of line, and economical at volume. It is less suited to applications that demand maximum strength or a heavy industrial look."
      ),
      h2("Molded plastic zippers"),
      para(
        "Molded plastic zippers, often known by the VISLON brand name, are made by injecting individual plastic teeth directly onto the tape. They are strong, light, and corrosion resistant, which makes them a favourite for outdoor gear, sportswear, technical jackets, and luggage where moisture and weight both matter. They give a chunky, sporty appearance that many activewear brands want, and they avoid the cold feel and weight of metal while keeping a bold tooth profile."
      ),
      h2("How to choose"),
      para("A quick way to narrow it down is to start from the garment and the use case."),
      ul([
        "Jeans, denim jackets, workwear, leather goods: metal, for strength and heritage looks.",
        "Dresses, skirts, blouses, tailored trousers, curved seams: coil, for softness and flexibility.",
        "Outerwear shells, sportswear, bags, technical pieces: molded plastic, for a light, weatherproof, sporty build.",
      ]),
      h3("Size and gauge"),
      para(
        "Zippers are graded by a number such as 3, 5, or 8 that roughly reflects the width of the closed chain in millimetres. A larger number means larger teeth and more strength. A number 3 suits light dresses and skirts, a number 5 is a versatile middle ground for trousers and light jackets, and a number 8 or above is for heavy jackets, outerwear, and bags. Specifying the gauge is as important as the type."
      ),
      h3("Finish, slider, and puller"),
      para(
        "Within each family you still choose a finish for the elements and slider, an auto-lock or non-lock slider depending on whether the zipper should stay put under tension, and a puller style. The puller is the most visible branding surface on the whole zipper, so a custom puller or an engraved slider is a cheap way to reinforce identity."
      ),
      h2("Quality checks before bulk"),
      para(
        "Whatever type you choose, a few checks separate a reliable zipper from a warranty problem. Cycle the slider open and closed many times to confirm smooth travel, pull the closed chain apart laterally to test holding strength, and run the zipper through the garment wash to confirm the finish survives. For metal and molded types, confirm the box and pin on open-end zippers align cleanly so the user is not fighting the closure every morning."
      ),
      para(
        "Most zipper failures trace back to a mismatch between the element type and how the garment is used, or to skipping a wash test. Decide the type from the use case, lock the gauge and finish, and approve a washed sample. If you want a second opinion on a zipper spec or need a reliable supply across metal, coil, and molded types, our team can help you match the closure to the product."
      )
    ),
  },

  {
    _id: "post-garment-trims-guide",
    title: "What Are Garment Trims? A Sourcing Guide for Apparel Brands",
    slug: "garment-trims-guide-for-apparel-brands",
    publishedAt: "2026-05-15T09:00:00.000Z",
    body: body(
      para(
        "Ask most people what a garment is made of and they will say fabric. Ask a production manager and they will start listing trims. Trims are every component of a finished piece of clothing that is not the main fabric or the lining, and they cover everything from the zipper to the care label. They are a small line on the cost sheet and a large part of whether a garment works, sells, and lasts. This guide explains what counts as a trim, the main families, and why they deserve more attention than they usually get."
      ),
      h2("Functional trims versus branding trims"),
      para(
        "It helps to split trims into two jobs, because the two are sourced and judged differently."
      ),
      ul([
        "Functional trims hold the garment together and make it work: zippers, buttons, rivets, hooks, snaps, elastic, drawcords, and sewing thread. If these fail, the garment fails.",
        "Branding and finishing trims tell the customer whose product they are holding and how to care for it: woven labels, leather and PU patches, hang tags, size tabs, and printed care and content labels.",
      ]),
      para(
        "Many trims do both jobs at once. A jeans button is a fastener and a logo. A zipper puller is a closure part and a branding surface. The best trim decisions treat function and branding as one problem rather than two."
      ),
      h2("The main families of trims"),
      h3("Closures and fasteners"),
      para(
        "This is the engineering core: zippers in metal, coil, and molded plastic, tack buttons and rivets for denim, sew-through buttons, snaps, hooks and bars, and buckles. These take mechanical stress and they touch skin, so they carry both durability and compliance requirements."
      ),
      h3("Labels and patches"),
      para(
        "Woven labels, printed labels, leather and PU patches, and hang tags. These carry the brand, the size, the country of origin, and legally required care and fibre content information. They are also where a lot of perceived quality lives, because a customer reads them up close."
      ),
      h3("Metal trims and plates"),
      para(
        "Buckles, eyelets, D-rings, metal plates, and decorative hardware. Like fasteners, anything metal that touches skin needs to meet nickel-release and heavy-metal limits in regulated markets."
      ),
      h3("Threads, elastics, and tapes"),
      para(
        "The least glamorous and among the most important. Sewing thread strength and colour fastness, elastic recovery, and waistband or binding tapes all decide how a garment holds up after the customer takes it home and washes it."
      ),
      h2("Why trims punch above their weight"),
      para(
        "Trims are usually a single-digit percentage of a garment's material cost, yet they drive an outsized share of returns and of how premium a product feels. A customer rarely returns a shirt because the cotton was slightly off. They return it because the button popped, the zipper jammed, or the print on the care label washed away. On the upside, a well-chosen leather patch or a custom zipper puller can lift a mid-price garment into a higher perceived tier for very little added cost. Trims are where small money makes big differences in both directions."
      ),
      h2("The case for consolidating trims"),
      para(
        "Brands often buy fabric from one place and then scatter their trim orders across many small suppliers. That feels flexible but it creates hidden cost: many minimum order quantities to hit, many sets of lead times to track, inconsistent compliance documentation, and colour matching that drifts across vendors. Consolidating trims with a single capable supplier, or a small group of them, tends to mean fewer purchase orders, one colour standard across components, aligned delivery, and one compliance trail to audit."
      ),
      h2("Do not treat compliance as separate"),
      para(
        "Because trims include almost everything that touches skin and almost everything that carries a dye or a plating, they are where most chemical and metal compliance risk sits. OEKO-TEX STANDARD 100 certification has to be earned component by component, and metal trims have to control nickel release. Building compliance into how you source trims, rather than checking it at the end, saves a great deal of last-minute panic before shipment."
      ),
      para(
        "Trims reward brands that take them seriously. They are the difference between a garment that survives the customer's washing machine and one that does not, and between a product that feels cheap and one that feels considered. If you are building or tidying up a trims program across closures, labels, patches, and hardware, our team supplies and develops the full range, with compliance documentation, for denim and fashion brands."
      )
    ),
  },

  {
    _id: "post-compliant-trims-guide",
    title: "Compliant Trims: OEKO-TEX, REACH, and Nickel Release Explained",
    slug: "compliant-apparel-trims-oeko-tex-reach-nickel",
    publishedAt: "2026-05-27T09:00:00.000Z",
    body: body(
      para(
        "Compliance in apparel is often discussed at the fabric level, but a large share of the real risk sits in the trims. Metal that touches skin, dyes on a woven label, coatings on a buckle, and platings on a zipper all carry chemical and heavy-metal exposure. A single non-compliant button can hold up an entire shipment at customs or trigger a recall. This guide explains the three frameworks brands hit most often, OEKO-TEX, REACH, and nickel release, and what to ask a supplier for so you are covered."
      ),
      h2("Why trims are a compliance hotspot"),
      para(
        "Trims concentrate exactly the materials regulators care about. Metal fasteners and hardware can release nickel, lead, or cadmium. Coloured labels and patches can carry restricted azo dyes or formaldehyde in finishes. Coatings and adhesives can contain restricted phthalates or other substances of concern. Because trims are small and bought from many vendors, they are also the components most likely to slip through a brand's testing program. That combination, high risk and low visibility, is why trims deserve dedicated compliance attention."
      ),
      h2("OEKO-TEX STANDARD 100"),
      para(
        "OEKO-TEX STANDARD 100 is a globally recognised testing and certification system that checks textile and trim materials for harmful substances. It tests against a long list that includes banned azo colorants, formaldehyde, pentachlorophenol, cadmium, lead, and extractable nickel, and it aligns its limits with major regulations including the REACH restricted-substance and candidate lists."
      ),
      lead(
        "The detail that catches brands out: ",
        "to make a STANDARD 100 claim on a finished garment, each component has to be tested and certified, not just the main fabric. That means your buttons, zippers, labels, and patches each need to sit within the limits. A certificate on the fabric alone does not cover the trims, so ask each trim supplier for their own certification or test evidence."
      ),
      h2("REACH"),
      para(
        "REACH is the European Union regulation that governs chemicals in products sold into the EU. For trims, two parts matter most. Annex XVII lists restrictions on specific substances and the maximum amounts allowed in articles, covering things like certain azo dyes, cadmium, lead, and nickel release. The SVHC candidate list, maintained by ECHA, names substances of very high concern that carry communication and, above certain thresholds, notification duties. If you sell into Europe, your trims need to respect both, and your supplier should be able to show test reports that demonstrate it."
      ),
      h2("Nickel release"),
      para(
        "Nickel is singled out because prolonged skin contact with items that release too much of it causes allergic reactions in a meaningful share of the population. The relevant control limits how much nickel an item can release over time, tested by a standard method commonly cited as EN 1811, and it applies to articles intended to be in direct and prolonged contact with the skin."
      ),
      para(
        "For apparel that means the parts most people forget: the jeans waistband button that presses against the stomach, rivets, buckles, hooks, and the metal of a zipper. Specifying nickel-safe plating on these contact points from the start is far cheaper than discovering a failure after bulk production. Where skin contact is genuine and prolonged, treat nickel release as a non-negotiable line in the spec."
      ),
      h2("Other restrictions worth knowing"),
      para("Beyond the three big frameworks, a handful of substances come up repeatedly in trim testing."),
      ul([
        "Lead and cadmium in metal hardware, paints, and coatings, restricted in most major markets and specifically limited for children's products.",
        "Phthalates in plasticised prints, coated patches, and some PU components.",
        "Azo dyes that can release restricted aromatic amines, relevant to dyed labels, tapes, and threads.",
        "Formaldehyde in resin finishes on labels and fabrics.",
      ]),
      h2("What to ask your supplier for"),
      para(
        "Compliance is only real if it is documented. For each trim, ask for the paperwork before you commit to bulk, not after."
      ),
      ol([
        "A current OEKO-TEX STANDARD 100 certificate or equivalent test report for that specific component.",
        "Test results showing nickel release within limits for any metal part in skin contact.",
        "Confirmation of REACH compliance, including Annex XVII restricted substances and the SVHC list, for goods sold into the EU.",
        "Test reports tied to the actual material and finish you are buying, not a generic example.",
        "A named contact who can answer compliance questions and reissue documents when a market's limits change.",
      ]),
      para(
        "The brands that avoid compliance fire drills are the ones that build these requirements into the trim spec and the supplier conversation from day one. Metro Metal supplies trims with compliance documentation as standard and works to OEKO-TEX and nickel-release requirements, so the paperwork is ready when your shipment needs it."
      )
    ),
  },

  {
    _id: "post-denim-patches-guide",
    title: "Leather, PU, and Woven: Choosing the Right Brand Patch for Denim",
    slug: "leather-pu-woven-patches-for-denim-branding",
    publishedAt: "2026-06-05T09:00:00.000Z",
    body: body(
      para(
        "The patch on the back waistband of a pair of jeans is one of the most recognisable pieces of branding in fashion. It is small, it sits in a high-visibility spot, and it tells the customer a story about the product before they have tried it on. Choosing the right patch is a decision about material, technique, and how the brand wants to be perceived. This guide walks through the main options and how to specify them."
      ),
      h2("What the back patch does"),
      para(
        "The waistband patch, sometimes called the jacron when it is made from a paper or synthetic leather substitute, carries the logo and often a size or style reference. It has to survive industrial washing, abrasion against belts and chairs, and years of wear, all while holding its branding clearly. The material you choose sets both the look and how well it ages."
      ),
      h2("Genuine leather"),
      para(
        "Real leather is the traditional choice and still signals premium denim. It develops a patina, takes a deep debossed impression well, and feels substantial. The trade-offs are cost, variability from hide to hide, the need for tannery compliance documentation, and the fact that it does not suit brands with a vegan or fully synthetic positioning. Leather also needs careful matching to the garment wash, because aggressive laundry can dry it out or distort it if the wrong type is used."
      ),
      h2("PU and synthetic leather"),
      para(
        "PU, meaning polyurethane synthetic leather, has become the default for a large part of the market. It mimics the look of leather, takes embossing and debossing cleanly, and offers more consistency and better water resistance than many hides. Modern PU with thermo-reactive finishes can even reproduce a burnished, aged effect convincingly. It suits activewear and any brand that wants a leather look without animal materials, and it is generally easier to keep within chemical compliance limits. The honest trade-off is that very high-end customers can sometimes tell the difference by feel."
      ),
      h2("Woven labels"),
      para(
        "A woven label is created on a loom, with the design formed by the threads themselves rather than printed on top. Woven patches handle fine detail and small text well, resist washing, and cost less than leather. They read as clean and technical rather than heritage, which is why sportswear and contemporary brands often prefer them, while leather and PU dominate classic denim. Woven labels are also the workhorse for internal neck and care labels across all categories."
      ),
      h2("Debossing versus embossing"),
      para(
        "On leather and PU patches, the two main ways to render a logo are debossing and embossing, and they create opposite effects."
      ),
      ul([
        "Debossing presses the design into the surface from the front, leaving a recessed impression. It reads as understated and refined, and it is the industry standard for premium denim back patches.",
        "Embossing raises the design from behind, creating a relief that stands proud of the surface. It is bolder and more eye-catching, and works well where you want the logo to grab attention.",
      ]),
      para(
        "A burnished edge, where the rim of the patch is darkened, is a common premium touch on debossed leather and is increasingly reproduced on PU."
      ),
      h2("How the patch attaches"),
      para("The attachment method affects both the look and the durability, and it should be specified rather than left to the factory."),
      ul([
        "Sewn on: the most common and most durable for denim back patches, stitched around the perimeter.",
        "Heat or adhesive applied: faster and seamless in appearance, better suited to lighter garments than to a high-stress waistband.",
        "Riveted or attached with hardware: ties the patch into the denim hardware story and adds a rugged, workwear cue.",
      ]),
      h2("Choosing by brand position"),
      para(
        "There is no single right answer, only a fit with positioning. Heritage and premium denim leans to genuine leather with a debossed logo and a burnished edge. Sustainable and activewear brands lean to PU with a thermo-reactive finish for the leather look without the hide. Contemporary, technical, and sportswear brands often choose woven for its clean detail and lower cost. Match the patch to the story the rest of the garment is telling."
      ),
      para(
        "Whatever you choose, approve the patch on a washed sample, confirm the logo stays crisp after laundry, and make sure the material carries the compliance documentation your markets require. If you are developing a back patch or a full label suite for a denim range, our team produces leather, PU, and woven options and can help you match the technique to your brand."
      )
    ),
  },

  {
    _id: "post-sourcing-trims-asia",
    title: "A Brand's Guide to Sourcing Apparel Trims from Asia",
    slug: "sourcing-apparel-trims-from-asia",
    publishedAt: "2026-06-12T09:00:00.000Z",
    body: body(
      para(
        "Most of the world's garment trims are made in Asia, and for good reason. The region holds the densest concentration of trim factories, plating shops, weaving mills, and the ports to ship from, often clustered close together. For a brand, that concentration means competitive pricing and fast turnaround, but it also means a lot of suppliers to choose between and a lot of ways to get the details wrong. This guide covers how to source trims from Asia well, from the tech pack to delivery."
      ),
      h2("Why Asia for trims"),
      para(
        "Trim manufacturing benefits from clustering. When the button maker, the plating shop, the zipper factory, and the label weaver sit within the same industrial region, samples move faster, costs come down, and a single supplier can pull together a full trims package without long internal delays. Mature supply chains across Pakistan, China, and Hong Kong have built exactly this kind of density for denim and fashion accessories, which is why brands of every size source trims there."
      ),
      h2("The tech pack is the source of truth"),
      para(
        "Distance and language make precision essential. The single biggest driver of whether your trims arrive correct is the quality of your tech pack. For every trim it should specify the material and finish, exact dimensions in millimetres, the logo treatment with artwork attached, the compliance target, colour references, and the position on the garment. A supplier can only build what is written down, so an hour spent making the spec unambiguous saves weeks of back and forth and reduces costly remakes."
      ),
      h2("Understanding minimum order quantities"),
      para(
        "Custom trims are produced in bulk, so they carry minimum order quantities, and these often surprise new brands. Custom buttons, zippers, and woven labels are made to order in large runs, which makes very small quantities hard to accommodate or expensive per piece. There are practical ways to work with MOQs rather than against them."
      ),
      ul([
        "Consolidate styles so several products share the same button, zipper, or label and you reach the MOQ together.",
        "Use stock components with a custom puller or a custom logo where a fully bespoke trim is not justified by the volume.",
        "Plan trims at the range level rather than the single-style level, so one order covers a season.",
        "Be candid about volumes early, so the supplier proposes options that fit your scale instead of quoting for a scale you do not have.",
      ]),
      h2("Lead times and sampling"),
      para(
        "Trims need their own place in the production calendar. Custom development usually runs through several stages: an initial sample, one or more revisions, a pre-production sample approved against the actual garment wash, and then bulk. Each loop takes time, and trims that fail a wash test send you back a step. Build in time for at least one revision round, approve a washed pre-production sample before bulk, and order trims early enough that they are not the component holding up the cut-and-sew line."
      ),
      h2("Quality and compliance gates"),
      para(
        "Set clear checkpoints rather than inspecting only at the end. A reliable trim program approves a physical sample against the spec, runs metal and dye compliance testing where the market requires it, and confirms that finishes survive the garment wash. Insist on compliance documentation, an OEKO-TEX certificate or test report and nickel-release results for skin-contact metal, before bulk rather than after the goods have shipped. Gates that happen on time cost far less than failures discovered at the border."
      ),
      h2("The value of a consolidated supplier network"),
      para(
        "Scattering trims across many tiny vendors multiplies MOQs, lead times, colour standards, and compliance trails. Working with a supplier or network that can deliver closures, labels, patches, and hardware together tends to mean fewer purchase orders, one colour standard across components, aligned delivery dates, and a single compliance trail to audit. A network spanning Pakistan, China, and Hong Kong can also balance cost, speed, and capability across locations for a given order."
      ),
      h2("Communicate for approval, not just instruction"),
      para(
        "Good sourcing relationships run on clear approvals. Confirm each stage in writing, keep a single approved reference for every trim, and agree who signs off colour and wash results. Time zones and language make ambiguity expensive, so the brands that source well are the ones that close each loop cleanly rather than leaving decisions open."
      ),
      para(
        "Sourcing trims from Asia rewards preparation. A tight tech pack, realistic handling of MOQs and lead times, compliance gates that happen on time, and a consolidated supplier all turn a fragmented process into a dependable one. Metro Metal develops and supplies the full range of garment trims across a Pakistan, China, and Hong Kong network, and works with brands from specification through to delivered, compliant bulk."
      )
    ),
  },
];

const ndjson = posts
  .map((p) =>
    JSON.stringify({
      _id: p._id,
      _type: "post",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      publishedAt: p.publishedAt,
      image: { _sanityAsset: `image@file:///tmp/covers/${p.slug}.jpg` },
      body: p.body,
    })
  )
  .join("\n");

writeFileSync("/tmp/blog-posts.ndjson", ndjson + "\n");

// quick word-count + em-dash audit
for (const p of posts) {
  const text = p.body
    .filter((b) => b.children)
    .map((b) => b.children.map((c) => c.text).join(""))
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  const emDashes = (text.match(/—/g) || []).length;
  console.log(`${p.slug}\n  words: ${words}  em-dashes: ${emDashes}`);
}
console.log("\nWrote /tmp/blog-posts.ndjson");

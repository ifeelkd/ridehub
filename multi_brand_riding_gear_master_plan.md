# Master Build Prompt — Premium Multi-Brand Motorcycle Riding Gear Store

> **Project goal:** Build a distinctive, premium, mobile-first e-commerce website for an existing multi-brand motorcycle riding gear shop in Bongaigaon, Assam, India. The store owner must be able to manage products, inventory, and COD orders independently. Keep scope and recurring costs low while delivering an unusually polished customer experience.
>
> **Compensation context:** The developer and shop owner are considering a barter arrangement for riding gear with an agreed retail selling value of approximately ₹20,000. This is a scope constraint, not permission to cut corners on security or reliability. The exact products and their agreed valuation should be recorded separately before work starts.

---

## 1. Role, Working Style, and Definition of Done

You are a senior full-stack engineer, product designer, interaction designer, and pragmatic technical architect. Work autonomously, make sensible decisions, and do not ask unnecessary questions. If a business input is missing, make it configurable, use a clearly identified placeholder, and list it in the handover checklist.

Build a **working, deployable application**, not just a visual demo. Do not leave core features as mock UI, disconnected forms, dead buttons, hardcoded fake results, or TODO screens. Test real end-to-end flows before saying they work.

Optimize for these priorities, in order:

1. Premium and coherent visual design.
2. Reliable product, variant, stock, and order data.
3. An admin interface a non-technical shop owner can use without developer help.
4. Fast, responsive customer experiences on mobile and desktop.
5. Low complexity, low recurring cost, and straightforward maintenance.
6. Sensible architecture that can support Razorpay and more products later.

The initial scope is a single retailer selling multiple brands. **This is not a multi-vendor marketplace and not a newly invented single-brand company.**

## 2. Business Context and Scope

The retailer already operates a physical store selling motorcycle riding gear from multiple brands. The website creates an online sales channel for that existing shop.

### Initial release

- Up to **50 manually entered products**.
- Guest shopping and checkout.
- **Cash on Delivery (COD) only** at launch.
- Product, variant, inventory, and order management in a protected admin panel.
- Owner-controlled domain, hosting, database, storage, and service accounts.
- Clear product, shipping, return, privacy, and contact information supplied or approved by the owner.
- A responsive storefront with a premium identity appropriate for motorcycle gear.

### Explicitly defer to later phases

- Razorpay and online payments.
- Customer accounts, saved addresses, wishlists, loyalty features, and advanced review systems.
- Automated courier integrations, shipping label integrations, and complex fulfillment automation.
- Advanced analytics, customer segmentation, marketing automation, and a drag-and-drop CMS.
- Large-scale catalog migrations and ongoing product uploads by the developer.

Build a clean foundation so these features can be added later without a full rewrite, but do not implement them prematurely.

## 3. Design North Star: Premium, Intentional, and Never Generic

### The non-negotiable visual requirement

The site must **not look generic, template-based, choppy, cluttered, or AI-generated**. Every page should feel like part of one thoughtfully art-directed retail experience. Build the level of fit, finish, restraint, typographic confidence, spacing discipline, and interaction quality associated with premium consumer products and interfaces such as Apple’s website, iOS, and Samsung’s polished product experiences—**without copying their exact layouts, proprietary assets, logos, product pages, or interface designs**.

Translate that quality bar into an original motorcycle-gear retail identity: precise, tactile, engineered, confident, sporty, and premium. Do not simply apply a black background, orange buttons, and rounded cards to a generic template and call it premium.

### Design principles

- **Intentional composition:** Each page must have a clear visual hierarchy and one primary action at a time. Use editorial spacing, consistent alignment, strong grids, and controlled density.
- **Product-led art direction:** The actual riding gear should be the visual focus. Use large, crisp product images, considered crops, consistent ratios, clean backgrounds for product photography, and cinematic rider imagery for campaigns.
- **Premium restraint:** Use color, shadows, borders, motion, gradients, and rounded corners only when they serve hierarchy or usability. Avoid excessive glassmorphism, glowing gradients, arbitrary cards, random blobs, and needless decoration.
- **Consistent components:** Buttons, inputs, product cards, modals, navigation, badges, drawers, loading states, and admin controls must share an explicit design system.
- **Brand character:** Pair refined consumer-tech polish with the confidence and utility of motorcycle riding gear. Keep the experience grounded in real products, technical details, and the shop’s multi-brand identity.
- **Responsive by design:** Do not make a desktop page and shrink it. Recompose sections deliberately for mobile, with readable type, intentional spacing, useful touch targets, and no horizontal overflow.
- **No visual dead ends:** Every section should have a clear purpose. Avoid repetitive sections that look alike or a homepage made from identical rows of cards.
- **No fake polish:** Do not simulate quality with decorative animations while leaving layout, spacing, content, or image quality weak.

### Visual reference use

Study https://rynoxgear.com/ for information architecture, product discovery, category navigation, merchandising, product galleries, product information, and sizing patterns. Use it as functional and retail-context inspiration only. Do not copy its branding, text, imagery, code, or exact visual composition.

Use Apple’s website, iOS, and Samsung’s premium product experiences as **quality references for design discipline, typography, responsive behavior, and motion restraint**, not as templates to clone. Create an original design suitable for the real retailer.

### Palette and theme

Start with a sophisticated palette such as:

- Deep charcoal / near-black for strong contrast and selected high-impact sections.
- Warm off-white or clean neutral surfaces for reading and product discovery.
- A restrained electric orange or another owner-approved accent for primary actions and selected highlights.
- Layered neutral grays for secondary text, dividers, disabled controls, and quiet UI.

Use CSS variables/design tokens for colors, surfaces, borders, typography, radius, spacing, shadows, motion timings, and focus rings. Keep the palette easy to change centrally. Do not force a full dark theme onto every page if doing so makes product browsing or readability worse. Choose a coherent default theme and make any optional theme toggle complete and consistent rather than decorative.

### Typography: premium, not improvised

Typography is a major part of the design. Use a deliberate type scale and a small, compatible font system.

- Use a premium, highly readable sans serif for UI and body content, such as **Geist, Inter, or another properly licensed and production-suitable alternative**.
- Use a distinctive display face for campaign headings when it supports the art direction, such as **Barlow Condensed, Oswald, or a similarly restrained typeface**. Avoid overusing condensed type for body copy.
- Load local or framework-optimized fonts where possible (for example, through `next/font`) to reduce layout shift and avoid unnecessary third-party font requests.
- Establish tokens for font sizes, weights, letter spacing, line heights, and responsive scaling.
- Avoid too many font families, oversized text everywhere, inconsistent weights, awkward line wrapping, or decorative text that harms readability.
- Respect font licensing and do not bundle proprietary system fonts or assets without permission.

The typography should feel engineered and carefully tuned—not like a random combination of trending fonts.

### Icons and UI symbols

Use a consistent, professional icon system such as **Lucide** or another suitable open-source icon set. Icons should have consistent stroke weight, visual size, alignment, and hit areas. Use icons only where they improve recognition or scanability; pair unfamiliar icons with labels or accessible names.

The polish associated with Apple and Samsung comes from consistency and clarity, not from copying their proprietary icon artwork. Do not mix unrelated icon packs, emoji, inconsistent stroke styles, or improvised SVGs across the application. Use custom icons only when they add real value and can be maintained consistently.

## 4. Motion and Interaction Quality: Smooth, Fast, and Satisfying

Animation quality is a core requirement, but motion must never make the site feel slow or interfere with shopping. Interactions should feel immediate, controlled, smooth, and purposeful—not bouncy for its own sake.

### Motion principles

- Prefer short, polished transitions for hover, focus, press, open/close, drawer, modal, menu, and add-to-cart feedback.
- Use consistent motion tokens and a small set of easing curves. Favor natural ease-out/ease-in-out timing and restrained spring motion only when it adds tactility.
- Typical micro-interactions should usually feel quick (roughly 120–240 ms); larger drawers, dialogs, and overlays may take a little longer when the transition remains responsive. Tune by testing rather than applying one duration everywhere.
- Animate primarily compositor-friendly properties such as `transform` and `opacity`. Avoid repeatedly animating layout-heavy properties that trigger expensive reflow.
- Use Framer Motion only where its value justifies the dependency; CSS transitions are preferred for simple effects.
- Provide subtle feedback for adding to cart, changing a variant, applying a filter, saving a product, updating inventory, and changing an order status.
- Make menus and dialogs respond promptly to keyboard, pointer, and touch input. Animation must not delay access to important controls.
- Keep sticky headers stable and prevent layout jumps. If the header compresses on scroll, do it subtly and consistently.
- Avoid unnecessary page transitions, scroll hijacking, parallax overload, decorative cursor effects, excessive staggered entrances, large animated gradients, and autoplay effects that distract from shopping.
- Never make the customer wait for an animation to finish before an action can proceed.
- Use skeleton loaders only when they reflect a real loading state; avoid flashing skeletons for content that is already immediately available.
- Respect `prefers-reduced-motion`. Provide reduced or disabled nonessential motion for users who request it.
- Ensure focus states, errors, and selected states remain visible with motion disabled.

### Required motion details

- Product-card image swap on hover where a second real image exists.
- Clear, immediate pressed states for buttons and controls.
- A smooth mobile navigation drawer and cart drawer.
- A polished size-guide dialog and filter sheet.
- Responsive gallery interactions and smooth but restrained image zoom.
- Brief, understandable add-to-cart confirmation.
- Smooth state transitions for variant selection without flashing or layout shifts.
- Responsive feedback for admin actions, including pending, success, and failure states.

Do not claim the result is smooth based only on code review. Test the actual experience in a browser at mobile and desktop sizes. Check for dropped frames, jank, cumulative layout shift, delayed input, and accidental scroll locking.

## 5. Technology Stack

Use a lean stack that is appropriate for a small retailer:

- Next.js App Router.
- React and **JavaScript, not TypeScript**.
- Tailwind CSS.
- Lucide icon set.
- Supabase PostgreSQL for application data.
- Supabase Auth for protected admin access where appropriate.
- Supabase Storage or another suitable image-hosting service for product photos.
- Zod or an equivalent validation library for important input boundaries.

Use server-side operations for privileged writes. Never expose service-role keys, database credentials, storage secrets, or future payment secrets in browser code.

Keep dependencies limited to those with a clear use. Use one documented database configuration; do not create an unnecessary dual-database setup. Make reasonable use of Server Components and server-side rendering where useful, and avoid pushing the entire app into client-side rendering without need.

Provide a complete `.env.example` with variable names and descriptions but no actual secrets. Document migrations, seed data, local development and deployment.

## 6. Centralized Store Configuration

Create a single, clear source of configuration for:

- Store name and text logo / logo image.
- Primary and accent colors.
- Contact phone, email, address and social links.
- Currency (INR by default).
- Shipping charges and free-shipping threshold, if applicable.
- Low-stock threshold.
- Store policies and customer support details.
- Feature toggles for COD and future payment methods.

Do not scatter store identity, product brand assumptions, shipping thresholds, or contact information throughout components. Use placeholders for missing business inputs and list them in the handover checklist.

## 7. Customer-Facing Storefront

### Header and navigation

Build:
- A compact announcement bar, editable through a simple setting if feasible.
- Store identity and logo.
- Desktop mega menu with brands and categories.
- A mobile navigation drawer designed for thumb use.
- Search control.
- Cart icon and item count.
- A subtle sticky header where it improves usability.

Navigation must be keyboard accessible, support touch, close appropriately, and never trap users unnecessarily.

### Homepage

Include a carefully art-directed layout with:

1. A strong campaign hero with a real, licensed or owner-supplied rider image, concise headline, and clear shopping CTA.
2. Featured brands.
3. Product category tiles: jackets, helmets, gloves, pants, boots, luggage, and accessories as relevant to the actual inventory.
4. New arrivals and best sellers, based on defined data or owner-selected products—not fake popularity metrics.
5. One or more curated product rows or editorial campaign areas.
6. Trust information using only policies the owner has confirmed, such as shipping, returns, warranties, or payment methods.
7. An optional store story section based on approved business details.
8. A useful footer with contact details, policies, and navigation.

Avoid making every section the same card grid. Create rhythm between editorial imagery, category discovery, product collections and concise information sections. Keep initial content management simple; a sophisticated visual page builder is out of scope.

### Product listing and search

Implement:
- A coherent responsive product grid.
- Search by product name and brand.
- Filters by brand, category, price and availability.
- Size and color filters when relevant to listed products.
- Sort options such as featured, newest, price low-to-high and price high-to-low.
- Active filter indicators and a clear-all action.
- Helpful empty and error states.
- URL query parameters for shareable filters where practical.

Avoid an overly dense or cluttered filtering interface. On mobile, use an accessible bottom sheet or drawer that preserves selection state.

### Product cards

Each card should show the information needed to make a decision without visual clutter:
- Consistent product imagery and aspect ratio.
- Product name and brand.
- Selling price and optional compare-at price only when accurate.
- Relevant available colors/sizes when useful.
- Availability or a meaningful stock label when appropriate.
- A clear action to view or select the product.

Use image swapping only when a legitimate alternate product image exists. Prevent card layouts from jumping between products with different title lengths.

### Product detail pages

Each product page must support:
- Multiple images in a clear gallery.
- Brand, name, price and optional sale price.
- Product description and specifications.
- Variant selectors for sizes, colors, or other category-specific attributes.
- Variant-specific SKU and stock availability.
- A size guide or measurement chart when appropriate.
- Quantity selection and Add to Cart.
- Shipping, delivery and returns information based on confirmed store rules.
- Useful related products from the real catalog.

Do not show size/color selectors on products that do not need them. Prevent unavailable variants and quantities greater than available stock from being submitted. Make variant changes feel immediate, stable, and accessible.

### Cart

Provide:
- Add and remove item operations.
- Quantity control with stock validation.
- Variant-aware cart lines.
- Subtotal, shipping and final total.
- A clear empty-cart state.
- A free-shipping progress indicator only if the owner has configured a free-shipping threshold.
- Cart drawer plus a complete cart page if both can be implemented cleanly.

Client-side cart persistence may be used for convenience, but the server must revalidate products, prices, stock, shipping and totals before order creation.

## 8. Checkout: COD at Launch

Implement a functional guest checkout with **Cash on Delivery as the only payment method in phase 1**.

Collect only the information needed to fulfill the order:
- Customer name.
- Valid contact phone number.
- Delivery address.
- Town/city, state and PIN code.
- Optional delivery instructions.
- Items, quantities, and selected variants.

Display a clear order summary with subtotal, configured shipping charge and final total in INR. Do not invent delivery dates, coverage, free-shipping thresholds, return promises, or warranty claims. Those rules must be supplied or approved by the owner.

On a successful order:
- Generate a unique order number.
- Store the order and a snapshot of each item’s name, SKU, variant, unit price and quantity.
- Save the customer delivery details needed to fulfill the order.
- Mark the payment method as COD and payment status as unpaid/awaiting collection.
- Show a clear confirmation page and order reference.
- Make the order visible in the admin panel.

Prevent duplicate submissions and recalculate all totals server-side. Never trust the price or total submitted by the browser.

## 9. Data Model and Inventory Integrity

Use a relational schema appropriate for the first release. At minimum, consider:
- Products.
- Brands.
- Categories.
- Product images.
- Product variants.
- Inventory quantities.
- Orders.
- Order line-item snapshots.
- Store settings.
- Inventory change records where practical.

Products should support name, slug, brand, category, description, specifications, selling price, optional sale price, SKU, images, product-specific attributes and active/inactive status.

Stock-managed variants should have independent SKUs and quantities. Allow different product types to have different attributes instead of forcing all gear into one universal size/color matrix.

### Stock rules

- Validate inventory on the server.
- Do not allow negative stock.
- Use atomic database operations or transactions for order placement and stock changes.
- Define when stock is reserved or deducted for a COD order and implement that policy consistently.
- On cancellation, restore inventory exactly once where appropriate.
- Prevent duplicate submissions from creating duplicate orders or applying stock changes twice.
- Record a basic inventory history with adjustment reason and timestamp where practical.
- Handle concurrent orders for the final unit without overselling.

Maintain separate fields for order status and payment status. An order being placed does not mean payment has been collected.

Suggested order states: Pending, Confirmed, Packed, Shipped, Delivered, Cancelled. Define allowed transitions and the corresponding stock behavior; do not allow arbitrary status changes to corrupt inventory.

## 10. Protected Admin Panel

Create a responsive `/admin` area for a non-technical owner who may primarily use a phone. Prioritize clarity and speed over dashboard decoration.

### Dashboard

Show:
- Order count for today and the current month.
- Basic totals with clear definitions.
- Recent orders.
- Low-stock products.
- Shortcuts to add a product, update inventory, and view orders.

Distinguish order value from money actually collected. COD orders that have not been delivered or paid must not be presented as collected revenue.

### Product management

The owner must be able to:
- Create and edit products.
- Activate or deactivate products.
- Assign brands and categories.
- Upload, reorder and remove images if supported reliably.
- Edit product text, specifications and prices.
- Add variants, SKUs and stock quantities.
- Set a sale price when appropriate.
- Preview the customer-facing page.

Provide clear validation and feedback. Do not require code edits to make routine catalog changes.

### Inventory management

Provide:
- Searchable products and variants.
- Quick quantity adjustments and direct quantity entry.
- Low-stock indicators.
- A reason field for manual stock adjustments where practical.
- A basic history of changes.

Inventory updates must use protected server operations and must not bypass validation.

### Order management

Provide:
- A searchable order list.
- Filtering by order status and date where practical.
- Order details with delivery information and line items.
- COD payment state.
- Status updates with safeguards.
- Cancellation handling and correct stock restoration.
- A print-friendly order summary.
- A way to mark COD payment as collected when the owner confirms delivery/payment.

Do not automatically mark COD orders paid.

### Minimal store settings

Allow configuration of store contact details, shipping charges, free-shipping threshold if used, low-stock threshold and customer-facing policies. Do not build a complex CMS or drag-and-drop menu builder in this phase.

## 11. Authentication and Security

Use secure admin authentication and check authorization on the server for every privileged operation. Hiding admin links in the UI is not security.

If using Supabase:
- Configure appropriate Row Level Security policies.
- Keep service-role keys on the server only.
- Restrict admin data and operations to the authorized shop owner.
- Verify uploads and restrict file types and sizes.
- Validate and sanitize untrusted input.
- Protect order creation, inventory updates and admin endpoints from unauthorized access.
- Add sensible rate limits to sensitive endpoints where feasible.

Do not collect more customer data than necessary. Do not commit secrets to source control. Document secure account ownership and credential handover.

## 12. Performance, Responsiveness, Accessibility, and Stability

Test at approximately 360px, 768px, 1024px and 1440px viewports.

Requirements:
- No horizontal overflow.
- No overlapping or clipped content.
- No large layout shifts as images or fonts load.
- Correct aspect ratios and responsive image sizing.
- Lazy-load below-the-fold imagery where suitable.
- Use optimized images and framework image tooling where appropriate.
- Keep client JavaScript and animation work limited.
- Make primary interactions respond promptly.
- Provide semantic HTML, accessible labels, keyboard navigation, clear focus states and sensible contrast.
- Respect reduced-motion preferences.
- Include loading, error, success and empty states that fit the design system.

Aim for excellent real-world Lighthouse performance and accessibility, but do not fabricate scores. Report measurements from actual runs if available.

## 13. SEO and Essential Pages

Implement:
- Page titles and metadata.
- Unique product metadata where available.
- Open Graph metadata.
- A sitemap and robots configuration.
- Product structured data only when values are supported by real product data.
- About, Contact, Shipping, Returns, Privacy and Terms pages.

Use owner-approved business details and policies. Never invent warranties, authorized-dealer status, return terms, delivery timelines, testimonials, reviews, or brand affiliations. Contact forms must validate submissions and avoid exposing private data.

## 14. Future Phase: Razorpay

Do not activate Razorpay in the initial COD-only release. Keep the schema ready for a later integration by storing payment method and payment status separately from order status.

A future payment implementation must include:
- Server-side Razorpay order creation.
- Signature verification.
- Webhook signature verification.
- Idempotent event handling.
- Clear handling for pending, successful and failed payments.
- Correct inventory reservation/decrement policy.
- Reconciliation of payment and order status.

Never treat a client-side success callback as proof that payment has been received. Never expose payment secrets in client code. List this phase as incomplete until separately implemented and tested.

## 15. Low Operating Costs and Ownership

The shop owner will own and pay directly for:
- Domain registration.
- Hosting.
- Database and image storage if paid service is necessary.
- Future payment gateway fees.
- Any optional paid integrations.

Register production accounts under the owner’s control where practical. The owner should retain access to the domain, hosting, business data and admin credentials. Explain how to recover account access and where backups are stored.

Choose economical plans based on current provider terms and actual usage. Do not promise lifetime-free hosting. Document the possible recurring costs and any relevant free-tier limits before launch.

## 16. Implementation Stages

Execute the project in these stages without asking unnecessary questions:

**Stage 1 — Foundation:** inspect the environment, establish the project, design tokens, database schema, centralized configuration, authentication and seed strategy.

**Stage 2 — Visual storefront:** build and polish the homepage, navigation, brands/categories, product listing, product cards, product detail pages, responsive behavior and motion system.

**Stage 3 — Commerce:** implement cart, server-side validation, COD checkout, order creation, stock safety and confirmation pages.

**Stage 4 — Admin:** build product editing, image handling, variants, inventory management, order management, COD collection status and basic dashboard.

**Stage 5 — Quality and handover:** run tests, fix defects, verify responsive behavior and animations, document account setup and deployment, and prepare the owner's guide.

Complete and test each stage before treating it as finished. Do not waste time building deferred features while core commerce flows are broken.

## 17. Testing and Acceptance Criteria

Run the actual application. Run applicable lint checks, migrations, seed commands, production build and automated tests. Use browser automation if available.

Verify at least the following:

1. The admin can log in securely.
2. The admin can create, update and deactivate a product.
3. Products support multiple images and appropriate variant types.
4. Each stock-managed variant has its own SKU and quantity.
5. A customer can browse, search, filter and sort the catalog.
6. A customer can view product details and select a valid available variant.
7. A customer can add, update and remove cart items.
8. Checkout recalculates price, shipping and stock on the server.
9. A customer can place a COD order and receive an order number.
10. The order is visible in admin with correct details and totals.
11. Stock changes according to the documented COD policy.
12. Duplicate requests do not create duplicate orders or duplicate deductions.
13. Cancellation restores stock correctly and only once.
14. COD orders are not automatically marked paid.
15. The owner can record COD collection when appropriate.
16. Unauthorized users cannot perform admin operations.
17. Key layouts work at mobile, tablet and desktop widths.
18. Menus, drawers, dialogs and forms are usable with keyboard and touch.
19. The visual experience has no obvious jumps, stutter, broken images, clipped text or horizontal overflow.
20. Reduced-motion preferences are respected.
21. There are no known critical errors, fake buttons or disconnected core workflows.

If a test cannot be run because a service, credential, browser, or deployment target is unavailable, state the exact limitation and provide the manual verification procedure. Never invent test results or claim that a flow passed without testing it.

## 18. Delivery and Owner Handover

Deliver:
- Complete source code and project structure.
- `.env.example` with descriptions but no secrets.
- Database schema/migrations and seed instructions.
- README with exact install, development, migration, seed, test and deployment commands.
- A secure procedure for creating the initial admin account; do not hardcode production credentials.
- A short non-technical owner guide explaining how to add products, update variant stock, process COD orders, cancel orders, record collection, and update store settings.
- A checklist of content the owner must supply, including brand names, initial product data, images, stock, shipping rules, policies and contact details.
- A list of recurring services and possible costs.
- A clear list of completed, tested, blocked and deferred features.
- Actual test/build outcomes and any known issues.

## Final Quality Bar

The finished website must feel intentionally designed, premium, responsive, fast, and smooth—not generic or visually choppy. Typography, spacing, imagery, iconography, responsive composition and motion should be consistent from the homepage through checkout and admin. Its polish should evoke the clarity and refinement of leading consumer-tech experiences while retaining an original motorcycle gear retail identity.

At the same time, the website must be practical for a real small business: reliable stock, correct COD order handling, secure administration, simple owner workflows and low ongoing complexity. A beautiful storefront is not complete unless the shop owner can actually operate it.

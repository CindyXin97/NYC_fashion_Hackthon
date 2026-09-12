Project : OOTD Swipes

FitSwipe — Hackathon PRD
AI-powered personalized fashion discovery → refinement → cart
1. Product Summary
FitSwipe is a video-first AI fashion shopping experience. The user briefly shows themselves and/or their current outfit on camera, answers a small set of preference questions, and receives a personalized full-look recommendation. The user can then refine the look conversationally—changing colors, pieces, price, vibe, or inspiration—before selected items are placed into a cart for review and checkout.
2. Problem & Product Hypothesis
Online fashion shopping has two major frictions: users often cannot translate a vague intent (“I want something cool for a rooftop date”) into searchable product attributes, and individual product pages do not help them compose a coherent full outfit. FitSwipe turns visual context + natural-language intent into an editable, shoppable look.
Core hypothesis: if AI can understand the shopper’s context and preferences, recommend a complete look, and let the shopper refine it in natural language, the path from inspiration to purchase becomes substantially shorter and more engaging.
3. Target User / Job to Be Done
Primary user: a fashion shopper who knows the occasion or desired vibe but does not know exactly what items to search for.
JTBD: “When I need an outfit for a specific occasion, help me quickly discover a look that feels like me, adjust it without restarting my search, and turn it into a cart I can actually buy.”
4. End-to-End User Flow
Step 1 — Video Capture / Visual Context
User opens the experience and uses the camera/video to show their current outfit and/or themselves. The system extracts fashion-relevant visual context such as currently worn pieces, broad color palette, and styling context. For the hackathon, avoid inferring sensitive personal attributes; the user can explicitly provide fit/size preferences if needed.
Step 2 — Preference Intake (“Style Brief”)
The experience asks a short set of questions: desired style/vibe; occasion; budget or price range; preferred/avoided brands; colors or categories to avoid; and optional fashion/KOL inspiration. The result is converted into a structured Style Brief.
Step 3 — Personalized Look Generation
Gemini combines the Style Brief with visual context to produce a complete outfit concept. The UI presents the recommended look plus item-level cards (e.g., top, bottom, shoes, bag, accessories) with rationale and price.
Step 4 — Conversational Refinement
The user can type or speak edits such as “make the shoes less formal,” “change the jacket to red,” “keep the dress but make the total under $250,” or "make this more like my inspiration.” The system preserves accepted parts and regenerates only the requested components where possible.
Step 5 — Variant / Image Generation
The system can generate alternative visualizations or look variants. Variants should be bounded by the available product catalog if the experience claims that the shown items are purchasable.
Step 6 — Cart & Checkout
Accepted items are added to a cart. The user can remove or swap individual pieces, view the total price, and proceed to a one-click checkout experience. For the hackathon MVP, checkout should be a clearly labeled prototype/mock unless a real commerce integration is available.
5. MVP Requirements for the Hackathon
Feature
Priority
MVP Implementation
Risk
Video capture
P0
Vonage video session/camera capture; sample frames or snapshots for AI analysis
Medium
Style Brief
P0
5–6 structured questions + optional free-text prompt
Low
Gemini recommendation
P0
Return structured JSON: look + item categories + rationale + constraints
Low–Medium
Look visualization
P0
Use curated catalog images and/or generated visualization
Medium
Conversational edits
P0
Preserve state and update only requested fields/items
Medium
Cart
P0
Add/remove/swap items; calculate total
Low
Checkout
P1
Mock checkout / Apple Pay-style handoff; do not build payments unless already available
Low
Real retailer inventory
P2
Stretch only
High
True virtual try-on / avatar
P2
Stretch only; technically risky in a short hackathon
Very High

6. Important Product Clarification: Avatar vs. Outfit Visualization
The phrase “generate your avatar” can create a much larger technical promise than the MVP needs. A photorealistic avatar that preserves body geometry and accurately renders garment fit is effectively a virtual try-on problem. That is significantly harder than generating a fashion visualization.
Recommended MVP: use the user’s video as context, then generate or compose a representative look visualization. Position it as personalized styling, not guaranteed fit simulation. Treat true avatar/virtual try-on as a future extension.
7. Technical Architecture (MVP)
Vonage Video API → camera/video context → selected frame(s) → Gemini multimodal analysis → structured Style Profile / Style Brief → recommendation engine against a curated product catalog → look renderer → conversational refinement loop → cart state → mock checkout.
Key design rule: Gemini recommends and explains; the catalog is the source of truth for SKU, price, brand, size, availability, and purchase URL. This prevents generated products from being mistaken for real inventory.
8. Feasibility Assessment
Dimension
Assessment
Reasoning
Concept coherence
8.5 / 10
Clear journey from intent to purchase; stronger than a standalone AI stylist.
Hackathon demo value
9 / 10
Highly visual and easy to demonstrate live.
Gemini fit
9 / 10
Multimodal understanding + preference reasoning + conversational refinement are natural uses.
Vonage fit
7 / 10
Video capture is useful, but the demo must make it visibly necessary rather than a decorative API call.
MVP buildability
8 / 10
Strong if catalog, cart, and checkout are mocked/curated; much lower if real commerce and virtual try-on are attempted.
Technical novelty
7 / 10
AI styling exists; differentiation comes from video context + stateful refinement + shoppable execution.
Commercial plausibility
8 / 10
Potential affiliate/retailer conversion model; clear shopping funnel.

9. Likely Judge Challenges & Responses
“How is this different from ChatGPT/Gemini recommending an outfit?” The product closes the loop: visual context → structured preferences → full-look generation → stateful edits → SKU-level cart. It is an interaction and commerce workflow, not a one-shot answer.
“Why do you need video?” Video reduces the amount users must describe and makes the styling interaction visual. The strongest demo should show the recommendation changing because of information captured from the video.
“Are those generated clothes actually purchasable?” Only catalog-backed items should be labeled shoppable. Generated imagery is inspiration/visualization; the catalog remains the source of truth.
“Can you really tell whether clothing will fit from a video?” Not reliably in the MVP. We do not claim precise fit prediction. Users provide sizing preferences explicitly; true virtual try-on is future work.
“Why would users trust the AI?” Show item-level rationale and let the user preserve, swap, or reject each piece. The AI is an editable stylist rather than an opaque decision-maker.
“Why is checkout part of this?” It demonstrates the core business value: converting inspiration into a transaction with minimal search friction. The hackathon prototype can mock payment while preserving the full product flow.
10. Success Metrics
For a production product, the north-star metric should be Completed Shoppable Looks per Styling Session: sessions in which a user reaches a coherent, catalog-backed look and adds at least one recommended item to cart. Supporting funnel metrics include Style Brief completion rate, recommendation acceptance rate, average refinement turns before acceptance, item add-to-cart rate, cart completion rate, checkout conversion, time-to-first-liked-look, and repeat styling sessions.
For the hackathon itself, success is simpler: a judge can complete the entire flow live in under ~2 minutes; the system visibly uses both video and Gemini; at least one conversational edit changes the recommendation while preserving other choices; and the final look becomes an editable cart without a broken handoff.
11. Recommended Scope Cut
Build one polished golden path rather than broad functionality: video capture → 5-question Style Brief → 1 full look → 2 conversational edits → curated SKU-backed cart → mock checkout. If time remains, add multiple look variants or social/video shopping. Do not spend core build time on real payment processing, retailer-wide inventory search, or photorealistic virtual try-on.
12. One-Sentence Pitch
“FitSwipe turns a quick video and a few style preferences into an editable, personalized, shoppable outfit—taking you from ‘I need something to wear’ to checkout in one conversation 

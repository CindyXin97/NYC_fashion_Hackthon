// FitSwipe Core Application Logic — Multi-Screen Tinder Studio

// Application State
const state = {
  deck: JSON.parse(JSON.stringify(CURATED_LOOKS_DECK)),
  currentCardIndex: 0,
  swipedHistory: [],
  lockedItems: new Set(),
  activePresetIndex: 0,
  isCameraActive: false,
  stream: null,
  cartDiscountRate: 0.10, // 10% first order discount
  taxRate: 0.08875, // NYC Sales Tax 8.875%
  brief: {
    occasion: "Rooftop Date (Meatpacking)",
    vibe: "Quiet Luxury",
    budget: "Contemporary Designer ($800 - $1,500)",
    brand: "The Row & Khaite",
    notes: ""
  },
  cartItems: [],
  capturedPhoto: null,
  capturedVideo: null
};

// DOM Element Selectors
const DOM = {
  video: document.getElementById('webcam-video'),
  demoImage: document.getElementById('demo-image-preview'),
  toggleCameraBtn: document.getElementById('toggle-camera-btn'),
  cyclePresetBtn: document.getElementById('cycle-preset-btn'),
  captureSnapshotBtn: document.getElementById('capture-snapshot-btn'),
  recordVideoBtn: document.getElementById('record-video-btn'),
  recordVideoLabel: document.getElementById('record-video-label'),
  vonageConfigBtn: document.getElementById('vonage-config-btn'),
  vonageModal: document.getElementById('vonage-modal'),
  closeVonageModalBtn: document.getElementById('close-vonage-modal-btn'),
  saveVonageConfigBtn: document.getElementById('save-vonage-config-btn'),
  vonageApiKeyInput: document.getElementById('vonage-api-key-input'),
  vonageSessionIdInput: document.getElementById('vonage-session-id-input'),
  vonageTokenInput: document.getElementById('vonage-token-input'),
  vonageConnStatus: document.getElementById('vonage-conn-status'),
  vonageHudBadge: document.getElementById('vonage-hud-badge'),
  capturedMediaPanel: document.getElementById('captured-media-panel'),
  photoPreviewCard: document.getElementById('photo-preview-card'),
  capturedPhotoImg: document.getElementById('captured-photo-img'),
  videoPreviewCard: document.getElementById('video-preview-card'),
  capturedVideoPlayer: document.getElementById('captured-video-player'),
  videoMetaLabel: document.getElementById('video-meta-label'),
  hudStatus: document.getElementById('hud-status'),
  hudStatusText: document.getElementById('hud-status-text'),
  detectedItemsText: document.getElementById('detected-items-text'),
  detectedPalette: document.getElementById('detected-palette'),
  silhouetteLabel: document.getElementById('silhouette-label'),
  generateLookBtn: document.getElementById('generate-look-btn'),
  customPromptInput: document.getElementById('custom-prompt-input'),
  intakeScreen: document.getElementById('intake-screen'),
  studioScreen: document.getElementById('studio-screen'),
  synthesisLoadingOverlay: document.getElementById('synthesis-loading-overlay'),
  btnBackBrief: document.getElementById('btn-back-brief'),
  stepNav1: document.getElementById('step-nav-1'),
  stepNav2: document.getElementById('step-nav-2'),
  stepNav3: document.getElementById('step-nav-3'),
  stepNav4: document.getElementById('step-nav-4'),
  aiReasoningText: document.getElementById('ai-reasoning-text'),
  swipeCardStack: document.getElementById('swipe-card-stack'),
  btnTinderRewind: document.getElementById('btn-tinder-rewind'),
  btnTinderNope: document.getElementById('btn-tinder-nope'),
  btnTinderRefine: document.getElementById('btn-tinder-refine'),
  btnTinderLike: document.getElementById('btn-tinder-like'),
  btnTinderSuperlike: document.getElementById('btn-tinder-superlike'),
  quickChipsRow: document.getElementById('quick-chips-row'),
  chatHistory: document.getElementById('chat-history'),
  chatForm: document.getElementById('chat-form'),
  chatInput: document.getElementById('chat-input'),
  typingIndicator: document.getElementById('typing-indicator'),
  cartCount: document.getElementById('cart-count'),
  openCartBtn: document.getElementById('open-cart-btn'),
  closeCartBtn: document.getElementById('close-cart-btn'),
  cartDrawer: document.getElementById('cart-drawer'),
  cartDrawerOverlay: document.getElementById('cart-drawer-overlay'),
  cartItemsList: document.getElementById('cart-items-list'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  cartDiscount: document.getElementById('cart-discount'),
  cartTax: document.getElementById('cart-tax'),
  cartTotalPrice: document.getElementById('cart-total-price'),
  applePayBtn: document.getElementById('apple-pay-btn'),
  checkoutModal: document.getElementById('checkout-modal'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  modalItemCount: document.getElementById('modal-item-count'),
  modalTotalPaid: document.getElementById('modal-total-paid'),
  exportBriefBtn: document.getElementById('export-brief-btn')
};

// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
  initVideoContext();
  initPillListeners();
  initRefinementListeners();
  initCartListeners();
  initTinderActionButtons();
  initScreenNavigation();
  initVonageConfigListeners();
  
  // Preload initial look pieces into cart
  addLookToCart(state.deck[0], false);
  renderSwipeDeck();
});

// 1. Video Context & Vonage Video API Handler
async function initVideoContext() {
  const publisherContainerId = 'vonage-publisher-container';

  // 1. Attempt Vonage Video API Publisher Initialization
  if (window.vonageService) {
    try {
      const res = await window.vonageService.initPublisher(publisherContainerId, (status) => {
        updateHudStatus(status.label, status.active);
        if (DOM.vonageHudBadge) {
          DOM.vonageHudBadge.textContent = status.mode === 'session-connected' 
            ? 'VONAGE CLOUD LIVE' 
            : 'VONAGE 720p 30FPS';
        }
      });

      if (res && res.success) {
        state.isCameraActive = true;
        DOM.video.style.display = 'none';
        DOM.demoImage.style.display = 'none';
        const pubBox = document.getElementById(publisherContainerId);
        if (pubBox) pubBox.style.display = 'block';
      } else {
        loadPreset(0);
      }
    } catch (e) {
      console.warn('[FitSwipe] Vonage init error, falling to preset:', e);
      loadPreset(0);
    }
  } else {
    loadPreset(0);
  }

  // Toggle Live Camera
  DOM.toggleCameraBtn.addEventListener('click', async () => {
    const pubBox = document.getElementById(publisherContainerId);
    if (state.isCameraActive) {
      state.isCameraActive = false;
      if (pubBox) pubBox.style.display = 'none';
      loadPreset(state.activePresetIndex);
      updateHudStatus("DEMO PRESET ACTIVE", false);
    } else {
      if (window.vonageService) {
        if (pubBox) pubBox.style.display = 'block';
        DOM.demoImage.style.display = 'none';
        DOM.video.style.display = 'none';
        state.isCameraActive = true;
        await window.vonageService.initPublisher(publisherContainerId, (status) => {
          updateHudStatus(status.label, status.active);
        });
      } else {
        loadPreset(state.activePresetIndex);
      }
    }
  });

  // Cycle Demo Presets
  DOM.cyclePresetBtn.addEventListener('click', () => {
    state.activePresetIndex = (state.activePresetIndex + 1) % DEMO_PRESETS.length;
    loadPreset(state.activePresetIndex);
  });

  // Take Snapshot Photo via Vonage Video API
  DOM.captureSnapshotBtn.addEventListener('click', () => {
    flashCaptureEffect();

    let photoData = null;
    if (window.vonageService && state.isCameraActive) {
      const result = window.vonageService.takePhoto();
      if (result && result.success) {
        photoData = result.dataUrl;
      }
    }

    // If no camera active, capture current demo image
    if (!photoData) {
      photoData = DOM.demoImage.src || DEMO_PRESETS[state.activePresetIndex].image;
    }

    state.capturedPhoto = photoData;
    displayCapturedPhoto(photoData);

    appendChatMessage('stylist', `📸 [Vonage Video API] High-resolution outfit snapshot captured! Analyzing neckline, texture drape, and silhouette palette for Gemini styling synthesis.`);
  });

  // Record Video Clip via Vonage Video API
  if (DOM.recordVideoBtn) {
    DOM.recordVideoBtn.addEventListener('click', () => {
      if (!window.vonageService || !state.isCameraActive) {
        alert("Please turn on the live Vonage camera to record a video clip.");
        return;
      }

      if (window.vonageService.isRecording) {
        // Stop recording
        window.vonageService.stopVideoRecording();
        return;
      }

      // Start 5-second video recording from Vonage stream
      DOM.recordVideoBtn.classList.add('btn-recording-pulse');
      DOM.recordVideoLabel.textContent = '⏹️ Recording (5s)...';

      window.vonageService.startVideoRecording(
        5,
        (remainingSecs) => {
          DOM.recordVideoLabel.textContent = `⏹️ Recording (${remainingSecs}s)...`;
        },
        (result) => {
          DOM.recordVideoBtn.classList.remove('btn-recording-pulse');
          DOM.recordVideoLabel.textContent = '🎥 Record Video (Vonage)';

          if (result && result.success) {
            state.capturedVideo = result.blobUrl;
            displayCapturedVideo(result.blobUrl, result.duration);
            flashCaptureEffect();
            appendChatMessage('stylist', `🎥 [Vonage Video API] 5-second video clip captured from stream! Dynamic motion & silhouette angles ingested for personalized fit match.`);
          } else {
            console.warn('[FitSwipe] Recording error:', result?.error);
          }
        }
      );
    });
  }
}

// Display Captured Photo in Tray
function displayCapturedPhoto(dataUrl) {
  if (!DOM.capturedMediaPanel) return;
  DOM.capturedMediaPanel.style.display = 'block';
  DOM.photoPreviewCard.style.display = 'block';
  DOM.capturedPhotoImg.src = dataUrl;
}

// Display Captured Video in Tray
function displayCapturedVideo(blobUrl, duration) {
  if (!DOM.capturedMediaPanel) return;
  DOM.capturedMediaPanel.style.display = 'block';
  DOM.videoPreviewCard.style.display = 'block';
  DOM.capturedVideoPlayer.src = blobUrl;
  if (DOM.videoMetaLabel) {
    DOM.videoMetaLabel.textContent = `Vonage Stream Clip (${duration}s)`;
  }
}

// Vonage API Config Modal Handlers
function initVonageConfigListeners() {
  if (!DOM.vonageConfigBtn || !DOM.vonageModal) return;

  // Pre-fill existing credentials
  if (window.vonageService) {
    DOM.vonageApiKeyInput.value = window.vonageService.credentials.apiKey || '';
    DOM.vonageSessionIdInput.value = window.vonageService.credentials.sessionId || '';
    DOM.vonageTokenInput.value = window.vonageService.credentials.token || '';
  }

  DOM.vonageConfigBtn.addEventListener('click', () => {
    DOM.vonageModal.style.display = 'flex';
  });

  DOM.closeVonageModalBtn.addEventListener('click', () => {
    DOM.vonageModal.style.display = 'none';
  });

  DOM.saveVonageConfigBtn.addEventListener('click', async () => {
    const apiKey = DOM.vonageApiKeyInput.value.trim();
    const sessionId = DOM.vonageSessionIdInput.value.trim();
    const token = DOM.vonageTokenInput.value.trim();

    if (window.vonageService) {
      window.vonageService.saveCredentials(apiKey, sessionId, token);
      DOM.vonageConnStatus.textContent = apiKey 
        ? "Credentials saved. Connecting to Vonage session..." 
        : "Local Publisher Mode active.";
      DOM.vonageConnStatus.style.borderLeftColor = "#3b82f6";

      // Re-initialize publisher with new credentials
      await window.vonageService.initPublisher('vonage-publisher-container', (status) => {
        updateHudStatus(status.label, status.active);
      });

      setTimeout(() => {
        DOM.vonageModal.style.display = 'none';
      }, 700);
    }
  });
}

function loadPreset(index) {
  state.isCameraActive = false;
  const preset = DEMO_PRESETS[index];
  const pubBox = document.getElementById('vonage-publisher-container');
  if (pubBox) pubBox.style.display = 'none';
  DOM.video.style.display = 'none';
  DOM.demoImage.style.display = 'block';
  DOM.demoImage.src = preset.image;
  DOM.detectedItemsText.textContent = preset.detectedPieces.join(' • ');
  DOM.silhouetteLabel.textContent = `Silhouette: ${preset.detectedSilhouette}`;

  DOM.detectedPalette.innerHTML = preset.detectedPalette
    .map(color => `<div class="swatch-circle" style="background: ${color};"></div>`)
    .join('');

  updateHudStatus(`DEMO CONTEXT: ${preset.name.split(' ')[0]}`, false);
  if (DOM.vonageHudBadge) {
    DOM.vonageHudBadge.textContent = 'DEMO PRESET ACTIVE';
  }
}

function updateHudStatus(text, isLive) {
  DOM.hudStatusText.textContent = text;
  const dot = DOM.hudStatus.querySelector('.rec-dot');
  if (dot) dot.style.background = isLive ? '#ff4757' : '#c29b38';
}

function flashCaptureEffect() {
  const stage = document.getElementById('video-stage');
  stage.style.transition = 'filter 0.15s ease';
  stage.style.filter = 'brightness(2.2)';
  setTimeout(() => {
    stage.style.filter = 'brightness(1)';
  }, 180);
}

// 2. Style Brief Intake Handlers & Screen Navigation
function initPillListeners() {
  const pillGroups = [
    { containerId: 'occasion-options', key: 'occasion' },
    { containerId: 'vibe-options', key: 'vibe' },
    { containerId: 'budget-options', key: 'budget' },
    { containerId: 'brand-options', key: 'brand' }
  ];

  pillGroups.forEach(group => {
    const container = document.getElementById(group.containerId);
    if (!container) return;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.option-pill');
      if (!btn) return;

      container.querySelectorAll('.option-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      state.brief[group.key] = btn.getAttribute('data-val');
    });
  });

  DOM.generateLookBtn.addEventListener('click', () => {
    state.brief.notes = DOM.customPromptInput.value.trim();
    transitionToStudioScreen();
  });
}

function initScreenNavigation() {
  DOM.btnBackBrief.addEventListener('click', () => {
    DOM.studioScreen.classList.remove('active');
    DOM.intakeScreen.classList.add('active');

    // Update Progress Navigation
    DOM.stepNav1.className = 'progress-step active';
    DOM.stepNav2.className = 'progress-step active';
    DOM.stepNav3.className = 'progress-step';
    DOM.stepNav4.className = 'progress-step';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Smooth animated transition from Intake to the Swiping Studio
function transitionToStudioScreen() {
  DOM.synthesisLoadingOverlay.classList.add('active');

  setTimeout(() => {
    // Tribeca Candlelight Dinner is always the 3rd example (index 2)
    if (state.brief.occasion.includes("Gallery") || state.brief.vibe.includes("Edgy")) {
      state.deck = [CURATED_LOOKS_DECK[1], CURATED_LOOKS_DECK[0], CURATED_LOOKS_DECK[2], CURATED_LOOKS_DECK[3]];
    } else {
      state.deck = JSON.parse(JSON.stringify(CURATED_LOOKS_DECK));
    }

    // IF user captured a photo with Vonage: synthesize custom look #1 with generated clothes + user's head!
    if (state.capturedPhoto) {
      const occasionPrefix = state.brief.occasion.split(' ')[0] || "Custom";
      const personalizedLook = {
        id: "look-personalized-user",
        name: `Your Personalized ${occasionPrefix} Look`,
        subtitle: `Khaite Wool Trench & Toteme Silk • Styled on Your Silhouette`,
        heroImage: "images/tribeca_original.jpg",
        isUserPhotoLook: true,
        vibe: state.brief.vibe,
        occasion: state.brief.occasion,
        matchScore: 99,
        refinedBadge: "✦ AI Fitted on You ✨",
        rationale: `Synthesized luxury ensemble fitted directly on your silhouette: tailored Khaite wool outerwear, draped Toteme silk blouse, Frankie Shop trousers, and sculptural footwear.`,
        items: {
          outerwear: "out-1",
          tops: "top-1",
          bottoms: "bot-1",
          shoes: "sho-1",
          bags: "bag-2",
          accessories: "acc-2"
        },
        hotspots: [
          { category: "outerwear", top: "44%", left: "54%", label: "Khaite Wool Trench • $640" },
          { category: "tops", top: "48%", left: "52%", label: "Toteme Silk Blouse • $340" },
          { category: "bottoms", top: "72%", left: "48%", label: "Frankie Shop Trousers • $215" },
          { category: "shoes", top: "91%", left: "43%", label: "Neous Kitten Heels • $395" },
          { category: "bags", top: "58%", left: "24%", label: "Jacquemus Mini • $360" }
        ]
      };
      state.deck.unshift(personalizedLook);
    }

    state.currentCardIndex = 0;
    state.swipedHistory = [];
    renderSwipeDeck();

    // Switch views
    DOM.intakeScreen.classList.remove('active');
    DOM.studioScreen.classList.add('active');

    // Update Progress Navigation
    DOM.stepNav1.className = 'progress-step completed';
    DOM.stepNav2.className = 'progress-step completed';
    DOM.stepNav3.className = 'progress-step active';
    DOM.stepNav4.className = 'progress-step';

    DOM.synthesisLoadingOverlay.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const activeLook = getCurrentActiveLook();
    if (activeLook) {
      DOM.aiReasoningText.textContent = activeLook.rationale;
      const mediaNotice = state.capturedPhoto
        ? " with your captured photo styled on Card #1 📸✨"
        : (state.capturedVideo ? " with your Vonage video context 🎥" : "");
      appendChatMessage('stylist', `✨ Synthesized ${state.deck.length} personalized looks${mediaNotice}! Swipe through the deck or tap ♥ to add to cart.`);
    }
  }, 750);
}

function getCurrentActiveLook() {
  if (state.currentCardIndex >= state.deck.length) return null;
  return state.deck[state.currentCardIndex];
}

// 3. Render Tinder-Style Swipable Outfit Deck
function renderSwipeDeck() {
  DOM.swipeCardStack.innerHTML = '';

  if (state.currentCardIndex >= state.deck.length) {
    const emptyState = document.createElement('div');
    emptyState.className = 'deck-empty-state';
    emptyState.innerHTML = `
      <div class="deck-empty-icon">✨</div>
      <h3 class="deck-empty-title">All Looks Explored!</h3>
      <p class="deck-empty-desc">You've swiped through all outfits synthesized for this brief. Restart the deck to review again, or view your cart to checkout.</p>
      <div style="display: flex; gap: 10px;">
        <button class="btn-secondary" id="btn-reset-deck">↺ Restart Deck</button>
        <button class="btn-primary" id="btn-view-cart-empty">🛍️ View Cart (${state.cartItems.length})</button>
      </div>
    `;

    emptyState.querySelector('#btn-reset-deck').addEventListener('click', () => {
      state.currentCardIndex = 0;
      state.swipedHistory = [];
      renderSwipeDeck();
    });

    emptyState.querySelector('#btn-view-cart-empty').addEventListener('click', () => {
      DOM.openCartBtn.click();
    });

    DOM.swipeCardStack.appendChild(emptyState);
    return;
  }

  // Render top 3 visible cards in stack for clean depth
  const maxVisible = 3;
  for (let i = maxVisible - 1; i >= 0; i--) {
    const cardIdx = state.currentCardIndex + i;
    if (cardIdx >= state.deck.length) continue;

    const look = state.deck[cardIdx];
    const isTopCard = (i === 0);
    const cardEl = createSwipeCardElement(look, i, isTopCard);
    DOM.swipeCardStack.appendChild(cardEl);

    if (isTopCard) {
      attachCardDragListeners(cardEl, look);
      DOM.aiReasoningText.textContent = look.rationale;
    }
  }
}

function calculateLookSubtotal(look) {
  let subtotal = 0;
  for (const [cat, id] of Object.entries(look.items)) {
    const found = MOCK_CATALOG[cat]?.find(i => i.id === id);
    if (found) subtotal += found.price;
  }
  return subtotal;
}

function createSwipeCardElement(look, depthIndex, isInteractive) {
  const card = document.createElement('div');
  card.className = `swipe-card card-depth-${depthIndex}`;
  card.setAttribute('data-look-id', look.id);

  const subtotal = calculateLookSubtotal(look);

  // Hotspots directly on the assembled image
  const hotspotsHtml = (look.hotspots || []).map((h, idx) => `
    <div class="hotspot-pin" style="top: ${h.top}; left: ${h.left};" title="${h.label}">
      <div class="hotspot-beacon">${idx + 1}</div>
      <div class="hotspot-label-pill">${h.label}</div>
    </div>
  `).join('');

  // 5-Piece breakdown
  const breakdownItemsHtml = Object.entries(look.items).map(([cat, id]) => {
    const item = MOCK_CATALOG[cat]?.find(i => i.id === id);
    if (!item) return '';
    return `
      <div class="breakdown-item-chip">
        <img class="breakdown-item-thumb" src="${item.image}" alt="${item.name}">
        <div class="breakdown-item-info">
          <div class="breakdown-item-brand">${item.brand} • ${cat.toUpperCase()}</div>
          <div class="breakdown-item-title">${item.name}</div>
        </div>
        <div class="breakdown-item-price">$${item.price}</div>
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <!-- Tinder Stamps -->
    <div class="tinder-stamp stamp-like">LIKE</div>
    <div class="tinder-stamp stamp-nope">NOPE</div>
    <div class="tinder-stamp stamp-superlike">SUPER LIKE</div>

    <!-- Assembled Complete Outfit Visual -->
    <div class="assembled-visual-wrap">
      <!-- Generated Luxury Outfit (Coat, Blouse, Trousers, Heels, Bag) -->
      <img class="assembled-img" src="${look.heroImage}" alt="${look.name}">

      <!-- User Head Composited on the Outfit Neckline -->
      ${(look.isUserPhotoLook && state.capturedPhoto) ? `
        <div class="user-face-tryon-box">
          <div class="user-face-mask">
            <img class="user-face-img" src="${state.capturedPhoto}" alt="Your Head" />
          </div>
        </div>
        <div class="pill-tryon-overlay">
          <span class="pulse-sparkle">✨</span> AI Styled: Your Head on Curated Outfit
        </div>
        <button class="btn-toggle-head-fit" type="button" title="Toggle Your Head / Model View">
          <span class="head-toggle-label">👤 Head Fit: ON</span>
        </button>
      ` : ''}

      ${hotspotsHtml}
    </div>

    <!-- Metadata & Details -->
    <div class="card-meta-wrap">
      <div>
        <div class="card-title-row">
          <div class="card-look-title">${look.name}</div>
          <div class="card-look-price">$${subtotal.toLocaleString()}</div>
        </div>

        <div class="card-tags-row">
          <span class="badge-match">${look.matchScore}% Aesthetic Match</span>
          <span class="badge-occasion">${look.occasion}</span>
          <span class="badge-occasion">${look.vibe}</span>
          ${look.refinedBadge ? `<span class="badge-refined-alert">${look.refinedBadge}</span>` : ''}
        </div>

        <div class="card-rationale-snippet">${look.rationale}</div>
      </div>

      <div class="card-subactions-row">
        <button class="btn-toggle-breakdown" type="button">
          <span>✦ View 5-Piece Breakdown</span>
          <span class="arrow-icon">▾</span>
        </button>
        <span style="font-size: 0.72rem; color: var(--text-muted);">Swipe right to add look to cart</span>
      </div>
    </div>

    <!-- Collapsible Piece Breakdown Sheet -->
    <div class="piece-breakdown-panel">
      <div class="breakdown-items-list">
        ${breakdownItemsHtml}
      </div>
    </div>
  `;

  // Toggle breakdown sheet
  const toggleBtn = card.querySelector('.btn-toggle-breakdown');
  const panel = card.querySelector('.piece-breakdown-panel');
  const arrow = card.querySelector('.arrow-icon');

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = panel.classList.toggle('expanded');
    arrow.textContent = isExpanded ? '▴' : '▾';
  });

  // Toggle User Head vs Model View
  const headToggleBtn = card.querySelector('.btn-toggle-head-fit');
  if (headToggleBtn) {
    headToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const faceBox = card.querySelector('.user-face-tryon-box');
      const label = headToggleBtn.querySelector('.head-toggle-label');
      if (faceBox) {
        const isHidden = (faceBox.style.display === 'none');
        faceBox.style.display = isHidden ? 'block' : 'none';
        headToggleBtn.classList.toggle('inactive', !isHidden);
        if (label) label.textContent = isHidden ? '👤 Head Fit: ON' : '👗 Model View';
      }
    });
  }

  return card;
}

// 4. Touch & Drag Swipe Physics (Tinder Gestures)
function attachCardDragListeners(card, look) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  const likeStamp = card.querySelector('.stamp-like');
  const nopeStamp = card.querySelector('.stamp-nope');
  const superlikeStamp = card.querySelector('.stamp-superlike');

  const onDragStart = (clientX, clientY) => {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    card.classList.add('is-dragging');
  };

  const onDragMove = (clientX, clientY) => {
    if (!isDragging) return;
    currentX = clientX - startX;
    currentY = clientY - startY;

    const rotation = currentX * 0.08;
    card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;

    // Modulate stamps opacity
    if (currentX > 20) {
      likeStamp.style.opacity = Math.min((currentX - 20) / 90, 1);
      nopeStamp.style.opacity = 0;
      superlikeStamp.style.opacity = 0;
    } else if (currentX < -20) {
      nopeStamp.style.opacity = Math.min((-currentX - 20) / 90, 1);
      likeStamp.style.opacity = 0;
      superlikeStamp.style.opacity = 0;
    } else if (currentY < -40 && Math.abs(currentX) < 50) {
      superlikeStamp.style.opacity = Math.min((-currentY - 40) / 90, 1);
      likeStamp.style.opacity = 0;
      nopeStamp.style.opacity = 0;
    } else {
      likeStamp.style.opacity = 0;
      nopeStamp.style.opacity = 0;
      superlikeStamp.style.opacity = 0;
    }
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('is-dragging');

    const threshold = 110;
    if (currentX > threshold) {
      triggerSwipeAnimation(card, 'right', look);
    } else if (currentX < -threshold) {
      triggerSwipeAnimation(card, 'left', look);
    } else if (currentY < -130 && Math.abs(currentX) < 80) {
      triggerSwipeAnimation(card, 'up', look);
    } else {
      // Spring back
      card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      card.style.transform = 'translate(0px, 0px) rotate(0deg)';
      likeStamp.style.opacity = 0;
      nopeStamp.style.opacity = 0;
      superlikeStamp.style.opacity = 0;
    }
  };

  // Mouse Events
  card.addEventListener('mousedown', (e) => {
    if (e.target.closest('.btn-toggle-breakdown') || e.target.closest('.piece-breakdown-panel')) return;
    onDragStart(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) onDragMove(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) onDragEnd();
  });

  // Touch Events for Mobile / Tablet
  card.addEventListener('touchstart', (e) => {
    if (e.target.closest('.btn-toggle-breakdown') || e.target.closest('.piece-breakdown-panel')) return;
    const touch = e.touches[0];
    onDragStart(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      onDragMove(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (isDragging) onDragEnd();
  });
}

function triggerSwipeAnimation(card, direction, look) {
  card.style.transition = 'transform 0.45s ease-out, opacity 0.35s ease';

  if (direction === 'right') {
    card.style.transform = 'translate(600px, 50px) rotate(35deg)';
    card.style.opacity = '0';
    addLookToCart(look, true);
    state.swipedHistory.push({ look, direction: 'right' });
    appendChatMessage('stylist', `💚 **Liked & Added to Cart:** Assembled look *"${look.name}"* ($${calculateLookSubtotal(look).toLocaleString()}).`);
  } else if (direction === 'left') {
    card.style.transform = 'translate(-600px, 50px) rotate(-35deg)';
    card.style.opacity = '0';
    state.swipedHistory.push({ look, direction: 'left' });
    appendChatMessage('stylist', `Passed on *"${look.name}"*. Queuing next tailored look...`);
  } else if (direction === 'up') {
    card.style.transform = 'translate(0px, -650px) rotate(0deg)';
    card.style.opacity = '0';
    addLookToCart(look, false);
    state.swipedHistory.push({ look, direction: 'up' });
    appendChatMessage('stylist', `⭐ **Superliked:** *"${look.name}"*! Opening instant Apple Pay checkout.`);
    setTimeout(() => {
      DOM.openCartBtn.click();
      setTimeout(() => DOM.applePayBtn.click(), 300);
    }, 450);
  }

  setTimeout(() => {
    state.currentCardIndex++;
    renderSwipeDeck();
  }, 350);
}

// 5. Tinder Action Buttons
function initTinderActionButtons() {
  DOM.btnTinderRewind.addEventListener('click', () => {
    if (state.swipedHistory.length === 0 || state.currentCardIndex === 0) {
      alert("No previous looks to rewind!");
      return;
    }
    state.swipedHistory.pop();
    state.currentCardIndex--;
    renderSwipeDeck();
    const active = getCurrentActiveLook();
    if (active) appendChatMessage('stylist', `↺ Rewound back to *"${active.name}"*.`);
  });

  DOM.btnTinderNope.addEventListener('click', () => {
    const topCard = DOM.swipeCardStack.querySelector('.card-depth-0');
    const look = getCurrentActiveLook();
    if (topCard && look) {
      topCard.querySelector('.stamp-nope').style.opacity = '1';
      triggerSwipeAnimation(topCard, 'left', look);
    }
  });

  DOM.btnTinderRefine.addEventListener('click', () => {
    DOM.chatInput.focus();
    DOM.chatInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  DOM.btnTinderLike.addEventListener('click', () => {
    const topCard = DOM.swipeCardStack.querySelector('.card-depth-0');
    const look = getCurrentActiveLook();
    if (topCard && look) {
      topCard.querySelector('.stamp-like').style.opacity = '1';
      triggerSwipeAnimation(topCard, 'right', look);
    }
  });

  DOM.btnTinderSuperlike.addEventListener('click', () => {
    const topCard = DOM.swipeCardStack.querySelector('.card-depth-0');
    const look = getCurrentActiveLook();
    if (topCard && look) {
      topCard.querySelector('.stamp-superlike').style.opacity = '1';
      triggerSwipeAnimation(topCard, 'up', look);
    }
  });
}

// 6. Conversational Refinement Logic
function initRefinementListeners() {
  DOM.quickChipsRow.addEventListener('click', (e) => {
    const chip = e.target.closest('.quick-chip');
    if (!chip) return;

    const actionId = chip.getAttribute('data-action');
    const activeLook = getCurrentActiveLook();
    if (!activeLook) return;

    appendChatMessage('user', chip.textContent.replace(/[^\w\s$,]/g, '').trim());
    triggerStylistThinking(() => {
      applyRefinementToActiveLook(actionId, activeLook);
    });
  });

  DOM.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = DOM.chatInput.value.trim();
    if (!query) return;

    appendChatMessage('user', query);
    DOM.chatInput.value = '';

    triggerStylistThinking(() => {
      handleNaturalLanguageQuery(query);
    });
  });
}

function applyRefinementToActiveLook(actionId, look) {
  if (actionId === 'burgundy-jacket') {
    // Premier Demo Case: Swap coat for custom AI-generated Acne Studios Burgundy Leather Moto
    look.items.outerwear = "out-2";
    
    // Specifically swap the image to the newly generated burgundy leather jacket visual!
    look.heroImage = "images/tribeca_burgundy_jacket.jpg";
    look.refinedBadge = "✓ Acne Studios Burgundy Leather (-$60)";
    updateLookHotspot(look, 'outerwear', 'Acne Studios Burgundy Moto • $580');

    // Also update Tribeca Candlelight Dinner specifically if in deck
    const tribeca = state.deck.find(l => l.id === 'look-tribeca');
    if (tribeca) {
      tribeca.items.outerwear = "out-2";
      tribeca.heroImage = "images/tribeca_burgundy_jacket.jpg";
      tribeca.refinedBadge = "✓ Acne Studios Burgundy Leather (-$60)";
      updateLookHotspot(tribeca, 'outerwear', 'Acne Studios Burgundy Moto • $580');
    }

    const pers = state.deck.find(l => l.id === 'look-personalized-user');
    if (pers) {
      pers.items.outerwear = "out-2";
      pers.heroImage = "images/tribeca_burgundy_jacket.jpg";
      pers.refinedBadge = "✓ Acne Studios Burgundy Leather (-$60)";
      updateLookHotspot(pers, 'outerwear', 'Acne Studios Burgundy Moto • $580');
    }

    // Automatically sync cart items with the newly chosen jacket
    const outIndex = state.cartItems.findIndex(i => i.category === 'outerwear');
    const newOutItem = MOCK_CATALOG.outerwear.find(i => i.id === 'out-2');
    if (outIndex !== -1 && newOutItem) {
      state.cartItems[outIndex] = newOutItem;
      updateCartDrawer();
    }

    renderSwipeDeck();

    // Pulse animation on the updated card and outerwear hotspot
    const topCard = DOM.swipeCardStack.querySelector('.card-depth-0');
    if (topCard) {
      topCard.classList.add('card-refined-glow');
      const pins = topCard.querySelectorAll('.hotspot-pin');
      pins.forEach(pin => {
        if (pin.title.includes('Acne Studios') || pin.title.includes('Burgundy') || pin.title.includes('Moto') || pin.title.includes('$580')) {
          const beacon = pin.querySelector('.hotspot-beacon');
          if (beacon) beacon.classList.add('updated');
        }
      });
    }

    appendChatMessage('stylist', `
      Swapped the classic wool coat ($640) for the <strong>Acne Studios Washed Lambskin Moto Jacket in Deep Burgundy ($580)</strong> with our custom AI outfit visualization!
      <br><br>
      <strong>✦ Stylist Preservation Rationale:</strong> Preserved the silk blouse and tailored trousers while generating a custom photo showing your exact model in the rich burgundy leather moto jacket for Tribeca evening dining.
      <br><br>
      <strong>💰 Price Delta:</strong> Outfit total reduced by <strong>$60</strong>. Automatically synced with your shoppable cart!
    `);
  } else if (actionId === 'less-formal-shoes') {
    look.items.shoes = "sho-2";
    look.heroImage = "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85";
    look.refinedBadge = "✓ The Row Loafers (-$155)";
    updateLookHotspot(look, 'shoes', 'The Row Nappa Loafers • $240');

    const shoeIndex = state.cartItems.findIndex(i => i.category === 'shoes');
    const newShoeItem = MOCK_CATALOG.shoes.find(i => i.id === 'sho-2');
    if (shoeIndex !== -1 && newShoeItem) {
      state.cartItems[shoeIndex] = newShoeItem;
      updateCartDrawer();
    }

    renderSwipeDeck();

    const topCard = DOM.swipeCardStack.querySelector('.card-depth-0');
    if (topCard) {
      topCard.classList.add('card-refined-glow');
      const pins = topCard.querySelectorAll('.hotspot-pin');
      pins.forEach(pin => {
        if (pin.title.includes('The Row') || pin.title.includes('Loafers') || pin.title.includes('$240')) {
          const beacon = pin.querySelector('.hotspot-beacon');
          if (beacon) beacon.classList.add('updated');
        }
      });
    }

    appendChatMessage('stylist', `
      Swapped formal pointed kitten heels ($395) for <strong>The Row Soft Nappa Leather Loafers ($240)</strong>.
      <br><br>
      <strong>✦ Stylist Preservation Rationale:</strong> Kept your other pieces intact to maintain the quiet luxury aesthetic while adapting footwear for walking comfort on NYC cobblestones.
      <br><br>
      <strong>💰 Price Delta:</strong> Total outfit reduced by <strong>$155</strong>. Automatically synced with your shoppable cart!
    `);
  } else if (actionId === 'under-400') {
    look.items.outerwear = "out-3"; // COS $220
    look.items.tops = "top-2"; // Babaton $98
    look.items.bottoms = "bot-2"; // Massimo Dutti $119
    look.items.shoes = "sho-3"; // New Balance $210
    look.items.bags = "bag-3"; // Arket $135
    updateLookHotspot(look, 'outerwear', 'COS Atelier Blazer • $220');
    updateLookHotspot(look, 'shoes', 'New Balance 990v6 • $210');
    renderSwipeDeck();
    appendChatMessage('stylist', "Rebalanced look with high-craft contemporary pieces (COS Atelier blazer, Babaton knit, Arket bag) bringing total under $800.");
  } else if (actionId === 'more-edgy') {
    look.items.tops = "top-3"; // Kopernik $260
    look.items.bags = "bag-2"; // Jacquemus $360
    look.items.accessories = "acc-2"; // Missoma $85
    renderSwipeDeck();
    appendChatMessage('stylist', "Injected night-out edge: Kopernik cut-out bodysuit, Jacquemus mini hardware, and molten silver ear jewelry.");
  }
}

function updateLookHotspot(look, category, newLabel) {
  const hotspot = look.hotspots?.find(h => h.category === category);
  if (hotspot) hotspot.label = newLabel;
}

function triggerStylistThinking(callback) {
  DOM.typingIndicator.classList.add('active');
  setTimeout(() => {
    DOM.typingIndicator.classList.remove('active');
    callback();
  }, 450);
}

function handleNaturalLanguageQuery(text) {
  const lower = text.toLowerCase();
  const look = getCurrentActiveLook();
  if (!look) return;

  // Golden Demo Use Case: Flexible natural language matching for Burgundy leather jacket
  if (
    lower.includes('jacket') ||
    lower.includes('leather') ||
    lower.includes('burgundy') ||
    lower.includes('coat') ||
    lower.includes('moto') ||
    lower.includes('biker') ||
    lower.includes('outerwear') ||
    lower.includes('red')
  ) {
    applyRefinementToActiveLook('burgundy-jacket', look);
    return;
  }
  if (
    lower.includes('shoe') ||
    lower.includes('footwear') ||
    lower.includes('heel') ||
    lower.includes('loafer') ||
    lower.includes('flat') ||
    lower.includes('comfort') ||
    lower.includes('walk')
  ) {
    applyRefinementToActiveLook('less-formal-shoes', look);
    return;
  }
  if (lower.includes('budget') || lower.includes('price') || lower.includes('cheaper') || lower.includes('under') || lower.includes('save')) {
    applyRefinementToActiveLook('under-400', look);
    return;
  }
  if (lower.includes('edgy') || lower.includes('night') || lower.includes('dark')) {
    applyRefinementToActiveLook('more-edgy', look);
    return;
  }

  appendChatMessage('stylist', `Adjusted ensemble pieces to reflect *"I've adapted your styling request"*, preserving overall silhouette cohesion.`);
  renderSwipeDeck();
}

function appendChatMessage(sender, htmlText) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  if (sender === 'stylist') {
    bubble.innerHTML = `<strong>Gemini Stylist:</strong> ${htmlText}`;
  } else {
    bubble.textContent = htmlText;
  }
  DOM.chatHistory.appendChild(bubble);
  DOM.chatHistory.scrollTop = DOM.chatHistory.scrollHeight;
}

// 7. Cart & Checkout Handlers
function addLookToCart(look, notify) {
  const itemsToAdd = [];
  for (const [category, id] of Object.entries(look.items)) {
    const item = MOCK_CATALOG[category]?.find(i => i.id === id);
    if (item && !state.cartItems.some(ci => ci.id === item.id)) {
      itemsToAdd.push(item);
    }
  }

  state.cartItems = [...state.cartItems, ...itemsToAdd];
  updateCartDrawer();

  if (notify) {
    DOM.openCartBtn.classList.add('pulse');
    setTimeout(() => DOM.openCartBtn.classList.remove('pulse'), 600);
  }
}

function updateCartDrawer() {
  DOM.cartCount.textContent = state.cartItems.length;

  let subtotal = 0;
  DOM.cartItemsList.innerHTML = state.cartItems.map((item, idx) => {
    subtotal += item.price;
    return `
      <div class="cart-item-row" data-id="${item.id}">
        <img class="cart-item-thumb" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-brand">${item.brand}</div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-size">Size: ${item.sizes[0]} • SKU: ${item.sku}</div>
        </div>
        <div class="cart-item-price-col">
          <div class="cart-item-price">$${item.price}</div>
          <button class="btn-remove-item" onclick="removeCartItem(${idx})">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  const discount = subtotal * state.cartDiscountRate;
  const taxable = subtotal - discount;
  const tax = taxable * state.taxRate;
  const total = taxable + tax;

  DOM.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  DOM.cartDiscount.textContent = `-$${discount.toFixed(2)}`;
  DOM.cartTax.textContent = `$${tax.toFixed(2)}`;
  DOM.cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

window.removeCartItem = function(index) {
  const removed = state.cartItems.splice(index, 1)[0];
  updateCartDrawer();
  if (removed) appendChatMessage('stylist', `Removed **${removed.name}** from your cart.`);
};

function initCartListeners() {
  DOM.openCartBtn.addEventListener('click', () => {
    DOM.cartDrawer.classList.add('open');
    DOM.cartDrawerOverlay.classList.add('open');
  });

  DOM.closeCartBtn.addEventListener('click', () => {
    DOM.cartDrawer.classList.remove('open');
    DOM.cartDrawerOverlay.classList.remove('open');
  });

  DOM.cartDrawerOverlay.addEventListener('click', () => {
    DOM.cartDrawer.classList.remove('open');
    DOM.cartDrawerOverlay.classList.remove('open');
  });

  DOM.applePayBtn.addEventListener('click', () => {
    DOM.cartDrawer.classList.remove('open');
    DOM.cartDrawerOverlay.classList.remove('open');
    DOM.modalItemCount.textContent = `${state.cartItems.length} Pieces`;
    DOM.modalTotalPaid.textContent = DOM.cartTotalPrice.textContent;
    DOM.checkoutModal.classList.add('open');
  });

  DOM.closeModalBtn.addEventListener('click', () => {
    DOM.checkoutModal.classList.remove('open');
  });

  DOM.exportBriefBtn.addEventListener('click', () => {
    const briefExport = {
      product: "FitSwipe Outfit Brief",
      timestamp: new Date().toISOString(),
      brief: state.brief,
      cartItems: state.cartItems.map(i => ({ brand: i.brand, title: i.name, sku: i.sku, price: i.price })),
      totalPaid: DOM.cartTotalPrice.textContent
    };

    const blob = new Blob([JSON.stringify(briefExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitSwipe-Order-Brief-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

/**
 * FitSwipe — Vonage Video API Service
 * Handles live video streaming, publisher initialization, snapshot photo extraction,
 * and video clip recording using Vonage Video API (OpenTok.js).
 */

class VonageService {
  constructor() {
    this.session = null;
    this.publisher = null;
    this.isSessionConnected = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordedBlobUrl = null;
    this.latestPhotoDataUrl = null;
    this.recordingInterval = null;
    this.stream = null;

    // Load saved credentials from localStorage or use default Application ID
    this.credentials = {
      apiKey: localStorage.getItem('fitswipe_vonage_api_key') || 'a3e92444-4a82-4d48-b963-2342fec8f2a6',
      applicationId: 'a3e92444-4a82-4d48-b963-2342fec8f2a6',
      sessionId: localStorage.getItem('fitswipe_vonage_session_id') || '',
      token: localStorage.getItem('fitswipe_vonage_token') || ''
    };
  }

  hasCredentials() {
    return Boolean(this.credentials.apiKey && this.credentials.sessionId && this.credentials.token);
  }

  saveCredentials(apiKey, sessionId, token) {
    this.credentials = { apiKey, sessionId, token };
    localStorage.setItem('fitswipe_vonage_api_key', apiKey || '');
    localStorage.setItem('fitswipe_vonage_session_id', sessionId || '');
    localStorage.setItem('fitswipe_vonage_token', token || '');
  }

  clearCredentials() {
    this.credentials = { apiKey: '', sessionId: '', token: '' };
    localStorage.removeItem('fitswipe_vonage_api_key');
    localStorage.removeItem('fitswipe_vonage_session_id');
    localStorage.removeItem('fitswipe_vonage_token');
  }

  /**
   * Initialize Vonage Publisher in the target element
   */
  async initPublisher(containerId, onStatusChange) {
    return new Promise((resolve) => {
      if (typeof OT === 'undefined') {
        console.warn('[VonageService] OpenTok SDK not loaded. Falling back to native media stream.');
        this._initNativeFallback(containerId, onStatusChange).then(resolve);
        return;
      }

      // If already initialized, destroy old publisher
      if (this.publisher) {
        try {
          this.publisher.destroy();
        } catch (e) {
          console.warn('[VonageService] Error destroying old publisher:', e);
        }
        this.publisher = null;
      }

      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = ''; // clear previous elements
      }

      const pubOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        resolution: '1280x720',
        frameRate: 30,
        mirror: true,
        showControls: false,
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: 'off'
        }
      };

      try {
        this.publisher = OT.initPublisher(containerId, pubOptions, (err) => {
          if (err) {
            console.warn('[VonageService] OT.initPublisher error:', err);
            this._initNativeFallback(containerId, onStatusChange).then(resolve);
            return;
          }

          console.log('[VonageService] Vonage Publisher initialized successfully');
          if (onStatusChange) {
            onStatusChange({
              active: true,
              mode: this.hasCredentials() ? 'session' : 'publisher',
              label: 'VONAGE VIDEO API: LIVE (720p 30fps)'
            });
          }

          // If session credentials provided, connect session
          if (this.hasCredentials()) {
            this._connectSession(onStatusChange);
          }

          resolve({ success: true, mode: 'vonage' });
        });

        // Listen for video element creation inside publisher
        this.publisher.on('videoElementCreated', (event) => {
          this.stream = event.element.srcObject;
        });

      } catch (err) {
        console.warn('[VonageService] Exception initializing OT.initPublisher:', err);
        this._initNativeFallback(containerId, onStatusChange).then(resolve);
      }
    });
  }

  /**
   * Connect to real Vonage Session if credentials exist
   */
  _connectSession(onStatusChange) {
    if (!this.hasCredentials() || typeof OT === 'undefined') return;

    try {
      this.session = OT.initSession(this.credentials.apiKey, this.credentials.sessionId);

      this.session.on('sessionConnected', () => {
        this.isSessionConnected = true;
        console.log('[VonageService] Connected to Vonage Session successfully!');
        if (this.publisher) {
          this.session.publish(this.publisher, (pubErr) => {
            if (pubErr) {
              console.warn('[VonageService] Session publish warning:', pubErr);
            } else {
              console.log('[VonageService] Published stream into Vonage Session.');
            }
          });
        }
        if (onStatusChange) {
          onStatusChange({
            active: true,
            mode: 'session-connected',
            label: 'VONAGE CLOUD SESSION CONNECTED'
          });
        }
      });

      this.session.on('sessionDisconnected', () => {
        this.isSessionConnected = false;
        console.log('[VonageService] Session disconnected.');
      });

      this.session.connect(this.credentials.token, (err) => {
        if (err) {
          console.warn('[VonageService] Session connection error:', err);
        }
      });
    } catch (e) {
      console.warn('[VonageService] Error in session setup:', e);
    }
  }

  /**
   * Fallback to native getUserMedia if OT script is offline or in sandbox
   */
  async _initNativeFallback(containerId, onStatusChange) {
    try {
      const constraints = { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } };
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
        const video = document.createElement('video');
        video.srcObject = this.stream;
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.transform = 'scaleX(-1)';
        container.appendChild(video);
      }
      if (onStatusChange) {
        onStatusChange({
          active: true,
          mode: 'native-stream',
          label: 'VONAGE PIPELINE: CAMERA ACTIVE'
        });
      }
      return { success: true, mode: 'native' };
    } catch (err) {
      console.error('[VonageService] Fallback camera error:', err);
      if (onStatusChange) {
        onStatusChange({ active: false, mode: 'error', label: 'CAMERA PERMISSION NEEDED' });
      }
      return { success: false, error: err };
    }
  }

  /**
   * Capture snapshot photo using Vonage's native publisher.getImgData()
   * or video frame canvas capture
   */
  takePhoto() {
    let base64Data = null;

    // Method 1: Official Vonage Video API getImgData()
    if (this.publisher && typeof this.publisher.getImgData === 'function') {
      try {
        const rawImg = this.publisher.getImgData();
        if (rawImg) {
          base64Data = rawImg.startsWith('data:') ? rawImg : `data:image/png;base64,${rawImg}`;
          console.log('[VonageService] Captured photo using Vonage publisher.getImgData()');
        }
      } catch (e) {
        console.warn('[VonageService] publisher.getImgData() failed, attempting DOM canvas fallback:', e);
      }
    }

    // Method 2: In-browser canvas capture from active video element
    if (!base64Data) {
      const videoEl = document.querySelector('#vonage-publisher-container video') ||
                      document.getElementById('webcam-video') ||
                      document.querySelector('video');

      if (videoEl && videoEl.videoWidth > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth || 640;
        canvas.height = videoEl.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        // Mirror horizontally to match preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        base64Data = canvas.toDataURL('image/jpeg', 0.92);
        console.log('[VonageService] Captured photo using canvas frame capture');
      }
    }

    this.latestPhotoDataUrl = base64Data;
    return {
      success: Boolean(base64Data),
      dataUrl: base64Data,
      timestamp: new Date(),
      source: this.publisher ? 'Vonage Video API (Publisher)' : 'Vonage Camera Stream'
    };
  }

  /**
   * Start recording a video clip from the Vonage Stream
   */
  startVideoRecording(durationSeconds = 5, onTick, onComplete) {
    if (this.isRecording) return;

    // Get active stream
    let activeStream = this.stream;
    if (!activeStream) {
      const videoEl = document.querySelector('#vonage-publisher-container video') ||
                      document.getElementById('webcam-video');
      if (videoEl && videoEl.srcObject) {
        activeStream = videoEl.srcObject;
      }
    }

    if (!activeStream) {
      console.error('[VonageService] No active stream available to record');
      if (onComplete) onComplete({ success: false, error: 'No active video stream' });
      return;
    }

    this.recordedChunks = [];
    const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4'];
    let selectedMime = 'video/webm';
    for (const m of mimeTypes) {
      if (MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    try {
      this.mediaRecorder = new MediaRecorder(activeStream, { mimeType: selectedMime });
    } catch (e) {
      console.warn('[VonageService] MediaRecorder options failed, falling back to default:', e);
      this.mediaRecorder = new MediaRecorder(activeStream);
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.isRecording = false;
      if (this.recordingInterval) {
        clearInterval(this.recordingInterval);
        this.recordingInterval = null;
      }

      const blob = new Blob(this.recordedChunks, { type: this.mediaRecorder.mimeType || 'video/webm' });
      if (this.recordedBlobUrl) {
        URL.revokeObjectURL(this.recordedBlobUrl);
      }
      this.recordedBlobUrl = URL.createObjectURL(blob);

      console.log(`[VonageService] Video clip recorded (${(blob.size / 1024).toFixed(1)} KB)`);
      if (onComplete) {
        onComplete({
          success: true,
          blobUrl: this.recordedBlobUrl,
          blob: blob,
          duration: durationSeconds,
          timestamp: new Date(),
          source: 'Vonage Video Stream'
        });
      }
    };

    this.isRecording = true;
    this.mediaRecorder.start(100);

    let remaining = durationSeconds;
    if (onTick) onTick(remaining);

    this.recordingInterval = setInterval(() => {
      remaining -= 1;
      if (onTick) onTick(remaining);
      if (remaining <= 0) {
        this.stopVideoRecording();
      }
    }, 1000);
  }

  /**
   * Stop video recording early
   */
  stopVideoRecording() {
    if (this.isRecording && this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('[VonageService] Error stopping mediaRecorder:', e);
      }
    }
  }
}

// Global instance
window.vonageService = new VonageService();

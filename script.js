/**
 * Happy Birthday Website - Main Script
 * Handles: name input (in-page), card open/close, background music, confetti
 * No frameworks - vanilla JavaScript only
 */

(function () {
  'use strict';

  // ---------- DOM Elements ----------
  const btnOpenCard = document.getElementById('btn-open-card');
  const btnCloseCard = document.getElementById('btn-close-card');
  const btnCloseCard2 = document.getElementById('btn-close-card-2');
  const card = document.getElementById('card');
  const card2 = document.getElementById('card-2');
  const cardContainer = document.getElementById('card-container');
  const birthdayNameEl = document.getElementById('birthday-name');
  const musicEl = document.getElementById('birthday-music');
  const confettiContainer = document.getElementById('confetti-container');
  const cakeOverlay = document.getElementById('cake-overlay');

  const CONFETTI_DURATION = 4000;
  const MUSIC_VOLUME = 0.3;
  const DEFAULT_NAME = 'Charlie Shaine';
  const CAKE_ANIMATION_DURATION = 2500;

  let confettiInterval = null;

  /**
   * Get the birthday name (fixed for this card).
   */
  function getBirthdayName() {
    return DEFAULT_NAME;
  }

  /**
   * Update the greeting message inside the card with the given name.
   */
  function updateBirthdayMessage(name) {
    if (birthdayNameEl) {
      birthdayNameEl.textContent = name;
    }
  }

  /**
   * Open the card: add class, play music, start confetti.
   */
  function openCard() {
    if (!card) return;
    card.classList.add('is-open');
    card.setAttribute('aria-expanded', 'true');
    playMusic();
    startConfetti();
  }

  /**
   * Open second card: add class, play music, start confetti.
   */
  function openCard2() {
    if (!card2) return;
    card2.classList.add('is-open');
    card2.setAttribute('aria-expanded', 'true');
    playMusic();
    startConfetti();
  }

  /**
   * Show cake animation overlay, then after delay open the card.
   */
  function showCakeThenOpenCard() {
    if (!cakeOverlay) {
      openCard();
      return;
    }
    cakeOverlay.classList.add('is-active');
    setTimeout(function () {
      cakeOverlay.classList.remove('is-active');
      openCard();
      var cardSection = document.getElementById('card-section');
      if (cardSection) {
        cardSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, CAKE_ANIMATION_DURATION);
  }

  /**
   * Close the card: remove class, pause music, stop confetti.
   */
  function closeCard() {
    if (!card) return;
    card.classList.remove('is-open');
    card.setAttribute('aria-expanded', 'false');
    pauseMusic();
    stopConfetti();
  }

  /**
   * Close second card: remove class, pause music, stop confetti.
   */
  function closeCard2() {
    if (!card2) return;
    card2.classList.remove('is-open');
    card2.setAttribute('aria-expanded', 'false');
    pauseMusic();
    stopConfetti();
  }

  /**
   * Toggle card open/closed (used when clicking or using keyboard on the card).
   */
  function toggleCard() {
    if (card.classList.contains('is-open')) {
      closeCard();
    } else {
      showCakeThenOpenCard();
    }
  }

  /**
   * Set and play background music at 30% volume.
   */
  function playMusic() {
    if (!musicEl) return;
    musicEl.volume = MUSIC_VOLUME;
    musicEl.play().catch(function (err) {
      console.warn('Audio play failed (user interaction or policy):', err);
    });
  }

  /**
   * Pause background music.
   */
  function pauseMusic() {
    if (musicEl) {
      musicEl.pause();
    }
  }

  /**
   * Create a single confetti piece and append to container.
   */
  function createConfettiPiece() {
    var piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = [
      '#e91e63', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#ff5722'
    ][Math.floor(Math.random() * 7)];
    var duration = CONFETTI_DURATION * 0.7 + Math.random() * CONFETTI_DURATION * 0.5;
    piece.style.animationDuration = duration + 'ms';
    piece.style.animationName = 'confetti-fall';
    confettiContainer.appendChild(piece);
    setTimeout(function () {
      if (piece.parentNode) {
        piece.parentNode.removeChild(piece);
      }
    }, duration + 100);
  }

  /**
   * Start confetti burst: spawn many pieces over a short time.
   */
  function startConfetti() {
    stopConfetti();
    var count = 0;
    var maxPieces = 60;
    var spawnInterval = 40;
    confettiInterval = setInterval(function () {
      createConfettiPiece();
      count++;
      if (count >= maxPieces) {
        clearInterval(confettiInterval);
        confettiInterval = null;
      }
    }, spawnInterval);
  }

  /**
   * Stop confetti: clear interval and remove all pieces.
   */
  function stopConfetti() {
    if (confettiInterval) {
      clearInterval(confettiInterval);
      confettiInterval = null;
    }
    if (confettiContainer) {
      confettiContainer.innerHTML = '';
    }
  }

  /**
   * Handle card click: open if closed; if open, close only when clicking close button or outside message.
   */
  function onCardClick(e) {
    if (e.target.closest('.btn-close-card')) {
      e.preventDefault();
      e.stopPropagation();
      closeCard();
      return;
    }
    if (card.classList.contains('is-open')) {
      closeCard();
    } else {
      showCakeThenOpenCard();
    }
  }

  /**
   * Handle second card click: open if closed; if open, close.
   */
  function onCard2Click(e) {
    if (e.target.closest('.btn-close-card')) {
      e.preventDefault();
      e.stopPropagation();
      closeCard2();
      return;
    }
    if (card2.classList.contains('is-open')) {
      closeCard2();
    } else {
      // reuse cake animation then open second card
      if (!cakeOverlay) {
        openCard2();
      } else {
        cakeOverlay.classList.add('is-active');
        setTimeout(function () {
          cakeOverlay.classList.remove('is-active');
          openCard2();
          var cardSection2 = document.getElementById('card-section-2');
          if (cardSection2) {
            cardSection2.scrollIntoView({ behavior: 'smooth' });
          }
        }, CAKE_ANIMATION_DURATION);
      }
    }
  }

  /**
   * Handle keyboard: Enter/Space on card toggles; Escape closes.
   */
  function onCardKeydown(e) {
    if (e.key === 'Escape') {
      closeCard();
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCard();
    }
  }

  // ---------- Initialize ----------
  (function init() {
    updateBirthdayMessage(getBirthdayName());

    if (btnOpenCard) {
      btnOpenCard.addEventListener('click', function () {
        showCakeThenOpenCard();
      });
    }

    if (btnCloseCard) {
      btnCloseCard.addEventListener('click', function (e) {
        e.stopPropagation();
        closeCard();
      });
    }

    if (btnCloseCard2) {
      btnCloseCard2.addEventListener('click', function (e) {
        e.stopPropagation();
        closeCard2();
      });
    }

    if (card) {
      card.addEventListener('click', onCardClick);
      card.addEventListener('keydown', onCardKeydown);
    }

    if (card2) {
      card2.addEventListener('click', onCard2Click);
      card2.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeCard2();
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (card2.classList.contains('is-open')) {
            closeCard2();
          } else {
            onCard2Click(e);
          }
        }
      });
    }
  })();
})();

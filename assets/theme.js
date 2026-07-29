/* =========================================================================
   MATRIARCH COFFEE — theme.js
   Small, dependency-free progressive enhancements:
   - mobile nav drawer
   - product-card quantity stepper
   - product-card variant radio -> hidden id field
   - product-card AJAX add-to-cart (falls back to a normal form post)
   - featured collection carousel prev/next buttons
   ========================================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initQuantitySteppers();
    initVariantRadios();
    initAddToCartForms();
    initCarousels();
  });

  /* ---- Mobile nav drawer ------------------------------------------- */
  function initNav() {
    document.querySelectorAll('[data-nav-toggle]').forEach(function (toggle) {
      var navId = toggle.getAttribute('aria-controls');
      var nav = navId ? document.getElementById(navId) : null;
      if (!nav) return;

      toggle.addEventListener('click', function () {
        var isOpen = nav.getAttribute('data-open') === 'true';
        nav.setAttribute('data-open', String(!isOpen));
        nav.setAttribute('aria-hidden', String(isOpen));
        toggle.setAttribute('aria-expanded', String(!isOpen));
      });

      nav.querySelectorAll('[data-nav-close]').forEach(function (closeBtn) {
        closeBtn.addEventListener('click', function () {
          nav.setAttribute('data-open', 'false');
          nav.setAttribute('aria-hidden', 'true');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });
  }

  /* ---- Quantity steppers --------------------------------------------- */
  function initQuantitySteppers() {
    document.querySelectorAll('[data-quantity-field]').forEach(function (field) {
      var input = field.querySelector('input[type="number"]');
      var decrease = field.querySelector('[data-qty-decrease]');
      var increase = field.querySelector('[data-qty-increase]');
      if (!input) return;

      if (decrease) {
        decrease.addEventListener('click', function () {
          var value = parseInt(input.value, 10) || 1;
          input.value = Math.max(1, value - 1);
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }

      if (increase) {
        increase.addEventListener('click', function () {
          var value = parseInt(input.value, 10) || 1;
          input.value = value + 1;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
    });
  }

  /* ---- Variant radio -> hidden id field ------------------------------- */
  function initVariantRadios() {
    document.querySelectorAll('[data-variant-id]').forEach(function (hiddenInput) {
      var form = hiddenInput.closest('form');
      if (!form) return;

      form.querySelectorAll('[data-variant-radio]').forEach(function (radio) {
        radio.addEventListener('change', function () {
          if (radio.checked) hiddenInput.value = radio.value;
        });
      });
    });
  }

  /* ---- AJAX add-to-cart ------------------------------------------------ */
  function initAddToCartForms() {
    document.querySelectorAll('.product-card__form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var formData = new FormData(form);

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Add to cart failed');
            return response.json();
          })
          .then(function () {
            return fetch('/cart.js', { headers: { Accept: 'application/json' } });
          })
          .then(function (response) { return response.json(); })
          .then(function (cart) {
            document.querySelectorAll('[data-cart-count]').forEach(function (el) {
              el.textContent = cart.item_count;
            });
          })
          .catch(function () {
            // Fall back to a normal (non-AJAX) submit if anything goes wrong.
            HTMLFormElement.prototype.submit.call(form);
          });
      });
    });
  }

  /* ---- Featured collection carousel ------------------------------------ */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (track) {
      var section = track.closest('[data-section-type="featured-collection-carousel"]');
      if (!section) return;

      var prevBtn = section.querySelector('[data-carousel-prev]');
      var nextBtn = section.querySelector('[data-carousel-next]');
      if (!prevBtn || !nextBtn) return;

      function scrollByCard(direction) {
        var card = track.querySelector('.product-card');
        var amount = card ? card.getBoundingClientRect().width + 16 : 320;
        track.scrollBy({ left: amount * direction, behavior: 'smooth' });
      }

      prevBtn.addEventListener('click', function () { scrollByCard(-1); });
      nextBtn.addEventListener('click', function () { scrollByCard(1); });

      function updateNavState() {
        var maxScroll = track.scrollWidth - track.clientWidth - 1;
        prevBtn.disabled = track.scrollLeft <= 0;
        nextBtn.disabled = track.scrollLeft >= maxScroll;
      }

      track.addEventListener('scroll', updateNavState);
      window.addEventListener('resize', updateNavState);
      updateNavState();
    });
  }
})();

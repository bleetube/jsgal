import PhotoSwipeLightbox from './node_modules/photoswipe/dist/photoswipe-lightbox.esm.js';
import './node_modules/photoswipe/dist/photoswipe.css';
import './gallery.css';

import { yall } from "./node_modules/yall-js";

// Invoke!
yall();

const options = {
    gallery: '#my-gallery',
    children:'a',
    pswpModule: () => import('./node_modules/photoswipe/dist/photoswipe.esm.js')
};

const lightbox = new PhotoSwipeLightbox(options);

lightbox.on('uiRegister', function() {

  // zoom level indicator
  lightbox.pswp.ui.registerElement({
    name: 'zoom-level-indicator',
    order: 9,
    onInit: (el, pswp) => {
      pswp.on('zoomPanUpdate', (e) => {
        if (e.slide === pswp.currSlide) {
          el.innerText = Math.round(pswp.currSlide.currZoomLevel * 100) + '%';
        }
      });
    }
  });

  // download button
  lightbox.pswp.ui.registerElement({
    name: 'download-button',
    order: 8,
    isButton: true,
    tagName: 'a',

    // SVG with outline
    html: {
      isCustomSVG: true,
      inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
      outlineID: 'pswp__icn-download'
    },

    // Or provide full svg:
    // html: '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" class="pswp__icn"><path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" /></svg>',

    // Or provide any other markup:
    // html: '<i class="fa-solid fa-download"></i>' 

    onInit: (el, pswp) => {
      el.setAttribute('download', '');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');

      pswp.on('change', () => {
        console.log('change');
        el.href = pswp.currSlide.data.src;
      });
    }
  });
});

lightbox.init();
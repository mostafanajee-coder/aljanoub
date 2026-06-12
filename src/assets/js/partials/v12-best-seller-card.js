class V12BestSellerCard extends HTMLElement {
    connectedCallback() {
        if (!this.product) {
            return salla.logger.warn('v12-best-seller-card:: product does not exist!');
        }
        salla.onReady(() => this.render());
    }

    render() {
        this.setAttribute('id', `v12-product-${this.product.id}`);
        // Add the primary class for hover effects and structure
        this.classList.add('product-card');
        
        // Force the host element to display as flex column to respect the grid
        this.style.display = 'flex';
        this.style.flexDirection = 'column';
        this.style.height = '100%';

        let imageHtml = '';
        if (this.product.image && this.product.image.url) {
            // Give fixed height or aspect ratio via CSS in index.twig, but here we just ensure it fills .p-visual
            imageHtml = `<img src="${this.product.image.url}" alt="${this.product.image.alt || this.product.name}" style="width: 100%; height: 100%; object-fit: contain; padding: 10px;">`;
        } else {
            imageHtml = `<div class="art-box art-coffee-bag">🛒</div>`;
        }

        let priceHtml = '';
        if (this.product.is_on_sale) {
             priceHtml = `<div class="p-price" style="font-weight:bold;">${salla.money(this.product.sale_price)} <span style="text-decoration: line-through; font-size: 0.75em; color: #888; margin-right: 4px; font-weight:normal;">${salla.money(this.product.regular_price)}</span></div>`;
        } else {
             priceHtml = `<div class="p-price" style="font-weight:bold;">${salla.money(this.product.price)}</div>`;
        }

        let badgeHtml = '';
        if (this.product.is_on_sale) {
             badgeHtml = `<span class="p-badge" style="background:var(--primary-color);">عرض</span>`;
        } else {
             badgeHtml = `<span class="p-badge" style="background:var(--secondary-color);">مميز</span>`;
        }

        this.innerHTML = `
          ${badgeHtml}
          <div class="p-visual" style="height: 220px; background: var(--bg-alt); display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid var(--border-color); position: relative;">
            <a href="${this.product.url}" style="width: 100%; height: 100%; display: block; z-index: 2;">
               ${imageHtml}
            </a>
          </div>
          <div class="p-info" style="padding: 20px; text-align: right; display: flex; flex-direction: column; flex: 1;">
            <div class="p-title" style="margin-bottom: 8px;">
               <a href="${this.product.url}" style="color: var(--primary-color); text-decoration: none; font-weight: 700; font-size: 1.15rem; line-height: 1.4;">${this.product.name}</a>
            </div>
            <div class="p-desc" style="color: var(--text-color); font-size: 0.9rem; line-height: 1.6; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; opacity: 0.8; flex: 1;">
               ${this.product.subtitle || ''}
            </div>
            <div class="p-rate" style="color: #f5b301; font-size: 0.9rem; margin-bottom: 15px; letter-spacing: 2px;">★★★★★</div>
            <div class="p-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 15px; border-top: 1px solid var(--border-color);">
              ${priceHtml}
              <salla-add-product-button product-status="${this.product.status}" product-id="${this.product.id}" product-type="${this.product.type}" loader-position="center" class="alj-pill-btn">
              </salla-add-product-button>
            </div>
          </div>
        `;
    }
}

if (!customElements.get('v12-best-seller-card')) {
    customElements.define('v12-best-seller-card', V12BestSellerCard);
}

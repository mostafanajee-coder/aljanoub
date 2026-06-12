class V12BestSellerCard extends HTMLElement {
    connectedCallback() {
        if (!this.product) {
            return salla.logger.warn('v12-best-seller-card:: product does not exist!');
        }
        salla.onReady(() => this.render());
    }

    render() {
        this.setAttribute('id', `v12-product-${this.product.id}`);
        // We do not add 'product-card' here because <salla-products-list> might apply its own wrappers,
        // but wait, if we are the component, we are the host. 
        // We'll add 'product-card' class to ourselves so our CSS applies correctly.
        this.classList.add('product-card');

        let imageHtml = '';
        if (this.product.image && this.product.image.url) {
            imageHtml = `<img src="${this.product.image.url}" alt="${this.product.image.alt || this.product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            imageHtml = `<div class="art-box art-coffee-bag">🛒</div>`;
        }

        let priceHtml = '';
        if (this.product.is_on_sale) {
             priceHtml = `<div class="p-price">${salla.money(this.product.sale_price)} <span style="text-decoration: line-through; font-size: 0.7em; color: #888; margin-right: 4px;">${salla.money(this.product.regular_price)}</span></div>`;
        } else {
             priceHtml = `<div class="p-price">${salla.money(this.product.price)}</div>`;
        }

        let badgeHtml = '';
        if (this.product.is_on_sale) {
             badgeHtml = `<span class="p-badge" style="background:var(--primary-color);">عرض</span>`;
        } else {
             badgeHtml = `<span class="p-badge">مميز</span>`;
        }

        this.innerHTML = `
          ${badgeHtml}
          <div class="p-visual" style="overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <a href="${this.product.url}" style="width: 100%; height: 100%; display: block;">
               ${imageHtml}
            </a>
          </div>
          <div class="p-info">
            <div class="p-title"><a href="${this.product.url}" style="color: inherit; text-decoration: none;">${this.product.name}</a></div>
            <div class="p-desc" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; font-size: 0.85em; margin-bottom: 8px;">${this.product.subtitle || this.product.name}</div>
            <div class="p-rate">★★★★★</div>
            <div class="p-footer">
              ${priceHtml}
              <salla-add-product-button product-status="${this.product.status}" product-id="${this.product.id}" product-type="${this.product.type}" loader-position="center" class="p-add-btn" style="border:none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              </salla-add-product-button>
            </div>
          </div>
        `;
    }
}

if (!customElements.get('v12-best-seller-card')) {
    customElements.define('v12-best-seller-card', V12BestSellerCard);
}

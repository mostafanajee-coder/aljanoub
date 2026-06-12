/**
 * V12O Dynamic Header Navigation / Client-Side Menu Binding
 * Fetches store categories from Salla's Navigation Menu SDK API,
 * filters out generic links, and binds them to the custom storefront header.
 */

const IGNORED_TITLES = [
  'الرئيسية', 'الرئيسيه', 'من نحن', 'المدونة', 'المدونه', 'الشروط', 'الاحكام', 'الشروط والأحكام', 'الشروط والاحكام',
  'سياسة الخصوصية', 'سياسة الاستبدال والاسترجاع', 'سياسه الخصوصيه', 'اتصل بنا', 'تواصل معنا', 'السلة', 'الحساب', 'تسجيل الدخول'
];

const IGNORED_URLS = [
  '/cart', '/checkout', '/login', '/register', '/search', '/contact', '/blog', '/about-us', '/terms', '/privacy'
];

function isCategoryItem(item) {
  if (!item.title || !item.url) return false;

  const cleanTitle = item.title.trim();
  const cleanUrl = item.url.toLowerCase().trim();

  // Exclude exact home links
  if (cleanUrl === '/' || cleanUrl === '' || cleanUrl === window.location.origin + '/' || cleanUrl === '#') {
    return false;
  }

  // Exclude ignored titles
  if (IGNORED_TITLES.some(ignored => cleanTitle.includes(ignored) || ignored.includes(cleanTitle))) {
    return false;
  }

  // Exclude ignored URLs
  if (IGNORED_URLS.some(ignored => cleanUrl.endsWith(ignored) || cleanUrl.includes(ignored))) {
    return false;
  }

  const isCategoryUrl = cleanUrl.includes('/c/') || cleanUrl.includes('/category/') || cleanUrl.includes('/categories/');
  const hasChildren = item.children && item.children.length > 0;
  const hasProducts = item.products && item.products.length > 0;

  return isCategoryUrl || hasChildren || hasProducts || cleanUrl.includes('/product');
}

function extractCategories(menuItems) {
  const list = [];

  function traverse(items) {
    for (const item of items) {
      if (isCategoryItem(item)) {
        if (!list.some(el => el.url === item.url || el.title === item.title)) {
          list.push(item);
        }
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(menuItems);
  return list;
}

function initDynamicHeaderMenu() {
  const container = document.getElementById('alj-header-menu');
  if (!container) return;

  if (typeof window.salla === 'undefined' || !salla.api || !salla.api.component || !salla.api.component.getMenus) {
    return;
  }

  salla.api.component.getMenus()
    .then(({ data }) => {
      if (!data || !Array.isArray(data)) return;

      const categories = extractCategories(data);
      // We need at least 3 valid dynamic categories/items to render
      if (categories.length < 3) return;

      // Keep only up to 5 dynamic categories to make space for the hardcoded Home link (6 links total)
      const displayCategories = categories.slice(0, 5);

      // Rebuild the menu container starting with Home link
      container.innerHTML = '';

      // Add "الرئيسية" Home link first
      const homeLi = document.createElement('li');
      const homeLink = document.createElement('a');
      homeLink.href = '/';
      homeLink.innerText = 'الرئيسية';
      homeLi.appendChild(homeLink);
      container.appendChild(homeLi);

      // Add dynamic categories
      displayCategories.forEach(item => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = item.url || '#';
        link.innerText = item.title || '';
        li.appendChild(link);
        container.appendChild(li);
      });
    })
    .catch(error => {
      salla.logger.error('Error fetching dynamic header menu:', error);
    });
}

salla.onReady(() => {
  initDynamicHeaderMenu();
});

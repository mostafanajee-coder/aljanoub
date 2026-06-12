/**
 * V12N Dynamic Categories Grid / Client-Side Menu Binding
 * Fetches store categories from Salla's Navigation Menu SDK API,
 * filters out generic pages, and progressively enhances the categories grid
 * using the exact same premium layout and CSS styles.
 */

const EMOJI_MAP = {
  'coffee': '☕', 'قهوة': '☕', 'القهوة': '☕',
  'dates': '🌴', 'تمر': '🌴', 'تمور': '🌴', 'التمور': '🌴',
  'cardamom': '🌿', 'هيل': '🌿', 'الهيل': '🌿',
  'saffron': '🌺', 'زعفران': '🌺', 'الزعفران': '🌺',
  'tea': '🫖', 'شاي': '🫖', 'الشاي': '🫖',
  'hospitality': '🍽️', 'ضيافة': '🍽️', 'أواني': '🍽️', 'أواني الضيافة': '🍽️',
  'camping': '⛺', 'رحلات': '⛺', 'لوازم الرحلات': '⛺',
  'tools': '⚙️', 'محضرات': '⚙️', 'أدوات': '⚙️', 'محضرات القهوة': '⚙️',
  'default': '✨'
};

const IGNORED_TITLES = [
  'الرئيسية', 'الرئيسيه', 'من نحن', 'المدونة', 'المدونه', 'الشروط', 'الاحكام', 'الشروط والأحكام', 'الشروط والاحكام',
  'سياسة الخصوصية', 'سياسة الاستبدال والاسترجاع', 'سياسه الخصوصيه', 'اتصل بنا', 'تواصل معنا', 'السلة', 'الحساب', 'تسجيل الدخول'
];

const IGNORED_URLS = [
  '/cart', '/checkout', '/login', '/register', '/search', '/contact', '/blog', '/about-us', '/terms', '/privacy'
];

function getEmojiForName(name) {
  if (!name) return EMOJI_MAP.default;
  const cleanName = name.toLowerCase().trim();
  for (const key in EMOJI_MAP) {
    if (key !== 'default' && cleanName.includes(key)) {
      return EMOJI_MAP[key];
    }
  }
  return EMOJI_MAP.default;
}

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
  return list.slice(0, 8);
}

function initDynamicCategories() {
  const container = document.getElementById('alj-categories-grid');
  if (!container) return;

  if (typeof window.salla === 'undefined' || !salla.api || !salla.api.component || !salla.api.component.getMenus) {
    return;
  }

  salla.api.component.getMenus()
    .then(({ data }) => {
      if (!data || !Array.isArray(data)) return;

      const categories = extractCategories(data);
      if (categories.length === 0) return;

      // Clear the current static grid content
      container.innerHTML = '';

      categories.forEach(item => {
        const card = document.createElement('a');
        card.href = item.url || '#';
        card.className = 'alj-v12-categories-card';

        const iconArea = document.createElement('div');
        iconArea.className = 'alj-v12-categories-icon-area';

        if (item.image) {
          const img = document.createElement('img');
          img.src = item.image;
          img.className = 'rounded-full w-full h-full object-cover';
          img.alt = item.title || 'category';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '50%';
          
          img.onerror = () => {
            img.remove();
            iconArea.innerText = getEmojiForName(item.title);
          };
          iconArea.appendChild(img);
        } else if (item.icon && !item.icon.includes('sicon-')) {
          iconArea.innerText = item.icon;
        } else if (item.icon) {
          const i = document.createElement('i');
          i.className = item.icon;
          iconArea.appendChild(i);
        } else {
          iconArea.innerText = getEmojiForName(item.title);
        }

        const nameArea = document.createElement('div');
        nameArea.className = 'alj-v12-categories-name';
        nameArea.innerText = item.title || '';

        card.appendChild(iconArea);
        card.appendChild(nameArea);
        container.appendChild(card);
      });
    })
    .catch(error => {
      // Gracefully fall back to pre-rendered static categories on error
      salla.logger.error('Error fetching dynamic categories:', error);
    });
}

salla.onReady(() => {
  initDynamicCategories();
});

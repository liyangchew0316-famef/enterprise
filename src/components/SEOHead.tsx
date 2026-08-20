import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

interface PageSeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
  jsonLd?: Record<string, any>;
}

export const SEOHead: React.FC = () => {
  const { currentView, setCurrentView, selectedProduct, setSelectedProduct, activeCategory, products } = useApp();

  // Sync URL search parameters on initial load so Google and direct links navigate directly to views/products
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const productParam = params.get('product');

      if (productParam && products.length > 0) {
        const found = products.find(p => p.id === productParam);
        if (found) {
          setSelectedProduct(found);
          setCurrentView('product_detail');
          return;
        }
      }

      if (viewParam && [
        'home', 'shop', 'product_detail', 'custom_print', 'badge_custom',
        'daily_spin', 'checkout', 'tng_payment', 'order_tracking', 'about', 'contact', 'terms'
      ].includes(viewParam)) {
        setCurrentView(viewParam as any);
      }
    } catch (e) {
      console.warn('SEO URL Sync warning:', e);
    }
  }, [products, setCurrentView, setSelectedProduct]);

  // Compute active SEO configuration
  const baseUrl = 'https://cabai.store';
  const defaultImage = `${baseUrl}/cabai_official_logo_1786624077846.jpg`;

  let seo: PageSeoConfig = {
    title: 'Cabai Enterprise | 3D Printing & Custom 3D Printed Products Malaysia',
    description: 'Cabai Enterprise is Malaysia\'s premier custom 3D printing maker studio based in Penang & Bukit Mertajam. Shop 3D printed keychains, desk accessories, toys, custom badges, and get instant custom 3D print quotes.',
    canonicalUrl: baseUrl,
    ogType: 'website',
    ogImage: defaultImage,
    keywords: 'Cabai Enterprise, Cabai 3D Printing, 3D printed products Malaysia, 3D printing Malaysia, custom 3D printing Malaysia, 3D printed toys, 3D printed accessories, custom 3D printed products, 3D printing Penang, 3D printing Bukit Mertajam'
  };

  switch (currentView) {
    case 'home':
      seo = {
        title: 'Cabai Enterprise | 3D Printing & Custom 3D Printed Products Malaysia',
        description: 'Cabai Enterprise is Malaysia\'s premier custom 3D printing maker studio based in Penang & Bukit Mertajam. Shop 3D printed keychains, desk accessories, toys, custom badges, and get instant custom 3D print quotes.',
        canonicalUrl: baseUrl,
        ogType: 'website',
        ogImage: defaultImage,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${baseUrl}/#webpage`,
          "name": "Cabai Enterprise - 3D Printing Malaysia",
          "url": baseUrl,
          "description": "Malaysia's dedicated 3D printing maker studio in Penang & Bukit Mertajam. Custom 3D printed products, keychains, desk accessories, custom badges, and rapid CAD prototyping.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`
          },
          "about": {
            "@type": "Thing",
            "name": "3D Printing & Custom Maker Products"
          }
        }
      };
      break;

    case 'shop':
      const categoryTitles: Record<string, string> = {
        keychains: '3D Printed Keychains Malaysia | Cabai Enterprise',
        badges: 'Custom 3D Badges & Pins Malaysia | Cabai Enterprise',
        custom: 'Custom 3D Printing & Drawing Studio | Cabai Enterprise',
        organizers: '3D Printed Desk Organizers & Accessories Malaysia | Cabai Enterprise',
        desk: '3D Printed Phone Stands & Holders Malaysia | Cabai Enterprise',
        home: '3D Printed Home Decor & Magnets Malaysia | Cabai Enterprise',
        all: '3D Printed Products Malaysia | Shop Keychains, Toys & Accessories | Cabai Enterprise'
      };

      const categoryDescriptions: Record<string, string> = {
        keychains: 'Shop durable 3D printed chili keychains, articulated flexi dragons, couples keyrings, and customizable tags in Malaysia by Cabai Enterprise.',
        badges: 'Design custom 3D printed pin and magnet badges in Malaysia. Upload logos, configure embossed text, and get precision PLA prints.',
        custom: 'Custom 3D printed products and interactive drawing canvas in Malaysia. Turn digital art and CAD files into physical reality.',
        organizers: 'High-quality 3D printed desk organizers, pen holders, and modular workstation accessories made in Malaysia.',
        desk: 'Ergonomic 3D printed phone stands, tablet holders, and tech accessories designed and printed in Malaysia.',
        home: 'Decorative 3D printed planters, fridge magnets, and creative home accessories by Cabai Enterprise Malaysia.',
        all: 'Browse 3D printed products in Malaysia by Cabai Enterprise. High-precision 3D printed keychains, fidget toys, desk organizers, and custom badges crafted in rigid PLA.'
      };

      const catKey = activeCategory || 'all';
      seo = {
        title: categoryTitles[catKey] || categoryTitles.all,
        description: categoryDescriptions[catKey] || categoryDescriptions.all,
        canonicalUrl: `${baseUrl}/?view=shop${activeCategory && activeCategory !== 'all' ? `&category=${activeCategory}` : ''}`,
        ogType: 'website',
        ogImage: defaultImage,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}/?view=shop#collection`,
          "name": categoryTitles[catKey] || categoryTitles.all,
          "url": `${baseUrl}/?view=shop`,
          "description": categoryDescriptions[catKey] || categoryDescriptions.all,
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": products.slice(0, 12).map((prod, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": prod.name,
              "url": `${baseUrl}/?view=product_detail&product=${prod.id}`
            }))
          }
        }
      };
      break;

    case 'product_detail':
      if (selectedProduct) {
        const prodImage = selectedProduct.images?.[0]?.startsWith('http') 
          ? selectedProduct.images[0] 
          : `${baseUrl}${selectedProduct.images?.[0] || '/cabai_official_logo_1786624077846.jpg'}`;

        seo = {
          title: `${selectedProduct.name} | 3D Printed in Malaysia | Cabai Enterprise`,
          description: `${selectedProduct.name} - ${selectedProduct.subtitle || selectedProduct.description.slice(0, 120)}. Buy custom 3D printed products in Malaysia from Cabai Enterprise. Handcrafted in Penang & Bukit Mertajam with premium PLA.`,
          canonicalUrl: `${baseUrl}/?view=product_detail&product=${selectedProduct.id}`,
          ogType: 'product',
          ogImage: prodImage,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": `${baseUrl}/?view=product_detail&product=${selectedProduct.id}#product`,
            "name": selectedProduct.name,
            "image": prodImage,
            "description": selectedProduct.description,
            "sku": selectedProduct.id,
            "brand": {
              "@type": "Brand",
              "name": "Cabai Enterprise"
            },
            "category": selectedProduct.category,
            "material": selectedProduct.specifications.material,
            "offers": {
              "@type": "Offer",
              "url": `${baseUrl}/?view=product_detail&product=${selectedProduct.id}`,
              "priceCurrency": "MYR",
              "price": selectedProduct.price.toFixed(2),
              "priceValidUntil": "2027-12-31",
              "availability": selectedProduct.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": "Cabai Enterprise",
                "url": baseUrl
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": selectedProduct.rating.toString(),
              "reviewCount": selectedProduct.reviewsCount.toString(),
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        };
      }
      break;

    case 'custom_print':
      seo = {
        title: 'Custom 3D Printing Malaysia | 3D Drawing Studio & Instant Quotes | Cabai Enterprise',
        description: 'Get instant custom 3D printing quotes in Malaysia. Draw custom 3D chili designs on our live interactive canvas or submit 3D models for fast production in Penang & Bukit Mertajam.',
        canonicalUrl: `${baseUrl}/?view=custom_print`,
        ogType: 'website',
        ogImage: defaultImage,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Custom 3D Printing & Interactive Drawing Studio",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Cabai Enterprise",
            "url": baseUrl
          },
          "serviceType": "Custom 3D Printing Service",
          "areaServed": "Malaysia",
          "description": "Custom 3D printing, rapid prototyping, and interactive chili drawing studio for physical 3D PLA/PETG production."
        }
      };
      break;

    case 'badge_custom':
      seo = {
        title: 'Custom 3D Badges & Pins Malaysia | Image Upload Studio | Cabai Enterprise',
        description: 'Design custom 3D printed badges and pins in Malaysia. Upload logos or images, add embossed text, and select pin or magnetic backing in premium PLA.',
        canonicalUrl: `${baseUrl}/?view=badge_custom`,
        ogType: 'website',
        ogImage: defaultImage,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Custom 3D Badge Customization Studio",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Cabai Enterprise",
            "url": baseUrl
          },
          "description": "Custom 3D printed badges, pins, and neodymium magnet nameplates in Malaysia."
        }
      };
      break;

    case 'about':
      seo = {
        title: 'About Cabai Enterprise | 3D Printing Studio Penang & Bukit Mertajam Malaysia',
        description: 'Learn about Cabai Enterprise, our journey from a maker joke to a leading 3D printing studio in Malaysia, and meet the 4 legends in our Hall of Glory.',
        canonicalUrl: `${baseUrl}/?view=about`,
        ogType: 'website',
        ogImage: defaultImage,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Cabai Enterprise 3D Printing Malaysia",
          "url": `${baseUrl}/?view=about`,
          "description": "The story, mission, and craftsmanship behind Cabai Enterprise 3D printing studio in Malaysia."
        }
      };
      break;

    case 'contact':
      seo = {
        title: 'Contact Cabai Enterprise | 3D Printing Malaysia Support & Inquiries',
        description: 'Contact Cabai Enterprise for custom 3D printing projects, corporate gifts, and bulk orders across Penang, Bukit Mertajam, and all Malaysia.',
        canonicalUrl: `${baseUrl}/?view=contact`,
        ogType: 'website',
        ogImage: defaultImage,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Cabai Enterprise",
          "url": `${baseUrl}/?view=contact`,
          "description": "Contact our maker studio via WhatsApp (+60 12-905 8515) or email for 3D printing quotations and support."
        }
      };
      break;

    case 'terms':
      seo = {
        title: 'Terms & Conditions | Cabai Enterprise 3D Printing Malaysia',
        description: 'Read the official Terms & Conditions for Cabai Enterprise. Information regarding 3D printed orders, custom products, prices, production, returns, and intellectual property in Malaysia.',
        canonicalUrl: `${baseUrl}/?view=terms`,
        ogType: 'website',
        ogImage: defaultImage,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms & Conditions - Cabai Enterprise",
          "url": `${baseUrl}/?view=terms`,
          "description": "Terms & Conditions for purchasing 3D-printed products and customised items from Cabai Enterprise Malaysia."
        }
      };
      break;

    case 'order_tracking':
      seo = {
        title: 'Track 3D Print Order Status | Cabai Enterprise Malaysia',
        description: 'Track your 3D printing order progress live from slicing and printing to courier dispatch across Malaysia.',
        canonicalUrl: `${baseUrl}/?view=order_tracking`,
        ogType: 'website',
        ogImage: defaultImage
      };
      break;

    default:
      break;
  }

  // Update DOM Title and Meta Tags
  useEffect(() => {
    // 1. Title
    document.title = seo.title;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // 3. Meta Keywords
    if (seo.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', seo.keywords);
    }

    // 4. Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seo.canonicalUrl);

    // 5. OpenGraph Tags
    const ogTags: Record<string, string> = {
      'og:title': seo.title,
      'og:description': seo.description,
      'og:url': seo.canonicalUrl,
      'og:type': seo.ogType || 'website',
      'og:image': seo.ogImage || defaultImage
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 6. Twitter Tags
    const twitterTags: Record<string, string> = {
      'twitter:title': seo.title,
      'twitter:description': seo.description,
      'twitter:image': seo.ogImage || defaultImage,
      'twitter:url': seo.canonicalUrl
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 7. Update Dynamic JSON-LD structured data
    let dynamicScript = document.getElementById('seo-dynamic-jsonld');
    if (seo.jsonLd) {
      if (!dynamicScript) {
        dynamicScript = document.createElement('script');
        dynamicScript.id = 'seo-dynamic-jsonld';
        dynamicScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(dynamicScript);
      }
      dynamicScript.textContent = JSON.stringify(seo.jsonLd, null, 2);
    } else if (dynamicScript) {
      dynamicScript.remove();
    }

    // 8. Update Browser URL cleanly without page reload (for crawlability & bookmarking)
    try {
      const url = new URL(window.location.href);
      if (currentView === 'home') {
        url.search = '';
      } else if (currentView === 'product_detail' && selectedProduct) {
        url.searchParams.set('view', 'product_detail');
        url.searchParams.set('product', selectedProduct.id);
      } else {
        url.searchParams.set('view', currentView);
        if (currentView === 'shop' && activeCategory && activeCategory !== 'all') {
          url.searchParams.set('category', activeCategory);
        } else {
          url.searchParams.delete('category');
        }
        url.searchParams.delete('product');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // Ignored in non-browser environments
    }
  }, [seo, currentView, selectedProduct, activeCategory, defaultImage]);

  return null;
};

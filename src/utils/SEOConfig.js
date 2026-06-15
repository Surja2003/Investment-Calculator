/**
 * SEO & Geo-Structured Data Layer Config
 * Provides comprehensive meta settings, localized keywords, and JSON-LD structured schemas.
 */

export const SEO_TEMPLATES = {
  IN: {
    title: 'Best SIP Calculator & Wealth Growth Predictor (Lumpsum & SWP) | India',
    description: 'Calculate your future mutual fund returns with India\'s most precise SIP, Lumpsum, and SWP planning calculator. Includes inflation adjustments & LTCG tax calculations.',
    keywords: 'SIP Calculator, Best SIP Calculator, Lumpsum Calculator, SWP Calculator, Systematic Withdrawal Plan, Mutual Fund Return Predictor, LTCG Tax Calculator, Indian Wealth Calculator',
    ogTitle: 'Premium Investment Calculator - SIP, Lumpsum & SWP Studio',
    ogDescription: 'Plan your long-term wealth accumulation, step-up SIPs, SWP withdraws, and financial goals with real-time visual charts.',
  },
  US: {
    title: 'Wealth Growth Predictor: SIP, Lumpsum & Systematic Withdrawal Planner',
    description: 'Project future investment compounding using our premium financial calculator. Supports monthly contributions, one-time deposits, retirement SWP, and inflation offsets.',
    keywords: 'Investment Calculator, Compound Interest Calculator, SIP Calculator, SWP Planner, Lumpsum Planner, Wealth Growth Predictor, Financial Goal Calculator, Capital Gains Tax Calculator',
    ogTitle: 'Wealth Compounding Calculator & Goal Milestone Planner',
    ogDescription: 'Interactive investment modeling tool. Simulate financial freedom scenarios, calculate compound growth, and track capital gains.',
  }
};

/**
 * Generates JSON-LD Structured Data script content for Rich Snippets.
 * @param {string} mode - 'sip' | 'lumpsum' | 'swp' | 'goal'
 * @param {string} locale - 'IN' | 'US'
 * @param {string} canonicalUrl - Canonical page URL
 * @returns {Object} JSON-LD Structured Data Schema
 */
export const generateStructuredData = (mode, locale = 'IN', canonicalUrl = 'https://investmentcalculator.app') => {
  const isINR = locale === 'IN';
  const currencyCode = isINR ? 'INR' : 'USD';
  
  // Base WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${canonicalUrl}#web-app`,
    'url': canonicalUrl,
    'name': isINR ? 'Best SIP & Lumpsum Calculator Studio' : 'Wealth Compounding & Goal Calculator Studio',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'Requires HTML5, CSS3, and JavaScript support.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': currencyCode
    },
    'description': isINR 
      ? 'Calculate mutual fund compound interest, step-up SIPs, SWP income streams, and goal targets with LTCG tax tracking.'
      : 'Simulate monthly savings growth, lumpsum compounding, retirement withdrawals, and customized wealth goals.'
  };

  // Specific Financial Product Schema
  const financialProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    '@id': `${canonicalUrl}#financial-product`,
    'name': isINR ? 'SIP & SWP Wealth Growth Calculator' : 'Investment Compounding Calculator',
    'description': 'Interactive calculator to model systematic investments (SIP), lumpsum investments, and systematic withdrawals (SWP).',
    'category': 'Financial Planning Software',
    'feesAndCommissionsSpecification': 'No fees. Totally free for public educational planning.',
    'provider': {
      '@type': 'Organization',
      'name': 'Investment Calculator Studio',
      'url': canonicalUrl
    }
  };

  return [webAppSchema, financialProductSchema];
};

/**
 * Dynamic SEO Updater
 * Updates the document head metadata and injects JSON-LD script tags.
 */
export const updatePageSEO = (mode, locale = 'IN', canonicalUrl = window.location.href) => {
  try {
    const config = SEO_TEMPLATES[locale] || SEO_TEMPLATES.IN;
    
    // 1. Update basic titles and descriptions
    document.title = config.title;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = config.description;

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = config.keywords;

    // 2. OpenGraph Meta Updates
    const ogs = [
      { property: 'og:title', content: config.ogTitle },
      { property: 'og:description', content: config.ogDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
    ];

    ogs.forEach(({ property, content }) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.content = content;
    });

    // 3. Inject/Update JSON-LD script
    let ldScript = document.getElementById('calculator-jsonld-schema');
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'calculator-jsonld-schema';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    
    const schemas = generateStructuredData(mode, locale, canonicalUrl);
    ldScript.innerHTML = JSON.stringify(schemas, null, 2);
  } catch (error) {
    console.error('Failed to update SEO tags in head', error);
  }
};

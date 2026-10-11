import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, ChevronDown,
  MapPin, Menu, PaintBucket, Paintbrush, Palette, Phone, Send, Sparkles, X,
  MessageCircle, ShieldCheck, House, Palette as PaletteIcon
} from 'lucide-react';

const whatsappValue = import.meta.env.VITE_WHATSAPP_NUMBER || '';
const whatsappNumber = whatsappValue && whatsappValue !== '91XXXXXXXXXX' ? whatsappValue.replace(/\D/g, '') : '';
const phoneNumber = import.meta.env.VITE_PHONE_NUMBER || '';
const email = import.meta.env.VITE_EMAIL || '';

const services = [
  { n: '01', title: 'Interior Painting', desc: 'Beautiful, smooth finishes for bedrooms, living rooms, kitchens and every corner of your home.', icon: House, tag: 'For your home' },
  { n: '02', title: 'Exterior Painting', desc: 'Refresh your home’s outside walls with a neat finish made to look good season after season.', icon: PaintBucket, tag: 'Built to impress' },
  { n: '03', title: 'Art & Decorative Painting', desc: 'Bring your ideas to life with creative wall art, accent walls and personalised designs.', icon: PaletteIcon, tag: 'Make it yours' },
  { n: '04', title: 'Colour Consultation', desc: 'Choose colours that feel right for your space, style and the atmosphere you want to create.', icon: Sparkles, tag: 'Find your shade' },
];

const projects = [
  { title: 'Warm & Welcoming', category: 'Interior finish', image: 'photo-1600210492486-724fe5c67fb0', desc: 'A calm, contemporary living space' },
  { title: 'Modern Home Exterior', category: 'Exterior finish', image: 'photo-1600607687939-ce8a6c25118c', desc: 'A clean look from the outside in' },
  { title: 'Creative Accent Wall', category: 'Decorative style', image: 'photo-1616486338812-3dadae4b4ace', desc: 'A little character goes a long way' },
];

function unsplashImage(id, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}

function unsplashSrcSet(id, widths = [480, 768, 1200, 1600]) {
  return widths.map((width) => `${unsplashImage(id, width)} ${width}w`).join(', ');
}

function waLink(message = 'Namaste Vinod Painter Service, mujhe painting ke liye quotation chahiye.') {
  if (!whatsappNumber || whatsappNumber === '91XXXXXXXXXX') return '#contact';
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function WhatsAppButton({ children = 'Get a free estimate', className = '', message }) {
  return <a className={`button button-primary magnetic-target ${className}`} href={waLink(message)} target={whatsappNumber && whatsappNumber !== '91XXXXXXXXXX' ? '_blank' : undefined} rel="noreferrer">
    <MessageCircle size={18} /> {children} <ArrowRight size={17} />
  </a>;
}

function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reducedMotion || !finePointer) return undefined;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return undefined;
    const root = document.documentElement;
    root.classList.add('cursor-enabled');
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame;

    const render = () => {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      trailRefs.current.forEach((trail, index) => {
        if (!trail) return;
        const lag = 0.09 - index * 0.012;
        const currentX = Number(trail.dataset.x || pointerX);
        const currentY = Number(trail.dataset.y || pointerY);
        trail.dataset.x = currentX + (pointerX - currentX) * lag;
        trail.dataset.y = currentY + (pointerY - currentY) * lag;
        trail.style.transform = `translate3d(${trail.dataset.x}px, ${trail.dataset.y}px, 0)`;
      });
      frame = requestAnimationFrame(render);
    };

    const setCursorState = (target) => {
      ring.classList.remove('cursor-link', 'cursor-view', 'cursor-nav', 'cursor-hidden');
      cursor.classList.remove('cursor-click');
      if (!target) return;
      if (target.matches('input, textarea, select, [contenteditable="true"]')) {
        ring.classList.add('cursor-hidden');
        return;
      }
      if (target.closest('.project-image')) ring.classList.add('cursor-view');
      else if (target.closest('button, .button')) ring.classList.add('cursor-link');
      else if (target.closest('nav, .nav-links')) ring.classList.add('cursor-nav');
      else if (target.closest('a')) ring.classList.add('cursor-link');
    };
    const handleMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      setCursorState(target?.closest('a, button, input, textarea, select, [contenteditable="true"], .project-image, nav'));
      const magnetic = target?.closest('.magnetic-target');
      document.querySelectorAll('.magnetic-target.is-magnetic').forEach((element) => {
        if (element !== magnetic) {
          element.classList.remove('is-magnetic');
          element.style.removeProperty('--mag-x');
          element.style.removeProperty('--mag-y');
        }
      });
      if (magnetic) {
        const bounds = magnetic.getBoundingClientRect();
        const offsetX = Math.max(-8, Math.min(8, (event.clientX - (bounds.left + bounds.width / 2)) * 0.12));
        const offsetY = Math.max(-6, Math.min(6, (event.clientY - (bounds.top + bounds.height / 2)) * 0.12));
        magnetic.classList.add('is-magnetic');
        magnetic.style.setProperty('--mag-x', `${offsetX}px`);
        magnetic.style.setProperty('--mag-y', `${offsetY}px`);
      }
      const tilt = target?.closest('.tilt-card');
      document.querySelectorAll('.tilt-card.is-tilting').forEach((element) => {
        if (element !== tilt) {
          element.classList.remove('is-tilting');
          element.style.removeProperty('--tilt-x');
          element.style.removeProperty('--tilt-y');
        }
      });
      if (tilt) {
        const bounds = tilt.getBoundingClientRect();
        const tiltX = Math.max(-2.5, Math.min(2.5, ((event.clientY - bounds.top) / bounds.height - 0.5) * -5));
        const tiltY = Math.max(-2.5, Math.min(2.5, ((event.clientX - bounds.left) / bounds.width - 0.5) * 5));
        tilt.classList.add('is-tilting');
        tilt.style.setProperty('--tilt-x', `${tiltX}deg`);
        tilt.style.setProperty('--tilt-y', `${tiltY}deg`);
      }
    };
    const handleDown = () => cursor.classList.add('cursor-click');
    const handleUp = () => cursor.classList.remove('cursor-click');
    const handleLeave = () => ring.classList.add('cursor-hidden');
    const handleEnter = () => ring.classList.remove('cursor-hidden');

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      root.classList.remove('cursor-enabled');
      document.querySelectorAll('.magnetic-target.is-magnetic').forEach((element) => {
        element.classList.remove('is-magnetic');
        element.style.removeProperty('--mag-x');
        element.style.removeProperty('--mag-y');
      });
      document.querySelectorAll('.tilt-card.is-tilting').forEach((element) => {
        element.classList.remove('is-tilting');
        element.style.removeProperty('--tilt-x');
        element.style.removeProperty('--tilt-y');
      });
    };
  }, []);

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="cursor-trail" ref={(element) => { trailRefs.current[0] = element; }} />
      <span className="cursor-trail cursor-trail-two" ref={(element) => { trailRefs.current[1] = element; }} />
      <span className="cursor-dot" ref={cursorRef} />
      <span className="cursor-ring" ref={ringRef}><span className="cursor-label"><span className="cursor-view-label">VIEW</span><span className="cursor-default-label">EXPLORE</span></span></span>
    </div>
  );
}

function InspirationSlider({ language }) {
  const [position, setPosition] = useState(52);
  const isHindi = language === 'hi';
  return (
    <div className="comparison-card reveal">
      <div className="comparison-frame">
        <img src={unsplashImage('photo-1600210492486-724fe5c67fb0', 1200)} alt={isHindi ? 'घर के इंटीरियर का प्रेरणादायक दृश्य' : 'Inspirational home interior view'} loading="lazy" decoding="async" />
        <div className="comparison-after" style={{ width: `${position}%` }}>
          <img src={unsplashImage('photo-1616486338812-3dadae4b4ace', 1200)} alt={isHindi ? 'सजावटी दीवार का प्रेरणादायक दृश्य' : 'Inspirational decorative wall view'} loading="lazy" decoding="async" />
        </div>
        <span className="comparison-label comparison-label-before">{isHindi ? 'प्रेरणा A' : 'INSPIRATION A'}</span>
        <span className="comparison-label comparison-label-after">{isHindi ? 'प्रेरणा B' : 'INSPIRATION B'}</span>
        <div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><span /></div>
        <input className="comparison-range" type="range" min="8" max="92" value={position} onChange={(event) => setPosition(event.target.value)} aria-label={isHindi ? 'प्रेरणादायक तस्वीरों की तुलना' : 'Compare inspiration images'} />
      </div>
      <p className="comparison-disclaimer">{isHindi ? 'यह केवल डिज़ाइन प्रेरणा है, किसी ग्राहक के असली पहले और बाद के काम का प्रमाण नहीं।' : 'Design inspiration only — this is not a verified customer before-and-after project.'}</p>
    </div>
  );
}

const colourStudies = [
  { key: 'sage', value: '#879b82', name: 'Muted sage', hindi: 'म्यूटेड सेज' },
  { key: 'ivory', value: '#e8dfc9', name: 'Warm ivory', hindi: 'गर्म आइवरी' },
  { key: 'clay', value: '#b8755e', name: 'Soft terracotta', hindi: 'सॉफ्ट टेराकोटा' },
  { key: 'forest', value: '#285345', name: 'Deep forest', hindi: 'डीप फॉरेस्ट' }
];

function ColourPreview({ language }) {
  const [selectedColour, setSelectedColour] = useState(colourStudies[0]);
  const isHindi = language === 'hi';

  return (
    <div className="colour-preview-card reveal">
      <div className="colour-preview-visual">
        <img
          src={unsplashImage('photo-1600210492486-724fe5c67fb0', 1200)}
          srcSet={unsplashSrcSet('photo-1600210492486-724fe5c67fb0')}
          sizes="(max-width: 760px) calc(100vw - 36px), 56vw"
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
          alt={isHindi ? 'आधुनिक कमरे का प्रेरणादायक दृश्य' : 'Inspirational modern room scene'}
        />
        <div className="colour-preview-overlay" style={{ backgroundColor: selectedColour.value }} aria-hidden="true" />
        <span className="colour-preview-label">{isHindi ? selectedColour.hindi : selectedColour.name}</span>
      </div>
      <div className="colour-preview-controls">
        <div>
          <small>{isHindi ? 'अपने रंग की कल्पना करें' : 'IMAGINE YOUR COLOUR'}</small>
          <p>{isHindi ? 'कमरे के माहौल पर अलग-अलग शेड का संकेत देखें।' : 'Explore a simple, illustrative tint for the mood of your room.'}</p>
        </div>
        <div className="colour-swatches" role="group" aria-label={isHindi ? 'रंग चुनें' : 'Choose a colour'}>
          {colourStudies.map((colour) => (
            <button
              type="button"
              className={selectedColour.key === colour.key ? 'colour-swatch active' : 'colour-swatch'}
              key={colour.key}
              style={{ '--swatch': colour.value }}
              onClick={() => setSelectedColour(colour)}
              aria-label={isHindi ? colour.hindi : colour.name}
              aria-pressed={selectedColour.key === colour.key}
            />
          ))}
        </div>
      </div>
      <p className="colour-preview-disclaimer">
        {isHindi
          ? 'यह केवल एक सामान्य स्क्रीन-आधारित संकेत है। असली पेंट का रंग रोशनी, सतह और स्क्रीन के अनुसार बदल सकता है।'
          : 'Illustrative screen preview only. Real paint can vary with light, surface and display settings.'}
      </p>
    </div>
  );
}

function AmbientBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const background = backgroundRef.current;
    if (!background || reducedMotion || !finePointer) return undefined;

    let frame;
    let nextX = 50;
    let nextY = 38;
    let currentX = nextX;
    let currentY = nextY;
    const handlePointerMove = (event) => {
      nextX = (event.clientX / window.innerWidth) * 100;
      nextY = (event.clientY / window.innerHeight) * 100;
    };
    const render = () => {
      currentX += (nextX - currentX) * 0.08;
      currentY += (nextY - currentY) * 0.08;
      background.style.setProperty('--spotlight-x', `${currentX}%`);
      background.style.setProperty('--spotlight-y', `${currentY}%`);
      frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div className="ambient-background" ref={backgroundRef} aria-hidden="true">
      <div className="ambient-spotlight" />
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="ambient-orb ambient-orb-three" />
      <div className="ambient-particles">
        {Array.from({ length: 9 }, (_, index) => <span key={index} className={`ambient-particle particle-${index + 1}`} />)}
      </div>
      <svg className="ambient-strokes" viewBox="0 0 700 900" preserveAspectRatio="none">
        <path className="ambient-stroke ambient-stroke-one" d="M-60 180C120 90 220 250 390 145S610 110 760 220" />
        <path className="ambient-stroke ambient-stroke-two" d="M-80 720C110 600 190 810 370 680S590 620 760 740" />
      </svg>
    </div>
  );
}

function useScrollReveals() {
  useEffect(() => {
    document.documentElement.classList.add('js-motion');
    const elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -48px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function IntroVeil() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem('vinod-intro-seen') !== 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('vinod-intro-seen', 'true');
      } catch {
        // Storage can be unavailable in privacy-restricted browsers.
      }
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;
  return (
    <div className="intro-veil" role="status" aria-label="Vinod Painter Service">
      <div className="intro-rule" />
      <p>VINOD PAINTER SERVICE</p>
      <span>Thoughtful colour for your space</span>
    </div>
  );
}


const dictionary = {
  en: {
    location: 'Serving Bairia, Terhagachh & Kishanganj, Bihar',
    tagline: 'Careful work. Beautiful results.',
    navServices: 'Services', navWork: 'Our work', navAbout: 'About us', navContact: 'Contact',
    navQuote: 'Get a free estimate',
    eyebrow: 'YOUR LOCAL PAINTING PROFESSIONAL', heroSection: 'YOUR LOCAL PAINTING PROFESSIONAL', aboutEyebrow: 'A LOCAL NAME YOU CAN TALK TO', contactEyebrow: 'LET’S MAKE IT HAPPEN', projectTitles: ['Warm & Welcoming','Modern Home Exterior','Creative Accent Wall'], projectCats: ['Interior finish','Exterior finish','Decorative style'], projectDescs: ['A calm, contemporary living space','A clean look from the outside in','A little character goes a long way'], stamp: 'MADE WITH', stamp2: 'CARE', address: 'Bairia, Terhagachh, Kishanganj, Bihar, India',
    hero1: 'Every wall has', hero2: 'a story. Let’s add', hero3: 'colour to yours.',
    heroDesc: 'From a fresh coat at home to expressive artistic walls, we bring care, colour and craftsmanship to every project.',
    quote: 'Get a free estimate', explore: 'Explore our work',
    personal: 'Personal attention, every time', local: 'Local service · Thoughtful finishing',
    rightColour: 'THE RIGHT COLOUR', changes: 'Changes everything.',
    vision: 'Your vision, our finish.', made: 'Made for your space.',
    fresh: '01 / A FRESH START', scroll: 'SCROLL TO DISCOVER',
    house: 'House Painting', houseSub: 'Interior & exterior',
    artistic: 'Artistic Finishes', artisticSub: 'Creative wall details',
    localPersonal: 'Local & Personal', localSub: 'Serving our community',
    clear: 'Clear Communication', clearSub: 'Discuss before we begin',
    what: 'WHAT WE DO', good: 'Good work is in', detailAccent: 'the details.',
    servicesIntro: 'Whether you’re refreshing one room or giving your whole home a new identity, we’ll help you make it feel just right.',
    serviceTitles: ['Interior Painting','Exterior Painting','Art & Decorative Painting','Colour Consultation'],
    serviceDescs: [
      'Beautiful, smooth finishes for bedrooms, living rooms, kitchens and every corner of your home.',
      'Refresh your home’s outside walls with a neat finish made to look good season after season.',
      'Bring your ideas to life with creative wall art, accent walls and personalised designs.',
      'Choose colours that feel right for your space, style and the atmosphere you want to create.'
    ],
    serviceTags: ['For your home','Built to impress','Make it yours','Find your shade'],
    inspiration: 'INSPIRATION FOR YOUR SPACE', little: 'A little colour.', big: 'A big difference.',
    workIntro: 'Every home is different. Tell us what you have in mind and let’s find a finish that feels like you.',
    galleryNote: 'Style inspiration only. Add photos of Vinod Painter Service’s completed projects here to showcase actual work.',
    localName: 'A LOCAL NAME YOU CAN TALK TO', notJust: 'It’s not just', yourHome: 'paint. It’s your home.',
    aboutDesc: 'Vinod Painter Service brings house painting and artistic painting together with a simple promise: listen to what you need, work with care, and help you feel good about your space.',
    aboutPoints: ['Discuss your colour and finish preferences','Plan the work around your space','Get in touch directly for your estimate'],
    aboutButton: 'Let’s talk about your project',
    lets: 'LET’S MAKE IT HAPPEN', ready: 'Ready for a', freshCoat: 'fresh coat?',
    contactIntro: 'Tell us a little about your project. We’ll connect with you to discuss what you need and how to get started.',
    serviceArea: 'OUR SERVICE AREA', quick: 'QUICK ENQUIRIES', whatsappQuote: 'WhatsApp us for a quote', callUs: 'CALL US',
    formTitle: 'Tell us about your project', required: 'Fields marked * are required.',
    name: 'Your name *', namePlaceholder: 'What should we call you?', phone: 'Phone number *', phonePlaceholder: 'Your contact number',
    need: 'What do you need?', projectDetails: 'Project details', detailPlaceholder: 'A room, a full home, a wall design… (optional)',
    send: 'Send enquiry on WhatsApp', prepare: 'Prepare my enquiry',
    privacy: 'Your details are used only to respond to your enquiry.',
    footerDesc: 'Bringing thoughtful colour to homes', footerDesc2: 'and creative ideas to life.',
    top: 'BACK TO TOP', rights: 'All rights reserved.', chat: 'Chat with us',
    successLive: 'Your WhatsApp enquiry should be open in a new tab. Please send it to complete your request.',
    successSetup: 'Your details are ready. Add the real WhatsApp number in the .env file to send this enquiry directly.',
    defaultMessage: 'Namaste Vinod Painter Service, mujhe painting ke liye quotation chahiye.'
  },
  hi: {
    location: 'बैरिया, टेढ़ागाछ और किशनगंज, बिहार में सेवा',
    tagline: 'साफ़ काम। सुंदर नतीजे।',
    navServices: 'हमारी सेवाएँ', navWork: 'हमारा काम', navAbout: 'हमारे बारे में', navContact: 'संपर्क करें',
    navQuote: 'मुफ़्त अनुमान लें',
    eyebrow: 'आपकी अपनी लोकल पेंटिंग सेवा', heroSection: 'आपकी अपनी लोकल पेंटिंग सेवा', aboutEyebrow: 'आपकी अपनी लोकल पेंटिंग सेवा', contactEyebrow: 'आइए, काम शुरू करें', projectTitles: ['आरामदायक घर','घर का बाहरी रूप','दीवार का खास डिज़ाइन'], projectCats: ['घर के अंदर की फिनिशिंग','बाहरी पेंटिंग','सजावटी डिज़ाइन'], projectDescs: ['सुकून भरा आधुनिक कमरा','बाहर से सुंदर और साफ़ रूप','दीवारों में अपनी पसंद का रंग'], stamp: 'मेहनत से', stamp2: 'किया गया काम', address: 'बैरिया, टेढ़ागाछ, किशनगंज, बिहार, भारत',
    hero1: 'हर दीवार की', hero2: 'एक कहानी है। उसमें', hero3: 'रंग भरें।',
    heroDesc: 'घर की नई पुताई हो या दीवारों पर कलात्मक डिज़ाइन — हम हर काम ध्यान और मेहनत से करते हैं।',
    quote: 'मुफ़्त अनुमान लें', explore: 'हमारा काम देखें',
    personal: 'हर काम पर खास ध्यान', local: 'आपकी लोकल सेवा · सुंदर फिनिशिंग',
    rightColour: 'सही रंग', changes: 'सब कुछ बदल देता है।',
    vision: 'आपकी पसंद, हमारी फिनिशिंग।', made: 'आपके घर के लिए।',
    fresh: '01 / नई शुरुआत', scroll: 'आगे देखने के लिए स्क्रॉल करें',
    house: 'घर की पेंटिंग', houseSub: 'अंदर और बाहर',
    artistic: 'कलात्मक पेंटिंग', artisticSub: 'दीवारों पर सुंदर डिज़ाइन',
    localPersonal: 'आपकी अपनी सेवा', localSub: 'अपने इलाके में सेवा',
    clear: 'साफ़ बातचीत', clearSub: 'काम शुरू करने से पहले चर्चा',
    what: 'हम क्या करते हैं', good: 'अच्छे काम की पहचान', detailAccent: 'छोटी-छोटी बातों में है।',
    servicesIntro: 'एक कमरे की पुताई हो या पूरे घर को नया रूप देना हो — आपकी पसंद के अनुसार काम करने में हम मदद करेंगे।',
    serviceTitles: ['घर के अंदर पेंटिंग','घर के बाहर पेंटिंग','आर्ट और सजावटी पेंटिंग','रंग चुनने में मदद'],
    serviceDescs: [
      'बेडरूम, बैठक, रसोई और घर के हर कमरे के लिए सुंदर और साफ़ फिनिशिंग।',
      'घर की बाहरी दीवारों को नई पुताई और सुंदर रूप दें।',
      'दीवारों पर कलात्मक चित्र, खास डिज़ाइन और आपकी पसंद की सजावट।',
      'आपके घर और पसंद के हिसाब से सही रंग चुनने में मदद।'
    ],
    serviceTags: ['आपके घर के लिए','बाहरी सुंदरता','अपनी पसंद का डिज़ाइन','अपना रंग चुनें'],
    inspiration: 'आपके घर के लिए नए आइडिया', little: 'थोड़ा सा रंग।', big: 'बड़ा बदलाव।',
    workIntro: 'हर घर अलग होता है। हमें अपनी पसंद बताइए, हम आपके लिए सही रंग और फिनिशिंग पर बात करेंगे।',
    galleryNote: 'ये केवल डिज़ाइन के उदाहरण हैं। यहाँ पापा के किए हुए असली काम की तस्वीरें लगाएँ।',
    localName: 'आपकी अपनी लोकल पेंटिंग सेवा', notJust: 'बात सिर्फ़', yourHome: 'रंग की नहीं, आपके घर की है।',
    aboutDesc: 'Vinod Painter Service में घर की पेंटिंग और कलात्मक पेंटिंग — दोनों का काम किया जाता है। हम आपकी ज़रूरत समझकर ध्यान से काम करने की कोशिश करते हैं।',
    aboutPoints: ['रंग और फिनिशिंग पर पहले चर्चा','आपके घर के हिसाब से काम की योजना','अनुमान और जानकारी के लिए सीधे संपर्क करें'],
    aboutButton: 'अपने काम के बारे में बात करें',
    lets: 'आइए, काम शुरू करें', ready: 'घर को दें', freshCoat: 'नया रंग-रूप।',
    contactIntro: 'अपने काम के बारे में थोड़ी जानकारी दें। हम आपसे संपर्क करके ज़रूरत और काम के बारे में बात करेंगे।',
    serviceArea: 'हमारा सेवा क्षेत्र', quick: 'जल्दी संपर्क करें', whatsappQuote: 'कोटेशन के लिए WhatsApp पर संपर्क करें', callUs: 'फ़ोन करें',
    formTitle: 'अपने काम के बारे में बताएँ', required: '* वाले विकल्प भरना ज़रूरी है।',
    name: 'आपका नाम *', namePlaceholder: 'अपना नाम लिखें', phone: 'मोबाइल नंबर *', phonePlaceholder: 'अपना संपर्क नंबर लिखें',
    need: 'कौन सा काम करवाना है?', projectDetails: 'काम की जानकारी', detailPlaceholder: 'एक कमरा, पूरा घर, दीवार का डिज़ाइन… (ज़रूरी नहीं)',
    send: 'WhatsApp पर पूछताछ भेजें', prepare: 'पूछताछ तैयार करें',
    privacy: 'आपकी जानकारी का उपयोग केवल आपकी पूछताछ का जवाब देने के लिए होगा।',
    footerDesc: 'घरों में भरें खूबसूरत रंग', footerDesc2: 'और आपके आइडिया को दें नया रूप।',
    top: 'ऊपर जाएँ', rights: 'सर्वाधिकार सुरक्षित।', chat: 'WhatsApp पर संपर्क करें',
    successLive: 'WhatsApp में आपकी पूछताछ खुलनी चाहिए। भेजने के लिए WhatsApp में Send दबाएँ।',
    successSetup: 'आपकी जानकारी तैयार है। सीधे WhatsApp पर भेजने के लिए .env फ़ाइल में सही नंबर डालें।',
    defaultMessage: 'नमस्ते Vinod Painter Service, मुझे पेंटिंग के काम का अनुमान चाहिए।'
  }
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState('hi');
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const t = dictionary[language];
  const [form, setForm] = useState({ name: '', phone: '', service: 'House painting', details: '' });
  const [sent, setSent] = useState(false);
  const heroVisualRef = useRef(null);
  const lightboxRef = useRef(null);
  const lightboxTriggerRef = useRef(null);

  useScrollReveals();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const visual = heroVisualRef.current;
    const desktopQuery = window.matchMedia('(hover: hover) and (min-width: 761px)');
    if (!visual || !desktopQuery.matches) return undefined;
    const handlePointerMove = (event) => {
      const bounds = visual.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      visual.style.setProperty('--pointer-x', `${(x * 5).toFixed(2)}px`);
      visual.style.setProperty('--pointer-y', `${(y * 5).toFixed(2)}px`);
    };
    const resetPointer = () => {
      visual.style.setProperty('--pointer-x', '0px');
      visual.style.setProperty('--pointer-y', '0px');
    };
    visual.addEventListener('pointermove', handlePointerMove);
    visual.addEventListener('pointerleave', resetPointer);
    return () => {
      visual.removeEventListener('pointermove', handlePointerMove);
      visual.removeEventListener('pointerleave', resetPointer);
    };
  }, []);

  useEffect(() => {
    if (selectedProject === null) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = lightboxRef.current;
    const focusable = dialog?.querySelectorAll('button');
    focusable?.[0]?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedProject(null);
      if (event.key === 'ArrowLeft') showPreviousProject();
      if (event.key === 'ArrowRight') showNextProject();
      if (event.key === 'Tab' && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lightboxTriggerRef.current?.focus();
    };
  }, [selectedProject]);

  const submitEnquiry = (e) => {
    e.preventDefault();
    const message = encodeURIComponent(`${language === 'hi' ? 'नमस्ते Vinod Painter Service!' : 'Hello Vinod Painter Service!'}\n${language === 'hi' ? 'नाम' : 'Name'}: ${form.name}\n${language === 'hi' ? 'मोबाइल नंबर' : 'Phone'}: ${form.phone}\n${language === 'hi' ? 'काम' : 'Service'}: ${form.service}\n${language === 'hi' ? 'जानकारी' : 'Details'}: ${form.details || (language === 'hi' ? 'कृपया मुझसे संपर्क करें।' : 'Please contact me to discuss.')}`);
    if (whatsappNumber && whatsappNumber !== '91XXXXXXXXXX') {
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
      setSent(true);
    } else {
      setSent(true);
    }
  };

  const closeMenu = () => setMenuOpen(false);
  const showPreviousProject = () => setSelectedProject((current) => current === null ? null : (current + projects.length - 1) % projects.length);
  const showNextProject = () => setSelectedProject((current) => current === null ? null : (current + 1) % projects.length);

  return (
    <div className="site-shell">
      <CustomCursor />
      <AmbientBackground />
      <IntroVeil />
      <div className="topline">
        <div className="container topline-inner">
          <span><MapPin size={14} /> {t.location}</span>
          <span className="topline-right"><Sparkles size={14} /> {t.tagline}</span>
        </div>
      </div>

      <header className={scrolled ? 'header header-scrolled' : 'header'}>
        <div className="container nav-wrap">
          <a className="brand" href="#home" onClick={closeMenu} aria-label="Vinod Painter Service home">
            <span className="brand-mark"><Paintbrush size={25} strokeWidth={1.8} /></span>
            <span className="brand-copy"><strong>VINOD <em>PAINTER</em></strong><small>SERVICE · KISHANGANJ</small></span>
          </a>
          <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          <nav id="primary-navigation" className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
            <a href="#services" onClick={closeMenu}>{t.navServices}</a>
            <a href="#work" onClick={closeMenu}>{t.navWork}</a>
            <a href="#about" onClick={closeMenu}>{t.navAbout}</a>
            <a href="#contact" onClick={closeMenu}>{t.navContact}</a>
            <div className="language-toggle" aria-label="Choose language">
              <button type="button" className={language === 'hi' ? 'active' : ''} onClick={() => setLanguage('hi')}>हिंदी</button>
              <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>English</button>
            </div>
            <WhatsAppButton className="nav-cta" message={t.defaultMessage}>{t.navQuote}</WhatsAppButton>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-grain" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> {t.eyebrow}</div>
              <h1>{t.hero1}<br /><span>{t.hero2}<br />{t.hero3}</span></h1>
              <p className="hero-description">{t.heroDesc}</p>
              <div className="hero-actions">
                <WhatsAppButton message={t.defaultMessage}>{t.quote}</WhatsAppButton>
                <a className="text-link" href="#work">{t.explore} <ArrowDownRight size={18} /></a>
              </div>
              <div className="hero-proof">
                <div className="proof-icon"><ShieldCheck size={20} /></div>
                <div><strong>{t.personal}</strong><small>{t.local}</small></div>
              </div>
            </div>
            <div className="hero-visual" ref={heroVisualRef}>
              <div className="hero-image-frame">
                <img src={unsplashImage('photo-1600607687939-ce8a6c25118c', 1200)} srcSet={unsplashSrcSet('photo-1600607687939-ce8a6c25118c')} sizes="(max-width: 760px) calc(100vw - 58px), (max-width: 1200px) 48vw, 620px" width="1200" height="1500" alt="Beautiful freshly finished modern home interior" fetchpriority="high" />
                <div className="image-shade" />
                <div className="image-caption"><span className="caption-dot" /><span><small>{t.rightColour}</small><strong>{t.changes}</strong></span></div>
              </div>
              <div className="floating-note"><span className="note-icon"><Palette size={20} /></span><span><strong>{t.vision}</strong><small>{t.made}</small></span></div>
              <div className="paint-swatch swatch-one" /><div className="paint-swatch swatch-two" /><div className="paint-swatch swatch-three" />
            </div>
          </div>
          <div className="hero-bottom container"><span>{t.fresh}</span><span className="scroll-label">{t.scroll} <span className="scroll-line" /></span></div>
        </section>

        <section className="trust-strip">
          <div className="container trust-grid">
            <div><span className="trust-number">01</span><span><strong>{t.house}</strong><small>{t.houseSub}</small></span></div>
            <div><span className="trust-number">02</span><span><strong>{t.artistic}</strong><small>{t.artisticSub}</small></span></div>
            <div><span className="trust-number">03</span><span><strong>{t.localPersonal}</strong><small>{t.localSub}</small></span></div>
            <div><span className="trust-number">04</span><span><strong>{t.clear}</strong><small>{t.clearSub}</small></span></div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="container">
            <div className="section-heading">
              <div><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> {t.what}</div><h2>{t.good}<br /><span>{t.detailAccent}</span></h2><svg className="paint-line" viewBox="0 0 220 24" aria-hidden="true"><path d="M2 12c30-10 44 10 72 0s42-10 70 0 42 10 74-1" /></svg></div>
              <p>{t.servicesIntro}</p>
            </div>
            <div className="services-grid">
              {services.map(({ n, title, desc, icon: Icon, tag }) => <article className="service-card tilt-card reveal reveal-stagger" key={n}>
                <div className="service-card-top"><span className="service-number">{n}</span><span className="service-icon"><Icon size={22} strokeWidth={1.7} /></span></div>
                <h3>{t.serviceTitles[Number(n) - 1]}</h3><p>{t.serviceDescs[Number(n) - 1]}</p>
                <a href="#contact" className="service-link">{t.serviceTags[Number(n) - 1]} <ArrowRight size={16} /></a>
              </article>)}
            </div>
          </div>
        </section>

        <section className="work-section section" id="work">
          <div className="container">
            <div className="section-heading work-heading">
              <div><div className="eyebrow"><span className="eyebrow-line" /> {t.inspiration}</div><h2>{t.little}<br /><span>{t.big}</span></h2></div>
              <p>{t.workIntro}</p>
            </div>
            <div className="projects-grid">
              {projects.map((project, i) => <article className={`project-card project-${i + 1} reveal reveal-stagger`} key={project.title}>
                <button type="button" className="project-image tilt-card" ref={selectedProject === i ? lightboxTriggerRef : null} onClick={() => setSelectedProject(i)} aria-label={language === 'hi' ? `${t.projectTitles[i]} की बड़ी तस्वीर देखें` : `View larger image of ${t.projectTitles[i]}`}>
                  <img src={unsplashImage(project.image)} srcSet={unsplashSrcSet(project.image)} sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1200px) 31vw, 480px" width="900" height="600" alt={t.projectTitles[i]} loading="lazy" decoding="async" /><span className="project-index">0{i + 1}</span><span className="project-view">{language === 'hi' ? 'देखें / जानें' : 'VIEW / EXPLORE'} <ArrowUpRight size={19} aria-hidden="true" /></span>
                </button>
                <div className="project-info"><div><small>{t.projectCats[i]}</small><h3>{t.projectTitles[i]}</h3><p>{t.projectDescs[i]}</p></div><a href="#contact" aria-label={language === "hi" ? `${t.projectTitles[i]} के बारे में पूछें` : `Ask about ${t.projectTitles[i]}`}><ArrowUpRight size={19} aria-hidden="true" /></a></div>
              </article>)}
            </div>
            <p className="gallery-note">{t.galleryNote}</p>
          </div>
        </section>

        <section className="colour-study-section section">
          <div className="container colour-study-grid">
            <div className="colour-study-copy reveal">
              <div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> {language === 'hi' ? 'रंग का अनुभव' : 'COLOUR EXPERIENCE'}</div>
              <h2>{language === 'hi' ? 'अपने कमरे का' : 'Find your room’s'}<br /><span>{language === 'hi' ? 'मूड खोजें।' : 'mood.'}</span></h2>
              <p>{language === 'hi' ? 'इन हल्के शेड्स से प्रेरणा लें और अपने स्पेस के लिए सही एहसास चुनें।' : 'Use these considered shades as a starting point for the feeling you want in your space.'}</p>
            </div>
            <ColourPreview language={language} />
          </div>
        </section>

        <section className="comparison-section section">
          <div className="container comparison-grid">
            <div className="comparison-copy reveal">
              <div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> {language === 'hi' ? 'रंग की प्रेरणा' : 'COLOUR STUDY'}</div>
              <h2>{language === 'hi' ? 'रंग बदलता है' : 'Colour changes'}<br /><span>{language === 'hi' ? 'माहौल।' : 'the mood.'}</span></h2>
              <p>{language === 'hi' ? 'दो प्रेरणादायक दृश्यों के बीच स्लाइड करें और अपने घर के लिए सही एहसास खोजें।' : 'Slide between two design inspirations and explore the feeling you want for your own space.'}</p>
            </div>
            <InspirationSlider language={language} />
          </div>
        </section>

        <section className="about-section section" id="about">
          <div className="container about-grid">
            <div className="about-visual reveal reveal-image">
              <img src={unsplashImage('photo-1562259949-e8e7689d7828', 1000)} srcSet={unsplashSrcSet('photo-1562259949-e8e7689d7828')} sizes="(max-width: 760px) calc(100vw - 50px), (max-width: 1200px) 44vw, 560px" width="1000" height="1000" alt="Painter carefully applying paint to a wall" loading="lazy" decoding="async" />
              <div className="about-stamp"><Paintbrush size={23} /><span>{t.stamp}<br />{t.stamp2}</span></div>
            </div>
            <div className="about-copy reveal">
              <div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> {t.aboutEyebrow}</div>
              <h2>{t.notJust}<br /><span>{t.yourHome}</span></h2>
              <p>{t.aboutDesc}</p>
              <div className="about-points"><div><Check size={17} /><span>{t.aboutPoints[0]}</span></div><div><Check size={17} /><span>{t.aboutPoints[1]}</span></div><div><Check size={17} /><span>{t.aboutPoints[2]}</span></div></div>
              <a href="#contact" className="button button-dark">{t.aboutButton} <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        <section className="contact-section section" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy reveal">
              <div className="eyebrow"><span className="eyebrow-line" /> {t.contactEyebrow}</div>
              <h2>{t.ready}<br /><span>{t.freshCoat}</span></h2>
              <p>{t.contactIntro}</p>
              <div className="contact-details">
                <div className="contact-detail"><span><MapPin size={19} /></span><div><small>{t.serviceArea}</small><strong>{t.address}</strong></div></div>
                <div className="contact-detail"><span><MessageCircle size={19} /></span><div><small>{t.quick}</small><strong>{t.whatsappQuote}</strong></div></div>
                {phoneNumber && <div className="contact-detail"><span><Phone size={19} /></span><div><small>{t.callUs}</small><strong>{phoneNumber}</strong></div></div>}
              </div>
            </div>
            <form className="contact-form reveal" onSubmit={submitEnquiry}>
              <div className="form-heading"><h3>{t.formTitle}</h3><p>{t.required}</p></div>
              <label>{t.name}<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t.namePlaceholder} /></label>
              <label>{t.phone}<input required type="tel" pattern="[0-9+() -]{8,18}" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder={t.phonePlaceholder} /></label>
              <label>{t.need}<span className="select-wrap"><select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}><option value="House painting">{language === "hi" ? "घर की पेंटिंग" : "House painting"}</option><option value="Interior painting">{language === "hi" ? "घर के अंदर पेंटिंग" : "Interior painting"}</option><option value="Exterior painting">{language === "hi" ? "घर के बाहर पेंटिंग" : "Exterior painting"}</option><option value="Art / decorative painting">{language === "hi" ? "आर्ट / सजावटी पेंटिंग" : "Art / decorative painting"}</option><option value="Colour consultation">{language === "hi" ? "रंग चुनने में मदद" : "Colour consultation"}</option><option value="Other">{language === "hi" ? "अन्य" : "Other"}</option></select><ChevronDown size={16} /></span></label>
              <label>{t.projectDetails}<textarea rows="3" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder={t.detailPlaceholder} /></label>
              <button type="submit" className="button button-primary form-submit"><Send size={17} /> {whatsappNumber && whatsappNumber !== '91XXXXXXXXXX' ? t.send : t.prepare} <ArrowRight size={17} /></button>
              {sent && <p className="form-feedback" role="status">{whatsappNumber && whatsappNumber !== '91XXXXXXXXXX' ? t.successLive : t.successSetup}</p>}
              <small className="privacy-note"><ShieldCheck size={13} /> {t.privacy}</small>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-main">
          <a className="brand footer-brand" href="#home"><span className="brand-mark"><Paintbrush size={24} /></span><span className="brand-copy"><strong>VINOD <em>PAINTER</em></strong><small>SERVICE · KISHANGANJ</small></span></a>
          <p>{t.footerDesc}<br />{t.footerDesc2}</p>
          <a className="footer-top" href="#home">{t.top} <ArrowUp size={16} aria-hidden="true" /></a>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} Vinod Painter Service. {t.rights}</span><span>Barira · Terhagachh · Kishanganj, Bihar</span></div>
      </footer>
      <a className="floating-whatsapp" href={waLink(t.defaultMessage)} target={whatsappNumber && whatsappNumber !== '91XXXXXXXXXX' ? '_blank' : undefined} rel="noreferrer" aria-label={language === "hi" ? "WhatsApp पर संपर्क करें" : "Contact Vinod Painter Service on WhatsApp"}><MessageCircle size={20} aria-hidden="true" /></a>
      {selectedProject !== null && <div className="lightbox" ref={lightboxRef} role="dialog" aria-modal="true" aria-label={t.projectTitles[selectedProject]} onClick={() => setSelectedProject(null)}>
        <button type="button" className="lightbox-close" onClick={() => setSelectedProject(null)} aria-label={language === 'hi' ? 'बंद करें' : 'Close image'}><X size={22} /></button>
        <button type="button" className="lightbox-control lightbox-previous" onClick={(event) => { event.stopPropagation(); showPreviousProject(); }} aria-label={language === 'hi' ? 'पिछली तस्वीर' : 'Previous image'}><ArrowLeft size={22} aria-hidden="true" /></button>
        <button type="button" className="lightbox-control lightbox-next" onClick={(event) => { event.stopPropagation(); showNextProject(); }} aria-label={language === 'hi' ? 'अगली तस्वीर' : 'Next image'}><ArrowRight size={22} aria-hidden="true" /></button>
        <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
          <img src={unsplashImage(projects[selectedProject].image, 1600)} srcSet={unsplashSrcSet(projects[selectedProject].image, [900, 1200, 1600, 2000])} sizes="(max-width: 900px) calc(100vw - 36px), 860px" width="1600" height="1067" alt={t.projectTitles[selectedProject]} />
          <div className="lightbox-caption"><small>{t.projectCats[selectedProject]}</small><strong>{t.projectTitles[selectedProject]}</strong><span>{t.projectDescs[selectedProject]}</span></div>
        </div>
      </div>}
    </div>
  );
}

export default App;
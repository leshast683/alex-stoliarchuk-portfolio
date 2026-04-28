import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function trackEvent(name, data = {}) {
  try {
    await addDoc(collection(db, 'analytics'), {
      event: name,
      data,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  } catch (e) {
    // silently fail — analytics should never break the app
  }
}

export function trackSectionView(sectionId) {
  trackEvent('section_view', { section: sectionId });
}

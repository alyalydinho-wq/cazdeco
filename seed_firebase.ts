import { db } from './src/lib/firebase';
import { mockProducts, mockCategories } from './src/data/mockData';
import { setDoc, doc } from 'firebase/firestore';

async function seedFirebase() {
  console.log("Seeding products...");
  for (const product of mockProducts) {
    try {
      await setDoc(doc(db, "products", String(product.id)), product, { merge: true });
      console.log("Added product:", product.id);
    } catch (e) {
      console.error(e);
    }
  }

  console.log("Seeding categories...");
  for (const category of mockCategories) {
    try {
      await setDoc(doc(db, "categories", String(category.id)), category, { merge: true });
      console.log("Added category:", category.id);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Done");
  process.exit(0);
}

seedFirebase();

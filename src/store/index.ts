import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Category, CartItem, Order, User } from '../types';
import { mockProducts, mockCategories } from '../data/mockData';
import { db, isFirebaseConfigured, mapFirestoreDocToProduct } from '../lib/firebase';
import { collection, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';

interface AppState {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  user: User | null;
  settings: {
    siteName: string;
    slogan: string;
    promotionalText: string;
    facebookUrl?: string;
    instagramUrl?: string;
    contactEmail: string;
    phone: string;
    address: string;
    shippingStandard: number;
    shippingFreeThreshold: number;
    shippingDelay: string;
    heroBanners?: {
      id: string;
      image: string;
      title: string;
      subtitle: string;
      buttonText: string;
      buttonLink: string;
    }[];
    categoryBanners?: Record<string, { image: string; title: string; subtitle: string }>;
  };
  
  // Actions
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  
  placeOrder: (customerDetails: any) => string;
  updateSettings: (newSettings: Partial<AppState['settings']>) => void;
  initializeFirebaseSync: () => void;

  // Loyalty and Auth Actions
  loginUser: (email: string, name: string, phone?: string) => void;
  logoutUser: () => void;
  addLoyaltyPoints: (points: number) => void;
  claimDailyBonus: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      categories: mockCategories,
      cart: [],
      orders: [],
      user: null,
      settings: {
        siteName: "CAZ'DECO",
        slogan: "Le spécialiste de l'aménagement et de la décoration à Mayotte",
        promotionalText: "Paiement jusqu'à 4 fois sans frais. Livraison express sur toute l'île. Support client à votre écoute.",
        contactEmail: "cazdeco976@gmail.com",
        phone: "+262 692 00 00 00",
        address: "1 IMPASSE MAHARAJA KAWENI 97600 MAYOTTE",
        shippingStandard: 25.00,
        shippingFreeThreshold: 500.00,
        shippingDelay: "3 à 5 jours ouvrés",
        heroBanners: [
          {
            id: "1",
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&h=1080&q=80",
            title: "Sublimez votre intérieur avec élégance",
            subtitle: "Découvrez nos nouvelles collections de mobilier, carrelage et décoration pour créer un espace qui vous ressemble.",
            buttonText: "Découvrir la collection",
            buttonLink: "/boutique?category=mobilier"
          },
          {
            id: "2",
            image: "/nouveautecarrelage.jpg",
            title: "Carrelages & Faïences d'exception",
            subtitle: "Un large choix de faïences et de carrelages de haute qualité pour toutes vos pièces d'eau, cuisines et extérieurs.",
            buttonText: "Voir les carrelages",
            buttonLink: "/boutique?category=carrelage"
          }
        ]
      },
      
      addToCart: (product, quantity) => set((state) => {
        const existingItem = state.cart.find(item => item.product.id === product.id);
        if (existingItem) {
          return {
            cart: state.cart.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        return { cart: [...state.cart, { product, quantity }] };
      }),
      
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item => 
          item.product.id === productId 
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      })),
      
      clearCart: () => set({ cart: [] }),
      
      addProduct: async (product) => {
        if (isFirebaseConfigured) {
          try {
            await setDoc(doc(db, "products", product.id), product);
          } catch (e) {
            console.error("Error adding product to Firebase:", e);
          }
        }
        set((state) => {
          if (state.products.some(p => p.id === product.id)) return state;
          return { products: [product, ...state.products] };
        });
      },
      
      updateProduct: async (updatedProduct) => {
        if (isFirebaseConfigured) {
          try {
            await setDoc(doc(db, "products", updatedProduct.id), updatedProduct, { merge: true });
          } catch (e) {
            console.error("Error updating product in Firebase:", e);
          }
        }
        set((state) => ({
          products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        }));
      },
      
      deleteProduct: async (productId) => {
        if (isFirebaseConfigured) {
          try {
            await deleteDoc(doc(db, "products", productId));
          } catch (e) {
            console.error("Error deleting product from Firebase:", e);
          }
        }
        set((state) => ({
          products: state.products.filter(p => p.id !== productId)
        }));
      },

      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
      })),
      
      updateCategory: (updatedCategory) => set((state) => ({
        categories: state.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)
      })),
      
      deleteCategory: (categoryId) => set((state) => ({
        categories: state.categories.filter(c => c.id !== categoryId)
      })),
      
      placeOrder: (customerDetails) => {
        const state = get();
        const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const shipping = subtotal > 200 ? 0 : 29.90; // Default delivery
        const taxes = subtotal * 0.085; // Octroi de mer/TVA local approx
        const total = subtotal + shipping + taxes;
        
        const newOrder: Order = {
          id: `CMD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
          date: Date.now(),
          customerDetails,
          items: [...state.cart],
          subtotal,
          shipping,
          taxes,
          total,
          status: 'pending'
        };
        
        set((state) => ({
          orders: [newOrder, ...state.orders],
          cart: []
        }));
        
        return newOrder.id;
      },
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      loginUser: (email, name, phone) => set((state) => {
        const newUser: User = {
          id: `USR-${Math.floor(Math.random() * 1000000)}`,
          email,
          name,
          phone,
          registeredAt: Date.now(),
          loyaltyPoints: 50, // Regaler à l'inscription d'un bonus fidélité
          dailyBonusClaimedAt: 0
        };
        return { user: newUser };
      }),

      logoutUser: () => set({ user: null }),

      addLoyaltyPoints: (points) => set((state) => {
        if (!state.user) return {};
        return {
          user: {
            ...state.user,
            loyaltyPoints: (state.user.loyaltyPoints || 0) + points
          }
        };
      }),

      claimDailyBonus: () => set((state) => {
        if (!state.user) return {};
        return {
          user: {
            ...state.user,
            loyaltyPoints: (state.user.loyaltyPoints || 0) + 15, // 15 points per day
            dailyBonusClaimedAt: Date.now()
          }
        };
      }),
      
      initializeFirebaseSync: () => {
        console.log("initializeFirebaseSync was called. isFirebaseConfigured:", isFirebaseConfigured);
        if (!isFirebaseConfigured) {
          console.warn("Firebase is not configured. Falling back to mock data / localStorage.");
          return;
        }
        
        // Listen to products
        console.log("Subscribing to Firestore products collection...");
        onSnapshot(collection(db, "products"), (snapshot) => {
          console.log(`Firestore products snapshot received. Document count: ${snapshot.docs.length}`);
          const products = snapshot.docs.map(doc => mapFirestoreDocToProduct(doc.id, doc.data()));
          console.log("Mapped products from Firestore:", products);
          if (products.length > 0) {
            set({ products });
          } else {
            console.warn("Firestore products collection is empty.");
          }
        }, (error) => {
          console.error("Firebase products sync error in Zustand store:", error);
        });

        // Listen to categories
        onSnapshot(collection(db, "categories"), (snapshot) => {
          const categories = snapshot.docs.map(doc => doc.data() as Category);
          if (categories.length > 0) {
            set({ categories });
          }
        }, (error) => {
          console.error("Firebase categories sync error:", error);
        });
      }
    }),
    {
      name: 'cazdeco-storage',
      version: 5, // Bump version to clear old storage, fix banners and restore slides
      migrate: (persistedState: any, version: number) => {
        if (version < 5) {
          // Reset state to avoid old undefined data
          return {
            products: mockProducts,
            categories: mockCategories,
            cart: [],
            orders: [],
            user: null,
            settings: {
              siteName: "CAZ'DECO",
              slogan: "Le spécialiste de l'aménagement et de la décoration à Mayotte",
              promotionalText: "Paiement jusqu'à 4 fois sans frais. Livraison express sur toute l'île. Support client à votre écoute.",
              contactEmail: "cazdeco976@gmail.com",
              phone: "+262 692 00 00 00",
              address: "1 IMPASSE MAHARAJA KAWENI 97600 MAYOTTE",
              shippingStandard: 25.00,
              shippingFreeThreshold: 500.00,
              shippingDelay: "3 à 5 jours ouvrés",
              heroBanners: [
                {
                  id: "1",
                  image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&h=1080&q=80",
                  title: "Sublimez votre intérieur avec élégance",
                  subtitle: "Découvrez nos nouvelles collections de mobilier, carrelage et décoration pour créer un espace qui vous ressemble.",
                  buttonText: "Découvrir la collection",
                  buttonLink: "/boutique?category=mobilier"
                },
                {
                  id: "2",
                  image: "/nouveautecarrelage.jpg",
                  title: "Carrelages & Faïences d'exception",
                  subtitle: "Un large choix de faïences et de carrelages de haute qualité pour toutes vos pièces d'eau, cuisines et extérieurs.",
                  buttonText: "Voir les carrelages",
                  buttonLink: "/boutique?category=carrelage"
                }
              ]
            }
          };
        }
        return persistedState;
      }
    }
  )
);

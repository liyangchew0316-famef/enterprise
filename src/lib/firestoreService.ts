import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, MaterialSpool, OrderStatus, PaymentStatus, ChiliDrawing } from '../types';

// Collection references
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const SPOOLS_COL = 'spools';
const QUOTES_COL = 'custom_quotes';
const DRAWINGS_COL = 'chili_drawings';

/**
 * Standardized Firestore error logger
 */
function handleFirestoreError(action: string, error: unknown): void {
  console.error(`[Firestore Service] Error during ${action}:`, error);
}

/**
 * Deep sanitization function for Firestore documents.
 * Firestore strictly disallows `undefined` values anywhere in a document tree.
 * This helper recursively removes all keys whose values are `undefined`.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return undefined as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean as unknown as T;
}

// ==========================================
// 1. PRODUCTS
// ==========================================
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COL));
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push(docSnap.data() as Product);
    });
    return products;
  } catch (error) {
    handleFirestoreError('fetchProductsFromFirestore', error);
    return [];
  }
}

export async function saveProductToFirestore(product: Product): Promise<boolean> {
  try {
    const cleanProduct = sanitizeForFirestore(product);
    await setDoc(doc(db, PRODUCTS_COL, product.id), cleanProduct, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError('saveProductToFirestore', error);
    return false;
  }
}

// ==========================================
// 2. ORDERS (Prepared for Customer Orders)
// ==========================================
export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  try {
    const querySnapshot = await getDocs(collection(db, ORDERS_COL));
    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });
    // Order by newest first
    return orders.sort((a, b) => new Date(b.date || (b as any).createdAt || 0).getTime() - new Date(a.date || (a as any).createdAt || 0).getTime());
  } catch (error) {
    handleFirestoreError('fetchOrdersFromFirestore', error);
    return [];
  }
}

/**
 * Fetch customer orders specifically for an authenticated user UID
 */
export async function fetchUserOrdersFromFirestore(userId: string): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COL), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });
    return orders.sort((a, b) => new Date(b.date || (b as any).createdAt || 0).getTime() - new Date(a.date || (a as any).createdAt || 0).getTime());
  } catch (error) {
    handleFirestoreError(`fetchUserOrdersFromFirestore(${userId})`, error);
    return [];
  }
}

/**
 * Save new or updated customer order to Firestore safely (with undefined stripping)
 */
export async function saveOrderToFirestore(order: Order): Promise<boolean> {
  console.log('[Firestore] 🚀 saveOrderToFirestore called for Order ID:', order.id);
  console.log('[Firestore] Runtime target Firebase Project ID:', db.app.options.projectId);
  console.log('[Firestore] Database instance ID:', (db as any)._databaseId?.database || '(default)');

  try {
    const cleanOrder = sanitizeForFirestore({
      ...order,
      firebaseSynced: true,
      updatedAt: new Date().toISOString()
    });
    console.log('[Firestore] Writing sanitized order payload to collection "orders", document:', order.id);
    
    await setDoc(doc(db, ORDERS_COL, order.id), cleanOrder, { merge: true });
    
    console.log('[Firestore] ✅ setDoc succeeded for Order:', order.id);
    return true;
  } catch (error: any) {
    console.error('[Firestore] ❌ setDoc FAILED for Order:', order.id);
    console.error('[Firestore] Error Code:', error?.code);
    console.error('[Firestore] Error Message:', error?.message);
    console.error('[Firestore] Full Error Object:', error);
    handleFirestoreError(`saveOrderToFirestore(${order.id})`, error);
    throw error;
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string, 
  status: OrderStatus, 
  note?: string
): Promise<boolean> {
  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    const docSnap = await getDoc(orderRef);
    if (docSnap.exists()) {
      const orderData = docSnap.data() as Order;
      const historyEntry: { status: OrderStatus; timestamp: string; note?: string } = {
        status,
        timestamp: new Date().toISOString()
      };
      if (note) {
        historyEntry.note = note;
      }
      const updatedHistory = [
        ...(orderData.statusHistory || []),
        historyEntry
      ];
      
      const payload = sanitizeForFirestore({
        status,
        statusHistory: updatedHistory,
        updatedAt: new Date().toISOString()
      });
      
      await updateDoc(orderRef, payload);
      return true;
    }
    return false;
  } catch (error) {
    handleFirestoreError(`updateOrderStatusInFirestore(${orderId})`, error);
    return false;
  }
}

/**
 * Real-time listener for a single order (Customer TNG Payment & Tracking).
 * Calls onUpdate with fresh Order data whenever the document changes in Firestore.
 */
export function subscribeToOrderById(
  orderId: string, 
  onUpdate: (order: Order | null) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    const unsubscribe = onSnapshot(
      orderRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Order;
          onUpdate(data);
        } else {
          onUpdate(null);
        }
      },
      (err) => {
        console.error(`[Firestore onSnapshot] Error listening to order ${orderId}:`, err);
        onError?.(err);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.error(`[Firestore onSnapshot] Setup failed for order ${orderId}:`, err);
    return () => {};
  }
}

/**
 * Update payment status for an order in Firestore
 * e.g., 'payment_submitted' when customer finishes manual TNG transfer,
 * or 'paid' when Admin verifies the transfer.
 */
export async function updatePaymentStatusInFirestore(
  orderId: string,
  paymentStatus: PaymentStatus,
  metadata?: Record<string, any>
): Promise<boolean> {
  console.log(`[Firestore] Updating paymentStatus for order ${orderId} -> ${paymentStatus}`);
  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    const docSnap = await getDoc(orderRef);
    if (!docSnap.exists()) {
      console.warn(`[Firestore] Order ${orderId} not found to update paymentStatus`);
      return false;
    }

    const orderData = docSnap.data() as Order;
    const now = new Date().toISOString();
    
    // Status history entry
    const historyNote = metadata?.note || 
      (paymentStatus === 'payment_submitted' 
        ? 'Customer submitted manual Touch \'n Go eWallet payment confirmation.' 
        : paymentStatus === 'paid' 
          ? 'Admin verified Touch \'n Go payment received.' 
          : `Payment status changed to ${paymentStatus}`);

    const historyEntry: { status: OrderStatus; timestamp: string; note?: string } = {
      status: orderData.status || 'Pending',
      timestamp: now,
      note: historyNote
    };

    const updatedHistory = [
      ...(orderData.statusHistory || []),
      historyEntry
    ];

    const payload: Record<string, any> = {
      paymentStatus,
      statusHistory: updatedHistory,
      updatedAt: now,
      ...(paymentStatus === 'payment_submitted' ? { paymentSubmittedAt: now } : {}),
      ...(paymentStatus === 'paid' ? { paymentVerifiedAt: now } : {}),
      ...(metadata || {})
    };

    const cleanPayload = sanitizeForFirestore(payload);
    await updateDoc(orderRef, cleanPayload);
    console.log(`[Firestore] ✅ paymentStatus successfully updated to ${paymentStatus} for order ${orderId}`);
    return true;
  } catch (error) {
    handleFirestoreError(`updatePaymentStatusInFirestore(${orderId})`, error);
    return false;
  }
}

// ==========================================
// 3. MATERIAL SPOOLS (Inventory)
// ==========================================
export async function fetchSpoolsFromFirestore(): Promise<MaterialSpool[]> {
  try {
    const querySnapshot = await getDocs(collection(db, SPOOLS_COL));
    const spools: MaterialSpool[] = [];
    querySnapshot.forEach((docSnap) => {
      spools.push(docSnap.data() as MaterialSpool);
    });
    return spools;
  } catch (error) {
    handleFirestoreError('fetchSpoolsFromFirestore', error);
    return [];
  }
}

export async function saveSpoolToFirestore(spool: MaterialSpool): Promise<boolean> {
  try {
    const cleanSpool = sanitizeForFirestore(spool);
    await setDoc(doc(db, SPOOLS_COL, spool.id), cleanSpool, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError('saveSpoolToFirestore', error);
    return false;
  }
}

export async function updateSpoolStockInFirestore(spoolId: string, stockKg: number): Promise<boolean> {
  try {
    const spoolRef = doc(db, SPOOLS_COL, spoolId);
    await updateDoc(spoolRef, {
      stockKg,
      isLow: stockKg <= 3.0
    });
    return true;
  } catch (error) {
    handleFirestoreError(`updateSpoolStockInFirestore(${spoolId})`, error);
    return false;
  }
}

// ==========================================
// 4. CHILI DRAWINGS & CUSTOM ARTWORK
// ==========================================
export async function fetchChiliDrawingsFromFirestore(): Promise<ChiliDrawing[]> {
  try {
    const querySnapshot = await getDocs(collection(db, DRAWINGS_COL));
    const drawings: ChiliDrawing[] = [];
    querySnapshot.forEach((docSnap) => {
      drawings.push(docSnap.data() as ChiliDrawing);
    });
    return drawings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError('fetchChiliDrawingsFromFirestore', error);
    return [];
  }
}

export async function saveChiliDrawingToFirestore(drawing: ChiliDrawing): Promise<boolean> {
  try {
    const cleanDrawing = sanitizeForFirestore(drawing);
    await setDoc(doc(db, DRAWINGS_COL, drawing.id), cleanDrawing, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError('saveChiliDrawingToFirestore', error);
    return false;
  }
}

export async function deleteChiliDrawingFromFirestore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, DRAWINGS_COL, id));
    return true;
  } catch (error) {
    handleFirestoreError(`deleteChiliDrawingFromFirestore(${id})`, error);
    return false;
  }
}

export async function likeChiliDrawingInFirestore(id: string, currentLikes: number = 0): Promise<number> {
  try {
    const drawingRef = doc(db, DRAWINGS_COL, id);
    const newLikes = currentLikes + 1;
    await updateDoc(drawingRef, {
      likesCount: newLikes
    });
    return newLikes;
  } catch (error) {
    handleFirestoreError(`likeChiliDrawingInFirestore(${id})`, error);
    return currentLikes + 1;
  }
}

// ==========================================
// 5. INITIAL DATA FETCH & SEEDING (PRODUCTS ONLY)
// ==========================================
export async function seedFirestoreInitialData(
  defaultProducts: Product[],
  defaultOrders: Order[],
  defaultSpools: MaterialSpool[]
): Promise<{ products: Product[]; orders: Order[]; spools: MaterialSpool[] }> {
  try {
    let products = await fetchProductsFromFirestore();
    if (products.length === 0 && defaultProducts.length > 0) {
      for (const prod of defaultProducts) {
        await saveProductToFirestore(prod);
      }
      products = defaultProducts;
    }

    // Only load real orders from Firestore; do NOT seed fake orders into database
    let orders = await fetchOrdersFromFirestore();
    if (orders.length === 0) {
      orders = defaultOrders; // fallback client state only, not saved to Firestore
    }

    let spools = await fetchSpoolsFromFirestore();
    if (spools.length === 0 && defaultSpools.length > 0) {
      for (const spool of defaultSpools) {
        await saveSpoolToFirestore(spool);
      }
      spools = defaultSpools;
    }

    return { products, orders, spools };
  } catch (error) {
    handleFirestoreError('seedFirestoreInitialData', error);
    return { products: defaultProducts, orders: defaultOrders, spools: defaultSpools };
  }
}

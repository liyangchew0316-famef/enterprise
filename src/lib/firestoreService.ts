import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, MaterialSpool, OrderStatus } from '../types';

// Collection references
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const SPOOLS_COL = 'spools';
const QUOTES_COL = 'custom_quotes';

// --- PRODUCTS ---
export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COL));
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });
    return products;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return [];
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, PRODUCTS_COL, product.id), product, { merge: true });
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
  }
}

// --- ORDERS ---
export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  try {
    const querySnapshot = await getDocs(collection(db, ORDERS_COL));
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data() as Order);
    });
    // Sort orders by date descending
    return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching orders from Firestore:', error);
    return [];
  }
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, ORDERS_COL, order.id), order, { merge: true });
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus, note?: string): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    const docSnap = await getDoc(orderRef);
    if (docSnap.exists()) {
      const orderData = docSnap.data() as Order;
      const updatedHistory = [
        ...(orderData.statusHistory || []),
        { status, timestamp: new Date().toISOString(), note }
      ];
      await updateDoc(orderRef, {
        status,
        statusHistory: updatedHistory
      });
    }
  } catch (error) {
    console.error('Error updating order status in Firestore:', error);
  }
}

// --- SPOOLS ---
export async function fetchSpoolsFromFirestore(): Promise<MaterialSpool[]> {
  try {
    const querySnapshot = await getDocs(collection(db, SPOOLS_COL));
    const spools: MaterialSpool[] = [];
    querySnapshot.forEach((doc) => {
      spools.push(doc.data() as MaterialSpool);
    });
    return spools;
  } catch (error) {
    console.error('Error fetching spools from Firestore:', error);
    return [];
  }
}

export async function saveSpoolToFirestore(spool: MaterialSpool): Promise<void> {
  try {
    await setDoc(doc(db, SPOOLS_COL, spool.id), spool, { merge: true });
  } catch (error) {
    console.error('Error saving spool to Firestore:', error);
  }
}

export async function updateSpoolStockInFirestore(spoolId: string, stockKg: number): Promise<void> {
  try {
    const spoolRef = doc(db, SPOOLS_COL, spoolId);
    await updateDoc(spoolRef, {
      stockKg,
      isLow: stockKg <= 3.0
    });
  } catch (error) {
    console.error('Error updating spool stock in Firestore:', error);
  }
}

// Seed initial data if Firestore collections are empty
export async function seedFirestoreInitialData(
  defaultProducts: Product[],
  defaultOrders: Order[],
  defaultSpools: MaterialSpool[]
): Promise<{ products: Product[]; orders: Order[]; spools: MaterialSpool[] }> {
  let products = await fetchProductsFromFirestore();
  if (products.length === 0 && defaultProducts.length > 0) {
    console.log('Seeding products to Firestore...');
    for (const p of defaultProducts) {
      await saveProductToFirestore(p);
    }
    products = defaultProducts;
  }

  let orders = await fetchOrdersFromFirestore();
  if (orders.length === 0 && defaultOrders.length > 0) {
    console.log('Seeding orders to Firestore...');
    for (const o of defaultOrders) {
      await saveOrderToFirestore(o);
    }
    orders = defaultOrders;
  }

  let spools = await fetchSpoolsFromFirestore();
  if (spools.length === 0 && defaultSpools.length > 0) {
    console.log('Seeding spools to Firestore...');
    for (const s of defaultSpools) {
      await saveSpoolToFirestore(s);
    }
    spools = defaultSpools;
  }

  return { products, orders, spools };
}

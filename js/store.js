import { db } from './firebase-config.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export async function validarCupon(codigoInput) {
  const cuponesRef = collection(db, "coupons");
  const q = query(cuponesRef, where("code", "==", codigoInput));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) throw new Error("Cupón no existe");

  const cuponDoc = querySnapshot.docs[0];
  const cupon = cuponDoc.data();

  if (!cupon.active) throw new Error("Cupón inactivo");
  if (cupon.expirationDate.toDate() < new Date()) throw new Error("Cupón vencido");
  if (cupon.usedCount >= cupon.usageLimit) throw new Error("Límite de usos alcanzado");

  return { id: cuponDoc.id, ...cupon };
}
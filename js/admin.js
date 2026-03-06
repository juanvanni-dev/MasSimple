import { db, storage } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

export async function crearProducto(archivoImagen, datosProducto) {
  try {
    // 1. Subir imagen a Storage
    const storageRef = ref(storage, `productos/${archivoImagen.name}`);
    await uploadBytes(storageRef, archivoImagen);
    const imagenUrl = await getDownloadURL(storageRef);

    // 2. Guardar en Firestore
    const docRef = await addDoc(collection(db, "products"), {
      nombre: datosProducto.nombre,
      precio: Number(datosProducto.precio),
      descripcion: datosProducto.descripcion,
      categoria: datosProducto.categoria,
      stock: Number(datosProducto.stock),
      sku: datosProducto.sku,
      imagen: imagenUrl,
      activo: true,
      fechaCreacion: serverTimestamp()
    });
    
    console.log("Producto creado con ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error al crear producto: ", error);
    return false;
  }
}
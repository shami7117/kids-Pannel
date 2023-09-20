import { db } from "../../Firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Add New Product
const addProduct = async (data) => {
  console.log("data", data);
  const snapshot = collection(db, "Products");
  // let q = query(snapshot, where("email", "==", data.email));
  // const ProductExist = await getDocs(q);

  // if (ProductExist.docs.length > 0) {
  //   return {
  //     message: "Product already exist!",
  //     code: 0,
  //   };
  // } else {
  const ref = doc(db, "Products", uuidv4());
  await setDoc(ref, data, { merge: true });
  const getRef = doc(db, "Products", ref.id);
  const res = await getDoc(getRef);
  return res.data()
    ? {
      data: { ...res.data(), id: res.id },
      message: "Product added successfully!",
      code: 1,
    }
    : {
      message: "Something went wrong!",
      code: 0,
    };
  // }
  // return ProductExist
};

// Get Single Product By Id
// const getProduct = async (id) => {
// };

// Get All Products
const getProducts = async (status) => {
  const ref = collection(db, "Products");
  console.log("status", status);

  let res;
  if (status !== null) {
    // Use the 'where' method to filter documents based on the status field
    const q = query(ref, where("status", "==", status));
    res = await getDocs(q);
  } else {
    res = await getDocs(ref);
  }

  let docs = [];

  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      docs.push({
        ...doc.data(),
        id: doc.id,
        createdAt: doc?.data()?.createdAt?.toDate()?.toString(),
      });
    });
    return docs;
  }
};



const getAllProducts = async () => {
  const ref = collection(db, "Products");


  const res = await getDocs(ref);


  let docs = [];

  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      docs.push({
        ...doc.data(),
        id: doc.id,
        createdAt: doc?.data()?.createdAt?.toDate()?.toString(),
      });
    });
    return docs;
  }
};


// Update Product
const updateProduct = async (id, Product) => {
  console.log("Product in api", Product);
  console.log("ID in api", id);
  const ref = doc(db, "Products", id);
  await setDoc(ref, Product, { merge: true });
  return {
    ...Product,
    id,
  };
};

// Delete Product
const deleteProduct = async (id) => {
  console.log("DELETED", id)
  const ref = doc(db, "Products", id);
  await deleteDoc(ref);
  console.log("DELETED")
  return id;
};

// Update Product Status
const activateProduct = async (Product) => {
  const data = {
    id: Product.key,
    name: Product.name,
    isEnabled: true,
  };
  const ref = doc(db, "Products", Product.key);
  await setDoc(ref, data, { merge: true });
  return data;
};
// Update Product Status
const deActivateProduct = async (Product) => {
  const data = {
    id: Product.key,
    name: Product.name,
    isEnabled: false,
  };
  const ref = doc(db, "Products", data.id);
  await setDoc(ref, data, { merge: true });
  return data;
};

const ProductApi = {
  addProduct,
  getProducts,
  updateProduct,
  activateProduct,
  deActivateProduct,
  deleteProduct,
  getAllProducts
};

export default ProductApi;

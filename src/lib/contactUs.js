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

// Add New ContactUs
const addContactUs = async (data) => {
    console.log("data", data);
    const snapshot = collection(db, "ContactUs");
    // let q = query(snapshot, where("email", "==", data.email));
    // const ContactUsExist = await getDocs(q);

    // if (ContactUsExist.docs.length > 0) {
    //   return {
    //     message: "ContactUs already exist!",
    //     code: 0,
    //   };
    // } else {
    const ref = doc(db, "ContactUs", uuidv4());
    await setDoc(ref, data, { merge: true });
    const getRef = doc(db, "ContactUs", ref.id);
    const res = await getDoc(getRef);
    return res.data()
        ? {
            data: { ...res.data(), id: res.id },
            message: "ContactUs added successfully!",
            code: 1,
        }
        : {
            message: "Something went wrong!",
            code: 0,
        };
    // }
    // return ContactUsExist
};

// Get Single ContactUs By Id
// const getContactUs = async (id) => {
// };

// Get All ContactUs
const getContactUs = async () => {
    const ref = collection(db, "ContactUs");
    console.log("status", status);

    let res;

    res = await getDocs(ref);


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



const getAllContactUs = async () => {
    const ref = collection(db, "ContactUs");


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


// Update ContactUs
const updateContactUs = async (id, ContactUs) => {
    console.log("ContactUs in api", ContactUs);
    console.log("ID in api", id);
    const ref = doc(db, "ContactUs", id);
    await setDoc(ref, ContactUs, { merge: true });
    return {
        ...ContactUs,
        id,
    };
};

// Delete ContactUs
const deleteContactUs = async (id) => {
    console.log("DELETED", id)
    const ref = doc(db, "ContactUs", id);
    await deleteDoc(ref);
    console.log("DELETED")
    return id;
};

// Update ContactUs Status
const activateContactUs = async (ContactUs) => {
    const data = {
        id: ContactUs.key,
        name: ContactUs.name,
        isEnabled: true,
    };
    const ref = doc(db, "ContactUs", ContactUs.key);
    await setDoc(ref, data, { merge: true });
    return data;
};
// Update ContactUs Status
const deActivateContactUs = async (ContactUs) => {
    const data = {
        id: ContactUs.key,
        name: ContactUs.name,
        isEnabled: false,
    };
    const ref = doc(db, "ContactUs", data.id);
    await setDoc(ref, data, { merge: true });
    return data;
};

const ContactUsApi = {
    addContactUs,
    getContactUs,
    updateContactUs,
    activateContactUs,
    deActivateContactUs,
    deleteContactUs,
    getAllContactUs
};

export default ContactUsApi;

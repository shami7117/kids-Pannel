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

// Add New Admin
const addAdmin = async (data) => {
    console.log("data", data);
    const snapshot = collection(db, "Admins");
    let q = query(snapshot, where("email", "==", data.email));
    const AdminExist = await getDocs(q);

    if (AdminExist.docs.length > 0) {
        return {
            message: "Admin already exist!",
            code: 0,
        };
    } else {
        const ref = doc(db, "Admins", uuidv4());
        await setDoc(ref, data, { merge: true });
        const getRef = doc(db, "Admins", ref.id);
        const res = await getDoc(getRef);
        console.log("API DATA", res.data(), "API ID", res.id)
        return res.data()
            ? {
                data: { ...res.data(), id: res.id },
                message: "Admin added successfully!",
                code: 1,
            }
            : {
                message: "Something went wrong!",
                code: 0,
            };
    }
    return AdminExist
};

// Get Single Admin By Id
// const getAdmin = async (id) => {
// };

// Get All Admins
const getAdmins = async () => {
    const ref = collection(db, "Admins");
    const res = await getDocs(ref);
    let docs = [];
    if (res.docs.length <= 0) {
        return [];
    } else {
        res.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
        });
        console.log(docs)
        return docs;
    }
};

const getUserByUserId = async (userId) => {
    const ref = collection(db, "Admins");
    const querySnapshot = await getDocs(ref);

    for (const doc of querySnapshot.docs) {
        if (doc.id === userId) {
            const userData = { ...doc.data(), id: doc.id };
            console.log(userData);
            return userData;
        }
    }

    return null; // No matching user found
};

const getUsersByUserIds = async (userIds) => {
    console.log("IDS IN API", userIds)
    const ref = collection(db, "Admins");
    const querySnapshot = await getDocs(ref);
    const matchingUsers = [];

    for (const userIdArray of userIds) {
        for (const userId of userIdArray) {
            const doc = querySnapshot.docs.find(doc => doc.id === userId);
            if (doc) {
                const userData = { ...doc.data(), id: doc.id };
                matchingUsers.push(userData);
                break; // Break the loop once a match is found in this userIdArray
            }
        }
    }

    return matchingUsers;
};





// Update Admin
const updateAdmin = async (id, Admin) => {
    console.log("Admin in api", Admin);
    console.log("ID in api", id);
    const ref = doc(db, "Admins", id);
    await setDoc(ref, Admin, { merge: true });
    return {
        ...Admin,
        id,
    };
};

// Delete Admin
const deleteAdmin = async (id) => {
    console.log("DELETED", id)
    const ref = doc(db, "Admins", id);
    await deleteDoc(ref);
    console.log("DELETED")
    return id;
};

// Update Admin Status
const activateAdmin = async (Admin) => {
    const data = {
        id: Admin.key,
        name: Admin.name,
        isEnabled: true,
    };
    const ref = doc(db, "Admins", Admin.key);
    await setDoc(ref, data, { merge: true });
    return data;
};
// Update Admin Status
const deActivateAdmin = async (Admin) => {
    const data = {
        id: Admin.key,
        name: Admin.name,
        isEnabled: false,
    };
    const ref = doc(db, "Admins", data.id);
    await setDoc(ref, data, { merge: true });
    return data;
};

const AdminApi = {
    addAdmin,
    getAdmins,
    updateAdmin,
    getUserByUserId,
    activateAdmin,
    deActivateAdmin,
    deleteAdmin,
    getUsersByUserIds
};

export default AdminApi;

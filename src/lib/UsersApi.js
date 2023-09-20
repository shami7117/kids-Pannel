import {
    arrayRemove,
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
import { db } from "../../firebase/firebase";



// Get All Users
const getUsers = async () => {
    try {
        const ref = collection(db, "Users");
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
    } catch (error) {
        console.log(error)
    }
};

// Update User
const updateUser = async (UserId, User) => {
    // console.log("project id", projectId);
    // console.log("project", project);
    const ref = doc(db, "Users", UserId);
    // delete project.id;
    await setDoc(ref, User, { merge: true });
    // console.log("project", project);
    return {
        ...User,
        id: UserId,
    };
};


// Add User
const addUser = async (data) => {
    console.log("data of adding guser", data);
    const snapshot = collection(db, "Users");
    let q = query(snapshot, where("email", "==", data?.email));
    const userExist = await getDocs(q);

    if (userExist.docs.length > 0) {
        return {
            message: "User already exists!",
            code: 0,
        };
    } else {
        const ref = doc(db, "Users", uuidv4());
        await setDoc(ref, data, { merge: true });
        const getRef = doc(db, "Users", ref.id);
        const res = await getDoc(getRef);
        return res.data()
            ? {
                data: { ...res.data(), id: res.id },
                message: "User added successfully!",
                code: 1,
            }
            : {
                message: "Something went wrong!",
                code: 0,
            };
    }
};



// Delete User
const deleteUser = async (id) => {
    const ref = doc(db, "Users", id);
    await deleteDoc(ref);
    return id;
};







const UsersApi = {

    getUsers, updateUser, addUser, deleteUser
};

export default UsersApi;

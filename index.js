const express = require("express");
const cors = require("cors");
const app = express();
const { database } = require("./config");
const {
  addDoc,
  collection,
  setDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} = require("firebase/firestore");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// User's collection
const usersCollection = collection(database, "users");
const bookingCollection = collection(database, "bookings");

// Getting individual user by email from database
app.get("/single-user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const querySnapshot = await getDocs(
      query(usersCollection, where("email", "==", email))
    );

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];

      // Get the user data from the document
      const userData = userDoc.data();
      console.log(userDoc.id);
      userData.id = userDoc.id;

      // Respond with the user data
      res.status(200).json(userData);
    } else {
      res
        .status(404)
        .json({ message: "No such document with the given email" });
    }
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Getting all bookings
app.get("/all-bookings", async (req, res) => {
  const querySnapshot = await getDocs(bookingCollection);

  const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  res.status(200).json(list);
});

// Getting individual booking with id
app.get("/single-booking/:id", async (req, res) => {
  const { id } = req.params;

  const docRef = doc(bookingCollection, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const bookingData = docSnap.data();
    res.status(200).json({ id: docSnap.id, ...bookingData });
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
});

// Getting all bookings of individual user
app.get("/my-bookings/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const querySnapshot = await getDocs(
      query(bookingCollection, where("email", "==", email))
    );

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];

      // Get the user data from the document
      const userData = userDoc.data();
      userData.id = userDoc.id;

      // Respond with the bookings of individual user
      res.status(200).json(userData);
    } else {
      res
        .status(404)
        .json({ message: "No such document with the given email" });
    }
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// adding new booking
app.post("/add-booking", async (req, res) => {
  const data = req.body;

  const result = await addDoc(bookingCollection, data);
});

/* app.post("/add-user", async (req, res) => {
  try {
    // Get user data from the request body
    const userData = {
      name: "Iftekher Hossen",
      email: "iftekherhossensajjad@gmail.com",
      role: "user",
    };

    // Add a new user document to the Firestore collection
    const newUserRef = await addDoc(usersCollection, userData);

    // Respond with the ID of the newly created user document
    res
      .status(201)
      .json({ message: "User added successfully", id: newUserRef.id });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}); */

app.get("/", async (req, res) => {
  res.send("Hotel booking admin is running");
});

app.listen(port, () => {
  console.log(`Hotel booking admin is running on port ${port}`);
});

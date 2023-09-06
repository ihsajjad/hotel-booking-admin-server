const express = require("express");
const cors = require("cors");
const app = express();
const { database } = require("./config");
const {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
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
      query(bookingCollection, where("guestEmail", "==", email))
    );

    if (!querySnapshot.empty) {
      const list = querySnapshot?.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Respond with the bookings of individual user
      res.status(200).json(list);
    }
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// adding new booking
app.post("/add-booking", async (req, res) => {
  const data = req.body;

  try {
    const result = await addDoc(bookingCollection, data);
    res.status(200).send({ error: false, message: "added successfully" });
  } catch (err) {
    if (err) {
      res.status(400).send({ error: true, message: "failed to add" });
    }
  }
});

app.get("/", async (req, res) => {
  res.send("Hotel booking admin is running");
});

// updating booking status and adding manager info
app.post("/update-single-booking/:id", async (req, res) => {
  const { id } = req.params;
  const updated = req.body;

  try {
    const result = await updateDoc(doc(bookingCollection, id), updated);
    if (result) {
      res.status(200).send({ error: false, message: "update successfull" });
    }
  } catch (err) {
    res.status(401).send({ error: true, message: "update failed" });
  }
});

app.listen(port, () => {
  console.log(`Hotel booking admin is running on port ${port}`);
});

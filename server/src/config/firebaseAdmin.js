import admin from "firebase-admin";
import fs from "fs"; // This lets Node read files from server folder.

const serviceAccount = JSON.parse(
  fs.readFileSync("firebase-service-account.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
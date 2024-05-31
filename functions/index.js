const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
require("dotenv").config();

admin.initializeApp();
const db = admin.firestore();
db.settings({
  ignoreUndefinedProperties: true,
});

exports.sentryWebhook = functions.https.onRequest(async (req, res) => {
  const issue = req.body; // Assuming body-parser middleware is used

  // console.log("Received new issue:", issue);

  // Assuming 'projectName' is part of the issue object or determined some other way
  const projectName = issue.project || "defaultProject";

  // Define the message for Firebase Cloud Messaging
  const message = {
    title: `New ${issue.project} Issue`,
    body: issue.message || "A new issue has been reported.",
    data: {
      projectName: issue.project,
      issueId: issue.id,
      eventId: issue.event.event_id,
      level: issue.event.level,
      timestamp: issue.event.received,
      _displayInForeground: true,
    },
  };

  console.log(issue);

  const post_data = {
    id: issue.id,
    event: {
      project: issue.project,
      id: issue.id,
      eventId: issue.event.event_id,
      level: issue.event.level,
      metadata: issue.event.metadata,
      location: issue.event.location,
      culprit: issue.culprit,
      message: issue.message,
      timestamp: issue.event.received,
    },
    user: {
      email: issue.event.user?.email || "No email provided",
      username: issue.event.user?.username || "No username provided",
      ip_address: issue.event.user?.ip_address || "No IP address provided",
    },
  };

  try {
    db.collection("projects")
      .doc(projectName)
      .collection("issues")
      .doc(issue.event.event_id)
      .set(post_data)
      .then(() => console.log(`Issue added successfully`))
      .catch((error) => console.error(`Error adding issue: ${error}`));

    console.log(
      `Issue added to Firestore under projects/${projectName}/issues/${issue.id}`
    );

    const tokens = await fetchTokens();
    console.log(
      "🚀 ~ exports.sentryWebhook=functions.https.onRequest ~ tokens:",
      tokens
    );

    // Send notification
    if (tokens.length > 0) {
      await sendPushNotification(tokens, message);
      res.status(200).send("Notification sent successfully");
    } else {
      res.status(404).send("No tokens found for project");
    }
  } catch (error) {
    console.error("Error processing issue:", error);
    res.status(500).send("Error processing issue");
  }
});

async function sendPushNotification(tokens, message) {
  console.log("🚀 ~ sendPushNotification ~ tokens:", tokens);

  console.log("Sending notifications...");

  console.log("Message:", message);

  const messages = tokens.map((token) => ({
    to: token.expoPushToken,
    sound: "default",
    ...message,
  }));

  console.log("Messages:", messages);

  try {
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      messages,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response from Expo server:", response.data);
    console.log("Notifications sent successfully");
  } catch (error) {
    console.error("Push notification error:", error.message);
  }
}

async function fetchTokens() {
  const db = admin.firestore();
  const tokens = [];

  await db
    .collection("user")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        tokens.push(doc.data());
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  return tokens;
}

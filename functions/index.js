const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
require("dotenv").config();

admin.initializeApp();
const db = admin.firestore();
db.settings({
  ignoreUndefinedProperties: true,
});

// const sentryToken = process.env.SENTRY_TOKEN;
const sentryToken = functions.config().sentry.token;

exports.sentryWebhook = functions.https.onRequest(async (req, res) => {
  const issue = req.body; // Assuming body-parser middleware is used

  // console.log("Received new issue:", issue);

  // Assuming 'projectName' is part of the issue object or determined some other way
  const projectName = issue.project || "defaultProject";

  // Define the message for Firebase Cloud Messaging
  const message = {
    notification: {
      title: `New ${issue.project} Issue`,
      body: issue.message || "A new issue has been reported.",
    },
    // data: {
    //   projectName: issue.project,
    //   issueId: issue.event.event_id,
    //   level: issue.event.level,
    //   timestamp: issue.event.received,
    // },
  };

  const post_data = {
    id: issue.id,
    event: {
      project: issue.project,
      id: issue.event.event_id,
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

exports.fetchSentryProjects = functions.https.onRequest(async (req, res) => {
  try {
    const response = await axios.get(
      "https://sentry.io/api/0/organizations/communite/projects/",
      {
        headers: {
          Authorization: sentryToken,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send("Failed to fetch projects");
  }
});

exports.fetchSentryIssues = functions.https.onCall(async (data, context) => {
  const projectName = data.projectName; // Example if passed from client

  try {
    const response = await axios.get(
      `https://sentry.io/api/0/projects/communite/${projectName}/issues/`,
      { headers: { Authorization: sentryToken } }
    );

    // Returning issues to the caller
    return { issues: response.data };
  } catch (error) {
    // Logging the error to Firebase console and returning an error message
    console.error("Error fetching Sentry issues:", error);
    throw new functions.https.HttpsError(
      "unknown",
      "Failed to fetch Sentry issues",
      error.message
    );
  }
});

async function sendPushNotification(tokens, message) {
  console.log("🚀 ~ sendPushNotification ~ tokens:", tokens);

  const messages = tokens.map((token) => ({
    to: token.expoPushToken,
    sound: "default",
    ...message,
  }));

  try {
    await axios.post("https://exp.host/--/api/v2/push/send", messages, {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
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

async function fetchAllExpoPushTokens() {
  const userCollectionRef = db.collection("user");
  const snapshot = await userCollectionRef.get();
  const tokens = [];

  snapshot.forEach((doc) => {
    const userData = doc.data();
    // Assuming the expoPushToken field exists and it's either a string or an array of strings
    if (userData.expoPushToken) {
      if (Array.isArray(userData.expoPushToken)) {
        // If it's an array, add all its elements
        tokens.push(...userData.expoPushToken);
      } else if (typeof userData.expoPushToken === "string") {
        // If it's a string, add it directly
        tokens.push(userData.expoPushToken);
      }
    }
  });

  console.log("Fetched tokens:", tokens);
  return tokens;
}

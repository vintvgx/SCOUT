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

  console.log("Received new issue:", issue);

  // Assuming 'projectName' is part of the issue object or determined some other way
  const projectName = issue.project || "defaultProject";

  // Define the message for Firebase Cloud Messaging
  const message = {
    notification: {
      title: "New Issue Detected",
      body: issue.project || "A new issue has been reported.",
    },
    topic: "sentry-issues",
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

    // Sending the notification
    await admin.messaging().send(message);
    console.log("Successfully sent message");

    // Send response after all operations are successful
    res.status(200).send(issue);
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

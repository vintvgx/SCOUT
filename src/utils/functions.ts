import axios from "axios";
import { format as prettyFormat } from "pretty-format";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1Ioud4rwt4sIYrX-KGGfV3sOiqocxU3Y",
  authDomain: "stats-a55dd.firebaseapp.com",
  projectId: "stats-a55dd",
  storageBucket: "stats-a55dd.appspot.com",
  messagingSenderId: "1059658323548",
  appId: "1:1059658323548:web:e7b28c8be3a4794219f899",
  measurementId: "G-V6NKP90PMG",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const fetchIssues = async (
  setRefreshing: (value: boolean) => void,
  setIssues: (data: any) => void,
  setError: (message: string) => void
) => {
  setRefreshing(true); // Enable the refreshing indicator
  try {
    const response = await axios.get(
      "https://sentry.io/api/0/projects/communite/portfolio/issues/",
      {
        headers: {
          Authorization:
            "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
        },
      }
    );
    setIssues(response.data);
    console.log("🚀 ~ fetchIssues ~ data:", prettyFormat(response.data));
  } catch (err: any) {
    setError(err.message);
    console.error(err.message);
  } finally {
    setRefreshing(false); // Disable the refreshing indicator
  }
};

export const fetchProjects = async (
  setProjects: (data: any) => void,
  setError: (message: string) => void
) => {
  try {
    const response = await axios.get(
      "https://sentry.io/api/0/organizations/communite/projects/",
      {
        headers: {
          Authorization:
            "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
        },
      }
    );
    setProjects(response.data);
    console.log("Projects:", prettyFormat(response.data));
  } catch (err: any) {
    setError(err.message);
    console.error("GET Projects err:", err.message);
  }
};

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "605ca6ac-8939-440c-baa7-0307f5f8d01d",
      })
    ).data;
    // console.log(token);

    try {
      const docRef = await addDoc(collection(db, "user"), {
        expoPushToken: token,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export const sendNotification = async (expoPushToken: string | undefined) => {
  console.log("Sending notification");
  console.log("Expo Push Token:", expoPushToken);
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title2",
    body: expoPushToken,
  };
  try {
    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("POST Push Notification err:", err.message);
  }
};

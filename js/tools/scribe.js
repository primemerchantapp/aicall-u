import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Logger } from "../utils/logger.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBe9a58zaQCrBSGeWwcIVa_PnZABoH6zV4",
  authDomain: "tudds-ccd0wn.firebaseapp.com",
  databaseURL: "https://tudds-ccd0wn-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tudds-ccd0wn",
  storageBucket: "tudds-ccd0wn.appspot.com",
  messagingSenderId: "786974954352",
  appId: "1:786974954352:web:696d4fce818f14659bb5b5",
  measurementId: "G-CEQL4E8CW3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class VoiceCommandTool {
  getDeclaration() {
    return [{
      name: "save_data_with_voice",
      description: "Saves data to the Firebase 'scribe_documents' collection using voice commands.",
      parameters: {
        type: "object",
        properties: {
          patientName: { type: "string", description: "The name of the patient" },
          age: { type: "string", description: "The age of the patient" },
          gender: { type: "string", description: "The gender of the patient" },
          title: { type: "string", description: "The document title" },
          chiefComplaint: { type: "string", description: "The patient's chief complaint" },
          treatmentPlan: { type: "string", description: "The treatment plan for the patient" }
        },
        required: ["patientName", "age", "gender", "title", "chiefComplaint", "treatmentPlan"]
      }
    }];
  }

  async execute(args) {
    try {
      Logger.info("VoiceCommandTool execution started", args);

      // Save data to Firebase
      const docRef = await addDoc(collection(db, "scribe_documents"), {
        patientName: args.patientName,
        age: args.age,
        gender: args.gender,
        title: args.title,
        chiefComplaint: args.chiefComplaint,
        treatmentPlan: args.treatmentPlan,
        created_at: new Date().toISOString()
      });

      Logger.info(`Document successfully written with ID: ${docRef.id}`);
      return `Data saved successfully with ID: ${docRef.id}`;
    } catch (error) {
      Logger.error("Error saving data to Firebase: ", error.message);
      throw new Error("Failed to save data. Please try again.");
    }
  }
}
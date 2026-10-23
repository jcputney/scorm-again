import { Platform } from "react-native";

export const ADL_DOWNLOAD_URL = "https://cdn.noverant.com/AllGolfExamples.zip";

// Built-in course configuration
export const BUILT_IN_COURSE_ID = "minimal-test";
export const BUILT_IN_COURSE_TITLE = "Minimal Test Course";
export const BUILT_IN_COURSE_PATH = "courses/minimal-test";

// The LMS endpoint that receives commits. The default is the mock LMS that
// `npm run test:integration:server` starts in the repository root.
// On the Android emulator, 10.0.2.2 is the host computer.
export const LMS_COMMIT_URL = Platform.OS === "android" ? "http://10.0.2.2:3001/lms/commit" : "http://localhost:3001/lms/commit";
export const LEARNER_ID = "demo-learner";

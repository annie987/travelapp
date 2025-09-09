import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral,
    padding: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.neutral,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.neutral,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  listItem: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  listItemTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.textHigh,
  },
  listItemDescription: {
    color: COLORS.textLow,
    fontSize: 14,
  },

  // Brand / login section
  brandSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  logoContainer: {
    backgroundColor: COLORS.primary,
    padding: 30,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  tagLine: {
    fontSize: 16,
    color: COLORS.textLow,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: width * 0.8,
    height: width * 0.6,
  },
  loginSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  googleIconContainer: {
    marginRight: 8,
  },
  googleButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.textLow,
    textAlign: "center",
    marginTop: 12,
  },
});

// Specific bucket list styles
export const bucketListStyles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
  trashButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 6,
  },
  formRow: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.textHigh,
  },
  input: {
    backgroundColor: "#e6f0ff",
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: "#003366",
    fontStyle: "italic",
  },

  detailText: {
    fontSize: 14,
    color: COLORS.textLow,
    marginTop: 2,
  },
  
});

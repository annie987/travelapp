// auth.styles.ts
import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // General container
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral,
  },
  scrollContainer: {
    padding: 16,
  },

  // Buttons
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

  // List items (shared)
  listItem: {
    flexDirection: "row",
    alignItems: "center",
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
  detailText: {
    fontSize: 14,
    color: COLORS.textLow,
    marginTop: 2,
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

  // 🔹 Bucket List specific
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, color: COLORS.textLow, marginBottom: 8 },
  cardValue: { fontSize: 20, fontWeight: "bold", color: COLORS.textHigh },

  trashButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  formPanel: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
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

  // Map modal
  mapDoneButton: {
    padding: 15,
    backgroundColor: COLORS.primary,
  },
  mapDoneText: {
    color: "#fff",
    textAlign: "center",
  },
});

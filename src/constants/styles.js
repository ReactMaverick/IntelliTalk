import { colors } from "@/constants/colors";
import { deviceHeight, deviceWidth } from "@/constants/constants";
import { H3, H5, p } from "@/constants/fontConstants";
import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: deviceHeight * 1 / 60,
    borderRadius: 10,
    width: deviceWidth * 90 / 100,
  },
  btnText: {
    textAlign: "center",
    color: colors.white,
    fontSize: p,
    fontFamily: 'LatoBold',
    lineHeight: 32,
  },
  bg: {
    backgroundColor: colors.screenBg,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  CustomBtn: {
    backgroundColor: colors.primary,
    paddingVertical: deviceHeight * 1 / 75,
    borderRadius: 10,
  },
  CustomBtnText: {
    textAlign: "center",
    color: colors.white,
    fontSize: p,
    fontFamily: 'LatoBold',
    lineHeight: deviceHeight * 1 / 25,
  },
  TitleRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: deviceHeight / 60,
  },
  Title: {
    fontSize: H5,
    fontFamily: 'LatoBold',
    color: colors.blueDarkColor,
  },
  ViewAll: {
    fontSize: p,
    fontFamily: 'LatoRegular',
    color: colors.blueDarkColor,
  },
  Para: {
    fontSize: p,
    fontFamily: 'LatoRegular',
    color: colors.darkColor,
    lineHeight: deviceHeight / 35,
  },
});

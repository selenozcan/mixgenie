import { BaseToast } from "react-native-toast-message";
import { colors, fonts } from "../styles/theme";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary,
        backgroundColor: colors.cardBg,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontFamily: fonts.bold,
        color: colors.primary,
        fontSize: 15,
      }}
      text2Style={{
        fontFamily: fonts.regular,
        color: colors.textDark,
        fontSize: 13,
      }}
    />
  ),
};

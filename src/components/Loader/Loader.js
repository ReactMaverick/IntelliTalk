import { colors } from "@/constants/colors";
import { ActivityIndicator, View } from "react-native";
import { styles } from "./Style";

export default function Loader() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}
import { Text, View } from "react-native";
import { styles } from "./Style";

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>
        </View>
    );
}
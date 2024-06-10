import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Style";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Profile({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            {/* Drawer Close Icon */}
            <View
                style={styles.closeDrawer}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.toggleDrawer();
                    }}
                    style={styles.closeDrawerButton}
                >
                    <Icon
                        name="menu"
                        type='MaterialIcons'
                        style={styles.closeDrawerIcon}
                    />
                </TouchableOpacity>
            </View>
            {/* Drawer Close Icon */}
        </SafeAreaView>
    );
}
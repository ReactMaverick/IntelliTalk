import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@/pages/Home/Home";
import Profile from "@/pages/Profile/Profile";
import Icon from 'react-native-vector-icons/Ionicons';
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import VerifyOTP from "@/pages/VerifyOTP/VerifyOTP";
import { useSelector } from "react-redux";
import { isLoggedIn } from "@/redux/reducers/authReducer";
import { DrawerContentScrollView, createDrawerNavigator } from "@react-navigation/drawer";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { deviceWidth } from "../constants/constants";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../constants/colors";
import { PROFILE_AVATAR } from "../constants/images";
import { selectUser } from "../redux/reducers/authReducer";
import { IMAGE_BASE_URL } from "../values/api/url";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (

        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
                drawerStyle: {
                    width: '65%'
                },
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Profile" component={Profile} />
        </Drawer.Navigator>
    );
}

const CustomDrawerContent = props => {

    const user = useSelector(selectUser);

    // console.log('user in router drawer component ==> ', user);

    return (
        <DrawerContentScrollView {...props}
            contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                paddingTop: 0,
            }}
        >
            {/* <ImageBackground source={require('../assets/images/navMenu.png')} style={{
                flex: 1,
                height: hp('100%')
            }}
            > */}
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientOverlay}
            >

                <View style={{ alignItems: "flex-start", paddingHorizontal: wp("5%") }}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={() => {
                            props.navigation.navigate('Profile');
                            props.navigation.closeDrawer();
                        }}
                    >
                        <Image
                            source={user?.image ? { uri: IMAGE_BASE_URL + user.image } : PROFILE_AVATAR}
                            style={styles.avatarStyle}
                        />
                        <Text style={styles.textStyle}>{user?.name ?? ''}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('Home');
                            props.navigation.closeDrawer();
                        }}
                    >
                        <View style={styles.drawerMenu}>
                            <Icon name="home" type='SimpleLineIcons' style={styles.drawerIcon} />
                            <Text style={styles.drawerMenuText}>Home</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('Profile');
                            props.navigation.closeDrawer();
                        }}
                    >
                        <View style={styles.drawerMenu}>
                            <Icon name="person" type='SimpleLineIcons' style={styles.drawerIcon} />
                            <Text style={styles.drawerMenuText}>Profile</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            {/* </ImageBackground> */}
        </DrawerContentScrollView>
    );
};

function HomeTabs() {

    const customScreenOptions = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
        },
    })


    return (
        <Tab.Navigator
            screenOptions={customScreenOptions}
        >
            <Tab.Screen
                name="HomeTab"
                component={Home}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}

const LoginStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="VerifyOTP"
                component={VerifyOTP}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomePage"
                component={MyDrawer}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

export default function Router() {
    const isUserLoggedIn = useSelector(isLoggedIn);

    console.log('isLoggedIn ==> ', isUserLoggedIn);

    if (isUserLoggedIn) {
        return <HomeStack />;
    } else {
        return <LoginStack />;
    }
}


const styles = StyleSheet.create({
    drawerMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: wp('5%')
    },
    drawerIcon: {
        marginRight: wp('3%'),
        color: '#fff',
        fontSize: hp('4%')
    },
    drawerMenuText: {
        color: '#ffff',
        fontSize: hp('2%')
    },
    overlay: {
        backgroundColor: '#000',
        borderColor: '#FFF',
        borderBottomWidth: 1,
    },
    avatarContainer: {
        justifyContent: 'center',
        width: '60%',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    avatarStyle: {
        width: 100,
        height: 100,
        marginTop: 10,
        // marginBottom: 15,
        borderRadius: 50,
        backgroundColor: colors.lightBlue,

    },
    textStyle: {
        marginTop: 10,
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: 'bold',
    },
    gradientOverlay: {
        flex: 1,
        height: hp('100%'),
        width: wp('100%'),
    },
});

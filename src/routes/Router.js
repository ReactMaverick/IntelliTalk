import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from "react";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import VerifyOTP from "../pages/VerifyOTP/VerifyOTP";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
                name="Home"
                component={HomeTabs}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

export default function Router() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (isLoggedIn) {
        return <HomeStack />;
    } else {
        return <LoginStack />;
    }
}

import { styled } from "nativewind";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ImageBackground } from "react-native";
import * as SecureStore from "expo-secure-store";
import { SplashScreen, Stack } from "expo-router";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";

import blurBg from "../src/assets/bg-blur.png";
import Stripes from "../src/assets/stripes.svg";

// Transform the Stripes into a component that can be styled by native wind
const StyledStripes = styled(Stripes);

const Layout = () => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null);

  const [hasFontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      // Convert the token into a booleand and change the state
      setIsUserAuthenticated(!!token);
    });
  }, []);

  // Show the splashScreen until the fonts are loaded
  if (!hasFontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: "absolute", left: "-100%" }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />

      {/* Children Components */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        {/* If the user is authenticated will redirect to next route */}
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  );
};

export default Layout;

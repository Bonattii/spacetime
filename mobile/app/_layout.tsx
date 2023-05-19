import { styled } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { ImageBackground } from "react-native";
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
  const [hasFontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

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
      />
    </ImageBackground>
  );
};

export default Layout;

import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Text, TouchableOpacity, View } from "react-native";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

import { api } from "../src/lib/api";

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";

// Discovery configs fot github
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoing: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/3e675bea39da0db109fd",
};

export default function App() {
  const router = useRouter();

  // Config the useAuthRequest to use Github authentication
  const [, response, signInWithGitHub] = useAuthRequest(
    {
      clientId: "3e675bea39da0db109fd",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "spacetime",
      }),
    },
    discovery
  );

  const handleGithubOAuthCode = async (code: string) => {
    const response = await api.post("/register", {
      code,
    });

    const { token } = response.data;

    // Save the token on the secure store
    await SecureStore.setItemAsync("token", token);

    // Will redirect the user to the memories page
    router.push("/memories");
  };

  useEffect(() => {
    // console.log(
    //   makeRedirectUri({
    //     scheme: "spacetime",
    //   })
    // );

    if (response?.type === "success") {
      // get the code that the github sent on the request of login
      const { code } = response.params;

      // Call the api to get a jwt token and register the user
      handleGithubOAuthCode(code);
    }
  }, [response]);

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text
            className="
              text-center font-title text-2xl leading-tight text-gray-50
            "
          >
            Your time capsule
          </Text>

          <Text
            className="
              text-center font-body text-base leading-relaxed text-gray-100
            "
          >
            Collect memorable moments from your journey and share (if you like)
            with the world!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGitHub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Register Memory
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        className="
          text-center font-body text-sm leading-relaxed text-gray-200
        "
      >
        Made by Rodrigo Bonatti
      </Text>
    </View>
  );
}

import { useState } from "react";
import { Link } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Switch,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";

const NewMemory = () => {
  const { bottom, top } = useSafeAreaInsets();

  const [isPublic, setIsPublic] = useState(false);

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />

        <Link href="memories" asChild>
          <TouchableOpacity
            className="
              h-10 w-10 items-center justify-center rounded-full bg-purple-500
            "
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: "#767577", true: "#372560" }}
            thumbColor={isPublic ? "#9b79ea" : "#9e9ea0"}
          />

          <Text className="font-body text-base text-gray-200">
            Make memory public
          </Text>
        </View>

        <TouchableOpacity
          className="
            h-32 items-center justify-center
            rounded-lg
            border border-dashed border-gray-500 bg-black/20
          "
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-2">
            <Icon name="image" color="#FFF" />
            <Text className="font-body text-sm text-gray-200">
              Add a photo or video for the cover
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Feel free to add photos, videos or narratives about this experience that you want to save for ever"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default NewMemory;

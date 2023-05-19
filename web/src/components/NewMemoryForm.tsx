"use client";

import Cookie from "js-cookie";
import { FormEvent } from "react";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { MediaPicker } from "./MediaPicker";

export const NewMemoryForm = () => {
  const router = useRouter();

  const handleCreateMemory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get the form data
    const formData = new FormData(event.currentTarget);

    // Get the file from the form data
    const fileToUpload = formData.get("coverUrl");

    let coverUrl = "";

    if (fileToUpload) {
      // Create a form data called file using the file to be uploaded
      const uploadFormData = new FormData();
      uploadFormData.set("file", fileToUpload);

      // Make the request to upload the file to the backend
      const uploadResponse = await api.post("/upload", uploadFormData);

      coverUrl = uploadResponse.data.fileUrl;
    }

    const token = Cookie.get("token");

    // Save the memory on the backend
    await api.post(
      "/memories",
      {
        coverUrl,
        content: formData.get("content"),
        isPublic: formData.get("isPublic"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/");
  };

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="
              flex cursor-pointer items-center gap-1.5
              text-sm text-gray-200 hover:text-gray-100
            "
        >
          <Camera className="h-4 w-4" />
          Attach media
        </label>

        <label
          htmlFor="isPublic"
          className="
              flex items-center gap-1.5
              text-sm text-gray-200 hover:text-gray-100
            "
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="
                h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500
              "
          />
          Make the memory public
        </label>
      </div>

      <MediaPicker />

      <textarea
        name="content"
        spellCheck={false}
        className="
            w-full flex-1
            resize-none
            rounded
            border-0 bg-transparent p-0
            text-lg leading-relaxed text-gray-100
            placeholder:text-gray-400 focus:ring-0
          "
        placeholder="Feel free to add photos, videos and narratives about this experience that you want to remember for ever."
      />

      <button
        type="submit"
        className="
              inline-block
              self-end
              rounded-full
              bg-green-500 px-5
              py-3 font-alt text-sm uppercase leading-none
              text-black
              hover:bg-green-600
            "
      >
        Save
      </button>
    </form>
  );
};

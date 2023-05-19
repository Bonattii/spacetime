"use client";

import { ChangeEvent, useState } from "react";

export const MediaPicker = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const onMediaSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    // Will garantee that one file was sent
    if (!files) {
      return;
    }

    // Will create one URL based on the file sent
    const previewURL = URL.createObjectURL(files[0]);

    setPreview(previewURL);
  };

  return (
    <>
      <input
        onChange={onMediaSelected}
        name="coverUrl"
        type="file"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  );
};

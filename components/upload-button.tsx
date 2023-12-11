// import { useMutation } from "convex/react";
// import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
// //import "@xixixao/uploadstuff/react/styles.css";
// import { api } from "../convex/_generated/api";

// type UploadedFileResponse = { storageId: string };

// export function UploadButtonComponent(): JSX.Element {
//   const generateUploadUrl = useMutation(api.files.generateUploadUrl);
//   //const saveStorageId = useMutation(api.files.saveStorageId);
//   const saveAfterUpload = async (uploaded: UploadFileResponse[]): Promise<void> => {
//     // await saveStorageId({ storageId: (uploaded[0].response as UploadedFileResponse).storageId })  ;
//     alert("Upload complete");
//     console.log(uploaded[0].response);
//   };

//   return (
//     <UploadButton
//       uploadUrl={generateUploadUrl}
//       fileTypes={[".pdf", "image/*"]}
//       onUploadComplete={saveAfterUpload}
//       onUploadError={(error: unknown): void => {
//         // Do something with the error.
//         alert(`ERROR! ${error}`);
//       }}
//     />
//   );
// }


// import { useMutation } from "convex/react";
// import { UploadDropzone, UploadFileResponse } from "@xixixao/uploadstuff/react";
// import "@xixixao/uploadstuff/react/styles.css";
// import { api } from "../convex/_generated/api";
// import { type } from "os";


// interface UploadFileResponse {
//   file: File;
//   response: unknown;
// }
// export function UploadButtonComponent() {
//   const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
//   const saveStorageId = useMutation(api.upload.saveStorageId);
//   const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
//     const response = uploaded[0].response as { storageId: string };

//     await saveStorageId({
//       uploaded: {
//         storageId: response.storageId,
//       },
//     });
//   };

//   return (
//     <UploadDropzone
//       uploadUrl={generateUploadUrl}
//       fileTypes={[".pdf", "image/*"]}
//       onUploadComplete={saveAfterUpload}
//       onUploadError={(error: unknown) => {
//         // Do something with the error.
//         alert(`ERROR! ${error}`);
//       }}
//     />
//   );
// }




import { FormEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function UploadButtonComponent() {
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const sendImage = useMutation(api.upload.sendImage);
  const saveImage = useMutation(api.upload.imageSaved);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    console.log("postUrl:", postUrl);

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await sendImage({ storageId, author: name });
    await saveImage({ storageId, author: name });


    setSelectedImage(null);
    imageInput.current!.value = "";
  }
  return (
    <form onSubmit={handleSendImage}>
      <input
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={(event) => setSelectedImage(event.target.files![0])}
        disabled={selectedImage !== null}
      />
      <input
        type="submit"
        value="Send Image"
        disabled={selectedImage === null}
      />
    </form>
  );
}


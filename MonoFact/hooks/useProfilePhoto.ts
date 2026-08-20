import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/app/services/config";
import { Alert } from "react-native";

// ---------------------------------------------------------------------------
// Cloudinary credentials — read from .env so they are never hard-coded
// in source code. In .env: EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and
// EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET.
// ---------------------------------------------------------------------------
const CLOUDINARY_CLOUD_NAME =
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_UPLOAD_PRESET =
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

// ---------------------------------------------------------------------------
// useProfilePhoto
// ---------------------------------------------------------------------------
// Custom hook that handles the full profile picture update flow:
//   1. Request permission to access the photo library
//   2. Open the image picker (square crop, 70% quality)
//   3. Upload the image to Cloudinary and get back a public URL
//   4. Save that URL to the user's Firestore document under "photoURL"
//   5. Call the optional onSuccess callback with the new URL so the UI
//      can update immediately without re-fetching from Firestore
//
// Returns:
//   pickAndUpload — call this when the user taps the avatar/camera button
//   uploading     — true while the upload is in progress (show a spinner)
// ---------------------------------------------------------------------------
export function useProfilePhoto(onSuccess?: (url: string) => void) {
    const [uploading, setUploading] = useState(false);

    const pickAndUpload = async () => {
        // Step 1 — request photo library permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Please allow access to your photo library in your device settings."
            );
            return;
        }

        // Step 2 — open the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,   // lets the user crop the image
            aspect: [1, 1],        // force square crop for the avatar
            quality: 0.7,          // 70% quality keeps file size reasonable
        });

        if (result.canceled) return;

        const uri = result.assets[0].uri;
        setUploading(true);

        try {
            // Step 3 — upload to Cloudinary via their unsigned upload API
            const formData = new FormData();
            formData.append("file", {
                uri,
                type: "image/jpeg",
                name: "profile.jpg",
            } as any);
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", "profile_pictures");

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData as any,
                }
            );

            const data = await response.json() as {
                secure_url?: string;
                error?: { message?: string };
            };

            if (!response.ok || !data.secure_url) {
                throw new Error(data.error?.message || "Upload failed");
            }

            const photoURL: string = data.secure_url;

            // Step 4 — save the Cloudinary URL to Firestore
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("Not authenticated");

            await updateDoc(doc(db, "users", currentUser.uid), { photoURL });

            // Step 5 — notify the caller so the avatar updates immediately
            onSuccess?.(photoURL);
            Alert.alert("Success", "Profile picture updated.");
        } catch (error: any) {
            Alert.alert(
                "Upload Failed",
                error.message || "Something went wrong. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

    return { pickAndUpload, uploading };
}

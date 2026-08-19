import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/app/services/config";
import { Alert } from "react-native";

const CLOUDINARY_CLOUD_NAME = "qk9ob1ok";
const CLOUDINARY_UPLOAD_PRESET = "e7zlnwyw";

export function useProfilePhoto(onSuccess?: (url: string) => void) {
    const [uploading, setUploading] = useState(false);

    const pickAndUpload = async () => {
        // 1. Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Please allow access to your photo library in your device settings.");
            return;
        }

        // 2. Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (result.canceled) return;

        const uri = result.assets[0].uri;
        setUploading(true);

        try {
            // 3. Upload to Cloudinary
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

            const data = await response.json() as { secure_url?: string; error?: { message?: string } };

            if (!response.ok || !data.secure_url) {
                throw new Error(data.error?.message || "Upload failed");
            }

            const photoURL: string = data.secure_url;

            // 4. Save URL to Firestore
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("Not authenticated");

            await updateDoc(doc(db, "users", currentUser.uid), { photoURL });

            onSuccess?.(photoURL);
            Alert.alert("Success", "Profile picture updated.");
        } catch (error: any) {
            Alert.alert("Upload Failed", error.message || "Something went wrong. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return { pickAndUpload, uploading };
}

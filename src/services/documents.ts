import { isSupabaseConfigured, supabase } from "@/services/supabase";

export async function uploadUserDocument(userId: string, documentType: string, file: File) {
  if (!isSupabaseConfigured) {
    return {
      path: `demo/${userId}/${documentType}/${file.name}`
    };
  }

  const path = `${userId}/${documentType}/${file.name}`;
  const { data, error } = await supabase.storage.from("user-documents").upload(path, file, {
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("user_documents").insert({
    user_id: userId,
    document_type: documentType,
    file_path: data.path
  });

  return data;
}

export async function uploadVehicleImage(vehicleId: string, file: File) {
  if (!isSupabaseConfigured) {
    return {
      path: `demo/${vehicleId}/${file.name}`
    };
  }

  const path = `${vehicleId}/${file.name}`;
  const { data, error } = await supabase.storage.from("vehicle-images").upload(path, file, {
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

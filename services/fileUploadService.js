import { supabase } from "../config/supabaseConfig.js";


export const uploadFileService = async (file) => {

  const filePath = `research/${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("research")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(error.message);
  }

  // get public URL
  const { data: publicUrlData } = supabase.storage
    .from("research")
    .getPublicUrl(filePath);

  return {
    fileUrl: publicUrlData.publicUrl,
    filePath,
  };
};

export const deleteFileService = async (filePath) => {
    const { error } = await supabase.storage
    .from("research")
    .remove([filePath]);

  if (error) {
    console.error("Delete error:", error.message);
  }
};
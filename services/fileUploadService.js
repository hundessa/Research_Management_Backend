export const uploadFileService = async (file) => {

  const filePath = `research/${Date.now()}-${file.originalname}`;
  const firebaseFile = bucket.file(filePath);

  const stream = firebaseFile.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {

    stream.on("error", reject);

    stream.on("finish", () => {

      const fileUrl =
        `https://storage.googleapis.com/${bucket.name}/${firebaseFile.name}`;

      resolve({ fileUrl, filePath });
    });

    stream.end(file.buffer);
  });
};

export const deleteFileService = async (filePath) => {
  await bucket.file(filePath).delete();
};
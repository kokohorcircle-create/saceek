import B2 from "backblaze-b2";

const applicationKeyId = process.env.B2_APPLICATION_KEY_ID;
const applicationKey = process.env.B2_APPLICATION_KEY;
const bucketId = process.env.B2_BUCKET_ID;
const bucketName = process.env.B2_BUCKET_NAME;

export async function uploadToBackblaze(
    fileBuffer: Buffer,
    originalName: string,
    folder = "uploads"
): Promise<string> {
    if (!applicationKeyId || !applicationKey || !bucketId || !bucketName) {
        throw new Error("Missing Backblaze B2 environment variables.");
    }

    console.log(`🚀 [B2 Start]: Preparing upload for "${originalName}" into folder "${folder}"`);
    try {
        const b2 = new B2({ applicationKeyId, applicationKey });

        console.log("🔑 [B2 Step 1]: Authorizing...");
        await b2.authorize();
        console.log("✅ [B2 Step 1 Success]: Authorized.");

        console.log("🌐 [B2 Step 2]: Getting Upload URL...");
        const { data: uploadData } = await b2.getUploadUrl({ bucketId });
        console.log("✅ [B2 Step 2 Success]: Received Upload URL.");

        const timestamp = Date.now();
        const safeName = originalName.replace(/\s+/g, "_");
        const fileName = `${folder}/${timestamp}_${safeName}`;

        console.log(`📤 [B2 Step 3]: Uploading ${fileBuffer.length} bytes...`);
        const { data: uploadedData } = await b2.uploadFile({
            uploadUrl: uploadData.uploadUrl,
            uploadAuthToken: uploadData.authorizationToken,
            fileName,
            data: fileBuffer,
        });

        const finalUrl = `https://f005.backblazeb2.com/file/${bucketName}/${uploadedData.fileName}`;
        console.log("🎯 [B2 Upload Complete]: Public URL:", finalUrl);
        return finalUrl;
    } catch (error: any) {
        console.error("❌ [B2 Fatal Error]:", error?.response?.data || error.message);
        throw new Error(`Backblaze Upload failed: ${error.message}`);
    }
}
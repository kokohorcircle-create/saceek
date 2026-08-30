// Prevent global type scoping issues
declare global {
    namespace NodeJS {
      interface Global {
        globalOtpStore?: Map<string, { otp: string; expires: number }>;
      }
    }
  }
  
  const globalOtpStore: Map<string, { otp: string; expires: number }> =
    (global as any).globalOtpStore || new Map();
  
  if (process.env.NODE_ENV !== "production") {
    (global as any).globalOtpStore = globalOtpStore;
  }
  
  export { globalOtpStore };
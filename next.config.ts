// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify에 정적 배포하려고 사용 중인 옵션
  output: "export",

  // ✅ export 모드에서 next/image 에러 안 나게 하는 옵션
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

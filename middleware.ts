import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware(
  // { publicRoutes: ["/", '/api/clerk']}
  {
    publicRoutes: [
      "/",
      '/api/clerk',
      '/api/video-token',
      '/api/video-token/generation',
      '/api/video-token/generation/get-token',
      '/api/mock-meeting',
      '/api/get-meeting'
    ]
  }
);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get your base URL from environment variable or use a default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://recoording.com";

  // Define static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // You can add dynamic routes here
  // For example, if you have shared video pages:
  // const videos = await prisma.video.findMany({
  //   select: { id: true, updatedAt: true },
  //   where: { isPublic: true }
  // })
  //
  // const videoRoutes = videos.map(video => ({
  //   url: `${baseUrl}/share/${video.id}`,
  //   lastModified: video.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7
  // }))

  return [...staticRoutes /* , ...videoRoutes */];
}

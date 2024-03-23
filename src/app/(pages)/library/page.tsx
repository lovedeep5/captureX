import React from 'react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const videos = [
  {
    sources:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    subtitle: "By Blender Foundation",
    thumb: "images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    sources:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",

    subtitle: "By Blender Foundation",
    thumb: "images/ElephantsDream.jpg",
    title: "Elephant Dream",
  },
  {
    sources:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",

    subtitle: "By Google",
    thumb: "images/ForBiggerBlazes.jpg",
    title: "For Bigger Blazes",
  },
  {
    sources:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    subtitle: "By Blender Foundation",
    thumb: "images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    sources:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",

    subtitle: "By Blender Foundation",
    thumb: "images/ElephantsDream.jpg",
    title: "Elephant Dream",
  },
  {
    sources:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",

    subtitle: "By Google",
    thumb: "images/ForBiggerBlazes.jpg",
    title: "For Bigger Blazes",
  }
]

const Library = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 pb-10">
        {videos?.map((video) => (
          <Card
            className="rounded-sm hover:bg-muted/20 transition cursor-pointer"
            key={video.title}
          >
            <video
              className="w-full rounded-t-sm"
              src={video.sources}
              controls
            ></video>
            <CardHeader>
              <CardTitle className="text-md">{video.title}</CardTitle>
              <CardDescription>{video.subtitle}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Library

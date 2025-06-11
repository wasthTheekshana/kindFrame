"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Photo {
  id: number
  src: string
  title: string
  year: string
  //description: string
  //category: string
}

const categories = ["Nature", "Architecture", "Urban", "Interior", "Abstract", "Culture", "Texture", "Craft", "Landscape"];

// Generate 100 photos with consistent data structure
const photos: Photo[] = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  src: `/images/${i + 1}.jpeg`,
  title: `kind frame ${String(i + 1).padStart(3, '0')}`,
  year: `${2025 + Math.floor(i / 25)}`, // Evenly distribute across 5 years
  //description: `A beautiful ${categories[i % categories.length].toLowerCase()} photograph taken in ${2023 + Math.floor(i / 25)}.`,
  //category: categories[i % categories.length],
}));

// Aspect ratio for all images (3:2)
const IMAGE_ASPECT_RATIO = 3 / 2;
const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = Math.round(IMAGE_WIDTH / IMAGE_ASPECT_RATIO);

export default function FaintFilmGallery() {
  const [viewMode, setViewMode] = useState<"grid" | "slider">("grid")
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredPhoto, setHoveredPhoto] = useState<Photo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const photosPerPage = 16

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const openPhoto = (photo: Photo) => {
    setSelectedPhoto(photo)
    setCurrentIndex(photos.findIndex((p) => p.id === photo.id))
  }

  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    const nextIndex = (currentIndex + 1) % photos.length
    setCurrentIndex(nextIndex)
    setSelectedPhoto(photos[nextIndex])
  }

  const prevPhoto = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length
    setCurrentIndex(prevIndex)
    setSelectedPhoto(photos[prevIndex])
  }

  // Get nearby photos for thumbnail navigation
  const getNearbyPhotos = () => {
    return [
      photos[(currentIndex - 2 + photos.length) % photos.length],
      photos[(currentIndex - 1 + photos.length) % photos.length],
      photos[currentIndex],
      photos[(currentIndex + 1) % photos.length],
      photos[(currentIndex + 2) % photos.length],
    ]
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header - Responsive adjustments */}
     <motion.header
       className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6"
       initial={{ y: -100, opacity: 0 }}
       animate={{ y: 0, opacity: 1 }}
       transition={{ duration: 0.6, ease: "easeOut" }}
     >
       <div className="flex items-center justify-between py-3 sm:py-4 max-w-7xl mx-auto">
         <motion.div
           initial={{ x: -20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ duration: 0.4, delay: 0.2 }}
         >
           <div className="flex flex-col items-start pl-10 border-l-4 border-blue-200">
             <h1 className="text-3xl sm:text-4xl font-extrabold text-black-700 drop-shadow-sm tracking-tight">
               KindFrame
             </h1>
             <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Capturing Kindness. Sharing Stories.</p>
             <p className="hidden xs:block text-xs text-gray-500">A visual tribute to Sri Lankan generosity.</p>
           </div>
         </motion.div>

         <motion.div
           initial={{ x: 20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ duration: 0.4, delay: 0.2 }}
         >
           <Button variant="ghost" size="sm" className="p-1 sm:p-2 hover:bg-gray-100">
             <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center space-y-1">
               <div className="w-full h-0.5 bg-black" />
               <div className="w-full h-0.5 bg-black" />
               <div className="w-full h-0.5 bg-black" />
             </div>
           </Button>
         </motion.div>
       </div>
     </motion.header>

        {/* Main Content */}
        <main className="pt-24 sm:pt-25 pb-20 sm:pb-24">
          {viewMode === "grid" ? (
              <div className="relative">
                {/* Preview image on right side - Hidden on mobile */}
                <div className="fixed right-0 top-0 bottom-0 w-1/3 z-0 hidden lg:block">
                  <AnimatePresence>
                    {hoveredPhoto && (
                        <motion.div
                            key={hoveredPhoto.id}
                            className="h-full flex items-center justify-center p-4 sm:p-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                          <div className="relative w-full h-full">
                            <Image
                                src={hoveredPhoto.src}
                                alt={hoveredPhoto.title}
                                fill
                                className="object-contain transition-all duration-500 hover:brightness-225 hover:shadow-2xl hover:opacity-60"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority={hoveredPhoto.id <= 4}
                            />
                          </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Year range at bottom right - Hidden on mobile */}
                <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-12 z-0 hidden lg:block">
                  <div className="flex items-center space-x-2 sm:space-x-4 text-gray-800">
                    {/*<span className="text-sm sm:text-xl">2025</span>*/}
                    <div className="w-16 sm:w-24 h-px bg-gray-700"></div>
                    <span className="text-sm sm:text-xl">2025</span>
                  </div>
                </div>

                {/* Grid of photos */}
                <div className="w-full lg:w-2/3 px-4 sm:px-6 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {photos.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage).map((photo) => (
                        <motion.div
                            key={photo.id}
                            className="relative cursor-pointer group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: (photo.id % photosPerPage) * 0.05 }}
                            onClick={() => openPhoto(photo)}
                            onMouseEnter={() => setHoveredPhoto(photo)}
                            onMouseLeave={() => setHoveredPhoto(null)}
                        >
                          <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
                            {/* Photo number */}
                            <div className="absolute top-2 left-2 text-xs text-gray-600 z-10 bg-white/80 px-1 rounded">
                              {photo.id}
                            </div>

                            {/* Photo */}
                            <Image
                                src={photo.src}
                                alt={photo.title}
                                fill
                                className="object-cover transition-all duration-500 group-hover:brightness-110 group-hover:scale-105"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                loading={photo.id > 12 ? "lazy" : "eager"}
                            />
                          </div>
                          {/* Title on hover - mobile tap */}
                          <div className="absolute inset-0 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-black/60 text-white text-xs p-1 w-full truncate">
                              {photo.title}
                            </div>
                          </div>
                        </motion.div>
                    ))}
                  </div>

                  {/* Pagination - Responsive */}
                  <div className="flex justify-center mt-6 overflow-x-auto py-2">
                    <div className="flex space-x-1 sm:space-x-2">
                      {Array.from({ length: Math.ceil(photos.length / photosPerPage) }).map((_, i) => (
                          <Button
                              key={i}
                              variant={currentPage === i + 1 ? "secondary" : "ghost"}
                              size="sm"
                              onClick={() => setCurrentPage(i + 1)}
                              className="min-w-[2rem] px-2 sm:px-3"
                          >
                            {i + 1}
                          </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          ) : (
              <motion.div
                  className="container mx-auto px-4 sm:px-6 py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {photos.map((photo, index) => (
                      <motion.div
                          key={photo.id}
                          className="cursor-pointer group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.01,
                          }}
                          onClick={() => openPhoto(photo)}
                      >
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm sm:shadow-md group-hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                          <div className="relative aspect-[3/2] bg-gray-100">
                            <Image
                                src={photo.src}
                                alt={photo.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                loading={index > 15 ? "lazy" : "eager"}
                            />
                          </div>
                          <div className="p-2 sm:p-3 flex-grow">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-0.5 truncate">{photo.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{photo.year}</p>
                          </div>
                        </div>
                      </motion.div>
                  ))}
                </div>
              </motion.div>
          )}

          {/* Grid/Slider Toggle - Responsive */}
          {/*<div className="fixed bottom-4 sm:bottom-8 left-0 right-0 flex justify-center z-40 px-4">*/}
          {/*  <motion.div*/}
          {/*      className="bg-white border border-gray-300 rounded-full shadow-sm max-w-xs w-full"*/}
          {/*      initial={{ y: 50, opacity: 0 }}*/}
          {/*      animate={{ y: 0, opacity: 1 }}*/}
          {/*      transition={{ duration: 0.6, delay: 0.5 }}*/}
          {/*  >*/}
          {/*    <div className="flex items-center justify-center">*/}
          {/*      <Button*/}
          {/*          variant={viewMode === "grid" ? "secondary" : "ghost"}*/}
          {/*          size="sm"*/}
          {/*          onClick={() => setViewMode("grid")}*/}
          {/*          className={`rounded-l-full px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm ${viewMode === "grid" ? "bg-gray-100" : ""}`}*/}
          {/*      >*/}
          {/*        Grid*/}
          {/*      </Button>*/}
          {/*      <Button*/}
          {/*          variant={viewMode === "slider" ? "secondary" : "ghost"}*/}
          {/*          size="sm"*/}
          {/*          onClick={() => setViewMode("slider")}*/}
          {/*          className={`rounded-r-full px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm ${viewMode === "slider" ? "bg-gray-100" : ""}`}*/}
          {/*      >*/}
          {/*        Slider*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*  </motion.div>*/}
          {/*</div>*/}

          {/* Copyright - Responsive */}
          <div className="fixed bottom-1 sm:bottom-4 right-2 sm:right-4 text-xs text-gray-500">© 2025 Kind Frame</div>
        </main>

        {/* Photo Detail Modal - Responsive */}
        <AnimatePresence>
          {selectedPhoto && (
              <motion.div
                  className="fixed inset-0 z-50 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
              >
                <div className="h-full flex flex-col lg:flex-row">
                  {/* Left Panel - Info - Hidden on mobile */}
                  <div className="hidden lg:block w-full lg:w-1/3 p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-light mb-2">{selectedPhoto.title}</h2>
                        <p className="text-gray-600 mb-3 sm:mb-4">Year taken {selectedPhoto.year}</p>
                        {/*<p className="text-gray-700 text-sm sm:text-base">{selectedPhoto.description}</p>*/}
                        {/*<p className="text-xs sm:text-sm text-gray-500 mt-2">Category: {selectedPhoto.category}</p>*/}
                      </div>

                      {/* Thumbnails */}
                      <div className="grid grid-cols-5 gap-2 mt-4">
                        {getNearbyPhotos().map((photo) => (
                            <div
                                key={photo.id}
                                className={`cursor-pointer transition-all ${photo.id === selectedPhoto.id ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
                                onClick={() => openPhoto(photo)}
                            >
                              <div className="relative aspect-[3/2]">
                                <Image
                                    src={photo.src}
                                    alt={photo.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 20vw, 10vw"
                                    loading="lazy"
                                />
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Center - Main Image */}
                  <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
                    <motion.div
                        key={selectedPhoto.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                      <div className="relative w-full h-full max-w-4xl">
                        <Image
                            src={selectedPhoto.src}
                            alt={selectedPhoto.title}
                            fill
                            className="object-contain"
                            priority
                        />
                      </div>
                    </motion.div>

                    {/* Mobile info panel */}
                    <div className="lg:hidden absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                      <h2 className="text-lg font-light mb-1">{selectedPhoto.title}</h2>
                      <p className="text-sm text-gray-600 mb-2">Year taken {selectedPhoto.year}</p>
                    </div>
                  </div>

                  {/* Right Panel - Navigation */}
                  <div className="absolute lg:static top-4 right-4 lg:w-16 flex flex-col items-center justify-start lg:justify-center z-10">
                    <Button variant="ghost" size="sm" onClick={closePhoto} className="lg:mb-8">
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </div>

                {/* Bottom Navigation - Mobile */}
                <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center space-x-3 shadow-sm">
                    <Button variant="ghost" size="sm" onClick={prevPhoto} className="px-2">
                      Prev
                    </Button>
                    <Button variant="ghost" size="sm" onClick={closePhoto} className="px-2">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={nextPhoto} className="px-2">
                      Next
                    </Button>
                  </div>
                </div>

                {/* Bottom Navigation - Desktop */}
                <div className="hidden lg:block absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white border border-gray-300 rounded-full px-6 py-3 flex items-center space-x-4 shadow-sm">
                    <Button variant="ghost" size="sm" onClick={prevPhoto}>
                      Prev
                    </Button>
                    <Button variant="ghost" size="sm" onClick={closePhoto}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={nextPhoto}>
                      Next
                    </Button>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  )
}
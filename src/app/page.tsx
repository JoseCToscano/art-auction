/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FQwXYGgSTEm
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState, useMemo } from "react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "~/components/ui/tooltip"
import Link from "next/link"
import { Input } from "~/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "~/components/ui/dropdown-menu"
import { Button } from "~/components/ui/button"

export default function Component() {
  const [artworks, setArtworks] = useState([
    {
      id: 1,
      image: "/placeholder.svg",
      artist: "Pixel Picasso",
      title: "Chromatic Cascade",
      currentBid: 1250,
    },
    {
      id: 2,
      image: "/placeholder.svg",
      artist: "Digital Dreamweaver",
      title: "Neon Nebula",
      currentBid: 850,
    },
    {
      id: 3,
      image: "/placeholder.svg",
      artist: "Cyber Curator",
      title: "Fractured Fusion",
      currentBid: 1500,
    },
    {
      id: 4,
      image: "/placeholder.svg",
      artist: "Pixel Poet",
      title: "Ethereal Echoes",
      currentBid: 1100,
    },
    {
      id: 5,
      image: "/placeholder.svg",
      artist: "Digital Draftsman",
      title: "Prismatic Promenade",
      currentBid: 975,
    },
    {
      id: 6,
      image: "/placeholder.svg",
      artist: "Cyber Sculptor",
      title: "Luminous Labyrinth",
      currentBid: 1375,
    },
    {
      id: 7,
      image: "/placeholder.svg",
      artist: "Pixel Painter",
      title: "Chromatic Confluence",
      currentBid: 1200,
    },
    {
      id: 8,
      image: "/placeholder.svg",
      artist: "Digital Demiurge",
      title: "Neon Nexus",
      currentBid: 1050,
    },
  ])
  const [selectedFilter, setSelectedFilter] = useState("featured")
  const filteredArtworks = useMemo(() => {
    switch (selectedFilter) {
      case "featured":
        return artworks.filter((artwork) => artwork.currentBid > 1000)
      case "newest":
        return [...artworks].sort((a, b) => b.id - a.id)
      case "ending-soon":
        return [...artworks].sort((a, b) => a.currentBid - b.currentBid)
      default:
        return artworks
    }
  }, [artworks, selectedFilter])
  return (
      <div className="flex min-h-screen w-full bg-muted">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <Link
                  href="#"
                  className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                  prefetch={false}
              >
                <div className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Digital Art Marketplace</span>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                  >
                    <div className="h-5 w-5" />
                    <span className="sr-only">My Bids</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">My Bids</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                  >
                    <div className="h-5 w-5" />
                    <span className="sr-only">Watchlist</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Watchlist</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      prefetch={false}
                  >
                    <div className="h-5 w-5" />
                    <span className="sr-only">Explore</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Explore</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="relative flex-1">
              <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  type="search"
                  placeholder="Search digital art..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <div className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {selectedFilter === "featured" ? "Featured" : selectedFilter === "newest" ? "Newest" : "Ending Soon"}
                </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={selectedFilter === "featured"}
                    onCheckedChange={() => setSelectedFilter("featured")}
                >
                  Featured
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={selectedFilter === "newest"}
                    onCheckedChange={() => setSelectedFilter("newest")}
                >
                  Newest
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={selectedFilter === "ending-soon"}
                    onCheckedChange={() => setSelectedFilter("ending-soon")}
                >
                  Ending Soon
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredArtworks.map((artwork) => (
                <Link
                    key={artwork.id}
                    href="#"
                    className="relative group overflow-hidden rounded-lg bg-background shadow-lg transition-all hover:shadow-xl"
                    prefetch={false}
                >
                  <img
                      src="/placeholder.svg"
                      alt={artwork.title}
                      width={400}
                      height={400}
                      className="aspect-square w-full object-cover transition-opacity group-hover:opacity-80"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-2xl font-bold">${artwork.currentBid.toLocaleString()}</div>
                      <Button size="sm">Bid</Button>
                    </div>
                  </div>
                </Link>
            ))}
          </main>
        </div>
      </div>
  )
}
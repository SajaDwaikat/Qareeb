import { create } from "zustand";

export type ListingType = {
  id: string;
  title: string;
  location: string;
  price: number;
  image: any;
  status: "Available" | "Full" | "Pending";
  category: string;
  completion: string;
  views: number;
  likes: number;
};

type ArchiveStore = {
  activeListings: ListingType[];
  archivedListings: ListingType[];
  setActiveListings: (listings: ListingType[]) => void;
  deleteFromListings: (id: string) => void;
  addToArchive: (listing: ListingType) => void;
  removeFromArchive: (id: string) => void;
  restoreFromArchive: (id: string) => void;
};

export const useArchiveStore = create<ArchiveStore>((set, get) => ({
  activeListings: [],
  archivedListings: [],

  setActiveListings: (listings) => set({ activeListings: listings }),

  deleteFromListings: (id) =>
    set((state) => ({
      activeListings: state.activeListings.filter((item) => item.id !== id),
    })),

  addToArchive: (listing) =>
    set((state) => ({
      activeListings: state.activeListings.filter((item) => item.id !== listing.id),
      archivedListings: state.archivedListings.some((item) => item.id === listing.id)
        ? state.archivedListings
        : [...state.archivedListings, listing],
    })),

  removeFromArchive: (id) =>
    set((state) => ({
      archivedListings: state.archivedListings.filter((item) => item.id !== id),
    })),

  restoreFromArchive: (id) => {
    const state = get();
    const listing = state.archivedListings.find((item) => item.id === id);
    if (!listing) return;

    set({
      archivedListings: state.archivedListings.filter((item) => item.id !== id),
      activeListings: [...state.activeListings, listing],
    });
  },
}));
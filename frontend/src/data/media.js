// Central asset manifest — every reserved media slot lives here.
// Populate each slot with the existing file paths in the public asset tree.

export const BG_TEXTURE = "/assets/images/espresso-bg.jpeg";

export const MEDIA = {
  home: {
    heroVideo: { src: "/assets/images/vids.bne/hero.wispr.mp4", alt: "Zaiba smiling at her laptop in warm candlelight" },
  },

  next: {
    video: { src: "/assets/images/vids.bne/lastpageedit.mp4", alt: "Illustrated character overlooking a sunset city skyline" },
  },

  story: {
    chemicalEngineering: { video: { src: "/assets/images/story/chemicalengg.mp4", alt: "Chemical engineering lab work and equipment" } },
    contentCreation: { videos: [
      { src: "/assets/images/story/content1.mp4", alt: "Content creation footage one" },
    ] },
    cpa: {
      video: { src: "/assets/images/story/instacpavid.mp4", alt: "DSCE CPA content team video" },
      supportingImage: { src: "/assets/images/story/cpa1.jpeg", alt: "CPA content team photo" },
      instagramUrl: "https://www.instagram.com/reel/CzBrSMcs-1v/?srtk=MXNsOGRoZG13OGZ2Zw==",
    },
    iedc: { image: { src: "/assets/images/story/iedc.jpeg", alt: "IEDC campus innovation work" } },
    under25: { image: { src: "/assets/images/story/under25.jpeg", alt: "Under 25 community event" } },
    dataEngineering: { customVisual: "code-editor" },
    socialService: { media: { src: "/assets/images/story/gopals.jpg", alt: "Gopal's run to heal community initiative" } },
    candleMaking: { images: [
      { src: "/assets/images/story/candles1.jpg", alt: "Hand-poured candle making process" },
      { src: "/assets/images/story/candles2.jpg", alt: "Finished candle making detail" },
    ] },
    braceletMaking: { images: [
      { src: "/assets/images/story/bracelet.jpg", alt: "Handmade bracelet craft" },
    ] },
  },

  wispr: {
    spokenPromptRecording: null,
    transcriptionEvidence: null,
    emergentInitial: null,
    emergentImproved: null,
  },

  build: {
    nivaas: { src: "/assets/images/projects/nivas.mp4", alt: "NIVAAS product interface video" },
    ansme: { src: "/assets/images/projects/ansmevid.mp4", alt: "ANSME product comparison demo video" },
    pat: { src: "/assets/images/projects/patinternship.jpeg", alt: "PAT internship work snapshot" },
    minirag: { src: "/assets/images/projects/ragbot.jpeg", alt: "Mini RAG bot project screenshot" },
  },
};

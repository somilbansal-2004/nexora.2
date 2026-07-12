var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  let cachedVideos = null;
  let cacheTime = 0;
  const CACHE_DURATION = 15 * 60 * 1e3;
  function unescapeHtml(str) {
    return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'");
  }
  app.get("/api/youtube/latest", async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelUrl = "https://www.youtube.com/@Nexora-k9x";
    const defaultVideos = [
      {
        id: "92NGRk_LF-4",
        title: "6-Axis Robotic Arm Kinematics & Parametric CAD modeling Masterclass",
        category: "Mechanical Engineering",
        description: "Step-by-step masterclass modeling a 6-axis robotic arm with complex joints, workspace volume optimization, and torque calculation in Fusion 360 & Inventor.",
        uploadDate: "June 18, 2026",
        duration: "1:48:22",
        views: "15.4K views",
        url: "https://youtu.be/92NGRk_LF-4",
        thumbnailUrl: "https://img.youtube.com/vi/92NGRk_LF-4/maxresdefault.jpg",
        bgGradient: "from-green-950 via-[#1b5e20] to-[#0f3a12]",
        accentColor: "#4CAF50",
        iconName: "mechanical"
      },
      {
        id: "eMELSgE5YtE",
        title: "Industrial PCB Design & High-Speed Impedance Routing Walkthrough",
        category: "Hardware PCBs",
        description: "A complete 8-layer high-speed PCB design session in Altium Designer, detailing impedance-matched routing, differential pairs, and signal integrity simulations.",
        uploadDate: "May 25, 2026",
        duration: "1:28:45",
        views: "12.1K views",
        url: "https://youtu.be/eMELSgE5YtE",
        thumbnailUrl: "https://img.youtube.com/vi/eMELSgE5YtE/maxresdefault.jpg",
        bgGradient: "from-emerald-700 to-[#1b5e20]",
        accentColor: "#4CAF50",
        iconName: "electronics"
      },
      {
        id: "POvlAxG3G_w",
        title: "High-Fidelity 3D Product Rendering & CAD Animation Workshop",
        category: "Product Design",
        description: "Learn professional rendering, materials setup, scene lighting, and complex keyframe animations for high-end product showcasing using SolidWorks & KeyShot.",
        uploadDate: "April 30, 2026",
        duration: "1:35:10",
        views: "9.5K views",
        url: "https://youtu.be/POvlAxG3G_w",
        thumbnailUrl: "https://img.youtube.com/vi/POvlAxG3G_w/maxresdefault.jpg",
        bgGradient: "from-[#2e7d32] to-emerald-900",
        accentColor: "#4CAF50",
        iconName: "cad"
      },
      {
        id: "OT0US0xXWAI",
        title: "Ansys Finite Element Method (FEM) Static & Dynamic Simulation Course",
        category: "Mechanical Engineering",
        description: "Master linear static, modal, and transient structural stress simulations in Ansys Workbench for mechanical brackets, chassis structures, and high-load assemblies.",
        uploadDate: "March 15, 2026",
        duration: "2:15:40",
        views: "18.3K views",
        url: "https://youtu.be/OT0US0xXWAI",
        thumbnailUrl: "https://img.youtube.com/vi/OT0US0xXWAI/maxresdefault.jpg",
        bgGradient: "from-emerald-950 via-teal-950 to-green-950",
        accentColor: "#4CAF50",
        iconName: "tutorials"
      }
    ];
    if (apiKey) {
      try {
        const pageRes = await fetch(channelUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
          }
        });
        if (pageRes.ok) {
          const html = await pageRes.text();
          const channelIdMatch = html.match(/"channelId"\s*:\s*"(UC[^"]+)"/) || html.match(/"externalId"\s*:\s*"(UC[^"]+)"/);
          const channelId = channelIdMatch ? channelIdMatch[1] : null;
          if (channelId) {
            const apiRes = await fetch(
              `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=5&type=video`
            );
            if (apiRes.ok) {
              const apiData = await apiRes.json();
              if (apiData.items && apiData.items.length > 0) {
                const liveVideos = apiData.items.map((item, i) => {
                  const id = item.id.videoId;
                  const title = unescapeHtml(item.snippet.title);
                  const desc = item.snippet.description;
                  const rawDate = new Date(item.snippet.publishedAt);
                  const formattedDate = rawDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  });
                  const category = title.toLowerCase().includes("pcb") || title.toLowerCase().includes("circuit") ? "Hardware PCBs" : title.toLowerCase().includes("cad") || title.toLowerCase().includes("solidworks") ? "Product Design" : "Mechanical Engineering";
                  const bgGradients = [
                    "from-green-950 via-[#1b5e20] to-[#0f3a12]",
                    "from-emerald-700 to-[#1b5e20]",
                    "from-[#2e7d32] to-emerald-900",
                    "from-emerald-950 via-teal-950 to-green-950",
                    "from-teal-900 to-[#1b5e20]"
                  ];
                  return {
                    id,
                    title,
                    category,
                    description: desc,
                    uploadDate: formattedDate,
                    duration: "1:30:00",
                    views: "9.5K views",
                    url: `https://youtu.be/${id}`,
                    thumbnailUrl: item.snippet.thumbnails?.maxresdefault?.url || item.snippet.thumbnails?.high?.url || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
                    bgGradient: bgGradients[i % bgGradients.length],
                    accentColor: "#4CAF50",
                    iconName: title.toLowerCase().includes("cad") ? "cad" : title.toLowerCase().includes("pcb") ? "electronics" : "mechanical"
                  };
                });
                return res.json({ success: true, videos: liveVideos });
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to query YouTube search API, returning curated fallback:", err);
      }
    }
    return res.json({ success: true, videos: defaultVideos });
  });
  app.get("/api/youtube/stats", async (req, res) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelUrl = "https://www.youtube.com/@Nexora-k9x";
    let subscriberCount = "12.4K";
    let videoCount = "130";
    let subscriberValue = 12420;
    let videoValue = 130;
    try {
      const response = await fetch(channelUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9"
        }
      });
      if (response.ok) {
        const html = await response.text();
        const channelIdMatch = html.match(/"channelId"\s*:\s*"(UC[^"]+)"/) || html.match(/"externalId"\s*:\s*"(UC[^"]+)"/);
        const channelId = channelIdMatch ? channelIdMatch[1] : null;
        if (apiKey && channelId) {
          try {
            const apiRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);
            if (apiRes.ok) {
              const apiData = await apiRes.json();
              if (apiData.items && apiData.items.length > 0) {
                const stats = apiData.items[0].statistics;
                const subCountInt = parseInt(stats.subscriberCount, 10);
                const vidCountInt = parseInt(stats.videoCount, 10);
                subscriberValue = subCountInt;
                videoValue = vidCountInt;
                if (subCountInt >= 1e6) {
                  subscriberCount = (subCountInt / 1e6).toFixed(1) + "M";
                } else if (subCountInt >= 1e3) {
                  subscriberCount = (subCountInt / 1e3).toFixed(1) + "K";
                } else {
                  subscriberCount = subCountInt.toString();
                }
                videoCount = vidCountInt.toString();
                return res.json({
                  success: true,
                  subscriberCount,
                  subscriberValue,
                  videoCount,
                  videoValue,
                  source: "api"
                });
              }
            }
          } catch (apiErr) {
            console.error("YouTube API stats fetch failed, falling back to scraping:", apiErr);
          }
        }
        const subMatch = html.match(/"subscriberCountText"\s*:\s*\{\s*"accessibility"\s*:\s*\{\s*"accessibilityData"\s*:\s*\{\s*"label"\s*:\s*"([^"]+)"/i) || html.match(/"subscriberCountText"\s*:\s*\{\s*"simpleText"\s*:\s*"([^"]+)"/i) || html.match(/itemprop="interactionCount" content="([^"]+)"/i);
        if (subMatch) {
          const rawSub = subMatch[1];
          const subClean = rawSub.replace(/subscribers/gi, "").trim();
          subscriberCount = subClean;
          let val = parseFloat(subClean);
          if (subClean.toLowerCase().includes("k")) val *= 1e3;
          if (subClean.toLowerCase().includes("m")) val *= 1e6;
          subscriberValue = isNaN(val) ? 12420 : val;
        } else {
          const broadSubMatch = html.match(/([\d.]+[KMB]?)\s*subscribers/i);
          if (broadSubMatch) {
            subscriberCount = broadSubMatch[1];
            let val = parseFloat(subscriberCount);
            if (subscriberCount.toLowerCase().includes("k")) val *= 1e3;
            if (subscriberCount.toLowerCase().includes("m")) val *= 1e6;
            subscriberValue = isNaN(val) ? 12420 : val;
          }
        }
        const vidMatch = html.match(/"videoCountText"\s*:\s*\{\s*"runs"\s*:\s*\[\s*\{\s*"text"\s*:\s*"([^"]+)"/i) || html.match(/"videoCountText"\s*:\s*\{\s*"simpleText"\s*:\s*"([^"]+)"/i);
        if (vidMatch) {
          const rawVid = vidMatch[1];
          videoCount = rawVid.replace(/videos/gi, "").trim();
          videoValue = parseInt(videoCount.replace(/,/g, ""), 10) || 130;
        } else {
          const broadVidMatch = html.match(/([\d,]+)\s*videos/i);
          if (broadVidMatch) {
            videoCount = broadVidMatch[1];
            videoValue = parseInt(videoCount.replace(/,/g, ""), 10) || 130;
          }
        }
      }
    } catch (err) {
      console.error("Failed to scrap YouTube stats:", err);
    }
    return res.json({
      success: true,
      subscriberCount,
      subscriberValue,
      videoCount,
      videoValue,
      source: "scraped/fallback"
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("[Server] Integrated Vite development middleware");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("[Server] Serving compiled static files from /dist");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Core running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

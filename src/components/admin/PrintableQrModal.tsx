"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrCode } from "@/lib/qrcodegen";
import { StoreConfig } from "@/data/defaultCheezious";
import {
  X,
  Crown,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Smartphone,
  Hash,
  Palette,
} from "lucide-react";

interface PrintableQrModalProps {
  config: StoreConfig;
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function PrintableQrModal({
  config,
  isOpen,
  onClose,
  showToast,
}: PrintableQrModalProps) {
  const [targetUrl, setTargetUrl] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [cardTheme, setCardTheme] = useState<"yellow" | "dark">("yellow");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set default URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setTargetUrl(origin);
    }
  }, []);

  // Compute the final scanned URL including table number if specified
  const effectiveUrl = React.useMemo(() => {
    let url = targetUrl.trim() || (typeof window !== "undefined" ? window.location.origin : "");
    if (tableNumber.trim()) {
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}table=${encodeURIComponent(tableNumber.trim())}`;
    }
    return url;
  }, [targetUrl, tableNumber]);

  // Generate and draw preview on canvas
  useEffect(() => {
    if (!isOpen || !previewCanvasRef.current || !effectiveUrl) return;

    try {
      // Generate QR Code matrix with Quartile error correction (supports center logo emblem)
      const qr = QrCode.encodeText(effectiveUrl, "Q");
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Card Dimensions: 800 x 1120 (3:4.2 portrait table tent ratio)
      const width = 800;
      const height = 1120;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Fill
      if (cardTheme === "yellow") {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#FFB800"); // Cheezious Yellow
        bgGrad.addColorStop(0.35, "#F59E0B"); // Amber 500
        bgGrad.addColorStop(1, "#D97706"); // Amber 600
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Subtle geometric background circles
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.arc(width * 0.9, height * 0.1, 240, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width * 0.1, height * 0.85, 200, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Dark Theme
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#191D26");
        bgGrad.addColorStop(1, "#0E1015");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Gold subtle accent glow at top
        ctx.fillStyle = "rgba(255, 184, 0, 0.08)";
        ctx.beginPath();
        ctx.arc(width * 0.5, 0, 350, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Top Branding Header
      const brandName = (config.brandName || "CHEEZIOUS").toUpperCase();

      // Crown Emblem icon badge
      const crownCenterY = 110;
      ctx.fillStyle = cardTheme === "yellow" ? "#111317" : "#FFB800";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 38, crownCenterY - 38, 76, 76, 22);
      ctx.fill();

      // Draw Crown inside badge
      ctx.fillStyle = cardTheme === "yellow" ? "#FFB800" : "#111317";
      ctx.beginPath();
      const cx = width / 2;
      const cy = crownCenterY + 12;
      ctx.moveTo(cx - 24, cy - 8);
      ctx.lineTo(cx - 20, cy - 30);
      ctx.lineTo(cx - 8, cy - 18);
      ctx.lineTo(cx, cy - 34);
      ctx.lineTo(cx + 8, cy - 18);
      ctx.lineTo(cx + 20, cy - 30);
      ctx.lineTo(cx + 24, cy - 8);
      ctx.closePath();
      ctx.fill();
      // Crown base bar
      ctx.fillRect(cx - 22, cy - 4, 44, 7);

      // Brand Title
      ctx.fillStyle = cardTheme === "yellow" ? "#111317" : "#FFFFFF";
      ctx.font = "900 46px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "2px";
      ctx.fillText(brandName, width / 2, 215);

      // Slogan
      ctx.fillStyle = cardTheme === "yellow" ? "rgba(17, 19, 23, 0.85)" : "#FFB800";
      ctx.font = "700 15px system-ui, -apple-system, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText(
        (config.slogan || "ORIGINAL TASTE • PASSION • FLAVOR").toUpperCase(),
        width / 2,
        245
      );

      // 3. "SCAN TO VIEW MENU" Banner Pill
      const pillY = 275;
      ctx.fillStyle = cardTheme === "yellow" ? "#111317" : "rgba(255, 184, 0, 0.15)";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 210, pillY, 420, 46, 23);
      ctx.fill();

      if (cardTheme === "dark") {
        ctx.strokeStyle = "rgba(255, 184, 0, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = cardTheme === "yellow" ? "#FFB800" : "#FFFFFF";
      ctx.font = "800 16px system-ui, -apple-system, sans-serif";
      ctx.letterSpacing = "1.5px";
      ctx.fillText("SCAN TO VIEW MENU & ORDER ONLINE", width / 2, pillY + 29);

      // 4. White Center Card for QR Code
      const qrBoxSize = 440;
      const qrBoxX = (width - qrBoxSize) / 2;
      const qrBoxY = 345;

      // Soft Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 5. Draw QR Code Modules onto White Container
      const qrPadding = 36;
      const qrDrawSize = qrBoxSize - qrPadding * 2;
      const moduleCount = qr.size;
      const moduleSize = qrDrawSize / moduleCount;
      const qrStartX = qrBoxX + qrPadding;
      const qrStartY = qrBoxY + qrPadding;

      ctx.fillStyle = "#111317";
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (qr.getModule(c, r)) {
            const mx = qrStartX + c * moduleSize;
            const my = qrStartY + r * moduleSize;
            ctx.fillRect(
              Math.floor(mx),
              Math.floor(my),
              Math.ceil(moduleSize),
              Math.ceil(moduleSize)
            );
          }
        }
      }

      // 6. Draw Center Emblem inside QR Code
      const emblemSize = 64;
      const emblemX = width / 2 - emblemSize / 2;
      const emblemY = qrBoxY + qrBoxSize / 2 - emblemSize / 2;

      // White outline around emblem
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(emblemX - 6, emblemY - 6, emblemSize + 12, emblemSize + 12, 16);
      ctx.fill();

      // Black badge background
      ctx.fillStyle = "#111317";
      ctx.beginPath();
      ctx.roundRect(emblemX, emblemY, emblemSize, emblemSize, 14);
      ctx.fill();

      // Yellow mini crown in center
      ctx.fillStyle = "#FFB800";
      ctx.beginPath();
      const ecx = width / 2;
      const ecy = qrBoxY + qrBoxSize / 2 + 10;
      ctx.moveTo(ecx - 18, ecy - 6);
      ctx.lineTo(ecx - 15, ecy - 22);
      ctx.lineTo(ecx - 6, ecy - 13);
      ctx.lineTo(ecx, ecy - 25);
      ctx.lineTo(ecx + 6, ecy - 13);
      ctx.lineTo(ecx + 15, ecy - 22);
      ctx.lineTo(ecx + 18, ecy - 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(ecx - 16, ecy - 3, 32, 5);

      // 7. Optional Table Identifier Badge
      let nextY = qrBoxY + qrBoxSize + 40;
      if (tableNumber.trim()) {
        ctx.fillStyle = cardTheme === "yellow" ? "#111317" : "#FFB800";
        ctx.beginPath();
        ctx.roundRect(width / 2 - 130, nextY - 10, 260, 48, 24);
        ctx.fill();

        ctx.fillStyle = cardTheme === "yellow" ? "#FFFFFF" : "#111317";
        ctx.font = "900 20px system-ui, -apple-system, sans-serif";
        ctx.letterSpacing = "2px";
        ctx.fillText(`TABLE ${tableNumber.trim().toUpperCase()}`, width / 2, nextY + 22);
        nextY += 65;
      } else {
        ctx.fillStyle = cardTheme === "yellow" ? "#111317" : "#FFFFFF";
        ctx.font = "800 18px system-ui, -apple-system, sans-serif";
        ctx.letterSpacing = "1.5px";
        ctx.fillText("DINE-IN • TAKEAWAY • DELIVERY", width / 2, nextY + 15);
        nextY += 50;
      }

      // 8. Footer Section
      // Hotline
      const hotline = config.whatsappNumber || config.hotline || "+92 314 6517960";
      ctx.fillStyle = cardTheme === "yellow" ? "#111317" : "#FFFFFF";
      ctx.font = "700 16px system-ui, -apple-system, sans-serif";
      ctx.fillText(`WhatsApp Orders: ${hotline}`, width / 2, nextY + 15);

      // Website URL
      const displayUrl = effectiveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
      ctx.fillStyle = cardTheme === "yellow" ? "rgba(17, 19, 23, 0.75)" : "rgba(255, 255, 255, 0.6)";
      ctx.font = "600 13px system-ui, -apple-system, sans-serif";
      ctx.fillText(displayUrl, width / 2, nextY + 45);

      // Bottom tagline
      ctx.fillStyle = cardTheme === "yellow" ? "#111317" : "#FFB800";
      ctx.font = "800 14px system-ui, -apple-system, sans-serif";
      ctx.letterSpacing = "1px";
      ctx.fillText("🔥 Delivering Cheezy Khushiyan!", width / 2, height - 40);
    } catch (err: any) {
      console.error("Failed to render QR Code:", err);
    }
  }, [isOpen, effectiveUrl, cardTheme, tableNumber, config]);

  if (!isOpen) return null;

  // Handle PNG Download
  const handleDownloadPng = () => {
    if (!previewCanvasRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = previewCanvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      const filename = tableNumber.trim()
        ? `cheezious-qr-table-${tableNumber.trim().toLowerCase()}.png`
        : "cheezious-qr-menu-standee.png";
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Printable QR Standee downloaded successfully!", "success");
    } catch (err: any) {
      showToast("Download failed: " + (err?.message || "Error"), "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Pure QR Code Only Download
  const handleDownloadQrOnly = () => {
    try {
      const qr = QrCode.encodeText(effectiveUrl, "Q");
      const qrCanvas = document.createElement("canvas");
      const size = 1000;
      qrCanvas.width = size;
      qrCanvas.height = size;
      const ctx = qrCanvas.getContext("2d");
      if (!ctx) return;

      // Pure white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      const padding = 80;
      const drawSize = size - padding * 2;
      const modCount = qr.size;
      const modSize = drawSize / modCount;

      ctx.fillStyle = "#111317";
      for (let r = 0; r < modCount; r++) {
        for (let c = 0; c < modCount; c++) {
          if (qr.getModule(c, r)) {
            ctx.fillRect(
              Math.floor(padding + c * modSize),
              Math.floor(padding + r * modSize),
              Math.ceil(modSize),
              Math.ceil(modSize)
            );
          }
        }
      }

      // Center logo badge
      const emblemSize = 140;
      const ex = size / 2 - emblemSize / 2;
      const ey = size / 2 - emblemSize / 2;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(ex - 12, ey - 12, emblemSize + 24, emblemSize + 24, 30);
      ctx.fill();

      ctx.fillStyle = "#111317";
      ctx.beginPath();
      ctx.roundRect(ex, ey, emblemSize, emblemSize, 24);
      ctx.fill();

      ctx.fillStyle = "#FFB800";
      const ecx = size / 2;
      const ecy = size / 2 + 20;
      ctx.beginPath();
      ctx.moveTo(ecx - 40, ecy - 12);
      ctx.lineTo(ecx - 34, ecy - 48);
      ctx.lineTo(ecx - 14, ecy - 28);
      ctx.lineTo(ecx, ecy - 54);
      ctx.lineTo(ecx + 14, ecy - 28);
      ctx.lineTo(ecx + 34, ecy - 48);
      ctx.lineTo(ecx + 40, ecy - 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(ecx - 36, ecy - 6, 72, 10);

      const dataUrl = qrCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "cheezious-qr-code.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Standalone QR code downloaded!", "success");
    } catch (err: any) {
      showToast("Download failed: " + (err?.message || "Error"), "error");
    }
  };

  // Handle Print Standee
  const handlePrint = () => {
    if (!previewCanvasRef.current) return;
    const dataUrl = previewCanvasRef.current.toDataURL("image/png");
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Please allow popups to print the QR standee.", "error");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Cheezious QR Standee</title>
          <style>
            @page {
              size: auto;
              margin: 0mm;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f3f4f6;
              height: 100vh;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .print-card {
              max-width: 90vw;
              max-height: 95vh;
              object-fit: contain;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              border-radius: 12px;
            }
            @media print {
              body {
                background: none;
              }
              .print-card {
                width: 100vw;
                height: 100vh;
                max-width: none;
                max-height: none;
                box-shadow: none;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" class="print-card" alt="Cheezious QR Standee" onload="window.print();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(effectiveUrl);
    setCopied(true);
    showToast("QR Link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-[#222631] rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl space-y-6 my-6 transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#222631] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-cheezious-yellow/10 border border-amber-500/30 text-amber-600 dark:text-cheezious-yellow flex items-center justify-center shadow-glow">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Printable QR Standee Generator</span>
                <span className="text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-cheezious-yellow px-2 py-0.5 rounded-full border border-amber-500/30">
                  Ready to Print
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-cheezious-textMuted mt-0.5">
                Generate authentic Cheezious-branded QR cards for tables, counters, or takeaway flyers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#222631] hover:bg-gray-200 dark:hover:bg-[#2D3342] text-neutral-600 dark:text-cheezious-textMuted hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Preview on Left, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Card Canvas Preview (Left 5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-100 dark:bg-[#111317] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#222631]">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[800/1120] rounded-2xl overflow-hidden shadow-2xl border border-black/10">
              <canvas
                ref={previewCanvasRef}
                className="w-full h-full object-contain block"
              />
            </div>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-3 text-center">
              Preview shown at 35% scale. Output is rendered at <strong>300 DPI (1600x2240)</strong> for crisp print quality.
            </p>
          </div>

          {/* Customization Options & Download Controls (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Target URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                <span>Target Menu Webpage URL</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://sample.helpexai.com"
                  className="flex-1 bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-[#222631] hover:bg-gray-200 dark:hover:bg-[#2D3342] text-neutral-700 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  title="Copy full scanned URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted">
                Customers will be routed directly to this address when scanning the QR code with their phone camera.
              </p>
            </div>

            {/* Table Number & Theme Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Optional Table Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-500" />
                  <span>Table Number (Optional)</span>
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. 05 or Counter"
                  className="w-full bg-gray-50 dark:bg-[#111317] text-neutral-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-[#222631] focus:border-cheezious-yellow focus:outline-none"
                />
                <p className="text-[11px] text-neutral-500 dark:text-cheezious-textMuted">
                  Appends <code className="text-amber-600 dark:text-cheezious-yellow">?table=X</code> to track dine-in table orders.
                </p>
              </div>

              {/* Card Color Scheme */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-cheezious-textLight flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-500" />
                  <span>Card Theme</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCardTheme("yellow")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      cardTheme === "yellow"
                        ? "bg-amber-400/20 text-amber-600 dark:text-cheezious-yellow border-amber-500"
                        : "bg-gray-50 dark:bg-[#111317] text-neutral-600 dark:text-cheezious-textMuted border-gray-200 dark:border-[#222631]"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-cheezious-yellow shrink-0" />
                    <span>Cheezious Gold</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardTheme("dark")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      cardTheme === "dark"
                        ? "bg-amber-400/20 text-amber-600 dark:text-cheezious-yellow border-amber-500"
                        : "bg-gray-50 dark:bg-[#111317] text-neutral-600 dark:text-cheezious-textMuted border-gray-200 dark:border-[#222631]"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#111317] border border-gray-500 shrink-0" />
                    <span>Dark Noir</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Resolved Scan URL Preview */}
            <div className="p-3.5 bg-gray-50 dark:bg-[#111317] rounded-xl border border-gray-200 dark:border-[#222631] space-y-1">
              <div className="text-[11px] font-bold text-neutral-600 dark:text-cheezious-textMuted flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encoded QR Destination:</span>
              </div>
              <div className="font-mono text-xs text-neutral-900 dark:text-white break-all select-all font-semibold">
                {effectiveUrl}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Download Standee PNG Button */}
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleDownloadPng}
                  className="w-full bg-cheezious-yellow hover:bg-cheezious-yellowHover text-black font-black py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-glow active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Standee (PNG)</span>
                </button>

                {/* Print Standee Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full bg-gray-900 hover:bg-black dark:bg-[#222631] dark:hover:bg-[#2D3342] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all border border-gray-700 dark:border-gray-600 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-cheezious-yellow" />
                  <span>Print Standee / Flyer</span>
                </button>
              </div>

              {/* Secondary Download Button for QR Only */}
              <button
                type="button"
                onClick={handleDownloadQrOnly}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1A1D24] dark:hover:bg-[#222631] text-neutral-700 dark:text-cheezious-textLight text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-gray-200 dark:border-[#222631]"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span>Download Standalone QR Code (High-Res Square)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

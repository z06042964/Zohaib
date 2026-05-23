import { Scissors, RefreshCw, Minimize2 } from "lucide-react";

export const TOOLS = [
  {
    id: "background-remover",
    title: "Background Remover",
    description:
      "Remove image backgrounds instantly with clean and accurate AI processing.",
    icon: Scissors,
    href: "/tools/background-remover",
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    id: "image-converter",
    title: "Image Converter",
    description:
      "Convert images between JPG, PNG, WEBP and more formats in seconds.",
    icon: RefreshCw,
    href: "/tools/image-converter",
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    id: "image-compressor",
    title: "Image Compressor",
    description:
      "Compress large images without losing quality for faster performance.",
    icon: Minimize2,
    href: "/tools/image-compressor",
    gradient: "from-indigo-500 to-brand-600",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
];

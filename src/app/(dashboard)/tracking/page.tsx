import type { Metadata } from "next";
import TrackingBoard from "./tracking-board";

export const metadata: Metadata = { title: "Tracking" };

export default function TrackingPage() {
  return <TrackingBoard />;
}

#!/usr/bin/env node
import { stat, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureManifest() {
  const root = process.cwd();
  const serverAppDir = path.join(root, ".next", "server", "app");
  const sourceFile = path.join(serverAppDir, "page_client-reference-manifest.js");
  const routeGroupDir = path.join(serverAppDir, "(site)");
  const destinationFile = path.join(routeGroupDir, "page_client-reference-manifest.js");

  const sourceExists = await fileExists(sourceFile);
  if (!sourceExists) {
    console.warn("[ensure-client-manifest] Source manifest not found, skipping copy.");
    return;
  }

  const destinationExists = await fileExists(destinationFile);
  if (destinationExists) {
    return;
  }

  await mkdir(routeGroupDir, { recursive: true });
  await copyFile(sourceFile, destinationFile);
  console.log("[ensure-client-manifest] Created client reference manifest for /(site)/page.");
}

ensureManifest();

import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

async function getLatestBlockHeight(): Promise<number> {
  try {
    const response = await fetch("https://api.hiro.so/v2/info");
    const data = (await response.json()) as any;
    return data?.stacks_tip_height;
  } catch (error) {
    console.error("Error fetching latest block height:", error);
    throw error;
  }
}

async function updateClarinetToml(newBlockHeight: number): Promise<void> {
  const clarinetPath = path.join(process.cwd(), "Clarinet.toml");

  try {
    // Read the current Clarinet.toml file
    let content = fs.readFileSync(clarinetPath, "utf8");

    // Replace the initial_height value
    content = content.replace(
      /initial_height\s*=\s*\d+/,
      `initial_height = ${newBlockHeight}`
    );

    // Write the updated content back to the file
    fs.writeFileSync(clarinetPath, content, "utf8");

    console.log(`Successfully updated initial_height to ${newBlockHeight}`);
  } catch (error) {
    console.error("Error updating Clarinet.toml:", error);
    throw error;
  }
}

export function runUpdateBlockHeight() {
  describe("Update Block Height", () => {
    it("should update the initial_height in Clarinet.toml", async () => {
      const latestBlockHeight = await getLatestBlockHeight();
      expect(latestBlockHeight).toBeGreaterThan(0);

      await updateClarinetToml(latestBlockHeight);

      // Verify the update
      const updatedContent = fs.readFileSync(
        path.join(process.cwd(), "Clarinet.toml"),
        "utf8"
      );
      expect(updatedContent).toContain(`initial_height = ${latestBlockHeight}`);
    });
  });
}

// Execute the update when this file is run directly
if (require.main === module) {
  (async () => {
    try {
      const latestBlockHeight = await getLatestBlockHeight();
      await updateClarinetToml(latestBlockHeight);
    } catch (error) {
      console.error("Failed to update block height:", error);
      process.exit(1);
    }
  })();
}

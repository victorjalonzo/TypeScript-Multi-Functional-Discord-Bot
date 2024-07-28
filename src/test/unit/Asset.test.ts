import { Asset } from "../../shared/intraestructure/Asset.js";
import { expect, it, describe } from "vitest"

describe("Asset", () => {
    it("should get an asset", async () => {
        const asset = await Asset.get("success-icon")

        expect(asset).toBeTypeOf("object")
    })
}) 
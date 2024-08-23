const { assert } = require("chai");

describe("Goodwill Contract", () => {
    let goodwill, owner, title, description, target, deadline, image, donators, donations;

    beforeEach(async () => {
        goodwill = await ethers.deployContract("Goodwill");
        owner = "0xF416A40EdF205c563E7B12Fdd3a21710c55CfDA3";
        title = "Snopixels";
        description = "A mobile game startup";
        target = BigInt(1);
        deadline = BigInt(42);
        image = "abc.jpg";
    });

    describe("createCampaign", async () => {
        it("Creates a new campaign", async () => {
            await goodwill.createCampaign(owner, title, description, target, deadline, image);

            const number = await goodwill.numberOfCampaigns();
            //console.log(number);
            assert.equal(number, BigInt(1));
        });
    });
});

const { assert, expect } = require("chai");

describe("Goodwill Contract", () => {
    let goodwill, owner, title, description, target, image, donators, donations;
    const fundVal = ethers.parseEther("1.5321451");

    beforeEach(async () => {
        goodwill = await ethers.deployContract("Goodwill");
        owner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        title = "Snowpixels";
        description = "A mobile game startup";
        target = BigInt(5);
        deadline = BigInt(42);
        image = "abc.jpg";
        await goodwill.createCampaign(owner, title, description, target, image);
    });

    describe("createCampaign", async () => {
        it("Creates a new campaign", async () => {
            const number = await goodwill.numberOfCampaigns();
            assert.equal(number, BigInt(1));
        });
    });

    describe("getCampaigns", async () => {
        it("Returns all campaigns", async () => {
            await goodwill.createCampaign(owner, title, description, target, image);
            const allCampaigns = await goodwill.getCampaigns();
            const number = await goodwill.numberOfCampaigns();

            assert.equal(number, BigInt(allCampaigns.length));
        });
        it("Returns data of each campaign correctly", async () => {
            const allCampaigns = await goodwill.getCampaigns();

            const newTitle = allCampaigns[0].title;
            const newTarget = allCampaigns[0].target;
            assert.equal(title, newTitle);
            assert.equal(target, newTarget);
        });
    });

    describe("donateToCampaign", () => {
        it("Reverts if we fund with 0 eth", async () => {
            await expect(goodwill.donateToCampaign(0, { value: ethers.parseEther("0") })).to.be
                .reverted;
        });
        it("Updates amount collected", async () => {
            let allCampaigns = await goodwill.getCampaigns();
            let campaign = allCampaigns[0];
            const prevBalance = campaign.amountCollected;

            await goodwill.donateToCampaign(0, { value: fundVal });
            allCampaigns = await goodwill.getCampaigns();
            campaign = allCampaigns[0];
            const newBalance = campaign.amountCollected;

            assert.equal(newBalance, prevBalance + fundVal);
        });
        it("Adds donators in the campaign", async () => {
            const [caller] = await hre.ethers.getSigners();
            await goodwill.donateToCampaign(0, { value: fundVal });

            let allCampaigns = await goodwill.getCampaigns();
            let campaign = allCampaigns[0];
            const donators = campaign.donators;

            assert.equal(donators[0], caller.address);
        });
        it("Stores each donation in the campaign", async () => {
            await goodwill.donateToCampaign(0, { value: fundVal });
            let allCampaigns = await goodwill.getCampaigns();
            let campaign = allCampaigns[0];

            const donation = campaign.donations[0];
            assert.equal(donation, fundVal);
        });
    });

    describe("getDonators", async () => {
        it("Returns all donators and donations", async () => {
            const [caller] = await hre.ethers.getSigners();
            await goodwill.donateToCampaign(0, { value: fundVal });
            let allCampaigns = await goodwill.getCampaigns();
            let campaign = allCampaigns[0];

            const donation = campaign.donations[0];
            assert.equal(donation, fundVal);
            const donators = campaign.donators;
            assert.equal(donators[0], caller.address);
        });
    });
});

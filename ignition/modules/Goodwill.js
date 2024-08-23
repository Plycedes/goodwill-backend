const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GoodwillModule", (m) => {
    const goodwill = m.contract("Goodwill");

    return { goodwill };
});

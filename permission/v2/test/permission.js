const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const chai = require("chai");
const chaiAsPromise = require("chai-as-promised");

chai.use(chaiAsPromise);
const expect = chai.expect;

function keccak256(data) {
  return ethers.utils.keccak256(data);
}

const BREATH = 4,
  DEPTH = 4;

const nwAdminOrg = "ADMINORG",
  nwAdminRole = "ADMIN",
  orgAdminRole = "ORGADMIN";

const ADMIN_NODE = {
  encodeId: "ADMIN_NODE",
  ip: "127.0.0.1",
  port: 80,
  raftPort: 81,
};

const ORG_1 = {
  orgId: "ORG_1",
  encodeId: "ORG_1",
  ip: "127.0.0.2",
  port: 80,
  raftPort: 81,
};

const ORG_2 = {
  orgId: "ORG_2",
  encodeId: "ORG_2",
  ip: "127.0.0.3",
  port: 80,
  raftPort: 81,
};

const ORG_1_EMPTY_ENCODE_ID = {
  orgId: "ORG_1",
  encodeId: "",
  ip: "127.0.0.2",
  port: 80,
  raftPort: 81,
};

const ORG_2_EMPTY_ENCODE_ID = {
  orgId: "ORG_2",
  encodeId: "",
  ip: "127.0.0.3",
  port: 80,
  raftPort: 81,
};

const VERIFIER_ROLE = keccak256(ethers.utils.toUtf8Bytes("VERIFIER_ROLE")),
  OPERATOR_ROLE = keccak256(ethers.utils.toUtf8Bytes("OPERATOR_ROLE"));

const SUB_ORG_1_1 = {
  orgId: "SUB_ORG_1_1",
  encodeId: "SUB_ORG_1_1",
  ip: "127.0.1.1",
  port: 80,
  raftPort: 81,
};

const SUB_ORG_1_2 = {
  orgId: "SUB_ORG_1_2",
  encodeId: "SUB_ORG_1_2",
  ip: "127.0.1.2",
  port: 80,
  raftPort: 81,
};

const SUB_ORG_1_3 = {
  orgId: "SUB_ORG_1_3",
  encodeId: "SUB_ORG_1_3",
  ip: "127.0.1.3",
  port: 80,
  raftPort: 81,
};

const SUB_ORG_1_4 = {
  orgId: "SUB_ORG_1_4",
  encodeId: "SUB_ORG_1_4",
  ip: "127.0.1.4",
  port: 80,
  raftPort: 81,
};

const SUB_ORG_1_5 = {
  orgId: "SUB_ORG_1_5",
  encodeId: "SUB_ORG_1_5",
  ip: "127.0.1.5",
  port: 80,
  raftPort: 81,
};

const SUB_ORG_1_6 = {
  orgId: "SUB_ORG_1_6",
  encodeId: "SUB_ORG_1_6",
  ip: "127.0.1.6",
  port: 80,
  raftPort: 81,
};

describe("Permission Testing", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  let network_admin,
    org_1_admin,
    org_2_admin,
    sub_org_1_1_admin,
    accounts;
  let permissionsUpgradable,
    permissionsImplementation,
    permissionsInterface,
    accountManager,
    nodeManager,
    orgManager,
    roleManager,
    voterManager;

  beforeEach(async () => {
    [
      network_admin,
      org_1_admin,
      org_2_admin,
      sub_org_1_1_admin,
      ...accounts
    ] = await ethers.getSigners();

    const PermissionsUpgradable = await ethers.getContractFactory(
      "PermissionsUpgradable",
      network_admin
    );
    permissionsUpgradable = await PermissionsUpgradable.deploy(
      network_admin.address
    );

    const AccountManager = await ethers.getContractFactory(
      "AccountManager",
      network_admin
    );
    accountManager = await AccountManager.deploy(
      permissionsUpgradable.address
    );

    const NodeManager = await ethers.getContractFactory(
      "NodeManager",
      network_admin
    );
    nodeManager = await NodeManager.deploy(
      permissionsUpgradable.address
    );

    const OrgManager = await ethers.getContractFactory(
      "OrgManager",
      network_admin
    );
    orgManager = await OrgManager.deploy(
      permissionsUpgradable.address
    );

    const RoleManager = await ethers.getContractFactory(
      "RoleManager",
      network_admin
    );
    roleManager = await RoleManager.deploy(
      permissionsUpgradable.address
    );

    const VoterManager = await ethers.getContractFactory(
      "VoterManager",
      network_admin
    );
    voterManager = await VoterManager.deploy(
      permissionsUpgradable.address
    );

    const PermissionsInterface = await ethers.getContractFactory(
      "PermissionsInterface",
      network_admin
    );
    permissionsInterface = await PermissionsInterface.deploy(
      permissionsUpgradable.address
    );

    const PermissionsImplementation =
      await ethers.getContractFactory(
        "PermissionsImplementation",
        network_admin
      );
    permissionsImplementation =
      await PermissionsImplementation.deploy(
        permissionsUpgradable.address,
        orgManager.address,
        roleManager.address,

        accountManager.address,
        voterManager.address,
        nodeManager.address
      );

    // update to upgradable contract
    await permissionsUpgradable
      .connect(network_admin)
      .init(
        permissionsInterface.address,
        permissionsImplementation.address
      );

    // boost network
    await permissionsInterface
      .connect(network_admin)
      .setPolicy(nwAdminOrg, nwAdminRole, orgAdminRole);
    await permissionsInterface
      .connect(network_admin)
      .init(BREATH, DEPTH);
    await permissionsInterface
      .connect(network_admin)
      .addAdminNode(
        ADMIN_NODE.encodeId,
        ADMIN_NODE.ip,
        ADMIN_NODE.port,
        ADMIN_NODE.raftPort
      );
    await permissionsInterface
      .connect(network_admin)
      .addAdminAccount(network_admin.address);
    await permissionsInterface
      .connect(network_admin)
      .updateNetworkBootStatus();
  });

  it("Should revert when addOrg ORG_1 then addOrg ORG_2", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );
    await expect(
      permissionsInterface
        .connect(network_admin)
        .addOrg(
          ORG_2.orgId,
          ORG_2.encodeId,
          ORG_2.ip,
          ORG_2.port,
          ORG_2.raftPort,
          org_2_admin.address
        )
    ).to.be.revertedWith(
      "items pending for approval. new item cannot be added"
    );
  });

  it("Should revert when addOrg ORG_1 then addOrg ORG_1 (duplicate)", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );
    await expect(
      permissionsInterface
        .connect(network_admin)
        .addOrg(
          ORG_1.orgId,
          ORG_1.encodeId,
          ORG_1.ip,
          ORG_1.port,
          ORG_1.raftPort,
          org_1_admin.address
        )
    ).to.be.revertedWith(
      "items pending for approval. new item cannot be added"
    );
  });

  it("Should revert when addOrg ORG_1 then addOrg ORG_2 with empty encodeId", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1_EMPTY_ENCODE_ID.orgId,
        ORG_1_EMPTY_ENCODE_ID.encodeId,
        ORG_1_EMPTY_ENCODE_ID.ip,
        ORG_1_EMPTY_ENCODE_ID.port,
        ORG_1_EMPTY_ENCODE_ID.raftPort,
        org_1_admin.address
      );
    await expect(
      permissionsInterface
        .connect(network_admin)
        .addOrg(
          ORG_2_EMPTY_ENCODE_ID.orgId,
          ORG_2_EMPTY_ENCODE_ID.encodeId,
          ORG_2_EMPTY_ENCODE_ID.ip,
          ORG_2_EMPTY_ENCODE_ID.port,
          ORG_2_EMPTY_ENCODE_ID.raftPort,
          org_2_admin.address
        )
    ).to.be.revertedWith(
      "items pending for approval. new item cannot be added"
    );
  });

  it("Should revert when addOrg ORG_1 then addOrg ORG_1 with empty encodeId (duplicate)", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1_EMPTY_ENCODE_ID.orgId,
        ORG_1_EMPTY_ENCODE_ID.encodeId,
        ORG_1_EMPTY_ENCODE_ID.ip,
        ORG_1_EMPTY_ENCODE_ID.port,
        ORG_1_EMPTY_ENCODE_ID.raftPort,
        org_1_admin.address
      );
    await expect(
      permissionsInterface
        .connect(network_admin)
        .addOrg(
          ORG_1_EMPTY_ENCODE_ID.orgId,
          ORG_1_EMPTY_ENCODE_ID.encodeId,
          ORG_1_EMPTY_ENCODE_ID.ip,
          ORG_1_EMPTY_ENCODE_ID.port,
          ORG_1_EMPTY_ENCODE_ID.raftPort,
          org_1_admin.address
        )
    ).to.be.revertedWith(
      "items pending for approval. new item cannot be added"
    );
  });

  it("Should revert when addOrg ORG_1 and approveOrg ORG_1  then addOrg ORG_1 and approveOrg ORG_1 (duplicate)", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );
    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );
    await expect(
      permissionsInterface
        .connect(network_admin)
        .addOrg(
          ORG_1.orgId,
          ORG_1.encodeId,
          ORG_1.ip,
          ORG_1.port,
          ORG_1.raftPort,
          org_1_admin.address
        )
    ).to.be.revertedWith("org exists");
  });

  it("Should revert when addOrg ORG_1 and approveOrg ORG_1 with empty encodeId  then addOrg ORG_1 and approveOrg ORG_1 with empty encodeId (duplicate)", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );
    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );
    await expect(
      permissionsInterface
        .connect(network_admin)
        .addOrg(
          ORG_1.orgId,
          ORG_1.encodeId,
          ORG_1.ip,
          ORG_1.port,
          ORG_1.raftPort,
          org_1_admin.address
        )
    ).to.be.revertedWith("org exists");
  });

  it("Should revert when add VERIFIER_ROLE then add VERIFIER_ROLE (duplicate)", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface.connect(org_1_admin).addNewRole(
      VERIFIER_ROLE,
      ORG_1.orgId,
      1, // Transact and ReadOnly
      false,
      false
    );

    await expect(
      permissionsInterface.connect(org_1_admin).addNewRole(
        VERIFIER_ROLE,
        ORG_1.orgId,
        1, // Transact and ReadOnly
        false,
        false
      )
    ).to.be.revertedWith("role exists for the org");
  });

  it("Should success when add acount ", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface.connect(org_1_admin).addNewRole(
      VERIFIER_ROLE,
      ORG_1.orgId,
      1, // Transact and ReadOnly
      false,
      false
    );

    await permissionsInterface.connect(org_1_admin).addNewRole(
      OPERATOR_ROLE,
      ORG_1.orgId,
      3, // Transact and ReadOnly
      false,
      false
    );

    await permissionsInterface
      .connect(org_1_admin)
      .assignAccountRole(
        "0xB4ED6F826c024e797C25eC874f23C5e6B8E1D822",
        ORG_1.orgId,
        VERIFIER_ROLE
      );

    await permissionsInterface
      .connect(org_1_admin)
      .assignAccountRole(
        "0xB4ED6F826c024e797C25eC874f23C5e6B8E1D822",
        ORG_1.orgId,
        OPERATOR_ROLE
      );
  });

  it("Should revert when addSubOrg SUB_ORG_1_1 for ORG_1 then addSubOrg SUB_ORG_1_1 for ORG_1 (duplicate)", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        ORG_1.orgId,
        SUB_ORG_1_1.orgId,
        SUB_ORG_1_1.encodeId,
        SUB_ORG_1_1.ip,
        SUB_ORG_1_1.port,
        SUB_ORG_1_1.raftPort
      );

    await expect(
      permissionsInterface
        .connect(org_1_admin)
        .addSubOrg(
          ORG_1.orgId,
          SUB_ORG_1_1.orgId,
          SUB_ORG_1_1.encodeId,
          SUB_ORG_1_1.ip,
          SUB_ORG_1_1.port,
          SUB_ORG_1_1.raftPort
        )
    ).to.be.rejectedWith("org exists");
  });

  it("Should revert when network admin try to addSubOrg for ORG_1", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await expect(
      permissionsInterface
        .connect(network_admin)
        .addSubOrg(
          ORG_1.orgId,
          SUB_ORG_1_1.orgId,
          SUB_ORG_1_1.encodeId,
          SUB_ORG_1_1.ip,
          SUB_ORG_1_1.port,
          SUB_ORG_1_1.raftPort
        )
    ).to.be.revertedWith("account is not a org admin account");
  });

  it("Should revert when add more than max breadth subOrg", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        ORG_1.orgId,
        SUB_ORG_1_1.orgId,
        SUB_ORG_1_1.encodeId,
        SUB_ORG_1_1.ip,
        SUB_ORG_1_1.port,
        SUB_ORG_1_1.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        ORG_1.orgId,
        SUB_ORG_1_2.orgId,
        SUB_ORG_1_2.encodeId,
        SUB_ORG_1_2.ip,
        SUB_ORG_1_2.port,
        SUB_ORG_1_2.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        ORG_1.orgId,
        SUB_ORG_1_3.orgId,
        SUB_ORG_1_3.encodeId,
        SUB_ORG_1_3.ip,
        SUB_ORG_1_3.port,
        SUB_ORG_1_3.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        ORG_1.orgId,
        SUB_ORG_1_4.orgId,
        SUB_ORG_1_4.encodeId,
        SUB_ORG_1_4.ip,
        SUB_ORG_1_4.port,
        SUB_ORG_1_4.raftPort
      );

    await expect(
      permissionsInterface
        .connect(org_1_admin)
        .addSubOrg(
          ORG_1.orgId,
          SUB_ORG_1_5.orgId,
          SUB_ORG_1_5.encodeId,
          SUB_ORG_1_5.ip,
          SUB_ORG_1_5.port,
          SUB_ORG_1_5.raftPort
        )
    ).to.be.revertedWith("breadth level exceeded");
  });

  it("Should revert when add more than max breadth inner subOrg", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        ORG_1.orgId,
        SUB_ORG_1_1.orgId,
        SUB_ORG_1_1.encodeId,
        SUB_ORG_1_1.ip,
        SUB_ORG_1_1.port,
        SUB_ORG_1_1.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        `${ORG_1.orgId}.${SUB_ORG_1_1.orgId}`,
        SUB_ORG_1_2.orgId,
        SUB_ORG_1_2.encodeId,
        SUB_ORG_1_2.ip,
        SUB_ORG_1_2.port,
        SUB_ORG_1_2.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        `${ORG_1.orgId}.${SUB_ORG_1_1.orgId}`,
        SUB_ORG_1_3.orgId,
        SUB_ORG_1_3.encodeId,
        SUB_ORG_1_3.ip,
        SUB_ORG_1_3.port,
        SUB_ORG_1_3.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        `${ORG_1.orgId}.${SUB_ORG_1_1.orgId}`,
        SUB_ORG_1_4.orgId,
        SUB_ORG_1_4.encodeId,
        SUB_ORG_1_4.ip,
        SUB_ORG_1_4.port,
        SUB_ORG_1_4.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        `${ORG_1.orgId}.${SUB_ORG_1_1.orgId}`,
        SUB_ORG_1_5.orgId,
        SUB_ORG_1_5.encodeId,
        SUB_ORG_1_5.ip,
        SUB_ORG_1_5.port,
        SUB_ORG_1_5.raftPort
      );

    await expect(
      permissionsInterface
        .connect(org_1_admin)
        .addSubOrg(
          `${ORG_1.orgId}.${SUB_ORG_1_1.orgId}`,
          SUB_ORG_1_6.orgId,
          SUB_ORG_1_6.encodeId,
          SUB_ORG_1_6.ip,
          SUB_ORG_1_6.port,
          SUB_ORG_1_6.raftPort
        )
    ).to.be.revertedWith("breadth level exceeded");
  });

  it("Should revert when assignAdminRole for org_1_admin then assignAdminRole for org_2_admin", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .assignAdminRole(
        ORG_1.orgId,
        org_1_admin.address,
        nwAdminRole
      );

    expect(
      permissionsInterface
        .connect(network_admin)
        .assignAdminRole(
          ORG_1.orgId,
          org_2_admin.address,
          nwAdminRole
        )
    ).to.be.revertedWith(
      "items pending for approval. new item cannot be added"
    );
  });

  it("Should success when addNewRole and assignAccountRole after assignAdminRole", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .assignAdminRole(
        ORG_1.orgId,
        sub_org_1_1_admin.address,
        nwAdminRole
      );

    await permissionsInterface
      .connect(sub_org_1_1_admin)
      .addNewRole(
        VERIFIER_ROLE,
        ORG_1.orgId,
        1, // Transact and ReadOnly
        false,
        false
      );

    await permissionsInterface
      .connect(sub_org_1_1_admin)
      .assignAccountRole(
        "0xB4ED6F826c024e797C25eC874f23C5e6B8E1D822",
        ORG_1.orgId,
        VERIFIER_ROLE
      );
  });

  it("Should revert when add more than max deep subOrg", async function () {
    await permissionsInterface
      .connect(network_admin)
      .addOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(network_admin)
      .approveOrg(
        ORG_1.orgId,
        ORG_1.encodeId,
        ORG_1.ip,
        ORG_1.port,
        ORG_1.raftPort,
        org_1_admin.address
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        ORG_1.orgId,
        SUB_ORG_1_1.orgId,
        SUB_ORG_1_1.encodeId,
        SUB_ORG_1_1.ip,
        SUB_ORG_1_1.port,
        SUB_ORG_1_1.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        `${ORG_1.orgId}.${SUB_ORG_1_1.orgId}`,
        SUB_ORG_1_2.orgId,
        SUB_ORG_1_2.encodeId,
        SUB_ORG_1_2.ip,
        SUB_ORG_1_2.port,
        SUB_ORG_1_2.raftPort
      );

    await permissionsInterface
      .connect(org_1_admin)
      .addSubOrg(
        `${ORG_1.orgId}.${SUB_ORG_1_1.orgId}.${SUB_ORG_1_2.orgId}`,
        SUB_ORG_1_3.orgId,
        SUB_ORG_1_3.encodeId,
        SUB_ORG_1_3.ip,
        SUB_ORG_1_3.port,
        SUB_ORG_1_3.raftPort
      );

    await expect(
      permissionsInterface
        .connect(org_1_admin)
        .addSubOrg(
          `${ORG_1.orgId}.${SUB_ORG_1_1.orgId}.${SUB_ORG_1_2.orgId}.${SUB_ORG_1_3.orgId}`,
          SUB_ORG_1_4.orgId,
          SUB_ORG_1_4.encodeId,
          SUB_ORG_1_4.ip,
          SUB_ORG_1_4.port,
          SUB_ORG_1_4.raftPort
        )
    ).to.be.revertedWith("depth level exceeded");
  });
});

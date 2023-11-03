// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// // will compile your contracts, add the Hardhat Runtime Environment's members to the
// // global scope, and execute the script.
// const hre = require('hardhat');
// const ethers = hre.ethers;

// function exportPermissionConfig(txs) {
//   let data = {
//     "permissionModel": "v2",
//     "upgradableAddress": txs.permissionUpgradable.contractAddress,
//     "interfaceAddress": txs.permissionsInterface.contractAddress,
//     "implAddress": txs.permissionsImplementation.contractAddress,
//     "nodeMgrAddress": txs.nodeManager.contractAddress,
//     "accountMgrAddress": txs.accountManager.contractAddress,
//     "roleMgrAddress": txs.roleManager.contractAddress,
//     "voterMgrAddress": txs.voterManager.contractAddress,
//     "orgMgrAddress": txs.orgManager.contractAddress,
//     "nwAdminOrg": "ADMINORG",
//     "nwAdminRole": "ADMIN",
//     "orgAdminRole": "ORGADMIN",
//     "accounts": [account.address],
//     "subOrgBreadth": 4,
//     "subOrgDepth": 4
//   }

//   fs.writeFile('permission-config.json', JSON.stringify(data), 'utf8', (err) => {
//     if (err) throw err;
//     console.log('Data written to file: ' + path.resolve(__dirname, 'permission-config.json'));
//   });
// }

// async function main() {
//   var txs = {};
//   txs.permissionUpgradable = await ethers.deployContract('PermissionsUpgradable', [account.address]);
//   if (txs.permissionUpgradable.contractAddress) {
//     txs.accountManager = await ethers.deployContract('AccountManager', [txs.permissionUpgradable.contractAddress]);
//     txs.nodeManager = await ethers.deployContract('NodeManager', [txs.permissionUpgradable.contractAddress]);
//     txs.orgManager = await ethers.deployContract('OrgManager', [txs.permissionUpgradable.contractAddress]);
//     txs.permissionsInterface = await ethers.deployContract('PermissionsInterface', [txs.permissionUpgradable.contractAddress]);
//     txs.roleManager = await ethers.deployContract('RoleManager', [txs.permissionUpgradable.contractAddress]);
//     txs.voterManager = await ethers.deployContract('VoterManager', [txs.permissionUpgradable.contractAddress]);
//     txs.permissionsImplementation = await ethers.deployContract('PermissionsImplementation', [
//       txs.permissionUpgradable.contractAddress,
//       txs.orgManager.contractAddress,
//       txs.roleManager.contractAddress,
//       txs.accountManager.contractAddress,
//       txs.voterManager.contractAddress,
//       txs.nodeManager.contractAddress
//     ]);

//     console.log("Creating transaction...");
//     let tx = await sendSignedTransaction({ to: txs.permissionUpgradable.contractAddress, data: hexdata });
//     console.log('Success call contract PermissionsUpgradable init.')
//     console.log(tx);

//     initUpgradableContract(txs);
//     exportPermissionConfig(txs);
//   } else {
//     console.log("Couldn't deploy PermissionsUpgradable contract");
//   }
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

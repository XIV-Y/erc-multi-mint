import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const MyERC721Factory = await ethers.getContractFactory("MyERC721");
  const erc721 = await MyERC721Factory.deploy();
  await erc721.waitForDeployment();
  const erc721Address = await erc721.getAddress();
  console.log("MyERC721:", erc721Address);

  const MyERC1155Factory = await ethers.getContractFactory("MyERC1155");
  const erc1155 = await MyERC1155Factory.deploy();
  await erc1155.waitForDeployment();
  const erc1155Address = await erc1155.getAddress();
  console.log("MyERC1155:", erc1155Address);

  const MultiMintControllerFactory = await ethers.getContractFactory("MultiMintController");
  const controller = await MultiMintControllerFactory.deploy(erc721Address, erc1155Address, deployer.address);
  await controller.waitForDeployment();
  const controllerAddress = await controller.getAddress();
  console.log("Controller:", controllerAddress);

  await (await erc721.transferOwnership(controllerAddress)).wait();
  await (await erc1155.transferOwnership(controllerAddress)).wait();
  console.log("Ownership transferred");

  console.log("\n=== Controller:", controllerAddress, "===");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

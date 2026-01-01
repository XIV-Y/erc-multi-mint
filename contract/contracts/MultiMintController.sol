// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./MyERC721.sol";
import "./MyERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MultiMintController {
    using ECDSA for bytes32;

    MyERC721 public erc721Contract;
    MyERC1155 public erc1155Contract;
    address public authorizedSigner;

    event MultiMintExecuted(
        address indexed to,
        uint256 erc721Count,
        uint256[] erc1155Ids,
        uint256[] erc1155Amounts
    );
    
    event ERC721Minted(address indexed to, uint256 indexed tokenId);
    event ERC1155Minted(address indexed to, uint256[] ids, uint256[] amounts);

    bytes32 private constant MULTIMINT_TYPEHASH =
        keccak256(
            "MultiMint(address to,uint256 erc721Count,uint256[] erc1155Ids,uint256[] erc1155Amounts)"
        );

    bytes32 private immutable DOMAIN_SEPARATOR;

    mapping(bytes32 => bool) public usedSignatures;

    constructor(address _erc721, address _erc1155, address _authorizedSigner) {
        erc721Contract = MyERC721(_erc721);
        erc1155Contract = MyERC1155(_erc1155);
        authorizedSigner = _authorizedSigner;

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("MultiMintController")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function multiMint(
        address to,
        uint256 erc721Count,
        uint256[] memory erc1155Ids,
        uint256[] memory erc1155Amounts,
        bytes memory signature
    ) external {
        require(erc1155Ids.length == erc1155Amounts.length, "Length mismatch");

        bytes32 structHash = keccak256(
            abi.encode(
                MULTIMINT_TYPEHASH,
                to,
                erc721Count,
                keccak256(abi.encodePacked(erc1155Ids)),
                keccak256(abi.encodePacked(erc1155Amounts))
            )
        );

        bytes32 hash = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        
        require(!usedSignatures[hash], "Signature already used");
        usedSignatures[hash] = true;

        address signer = hash.recover(signature);
        require(signer == authorizedSigner, "Invalid signature");

        for (uint256 i = 0; i < erc721Count; i++) {
            uint256 tokenId = erc721Contract.mint(to);
            emit ERC721Minted(to, tokenId);
        }

        for (uint256 i = 0; i < erc1155Ids.length; i++) {
            erc1155Contract.mint(to, erc1155Ids[i], erc1155Amounts[i]);
        }
        
        if (erc1155Ids.length > 0) {
            emit ERC1155Minted(to, erc1155Ids, erc1155Amounts);
        }

        emit MultiMintExecuted(to, erc721Count, erc1155Ids, erc1155Amounts);
    }

    function setAuthorizedSigner(address _newSigner) external {
        require(msg.sender == authorizedSigner, "Not authorized");
        authorizedSigner = _newSigner;
    }

    function getDomainSeparator() external view returns (bytes32) {
        return DOMAIN_SEPARATOR;
    }
}

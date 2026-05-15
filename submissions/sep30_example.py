import requests

sep30_server1 = "https://lnrec1.codeln.com"
sep30_server2 = "https://lnrec2.codeln.com"

horizon_server = "https://horizon-testnet.stellar.org"

from stellar_sdk import Asset, Keypair, Network, Server, Signer, TransactionBuilder

server = Server(horizon_server)

# accounts
test_account_public = ""
test_account_secret = ""
recovery_1_public = "GCSTM3GZ4ZTAZIUU5CP6EH6OARORQFA4OF757YI3BAFM3GG7ZWEH6PE3"
recovery_2_public = "GANEED7GCZO246CKIBPEJ2TAF7HWMMLYTBW3IQHF5OJ4B2ZFJRUAJU5X"
recovery_1_secret = "SDDOSYPHJCMRRHJRGLRO6X35L5UOLOQ7T7NPRKJSP2QFQRSN3K6Y2MIH"
recovery_2_secret = "SCMOPIR5ODW7IDVLBC4X2MCO3JBK6X7DQLW72EJFKCXISZPQNAB3XCAA"
lost_account = "GA4V5QDI4CSB7JMLYUGAP2ARKM2OHREV266P3YOAYWYJZU3ZLIU3KK5A"
lost_account_secret = "SA3XGL2KRAGKHRZ4JSNG5NMH2PVIREMVEGKR2HYZFUXFQVVS62OOIPU5"
new_master_public_key = "GB2U5HWYOODEPVY6DIJQZJHIDAUXH5I3RZFAJJBMZTP4OPFZJPDCF7YF"
new_master_secret_key = "SB7EAFYMDLVLBBQDIO53VBJOX5OLKYEYH5CDYCETJPMEYCCUTGJ7BUHN"


def add_signer1(address):
    resp = requests.post(f"{sep30_server1}/accounts/add/",
                         json={
                             "address": address,
                             "identities": {
                                 "phone": "+2547012345"
                             }
                         })

    return resp.json()


def add_signer2(address):
    resp = requests.post(f"{sep30_server1}/accounts/add/", json={
        "identities": {
            "address": address,
            "email": "kbc@codeln.com"
        }
    })
    return resp.json()


def set_options(signer1, signer2, account_address, secret_key):
    signer1 = signer1
    signer2 = signer2
    account = server.load_account(account_address)
    transaction_builder = (
        TransactionBuilder(
            source_account=account,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=100,
        )
        .append_set_options_op(
            signer=Signer.ed25519_public_key(signer1, weight=5)
        )
        .append_set_options_op(
            signer=Signer.ed25519_public_key(signer2, weight=5)
        )
        .append_set_options_op(
            master_weight=10,
            low_threshold=10,
            med_threshold=10,
            high_threshold=10
        ).set_timeout(30).
        build())
    transaction_builder.sign(secret_key)
    response = server.submit_transaction(transaction_builder)
    print(f"Recovery setup complete. Hash: {response['hash']}")
    return response


def recover_account(address):
    new_master_public_key = "GB2U5HWYOODEPVY6DIJQZJHIDAUXH5I3RZFAJJBMZTP4OPFZJPDCF7YF"
    new_master_secret_key = "SB7EAFYMDLVLBBQDIO53VBJOX5OLKYEYH5CDYCETJPMEYCCUTGJ7BUHN"
    source_account = server.load_account(lost_account)
    kp1 = Keypair.from_secret(recovery_1_secret)
    kp2 = Keypair.from_secret(recovery_2_secret)
    tx = (
        TransactionBuilder(
            source_account=source_account,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=100,
        )
        # We use SetOptions to swap the signer.
        # This adds the NEW key with weight 1.
        .append_set_options_op(
            signer=Signer.ed25519_public_key(new_master_public_key, weight=10)
        )

        # OPTIONAL: Set the weight of the OLD (lost) master key to 0
        # to prevent the person who found your old key from using it.
        # .append_set_options_op(
        #     signer=Signer.ed25519_public_key(lost_account, weight=0)
        # )
        .set_timeout(30)
        .build()
    )

    # 4. Multisig signing
    # We sign with BOTH recovery keys because their combined weight (1+1)
    # meets the 'high_threshold' of 2.
    tx.sign(kp1)
    tx.sign(kp2)

    try:
        response = server.submit_transaction(tx)
        print(f"Recovery Successful! New key added. Hash: {response['hash']}")
    except Exception as e:
        print(f"Recovery Failed: {e}")
    pass


def remove_old_master(lost_account, new_master_public_key, new_master_secret_key):
    source_account = server.load_account(lost_account)
    kp1 = Keypair.from_secret(recovery_1_secret)
    kp2 = Keypair.from_secret(recovery_2_secret)
    tx = (
        TransactionBuilder(
            source_account=source_account,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=100,
        )
        # OPTIONAL: Set the weight of the OLD (lost) master key to 0
        # to prevent the person who found your old key from using it.
        .append_set_options_op(
            signer=Signer.ed25519_public_key(lost_account, weight=0)
        )
        .set_timeout(30)
        .build()
    )
    tx.sign(kp1)
    tx.sign(kp2)
    try:
        response = server.submit_transaction(tx)
        print(f"Old Master replaced successfully! Hash: {response['hash']}")
    except Exception as e:
        print(f"Old Master Replacement Failed: {e}")
    pass


def test_recovered_payment(destination_address, source_address, new_master_secret_key):
    tx = (
        TransactionBuilder(
            source_account=server.load_account(source_address),
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
            base_fee=100,  # Base fee in stroops (100 stroops = 0.00001 XLM)
        )
        .append_payment_op(
            destination=destination_address,
            asset=Asset.native(),
            amount="10.50"  # Amount must be a string
        ).set_timeout(30)
        .build()
    )

    # 4. Sign and submit
    tx.sign(new_master_secret_key)

    try:
        response = server.submit_transaction(tx)
        print(f"Payment successful! Hash: {response['hash']}")
    except Exception as e:
        print(f"Transaction failed: {e}")


if __name__ == '__main__':
    address = 'GCGQZYBYQBTHN7K5LICZ23ERKXLEBMOUY2YX56OMPSEJDPVRMMMIEDL7'
    print(add_signer1(address))
    # print(add_signer2(address))
    # print(recover_account(address))

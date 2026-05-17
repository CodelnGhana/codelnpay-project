
import logging
import requests
from stellar_sdk import Server,Keypair,Network, TransactionBuilder, Asset, Signer, TransactionEnvelope
from stellar_sdk.exceptions import BaseRequestError

# Configure Logging for clean visibility instead of relying completely on print
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Configuration / Constants
FRIENDBOT_URL = "https://friendbot.stellar.org"
SEP30_SERVER_1 = "https://lnrec1.codelnpay.com"
SEP30_SERVER_2 = "https://lnrec2.codelnpay.com"
server = Server("https://horizon-testnet.stellar.org")

NETWORK_PASSPHRASE = Network.TESTNET_NETWORK_PASSPHRASE
BASE_FEE = 100


def create_funded_account():
    """Generates a new Stellar keypair and funds it via Friendbot."""
    kp = Keypair.random()

    response = requests.get(FRIENDBOT_URL, params={"addr": kp.public_key})
    response.raise_for_status()

    return kp.public_key, kp.secret


def setup_recovery_scenario():
    """Sets up a test case with a 'lost' account and a new master replacement."""
    lost_pub, lost_sec = create_funded_account()
    new_master_pub, new_master_sec = create_funded_account()

    return {
        "lost": (lost_pub, lost_sec),
        "new_master": (new_master_pub, new_master_sec)
    }


def register_with_signer(server_url, address, identity_payload):
    """Registers identities with SEP-30 recovery servers."""
    url = f"{server_url.rstrip('/')}/accounts/add/"

    response = requests.post(url, json={
        "address": address,
        "identities": identity_payload
    })
    response.raise_for_status()

    return response.json()


def add_signer_one(address, phone="+2547012345"):
    return register_with_signer(SEP30_SERVER_1, address, {"phone": phone})


def add_signer_two(address, email="xyz@example.com"):
    return register_with_signer(SEP30_SERVER_2, address, {"email": email})



def request_server_signature(server_url, address, tx_xdr):
    """Request a signature from a SEP-30 recovery server."""
    url = f"{server_url.rstrip('/')}/accounts/sign/"
    response = requests.post(url, data={
        "address": address,
        "transaction": tx_xdr
    })
    response.raise_for_status()
    return response.json()


def set_options(account_address, secret_key, signer1_address, signer2_address):
    """Configures multi-sig weights and thresholds on the account."""
    account = server.load_account(account_address)

    transaction = (
        TransactionBuilder(
            source_account=account,
            network_passphrase=NETWORK_PASSPHRASE,
            base_fee=BASE_FEE,
        )
        .append_set_options_op(signer=Signer.ed25519_public_key(signer1_address, weight=5))
        .append_set_options_op(signer=Signer.ed25519_public_key(signer2_address, weight=5))
        .append_set_options_op(
            master_weight=10,
            low_threshold=10,
            med_threshold=10,
            high_threshold=10
        )
        .set_timeout(30)
        .build()
    )

    transaction.sign(secret_key)
    response = server.submit_transaction(transaction)
    logging.info(f"Recovery setup complete. Hash: {response.get('hash')}")
    return response


def recover_account(lost_address, new_master_public_key):
    """Orchestrates recovery by getting signatures from both SEP-30 servers."""
    source_account = server.load_account(lost_address)

    # Build the recovery transaction to add the new key
    tx = (
        TransactionBuilder(
            source_account=source_account,
            network_passphrase=NETWORK_PASSPHRASE,
            base_fee=BASE_FEE,
        )
        .append_set_options_op(signer=Signer.ed25519_public_key(new_master_public_key, weight=10))
        .set_timeout(30)
        .build()
    )

    try:
        # Step 1: Sign with Server 1
        res_server1 = request_server_signature(SEP30_SERVER_1, lost_address, tx.to_xdr())
        tx_envelope_xdr = res_server1['transaction']

        # Step 2: Pass the partially signed XDR to Server 2
        res_server2 = request_server_signature(SEP30_SERVER_2, lost_address, tx_envelope_xdr)
        final_xdr = res_server2['transaction']

        # Step 3: Parse back to an Envelope object to submit to Horizon
        enveloped_tx = TransactionEnvelope.from_xdr(final_xdr, network_passphrase=NETWORK_PASSPHRASE)
        response = server.submit_transaction(enveloped_tx)
        logging.info(f"Recovery Successful! New key added. Hash: {response.get('hash')}")

    except (BaseRequestError, requests.RequestException, KeyError) as e:
        logging.error(f"Recovery Failed: {e}")


def remove_old_master(lost_account_address, new_master_secret_key):
    """Removes the signing power of the old compromised/lost master key."""
    source_account = server.load_account(lost_account_address)

    tx = (
        TransactionBuilder(
            source_account=source_account,
            network_passphrase=NETWORK_PASSPHRASE,
            base_fee=BASE_FEE,
        )
        .append_set_options_op(master_weight=0)
        .set_timeout(30)
        .build()
    )

    tx.sign(new_master_secret_key)
    try:
        response = server.submit_transaction(tx)
        logging.info(f"Old Master weight set to 0 successfully! Hash: {response.get('hash')}")
    except BaseRequestError as e:
        logging.error(f"Old Master Replacement Failed: {e}")


def test_recovered_payment(source_address, destination_address, new_master_secret_key):
    """Tests the newly recovered account access by executing a native payment."""
    tx = (
        TransactionBuilder(
            source_account=server.load_account(source_address),
            network_passphrase=NETWORK_PASSPHRASE,
            base_fee=BASE_FEE,
        )
        .append_payment_op(
            destination=destination_address,
            asset=Asset.native(),
            amount="10.50"
        )
        .set_timeout(30)
        .build()
    )

    tx.sign(new_master_secret_key)

    try:
        response = server.submit_transaction(tx)
        logging.info(f"Payment successful! Hash: {response.get('hash')}")
    except BaseRequestError as e:
        logging.error(f"Transaction failed: {e}")


if __name__ == '__main__':
    print(f"\n{' Creating Test Accounts ':=^50}")
    lost_account, lost_account_secret = create_funded_account()
    print(f"Lost Account Public Key: {lost_account}")

    print(f"\n{' Registering Account Recovery Signers ':=^50}")
    signer1 = add_signer_one(lost_account)
    signer2 = add_signer_two(lost_account)
    print("Account Recovery Signers Registered successfully via SEP-30 servers.")

    print(f"\n{' Updating Account Signers Thresholds ':=^50}")
    set_options(
        account_address=lost_account,
        secret_key=lost_account_secret,
        signer1_address=signer1['address'],
        signer2_address=signer2['address']
    )

    print(f"\n{' Creating New Replacement Keys ':=^50}")
    new_master_public_key, new_master_secret_key = create_funded_account()
    print(f"New Master Public Key: {new_master_public_key}")

    print(f"\n{' Starting Account Recovery ':=^50}")
    recover_account(lost_address=lost_account, new_master_public_key=new_master_public_key)

    print(f"\n{' Revoking Lost Key Privileges ':=^50}")
    remove_old_master(lost_account_address=lost_account, new_master_secret_key=new_master_secret_key)

    print(f"\n{' Testing Payment with New Master Key ':=^50}")
    test_recovered_payment(
        source_address=lost_account,
        destination_address=signer1['address'],
        new_master_secret_key=new_master_secret_key
    )
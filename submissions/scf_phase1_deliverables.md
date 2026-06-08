# Phase 1: CodelnPay Account Recovery Sep30 with AWS KMS

## Overview

Stellar operates on the Ed25519 cryptographic curve for account authentication and transaction validation. To secure our
recovery infrastructure, we leverage AWS KMS asymmetric keys using the native ECC_NIST_EDWARDS25519 key specification.
This allows the Recovery Server to delegate transaction signing directly ensuring the recovery private key material
never leaves the secure boundaries of AWS KMS.

1. **Setup Phase:** A unique user account mapping is established on the Recovery Server. The service utilizes AWS KMS
   key (configured with the ECC_NIST_EDWARDS25519 key
   specification).
2. **Configuration Phase:** The recovery public keys are registered as a secondary signers on the user’s primary Stellar
   account via a multi-signature configuration. The account's weight configurations and thresholds (low, medium, high)
   are
   adjusted so that standard transactions can be authorized by the mobile client alone, while administrative changes (
   like key rotation via SetOptions) require either the primary key or both the recovery signers.
3. **Recovery Phase:** If the primary device key is lost, CodeLnPay authenticates the user via multi-factor
   authentication (mobile and phone verification). Once authorized, the Recovery Servers process the stellar transaction
   to replace the lost primary key.Each of the servers evaluates the transaction hash and passes it to the AWS KMS to
   sign in turn.

---

## How to test

### Prerequisites

- **Python 3.11+**
- **Dependencies:**

```bash
pip install stellar-sdk 
```

### Run Example

```python
python
sep30_example
```

### Overview

1. Account Creation

```python
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
```

2. Registration

```python
def register_with_signer(server_url, address, identity_payload):
    """Registers identities with SEP-30 recovery servers."""
    url = f"{server_url.rstrip('/')}/accounts/add/"

    response = requests.post(url, json={
        "address": address,
        "identities": identity_payload
    })
    response.raise_for_status()

    return response.json()


```

3. Set Options

```python
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


```

4. Recovery Request

```python
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


```

5. Set lost master key weight to zero

```python
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

```

6. Test Payment

```python
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


```

### Architechture

### System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                  CodeLnpay Mobile Client               │
│       (Holds: Device Key / Account Primary Key)        │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 1. Submits registration request
                            │ 2. Sends XDR payload to be signed
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Recovery Server API                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ► POST /accounts/add                                  │
│    └─ Registers device key & requests KMS key creation │
│                                                        │
│  ► POST /accounts/sign                                 │
│    └─ Authorizes request & asks KMS to sign the XDR    │
│                                                        │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 1a. CreateKey 
                            │ 2a. Sign (using KMS asymmetric key)
                            ▼
┌────────────────────────────────────────────────────────┐
│                        AWS KMS                         │
├────────────────────────────────────────────────────────┤
│  • Secures the Recovery Key / Secondary Signer         │
└────────────────────────────────────────────────────────┘
```

### Sep 30 TestNet Servers

1. [Server A](https://lnrec1.codelnpay.com)
2. [Server B](https://lnrec2.codelnpay.com)


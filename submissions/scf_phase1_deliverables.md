# CodelnPay Account Recovery Sep30 with AWS KMS

## Overview

Stellar operates on the Ed25519 cryptographic curve for account authentication and transaction validation. To secure our
recovery infrastructure, we leverage AWS KMS asymmetric keys using the native ECC_NIST_EDWARDS25519 key specification.
This allows the Recovery Server to delegate transaction signing directly ensuring the recovery private key material
never leaves the secure boundaries of AWS KMS.

1. **Setup Phase:** A unique user account mapping is established on the Recovery Server. Instead of generating raw
   seeds, the service utilizes AWS KMS key (configured with the ECC_NIST_EDWARDS25519 key
   specification).
2. **Configuration Phase:** The recovery public key is registered as a secondary signer on the user’s primary Stellar
   account via a multi-signature layout. The account's weight configurations and thresholds (low, medium, high) are
   adjusted so that standard transactions can be authorized by the mobile client alone, while administrative changes (
   like key rotation via SetOptions) require either the primary key or the recovery signers.
3. **Recovery Phase:** If the primary device key is lost, CodeLnPay authenticates the user via  multi-factor
   authentication (mobile and phone verification). Once authorized, the Recovery Server constructs a Stellar transaction
   containing a SetOptions operation to replace the lost primary key.The server calculates the transaction hash and
   passes it to the AWS KMS to sign.
---

## How to test

### Prerequisites

- **Python 3.8+**
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
def setup():
    pass
```

2. Registration

```python

```

3. Set Options

```python

```

4. Recovery Request

```python

```

5. Test Payment

```python

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

1. [Server A](https://lnrec1.codeln.com)
2. [Server B](https://lnrec2.codeln.com)

